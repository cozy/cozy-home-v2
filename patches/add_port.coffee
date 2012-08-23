server = require '../server'
async = require "async"


saveFunc = (app) ->
    (callback) ->
        app.save callback

Application.all (err, apps) ->
    if err
        console.log "Patch failed"
    else
        for app in apps
            if app.name == "Notes"
                app.port = 8001
                app.git = "https://github.com/mycozycloud/cozy-notes.git"
            else if app.name == "Todos"
                app.port = 8002
                app.git = "https://github.com/mycozycloud/cozy-todos.git"
            else if app.name == "Emails"
                app.port = 8003
                app.git = "https://github.com/mycozycloud/cozy-mails.git"
        saveFuncs = (saveFunc(app) for app in apps)
        async.series saveFuncs, ->
            console.log "Patch succeeds."
            process.exit(0)

