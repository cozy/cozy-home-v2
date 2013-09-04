equest = require("request-json")
fs = require('fs')
{Application} = require '../models/application'
{AppManager} = require '../lib/paas'
{PermissionsManager} = require '../lib/permissions'
{DescriptionManager} = require '../lib/description'


# Helpers

send_error = (res, err, code=500) ->
    err ?=
        stack:   null
        message: "Server error occured"

    console.log "Sending error to client :"
    console.log err.stack

    res.send code,
        error: true
        success: false
        message: err.message
        stack: err.stack

send_error_socket = (err) ->
    compound.io.sockets.emit 'installerror', err.stack

mark_broken = (res, app, err) ->
    console.log "Marking app #{app.name} as broken because"
    console.log err.stack

    app.state = "broken"
    app.password = null
    app.errormsg = err.message
    app.save (saveErr) ->
        return send_error res, saveErr if saveErr

        res.send
            app: app
            error: true
            success: false
            message: err.message
            stack: err.stack
        , 500

# Define random function for application's token
randomString = (length) ->
    string = ""
    while (string.length < length)
        string = string + Math.random().toString(36).substr(2)
    return string.substr 0, length

# Save an app's icon in the DS
saveIcon = (appli, callback = ->) ->
    client = request.newClient "http://localhost:#{appli.port}/"
    tmpName = "/tmp/icon_#{appli.slug}.png"
    client.saveFile "icons/main_icon.png", tmpName, (err, res, body) ->
        return callback err if err
        appli.attachFile tmpName, name: 'icon.png', (err) ->
            fs.unlink tmpName
            return callback err if err
            callback null

module.exports =

    # Load application corresponding to slug given in params
    loadApplication: (req, res, next, slug) ->
        Application.all key: params.slug, (err, apps) ->
            if err
                next err
            else if apps is null or apps.length is 0
                res.send 404, error: 'Application not found'
            else
                req.app
                next()


    applications: (req, res, next) ->
        Application.all (err, apps) ->
            if err then next err
            else res.send rows: apps


    getPermissions: (req, res, next) ->
        permissions = new PermissionsManager()
        permissions.get req.body, (err, docTypes) ->
            if err then next err
            else
                app = permissions: docTypes
                res.send success: true, app: app


    getDescription: (req, res, next) ->
        description = new DescriptionManager()
        description.get req.body, (err, description) ->
            app = description: description
            res.send success: true, app: app


    getMetaData: (req, res, next) ->
        metaDataManager = new DescriptionManager()
        metaDataManager.get req.body, (metaData) ->
            res.send succes: true, app: metaData, 200


    read: (req, res, next) ->
        Application.find params.id, (err, app) ->
            if err then send_error res, err
            else if app is null
                send_error res, new Error('Application not found'), 404
            else
                res.send app


    icon: (req, res, next) ->
        if req.app._attachments?['icon.png']
            return req.app.getFile('icon.png', (->)).pipe res

        # else, do the attaching (apps installed before)
        # FOR MIGRATION, REMOVE ME LATER
        saveIcon req.app, (err) =>
            if err
                return fs.createReadStream('./client/app/assets/img/stopped.png').pipe res
            req.app.getFile('icon.png', (->)).pipe res


    updatestoppable: (req, res, next) ->
        Application.find params.id, (err, app) ->
            if err
                send_error res, err
            else if app is null
                send_error res, new Error('Application not found'), 404
            else
                app.updateAttributes isStoppable : req.body.isStoppable, (err, app) ->
                    return send_error res, err if err
                    res.send app


    # Set up app into 3 places :
    # * haibu, application manager
    # * proxy, cozy router
    # * database
    # Send an error if an application already has same slug.
    install: (req, res, next) ->
        req.body.slug = slugify req.body.name
        req.body.state = "installing"
        req.body.password = randomString 32

        Application.all key: req.body.slug, (err, apps) ->
            return send_error res, err if err

            if apps.length > 0 or req.body.slug is "proxy" or
                    req.body.slug is "home" or req.body.slug is "data-system"
                err = new Error "There is already an app with similar name"
                return send_error res, err, 400

            permissions = new PermissionsManager()
            permissions.get req.body, (err, docTypes) ->
                return send_error res, err if err
                req.body.permissions = docTypes

                Application.create req.body, (err, appli) ->
                    return send_error res, err if err

                    res.send success: true, app: appli, 201

                    console.info 'attempt to install app ' + JSON.stringify(appli)
                    manager = new AppManager()
                    manager.installApp appli, (err, result) ->

                        if err
                            mark_broken res, appli, err
                            res.send_error_socket err
                            return

                        appli.state = "installed"
                        appli.port = result.drone.port

                        console.info 'install succeeded on port ', appli.port

                        saveIcon appli, (err) ->
                            if err then console.log err.stack
                            else console.info 'icon attached'

                        appli.save (err) ->
                            return res.send_error_socket err if err
                            console.info 'saved port in db', appli.port
                            manager.resetProxy (err) ->
                                return send_error_socket err if err
                                console.info 'proxy reset', appli.port


    # Remove app from 3 places :
    # * haibu, application manager
    # * proxy, cozy router
    # * database
    uninstall: (req, res, next) ->
        req.body.slug = slugify req.body.name
        manager = new AppManager
        manager.uninstallApp req.app, (err, result) ->
            return mark_broken res, req.app, err if err

            req.app.destroy (err) ->
                return send_error res, err if err

                manager.resetProxy (err) ->
                    return send_error res, proxyErr if err

                    res.send
                        success: true
                        msg: 'Application succesfuly uninstalled'

    # Update an app :
    # * haibu, application manager
    # * proxy, cozy router
    # * database
    update: (req, res, next) ->
        manager = new AppManager()
        if not req.app.password?
            req.app.password = randomString 32

        manager.updateApp req.app, (err, result) ->
            return mark_broken res, req.app, err if err

            req.app.state = "installed"
            permissions = new PermissionsManager()
            permissions.get req.app, (err, docTypes) ->
                req.app.permissions = docTypes
                req.app.save (err) ->

                    saveIcon appli, (err) ->
                        if err then console.log err.stack
                        else console.info 'icon attached'

                    return send_error res, err if err

                    manager.resetProxy (err) ->
                        return mark_broken res, req.app, err if err

                        res.send
                            success: true
                            msg: 'Application succesfuly updated'

    start: (req, res, next) ->
        manager = new AppManager
        manager.start req.app, (err, result) ->
            return mark_broken res, req.app, err if err

            req.app.state = "installed"
            req.app.port = result.drone.port
            req.app.save (err) ->
                return send_error res, err if err

                manager.resetProxy (err) ->
                    return mark_broken res, req.app, err if err

                    res.send
                        success: true
                        msg: 'Application running'
                        app: req.app

    stop: (req, res, next) ->
        manager = new AppManager
        manager.stop req.app, (err, result) ->
            return mark_broken res, req.app, err if err

            data =
                state: 'stopped'
                port : 0

            req.app.updateAttributes data, (err) ->
                return send_error res, err if err

                manager.resetProxy (err) ->
                    return mark_broken res, req.app, err if err
                    res.send
                        success: true
                        msg: 'Application stopped'
                        app: req.app
