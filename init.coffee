server = require './server'
async = require "async"


## Small script to intialize list of available applications.

apps = [
    new Application
        name: "Notes"
        state: "installed"
        index: 0
        slug: "notes"
        icon: "notes_icon.png"
        port: 8001
        description: """
        Organize your interests
        """
    new Application
        name: "Todos"
        state: "installed"
        index: 1
        slug: "todos"
        icon: "todos_icon.png"
        port: 8002
        description: """
        Get Things Done
        """
    new Application
        name: "Emails"
        state: "installed"
        index: 0
        slug: "mails"
        icon: "mails_icon.png"
        port: 8003
        description: """
        Manage your emails
        """
    ]

saveFunc = (app) ->
    (callback) ->
        app.save callback

saveFuncs = (saveFunc(app) for app in apps)

async.series saveFuncs, ->
    console.log "Initialization succeeds."
    process.exit(0)

