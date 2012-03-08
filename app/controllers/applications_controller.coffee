
action 'index', ->
    layout(false)
    render title: "Cozy Home"


action 'clean', ->
    Application.destroyAll (error) ->
        if error
            send error: "Cleaning DB failed."
        else
            send success: "All applications are removed."


action 'init', ->
    app = new Application( name: "Noty plus", state: "installed", index: 0, path: "noty-plus")
    app.save (error) ->
        if error
            send error: "Initialization failed."
        else
            send success: "Initialization succeeds."


action 'applications', ->
    Application.all (errors, apps) ->
        if errors
            send error: "Retreive application failed."
        else
            send rows: apps



