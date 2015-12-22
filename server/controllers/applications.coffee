request             = require 'request-json'
fs                  = require 'fs'
slugify             = require 'cozy-slug'
{exec}              = require 'child_process'
async               = require 'async'
cozydb              = require 'cozydb'
log                 = require('printit')
    prefix: "applications"

Application         = require '../models/application'
NotificationsHelper = require 'cozy-notifications-helper'
localizationManager = require '../helpers/localization_manager'
manager             = require('../lib/paas').get()
{Manifest}          = require '../lib/manifest'
market              = require '../lib/market'
autostop            = require '../lib/autostop'
icons               = require '../lib/icon'

# Small hack to ensure that an user doesn't try to start an application twice
# at the same time. We store there the ID of apps which are already started.
# IDs are the keys, values are all equal to true.
startedApplications = {}

# Helpers

# Remove a notification after an update
removeAppUpdateNotification = (app) ->
    notifier = new NotificationsHelper 'home'
    notificationSlug = "home_update_notification_app_#{app.name}"
    notifier.destroy notificationSlug, (err) ->
        log.error err if err?

sendError = (res, err, code=500) ->
    err ?=
        stack:   null
        message: localizationManager.t "server error"

    console.log "Sending error to client :"
    console.log err.stack

    res.send code,
        error: true
        success: false
        message: err.message or err
        stack: err.stack

sendErrorSocket = (err) ->
    console.log "Sending error through socket"
    console.log err.stack

markBroken = (res, app, err) ->
    console.log "Marking app #{app.name} as broken because"
    console.log err.stack

    data =
        state: 'broken'
        password: null
    if err.result?
        data.errormsg = err.message + ' :\n' + err.result
    else if err.message?
        data.errormsg = err.message + ' :\n' + err.stack
    else
        data.errormsg = err
    data.errorcode = err.code
    app.updateAttributes data, (saveErr) ->
        log.error saveErr if saveErr

# Define random function for application's token
randomString = (length) ->
    string = ""
    while (string.length < length)
        string = string + Math.random().toString(36).substr(2)
    return string.substr 0, length

updateApp = (app, callback) ->
    data = {}
    manifest = new Manifest()
    manifest.download app, (err) ->
        if err?
            callback err
        else
            app.password = randomString 32
            # Retrieve access
            access =
                permissions: manifest.getPermissions()
                slug: app.slug
                password: app.password
            # Retrieve application
            data.widget = manifest.getWidget()
            data.version = manifest.getVersion()
            data.iconPath = manifest.getIconPath()
            data.color = manifest.getColor()
            data.needsUpdate = false
            try
                # `icons.getIconInfos` needs info from 'data' and 'app'.
                infos =
                    git: app.git
                    name: app.name
                    icon: app.icon
                    iconPath: data.iconPath
                    slug: app.slug
                iconInfos = icons.getIconInfos infos
            catch err
                console.log err if process.env.NODE_ENV isnt 'test'
                iconInfos = null
            data.iconType = iconInfos?.extension or null
            # Update access
            app.updateAccess access, (err) ->
                return callback err if err?
                manager.updateApp app, (err, result) ->
                    return callback err if err?
                    if app.state isnt "stopped"
                        data.state = "installed"
                    # Update application
                    app.updateAttributes data, (err) ->
                        removeAppUpdateNotification app
                        icons.save app, iconInfos, (err) ->
                            if err and process.env.NODE_ENV isnt 'test'
                                console.log err.stack
                            else console.info 'icon attached'
                            manager.resetProxy callback

baseIdController = new cozydb.SimpleController
    model: Application
    reqProp: 'application'
    reqParamID: 'id'


module.exports =

    loadApplicationById: baseIdController.find


    # Load application corresponding to slug given in params
    loadApplication:  (req, res, next, slug) ->
        Application.all key: req.params.slug, (err, apps) ->
            if err
                next err
            else if apps is null or apps.length is 0
                res.send 404, error: localizationManager.t 'Application not found'
            else
                req.application = apps[0]
                next()

    applications: (req, res, next) ->
        Application.all (err, apps) ->
            if err then next err
            else res.send rows: apps


    getPermissions: (req, res, next) ->
        manifest = new Manifest()
        manifest.download req.body, (err) ->
            if err then next err
            app = permissions: manifest.getPermissions()
            res.send success: true, app: app


    getDescription: (req, res, next) ->
        manifest = new Manifest()
        manifest.download req.body, (err) ->
            if err then next err
            app = description: manifest.getDescription()
            res.send success: true, app: app


    getMetaData: (req, res, next) ->
        manifest = new Manifest()
        manifest.download req.body, (err) ->
            if err then next err
            metaData = manifest.getMetaData()
            res.send success: true, app: metaData, 200


    read: (req, res, next) ->
        Application.find req.params.id, (err, app) ->
            if err then sendError res, err
            else if app is null
                sendError res, new Error(localizationManager.t 'Application not found'), 404
            else
                res.send app


    icon: (req, res, next) ->

        if req.application?._attachments?['icon.svg']
            stream = req.application.getFile('icon.svg', (->))
            stream.pipefilter = (res, dest) ->
                dest.set 'Content-Type', 'image/svg+xml'
            stream.pipe res
        else if req.application?._attachments?['icon.png']
            res.type 'png'
            stream = req.application.getFile('icon.png', (->))
            stream.pipe res
        else
            res.type 'png'
            fs.createReadStream('./client/app/assets/img/stopped.png').pipe res


    # Update application parameters like autostop or favorite.
    updateData: (req, res, next) ->
        app = req.application
        if req.body.isStoppable? and req.body.isStoppable isnt app.isStoppable
            Stoppable = req.body.isStoppable
            Stoppable = if Stoppable? then Stoppable else app.isStoppable
            changes =
                homeposition: req.body.homeposition or app.homeposition
                isStoppable: Stoppable
            app.updateAttributes changes, (err, app) ->
                autostop.restartTimeout app.name
                return sendError res, err if err
                res.send app
        else if req.body.favorite? and req.body.favorite isnt app.favorite
            changes =
                favorite: req.body.favorite
            app.updateAttributes changes, (err, app) ->
                return next err if err
                res.send app
        else
            res.send app


    # Set up app into 3 places :
    # * haibu, application manager
    # * proxy, cozy router
    # * database
    # Send an error if an application already has same slug.
    install: (req, res, next) ->
        req.body.slug = req.body.slug or slugify req.body.name
        req.body.state = "installing"
        access =
            password: randomString 32

        Application.all key: req.body.slug, (err, apps) ->
            return sendError res, err if err

            if apps.length > 0 or req.body.slug is "proxy" or
                    req.body.slug is "home" or req.body.slug is "data-system"
                err = new Error localizationManager.t "already similarly named app"
                return sendError res, err, 400

            manifest = new Manifest()
            manifest.download req.body, (err) ->
                return sendError res, err if err
                # Retrieve access
                access.permissions = manifest.getPermissions()
                access.slug = req.body.slug
                # Retrieve application
                req.body.widget = manifest.getWidget()
                req.body.version = manifest.getVersion()
                req.body.color = manifest.getColor()
                req.body.state = 'installing'

                # Create application in database
                Application.create req.body, (err, appli) ->
                    return sendError res, err if err
                    access.app = appli.id

                    # Create application access in database
                    Application.createAccess access, (err, app) ->
                        return sendError res, err if err

                        res.send success: true, app: appli, 201

                        infos = JSON.stringify appli
                        console.info "attempt to install app #{infos}"
                        appli.password = access.password

                        # Save icon first.
                        appli.iconPath = manifest.getIconPath()
                        appli.color = manifest.getColor()
                        try
                            iconInfos = icons.getIconInfos appli
                        catch err
                            if process.env.NODE_ENV isnt 'test'
                                console.log err
                            iconInfos = null
                        appli.iconType = iconInfos?.extension or null
                        icons.save appli, iconInfos, (err) ->

                            if err and process.env.NODE_ENV isnt 'test'
                                console.log err.stack

                            else
                                console.info 'icon attached'

                            # Install / Start application
                            manager.installApp appli, (err, result) ->
                                if err
                                    markBroken res, appli, err
                                    sendErrorSocket err
                                    return

                                if result.drone?
                                    msg = "install succeeded on " + \
                                          "port #{appli.port}"
                                    console.info msg
                                    updatedData =
                                        state: "installed"
                                        port: result.drone.port

                                    appli.updateAttributes updatedData, (err) ->
                                        return sendErrorSocket err if err?

                                        console.info 'saved port in db', \
                                            appli.port

                                        # Reset proxy
                                        manager.resetProxy (err) ->
                                            return sendErrorSocket err if err?
                                            console.info(
                                                'proxy reset', appli.port)

                                else
                                    err = new Error(
                                        "Controller has no " + \
                                        "informations about #{appli.name}"
                                    )
                                    return sendErrorSocket err if err


    # Remove app from 3 places :
    # * haibu, application managerll
    # * proxy, cozy router
    # * database
    uninstall: (req, res, next) ->
        req.body.slug = req.params.slug

        removeMetadata = (result) ->
            req.application.destroyAccess (err) ->
                log.warn err if err
                # Remove application
                req.application.destroy (err) ->
                    return sendError res, err if err
                    # Reset proxy
                    manager.resetProxy (err) ->
                        return sendError res, err if err
                    res.send
                        success: true
                        msg: localizationManager.t 'application successfuly uninstalled'


        manager.uninstallApp req.application, (err, result) ->

            if err
                manager.uninstallApp req.application, (err, result) ->
                    removeMetadata result
            else
                removeMetadata result


    # Update an app :
    # * haibu, application manager
    # * proxy, cozy router
    # * database
    update: (req, res, next) ->
        updateApp req.application, (err) ->
            return markBroken res, req.application, err if err?
            res.send
                success: true
                msg: localizationManager.t 'application successfuly updated'


    # Update all applications :
    # * haibu, application manager
    # * proxy, cozy router
    # * database
    updateAll: (req, res, next) ->

        error = {}
        broken = (app, err, cb) ->
            console.log "Marking app #{app.name} as broken because"
            console.log err.stack
            data =
                state: 'broken'
                password: null
            if err.result?
                data.errormsg = err.message + ' :\n' + err.result
            else
                data.errormsg = err.message + ' :\n' + err.stack
            app.updateAttributes data, (saveErr) ->
                console.log(saveErr) if saveErr?
                cb()

        updateApps = (app, callback) ->
            manifest = new Manifest()
            manifest.download app, (err) ->
                if err?
                    sendError res, message: err
                else
                    app.getAccess (err, access) ->
                        if err?
                            sendError res, message: err
                        else
                            if JSON.stringify(access.permissions) isnt
                                    JSON.stringify(manifest.getPermissions())
                                return callback()
                            if app.needsUpdate? and app.needsUpdate or
                                    app.version isnt manifest.getVersion()
                                if app.state in ["installed", "stopped"]
                                    # Update application
                                    console.log("Update #{app.name} (#{app.state})")
                                    updateApp app, (err) ->
                                        if err?
                                            error[app.name] = err
                                            broken app, err, callback
                                        else
                                            callback()
                                else
                                    callback()
                            else
                                callback()

        Application.all (err, apps) ->
            async.forEachSeries apps, updateApps, () ->
                if Object.keys(error).length > 0
                    sendError res, message: error
                else
                    res.send
                        success: true
                        msg: localizationManager.t 'application successfuly updated'



    # Start a stopped application.
    start: (req, res, next) ->
        # If controller is too slow, client receives a timeout
        # Below timeout allows to catch timeout error before client
        # If there is a timeout, application is consider like broken
        setTimeout () ->
            if startedApplications[req.application.id]?
                delete startedApplications[req.application.id]
                return markBroken res, req.application,
                    stack: "Installation timeout",
                    message: "Installation timeout"

        , 45 * 1000


        unless startedApplications[req.application.id]?
            startedApplications[req.application.id] = true

            req.application.password = randomString 32
            data =
                password: req.application.password
            # Update access
            req.application.updateAccess data, (err) ->
                # Start application
                manager.start req.application, (err, result) ->
                    if err and err isnt localizationManager.t "not enough memory"
                        delete startedApplications[req.application.id]
                        return markBroken res, req.application, err
                    else if err
                        delete startedApplications[req.application.id]
                        data =
                            errormsg: err
                            state: 'stopped'
                        # Update state application
                        req.application.updateAttributes data, (saveErr) ->
                            return sendError res, saveErr if saveErr

                            res.send
                                app: req.application
                                error: true
                                success: false
                                message: err.message
                                stack: err.stack
                            , 500
                    else
                        data =
                            state: 'installed'
                            port: result.drone.port
                        # Update state application
                        req.application.updateAttributes data, (err) ->
                            if err
                                delete startedApplications[req.application.id]
                                return markBroken res, req.application, err

                            # Reset proxy
                            manager.resetProxy (err) ->
                                delete startedApplications[req.application.id]

                                if err
                                    markBroken res, req.application, err
                                else
                                    res.send
                                        success: true
                                        msg: localizationManager.t 'application running'
                                        app: req.application

        else
            res.send
                error: true
                msg: localizationManager.t 'application is already starting'
                app: req.application


    stop: (req, res, next) ->
        # Stop application
        manager.stop req.application, (err, result) ->
            return markBroken res, req.application, err if err

            data =
                state: 'stopped'
                port : 0
            # Update application state
            req.application.updateAttributes data, (err) ->
                return sendError res, err if err
                # Reset proxy
                manager.resetProxy (err) ->
                    return markBroken res, req.application, err if err
                    res.send
                        success: true
                        msg: localizationManager.t 'application stopped'
                        app: req.application


    changeBranch: (req, res, next) ->
        branch = req.params.branch
        manifest = new Manifest()
        app = req.application
        if app.branch is branch
            err = new Error "This application is already on branch #{branch}"
            return sendError res, err

        app.branch = branch
        # Retrieve manifest
        manifest.download app, (err) =>
            if err?
                callback err
            else
                app.password = randomString 32
                # Retrieve access
                access =
                    permissions: manifest.getPermissions()
                    slug: app.slug
                    password: app.password
                # Retrieve application
                data =
                    widget: manifest.getWidget()
                    version: manifest.getVersion()
                    iconPath: manifest.getIconPath()
                    color: manifest.getColor()
                    needsUpdate: false
                try
                    # `icons.getIconInfos` needs info from 'data' and 'app'.
                    infos =
                        git: app.git
                        name: app.name
                        icon: app.icon
                        iconPath: data.iconPath
                        slug: app.slug
                    iconInfos = icons.getIconInfos infos
                catch err
                    console.log err
                    iconInfos = null
                data.iconType = iconInfos?.extension or null

                # Update access
                app.updateAccess access, (err) ->
                    return callback err if err?
                    manager.changeBranch app, branch, (err, result) ->
                        return sendError res, err if err

                        # Update application
                        data.branch = branch
                        app.updateAttributes data, (err) ->
                            icons.save app, iconInfos, (err) ->
                                if err then console.log err.stack
                                else console.info 'icon attached'
                                manager.resetProxy () ->
                                    res.send
                                        success: true
                                        msg: 'Branch succesfuly changed'


    fetchMarket: (req, res, next) ->
        market.getApps (err, data) ->
            if err?
                res.send
                    error: true
                    success: false
                    message: err
                , 500
            else
                res.send 200, data
