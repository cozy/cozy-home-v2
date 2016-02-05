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
appHelpers          = require '../lib/applications'


# Small hack to ensure that an user doesn't try to start an application twice
# at the same time. We store there the ID of apps which are already started.
# IDs are the keys, values are all equal to true.
startedApplications = {}


# TODO: rewrite error management in this module.
sendError = (res, err, code=500) ->
    err ?=
        stack:   null
        message: localizationManager.t "server error"

    log.info "Sending error to client :"
    log.error err.stack

    res.send code,
        error: true
        success: false
        message: err.message or err
        stack: err.stack


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
                res.send 404, error: localizationManager.t 'app not found'
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
            return next err if err
            app = permissions: manifest.getPermissions()
            res.send success: true, app: app


    getDescription: (req, res, next) ->
        manifest = new Manifest()
        manifest.download req.body, (err) ->
            return next err if err
            app = description: manifest.getDescription()
            res.send success: true, app: app


    getMetaData: (req, res, next) ->
        manifest = new Manifest()
        manifest.download req.body, (err) ->
            return next err if err
            metaData = manifest.getMetaData()
            res.send success: true, app: metaData, 200


    read: (req, res, next) ->
        Application.find req.params.id, (err, app) ->
            if err then sendError res, err
            else if app is null
                err = new Error(localizationManager.t 'app not found')
                sendError res, err, 404
            else
                res.send app


    icon: (req, res, next) ->

        # Case where the icon is a SVG picture.
        if req.application?._attachments?['icon.svg']
            stream = req.application.getFile 'icon.svg', ->
            stream.pipefilter = (res, dest) ->
                dest.set 'Content-Type', 'image/svg+xml'
            stream.pipe res

        # Case where the icon is a PNG picture.
        else if req.application?._attachments?['icon.png']
            res.type 'png'
            stream = req.application.getFile 'icon.png', ->
            stream.pipe res

        # Case where the icon is missing. It sends the default SVG one.
        else
            iconPath = './client/app/assets/img/default.svg'
            stream = fs.createReadStream(iconPath)
            stream.pipefilter = (res, dest) ->
                dest.set 'Content-Type', 'image/svg+xml'
            stream.pipe res


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
            password: appHelpers.newAccessToken()

        Application.all key: req.body.slug, (err, apps) ->
            return sendError res, err if err

            if apps.length > 0 or req.body.slug is "proxy" or
                    req.body.slug is "home" or req.body.slug is "data-system"
                err = new Error localizationManager.t "similarly named app"
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
                # get type to see if it's a static app
                req.body.type = manifest.getType()

                # Create application in database
                Application.create req.body, (err, appli) ->
                    return sendError res, err if err
                    access.app = appli.id

                    # Create application access in database
                    Application.createAccess access, (err, app) ->
                        return sendError res, err if err

                        res.send success: true, app: appli, 201
                        appHelpers.install appli, manifest, access


    # Remove app from 3 places :
    # * haibu, application manager
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
                        msg: localizationManager.t 'successfuly uninstalled'


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
        appHelpers.update req.application, (err) ->
            return appHelpers.markBroken req.application, err if err?
            res.send
                success: true
                msg: localizationManager.t 'successfuly updated'


    # Update all applications :
    # * haibu, application manager
    # * proxy, cozy router
    # * database
    updateAll: (req, res, next) ->

        error = {}
        broken = (app, err, cb) ->
            log.warn "Marking app #{app.name} as broken because"
            log.raw err.stack
            data =
                state: 'broken'
                password: null
            if err.result?
                data.errormsg = err.message + ' :\n' + err.result
            else
                data.errormsg = err.message + ' :\n' + err.stack
            app.updateAttributes data, (saveErr) ->
                log.error(saveErr) if saveErr?
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
                                    log.info("Update #{app.name} (#{app.state})")
                                    appHelpers.update app, (err) ->
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
                        msg: localizationManager.t 'successfuly updated'



    # Start a stopped application.
    start: (req, res, next) ->
        # If controller is too slow, client receives a timeout
        # Below timeout allows to catch timeout error before client
        # If there is a timeout, application is consider like broken
        setTimeout () ->
            if startedApplications[req.application.id]?
                delete startedApplications[req.application.id]
                return appHelpers.markBroken req.application,
                    stack: "Installation timeout",
                    message: "Installation timeout"

        , 45 * 1000


        unless startedApplications[req.application.id]?
            startedApplications[req.application.id] = true

            req.application.password = appHelpers.newAccessToken()
            data =
                password: req.application.password
            # Update access
            req.application.updateAccess data, (err) ->
                # Start application
                manager.start req.application, (err, result) ->
                    if err and
                    err isnt localizationManager.t "not enough memory"
                        delete startedApplications[req.application.id]
                        return appHelpers.markBroken req.application, err
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
                                return appHelpers.markBroken req.application, err

                            # Reset proxy
                            manager.resetProxy (err) ->
                                delete startedApplications[req.application.id]

                                if err
                                    appHelpers.markBroken req.application, err
                                else
                                    res.send
                                        success: true
                                        msg: localizationManager.t 'running'
                                        app: req.application

        else
            res.send
                error: true
                msg: localizationManager.t 'application is already starting'
                app: req.application


    stop: (req, res, next) ->
        # Stop application
        manager.stop req.application, (err, result) ->
            return appHelpers.markBroken req.application, err if err

            data =
                state: 'stopped'
                port : 0
            # Update application state
            req.application.updateAttributes data, (err) ->
                return sendError res, err if err
                # Reset proxy
                manager.resetProxy (err) ->
                    return appHelpers.markBroken req.application, err if err
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
                app.password = app.helpers.newAccessToken()
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
                                if err then log.error err.stack
                                else log.info 'icon attached'
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

    # get token for static application access
    getToken: (req, res, next) ->
        Application.all key: req.params.name, (err, apps) ->
            return sendError res, err if err
            Application.getToken apps[0]._id, (err, access) ->
                if err?
                    res.send
                        error: true
                        success: false
                        message: err
                    , 500
                else
                    res.send 200, access.token

