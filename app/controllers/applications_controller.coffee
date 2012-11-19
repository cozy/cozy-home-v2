# Actions to manage applications : home page + API.


slugify = require "../../common/slug"
{AppManager} = require "../../lib/paas"


# Helpers

send_error = (msg, code=500) ->
    if msg
        send error: true, msg: msg, code
    else
        send error: true, msg: "Server error occured", code


# Load application corresponding to slug given in params
before 'load application', ->
    Application.all key: params.slug, (err, apps) =>
        if err
            console.log err
            send_error()
        else if apps is null or apps.length == 0
            send error: 'Application not found', 404
        else
            @app = apps[0]
            next()
, only: ['update', 'uninstall']


## Actions


# Home page of the application, render browser UI.
action 'index', ->
    layout false
    render title: "Cozy Home"


# Return list of applications available on this cozy instance.
action 'applications', ->
    Application.all (errors, apps) ->
        if errors
            send_error "Retrieve applications failed."
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

    setupApp = (app) ->
        manager = new AppManager
        manager.installApp app, (err, result) ->
            if err
                app.state = "broken"
                app.save (err) ->
                    if err
                        send_error err.message
                    else
                        send
                            error: true
                            success: false
                            app:app
                            , 201
            else
                app.state = "installed"
                app.port = result.drone.port
                app.save (err) ->
                    if err
                        send_error err.message
                    else
                        manager.resetProxy (err) ->
                            if err
                                railway.logger.write "Proxy reset failed."
                                send_error "Server error occured"
                            else
                                send { success: true, app: app }, 201

    Application.all key: body.slug, (err, apps) ->
        if err
            send_error err.message
        else if apps.length
            send_error "There is already an app with similar name", 400
        else
            Application.create body, (err, app) ->
                if err
                    send_error err.message
                else
                    setupApp app


# Remove app from 3 places :
# * haibu, application manager
# * proxy, cozy router
# * database
action "uninstall", ->

    markAppAsBroken = =>
        @app.state = "broken"
        @app.save (err) ->
            if err
                send_error()
            else
                send_error "uninstallation failed"

    removeAppFromDb = =>
        @app.destroy (err) ->
            if err
                console.log err
                send_error 'Cannot destroy app'
            else
                manager.resetProxy (err) ->
                    if err
                        send_error 'Reset Proxy failed.'
                    else
                        send success: true, msg: 'Application succesfuly uninstalled'

    manager = new AppManager
    manager.uninstallApp @app, (err, result) =>
        if err
            markAppAsBroken()
        else
            removeAppFromDb()

# Update an app :
# * haibu, application manager
# * proxy, cozy router
# * database
action "update", ->

    markAppAsBroken = =>
        @app.state = "broken"
        @app.save (err) ->
            if err
                send_error()
            else
                send_error "uninstallation failed"

    manager = new AppManager
    manager.updateApp @app, (err, result) =>
        if err
            markAppAsBroken()
        else
            @app.state = "installed"
            @app.save (err) ->
                if err
                    send_error()
                else
                    manager.resetProxy (err) ->
                        if err
                            markAppAsBroken()
                        else
                            send
                                success: true
                                msg: 'Application succesfuly updated'
