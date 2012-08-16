# Actions to manage applications : home page + API.
#

## Filters

slugify = require("../../lib/slug")

# Checks if user is authenticated, if not a simple 403 error is sent.
checkApiAuthenticated = ->
    if req.isAuthenticated() then next() else send 403

before checkApiAuthenticated, { except: ["init", "index", "users"] }


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
    body.state = "installed"

    Application.all where: { slug: body.slug }, (err, apps) ->
        if err
            send error: true, msg: "Server error occured", 500
        if apps.length
            send error: true, msg: "There is already an app for that name", 400
        
        Application.create body, (err, app) ->
            if err
                send error: true, msg: "Server error occured", 500
            send app, 201
