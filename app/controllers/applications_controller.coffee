# Actions to manage applications : home page + API.
#

## Filters

slugify = require "../../lib/slug"
{AppManager} = require "../../lib/paas"

# Checks if user is authenticated, if not a simple 403 error is sent.
checkApiAuthenticated = ->
    if req.isAuthenticated() then next() else send 403

before checkApiAuthenticated, { except: ["init", "index", "users"] }

# Load application corresponding to slug given in params
before 'load application', ->
    Application.all where: { slug: params.slug }, (err, apps) =>
        if err
            console.log err
            send error: 'An error occured', 500
        else if apps is null or apps.length == 0
            send error: 'Application not found', 404
        else
            @app = apps[0]
            next()
, only: ['uninstall']


## Actions


# Home page of the application, render browser UI.
action 'index', ->
    layout false
    render title: "Cozy Home"


# Return list of applications available on this cozy instance.
action 'applications', ->
    Application.all (errors, apps) ->
        if errors
            send error: "Retrieve applications failed.", 500
        else
            send rows: apps

action "install", ->
    body.slug = slugify body.name
    body.state = "installing"

    Application.all where: { slug: body.slug }, (err, apps) ->
        if err
            send error: true, msg: "Server error occured", 500
        if apps.length
            send error: true, msg: "There is already an app for that name", 400
        
        else
            Application.create body, (err, app) ->
                if err
                    send error: true, msg: "Server error occured", 500

                manager = new AppManager
                manager.installApp app, (err, result) ->
                    if err
                        app.state = "broken"
                        app.save (err) ->
                            if err
                                send
                                    error: true,
                                    msg: "Server error occured"
                                    , 500
                            else
                                send app, 201
                    else
                        app.state = "installed"
                        console.log result
                        app.port = result.drone.port
                        app.save (err) ->
                            if err
                                send
                                    error: true,
                                    msg: "Server error occured"
                                    , 500
                            else
                                send app, 201


send_error = (msg) ->
    if msg
        send error: true, msg: msg, 500
    else
        send error: true, msg: "Server error occured", 500

                                
action "uninstall", ->
    
    manager = new AppManager
    manager.uninstallApp @app, (err, result) =>
        if err
            @app.state = "broken"
            @app.save (err) ->
                if err
                    send_error()
                else
                    send_error "uninstallation failed"
        else
            @app.destroy (err) ->
                if err
                    console.log err
                    send_error 'Cannot destroy app'
                else
                    send success: 'Application succesfuly uninstalled'
