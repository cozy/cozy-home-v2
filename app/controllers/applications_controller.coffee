# Actions to manage applications : home page + API.


slugify = require "./common/slug"
Client = require("request-json").JsonClient
fs = require('fs')
{AppManager} = require "./lib/paas"
{PermissionsManager} = require "./lib/permissions"
{DescriptionManager} = require "./lib/description"


# Helpers

send_error = (err, code=500) ->
    err ?=
        stack:   null
        message: "Server error occured"

    console.log "Sending error to client :"
    console.log err.stack

    send
        error: true
        success: false
        message: err.message
        stack: err.stack
    , code

send_error_socket = (err) ->
    compound.io.sockets.emit 'installerror', err.stack

mark_broken = (app, err) ->
    console.log "Marking app #{app.name} as broken because"
    console.log err.stack

    app.state = "broken"
    app.password = null
    app.errormsg = err.message
    app.save (saveErr) ->

        return send_error saveErr if saveErr

        send
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
    client = new Client "http://localhost:#{appli.port}/"
    tmpName = "/tmp/icon_#{appli.slug}.png"
    client.saveFile "icons/main_icon.png", tmpName, (err, res, body) ->
        return callback err if err
        appli.attachFile tmpName, name: 'icon.png', (err) ->
            fs.unlink tmpName
            return callback err if err
            callback null

# Load application corresponding to slug given in params
before 'load application', ->
    Application.all key: params.slug, (err, apps) =>
        if err
            send_error err
        else if apps is null or apps.length == 0
            send_error new Error('Application not found'), 404
        else
            @app = apps[0]
            next()
, only: ['update', 'icon', 'start','stop','uninstall']


## Actions

# Return list of applications available on this cozy instance.
action 'applications', ->
    Application.all (errors, apps) ->
        if errors
            send_error new Error "Retrieve applications failed."
        else
            send rows: apps

action 'getPermissions', ->
    permissions = new PermissionsManager()
    permissions.get body, (err, docTypes) =>
        app =
            permissions: docTypes
        send succes: true, app: app, 201

action 'getDescription', ->
    description = new DescriptionManager()
    description.get body, (err, description) =>
        app =
            description: description
        send succes: true, app: app, 201

action 'getMetaData', ->
    metaDataManager = new DescriptionManager()
    metaDataManager.get body, (metaData) ->
        send succes: true, app: metaData, 200

#display one application
action 'read', ->
    Application.find params.id, (err, app) ->
        if err
            send_error err
        else if app is null
            send_error new Error('Application not found'), 404
        else
            send app

# display the icon
action 'icon', ->
    if @app._attachments?['icon.png']
        return @app.getFile('icon.png', (->)).pipe res

    # else, do the attaching (apps installed before)
    # FOR MIGRATION, REMOVE ME LATER
    saveIcon @app, (err) =>
        return send 500 if err
        @app.getFile('icon.png', (->)).pipe res


# update applications options
action 'updatestoppable', ->
    Application.find params.id, (err, app) ->
        if err
            send_error err
        else if app is null
            send_error new Error('Application not found'), 404
        else
            app.updateAttributes isStoppable : body.isStoppable, (err, app) ->
                return send_error err if err
                send app


# Set up app into 3 places :
# * haibu, application manager
# * proxy, cozy router
# * database
# Send an error if an application already has same slug.
action "install", ->

    body.slug = slugify body.name
    body.state = "installing"
    body.password = randomString 32

    Application.all key: body.slug, (err, apps) ->

        return send_error err, 500 if err

        if apps.length > 0 or body.slug is "proxy" or
                body.slug is "home" or body.slug is "data-system"
            err = new Error "There is already an app with similar name"
            return send_error err, 400

        permissions = new PermissionsManager()
        permissions.get body, (err, docTypes) =>
            body.permissions = docTypes

            Application.create body, (err, appli) ->

                return send_error err if err

                send success: true, app: appli, 201

                console.info 'attempt to install app ' + JSON.stringify(appli)
                manager = new AppManager()
                manager.installApp appli, (err, result) ->

                    if err
                        mark_broken appli, err
                        send_error_socket err
                        return

                    appli.state = "installed"
                    appli.port  = result.drone.port

                    console.info 'install succeeded on port ', appli.port

                    saveIcon appli, (err) ->
                        if err then console.log err.stack
                        else console.info 'icon attached'

                    appli.save (err) ->

                        return send_error_socket err if err

                        console.info 'saved port in db', appli.port

                        manager.resetProxy (err) ->

                            return send_error_socket err if err

                            console.info 'proxy reset', appli.port


# Remove app from 3 places :
# * haibu, application manager
# * proxy, cozy router
# * database
action "uninstall", ->

    manager = new AppManager
    manager.uninstallApp @app, (err, result) =>

        return mark_broken @app, err if err

        @app.destroy (err) ->

            return send_error err if err

            manager.resetProxy (err) ->

                return send_error proxyErr if err

                send
                    success: true
                    msg: 'Application succesfuly uninstalled'

# Update an app :
# * haibu, application manager
# * proxy, cozy router
# * database
action "update", ->

    manager = new AppManager()
    if not @app.password?
        @app.password = randomString 32
    manager.updateApp @app, (err, result) =>

        return mark_broken @app, err if err

        @app.state = "installed"
        permissions = new PermissionsManager()
        permissions.get @app, (err, docTypes) =>
            @app.permissions = docTypes
            @app.save (err) =>

                saveIcon appli, (err) ->
                    if err then console.log err.stack
                    else console.info 'icon attached'

                return send_error err if err

                manager.resetProxy (err) =>

                    return mark_broken @app, err if err

                    send
                        success: true
                        msg: 'Application succesfuly updated'

action "start", ->
    manager = new AppManager
    manager.start @app, (err, result) =>

        return mark_broken @app, err if err

        @app.state = "installed"
        @app.port = result.drone.port
        @app.save (err) =>

            return send_error err if err

            manager.resetProxy (err) =>

                return mark_broken @app, err if err

                send
                    success: true
                    msg: 'Application running'
                    app: @app

action "stop", ->

    manager = new AppManager
    manager.stop @app, (err, result) =>

        return mark_broken @app, err if err

        data =
            state: 'stopped'
            port : 0

        @app.updateAttributes data, (err) =>

            return send_error err if err

            manager.resetProxy (err) =>

                return mark_broken @app, err if err

                send
                    success:true
                    msg: 'Application stopped'
                    app: @app
