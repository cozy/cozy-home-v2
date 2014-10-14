fs = require 'fs'
request = require 'request-json'
Application = require '../models/application'
ControllerClient = require("cozy-clients").ControllerClient

client = request.newClient 'http://localhost:9104/'

getAuthController = ->
    if process.env.NODE_ENV is 'production'
        try
            token = process.env.TOKEN
            return token
        catch err
            console.log err.message
            console.log err.stack
            return null
    else
        return ""

haibuClient =  new ControllerClient
    token: getAuthController()



updateRoutes = (occurence) ->
    if occurence < 10
        resetRoutes()
        setTimeout () =>
            updateRoutes(occurence + 1)
        , 30000
    else if occurence < 15
        resetRoutes()
        setTimeout () =>
            updateRoutes(occurence + 1)
        , 60000

# Grab all application informations listed in the database and compare
# them to informations stored inside haibu. If port is different
# application port is updated in data system.
resetRoutes = ->
    Application.all (err, installedApps) ->
        appDict = {}
        if installedApps isnt undefined
            for installedApp in installedApps
                if installedApp.name isnt ""
                    appDict[installedApp.slug] = installedApp
                else
                    installedApp.destroy()

        haibuClient.running (err, res, apps) ->
            updateApps apps, appDict, resetProxy

# Recursive function that compare haibu port to port stored for each
# application. If port is different, the application port is
# updated with the one given by haibu.
updateApps = (apps, appDict, callback) ->
    if apps? and apps.length > 0
        app = apps.pop()
        installedApp = appDict[app.name]

        if installedApp? and installedApp.port isnt app.port
            installedApp.updateAttributes port: app.port, (err) ->
                updateApps apps, appDict, callback
        else
            updateApps apps, appDict, callback
    else
        callback()

# Ask to proxy for synchronization between home and proxy.
resetProxy = ->
    client.get 'routes/reset/', (err, res, body) ->
        if res? and res.statusCode is 200
            console.info 'Proxy successfuly reseted.'
        else
            console.info 'Something went wrong while reseting proxy.'

module.exports = ->
    resetRoutes()
