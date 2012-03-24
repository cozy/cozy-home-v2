#
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


# Return list of available users
# TODO create a user package and move this action to it.
action 'users', ->
    User.all (errors, users) ->
        if errors
            send error: "Retrieve users failed.", 500
        else
            send rows: users


## Debug, to delete


# Clear all DB data (development helper).
# TODO move to a railway command.
action 'clean', ->
    destroyApplications = () ->
        Application.destroyAll (error) ->
             if error
                 send error: "Cleaning DB failed."
             else
               send success: "All applications are removed."

    destroyUsers = ->
        User.destroyAll (error) ->
            if error
                send error: "Cleaning DB failed."
            else
                destroyApplications()

    destroyUsers()



# Initialize DB data (development helper).
# TODO move to a railway command.
action 'init', ->
    create_app = ->
        app = new Application(name: "Noty plus", state: "installed", index: 0, slug: "noty-plus")

        app.save (error) ->
            if error
                send error: "Initialization failed."
            else
                send success: "Initialization succeeds."

    create_app()


