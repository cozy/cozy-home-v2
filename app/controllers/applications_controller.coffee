
# Actions to manage applications : home page + API.
#

## Filters


# Checks if user is authenticated, if not a simple 403 error is sent.
# TODO Make application more script friendly, with challenge requests for
# basic authentication.
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


