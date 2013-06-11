module.exports = (compound) ->

    # Bring models in context
    {Application, CozyInstance, User} = compound.models

    Client = require('request-json').JsonClient

    client = new Client 'http://localhost:9104/'
    haibuClient =  new Client 'http://localhost:9002/'

    # Grab all application informations listed in the database and compare
    # them to informations stored inside haibu. If port is different
    # application port is updated in data system.
    resetRoutes = ->
        Application.all (err, installedApps) ->
            appDict = {}
            if installedApps isnt undefined
                for installedApp in installedApps
                    if installedApp.name isnt ""
                        appDict[installedApp.name] = installedApp
                    else
                        installedApp.destroy()

            haibuClient.get 'drones/running', (err, res, apps) ->
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

    if process.env.NODE_ENV != "test"
        resetRoutes()
