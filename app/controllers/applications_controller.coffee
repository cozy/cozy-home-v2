# Actions to manage applications : home page + API.


slugify = require "./common/slug"
{AppManager} = require "./lib/paas"


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

mark_broken = (app, err) ->
    console.log "Marking app as broken because"
    console.log err.stack

    app.state = "broken"
    app.save (saveErr) ->

        return send_error saveErr if saveErr

        send
            app: app
            error: true
            success: false
            message: err.message
            stack: err.stack
        , 500


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
, only: ['update', 'start','stop','uninstall']


## Actions

# Return list of applications available on this cozy instance.
action 'applications', ->
    Application.all (errors, apps) ->
        if errors
            send_error new Error "Retrieve applications failed."
        else
            send rows: apps


# Set up app into 3 places :
# * haibu, application manager
# * proxy, cozy router
# * database
# Send an error if an application already has same slug.
action "install", ->

    body.slug = slugify body.name
    body.state = "installing"

    Application.all key: body.slug, (err, apps) ->

        return send_error err, 500 if err

        if apps.length > 0
            err = new Error "There is already an app with similar name"
            return send_error err, 400


        Application.create body, (err, appli) ->

            return send_error err if err

            console.info 'attempt to install app ' + JSON.stringify(appli)
            manager = new AppManager()
            manager.installApp appli, (err, result) ->

                return mark_broken appli, err if err

                appli.state = "installed"
                appli.port  = result.drone.port
                appli.save (err) ->

                    return send_error err if err

                    manager.resetProxy (err) ->

                        return send_error err if err

                        send success: true, app: appli, 201

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

    manager = new AppManager
    manager.updateApp @app, (err, result) =>

        return mark_broken @app, err if err

        @app.state = "installed"
        @app.port = result.drone.port
        @app.save (err) ->

            return send_error err if err

            manager.resetProxy (err) ->

                return mark_broken @app, err if err

                send
                    success: true
                    msg: 'Application succesfuly updated'

action "start", ->
    manager = new AppManager
    manager.start @app, (err, result) =>

        return mark_broken @app, err if err

        # require('eyes').inspect result

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

        @app.state = "stopped"
        @app.port = 0
        @app.save (err) =>

            return send_error err if err

            manager.resetProxy (err) =>

                return mark_broken @app, err if err

                send
                    success:true
                    msg: 'Application stopped'
                    app: @app
