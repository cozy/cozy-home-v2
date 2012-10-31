server = require './server'
async = require "async"

{AppManager} = new require("./lib/paas")

## Small script to intialize list of available applications.

appManager = new AppManager()
apps = [
    new Application
        name: "Notes"
        state: "installed"
        index: 0
        slug: "notes"
        icon: "notes_icon.png"
        port: 9201
        git: "git://github.com/mycozycloud/cozy-notes.git"
        description: """
        Organize your interests
        """
    new Application
        name: "Todos"
        state: "installed"
        index: 1
        slug: "todos"
        icon: "todos_icon.png"
        port: 9202
        git: "git://github.com/mycozycloud/cozy-todo.git"
        description: """
        Get Things Done
        """
    ]

saveFunc = (app) ->
    (callback) ->
        app.save ->
            appManager._addRouteToProxy app, { drone: port: app.port }, callback

saveFuncs = (saveFunc(app) for app in apps)

async.series saveFuncs, ->
    console.log "Initialization succeeds."

    process.exit(0)

