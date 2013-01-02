Client = require('request-json').JsonClient

client = new Client 'http://localhost:9104/'
haibu = require('haibu-api')
haibuClient = haibu.createClient(
    host: 'localhost'
    port: 9002
)


haibuClient =  new Client 'http://localhost:9002/'

resetRoutes = ->
    Application.all (err, installedApps) ->
        appDict = {}
        for installedApp in installedApps
            appDict[installedApp.name] = installedApp
            
        haibuClient.get 'drones/running', (err, res, apps) ->
            updateApps(apps, appDict, resetProxy)

updateApps = (apps, appDict, callback) ->
    if apps.length > 0
        app = apps.pop()
        installedApp = appDict[app.name]
        
        if installedApp? and installedApp.port isnt app.port
            installedApp.updateAttributes port: app.port, (err) ->
                updateApps apps, appDict, callback
        else
            updateApps apps, appDict, callback
    else
        callback()

resetProxy = ->
    client.get 'routes/reset/', (err, res, body) ->
        if res.statusCode is 200
            console.info 'Proxy successfuly reseted.'
        else
            console.info 'Something went wrong while reseting proxy.'

if process.env.NODE_ENV != "test"
    resetRoutes()

