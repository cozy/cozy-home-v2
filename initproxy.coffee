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
        port: 8001
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
        port: 8002
        git: "git://github.com/mycozycloud/cozy-todo.git"
        description: """
        Get Things Done
        """
    #new Application
        #name: "Emails"
        #state: "installed"
        #index: 0
        #slug: "mails"
        #icon: "mails_icon.png"
        #port: 8003
        #git: "git://github.com/mycozycloud/cozy-mails.git"
        #description: """
        #Manage your emails
        #"""
    ]

func = (app) ->
    (callback) ->
        appManager._addRouteToProxy app, { drone: port: app.port }, callback

funcs = (func(app) for app in apps)

async.series funcs, ->
    console.log "Proxy initialization succeeds."

    process.exit(0)
