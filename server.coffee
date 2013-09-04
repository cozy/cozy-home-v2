americano = require 'americano'
{AppManager} = require "../../lib/paas"
RealtimeAdapter     = require 'cozy-realtime-adapter'
NotificationsHelper = require 'cozy-notifications-helper'
AlarmManager        = require '../../lib/alarm_manager'
{User, Alarm, Application, Notification} = compound.models
realtime = RealtimeAdapter compound, ['notification.*', 'application.*']
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

process.on 'uncaughtException', (err) ->
    console.error err
    console.error err.stack

mark_broken = (app, err) ->
    app.state = "broken"
    app.password = null
    app.errormsg = err.message
    app.save (saveErr) ->
        return send_error saveErr if saveErr

stop_app = (app) ->
    manager = new AppManager
    manager.stop app, (err, result) =>
        return mark_broken app, err if err
        data =
            state: "stopped"
            port: 0
        app.updateAttributes data, (err) =>
            return send_error err if err
            manager.resetProxy (err) =>
                return mark_broken app, err if err


# notification and application events should be proxyed to client
applicationTimeout = []
notifhelper = new NotificationsHelper 'home'

# setup alarm manager for alarm events handling
User.all (err, users) ->
    if err? or users.length is 0
        console.info "Internal server error. Can't retrieve users or no user exists."
    else
        timezone = users[0].timezone
        alarmManager = new AlarmManager(timezone, Alarm, notifhelper)
        compound.alarmManager = alarmManager
        realtime.on 'alarm.*', alarmManager.handleAlarm

# also create a notification when an app install is complete
realtime.on 'application.update', (event, id) ->
    Application.find id, (err, app) ->
        return console.log err.stack if err # no notification, no big deal
        switch app.state
            when 'broken'
                notifhelper.createTemporary
                    text: "#{app.name}'s installation failled."
                    resource: {app: 'home'}
            else return

realtime.on 'usage.application', (event, name) ->
    if applicationTimeout[name]?
        clearTimeout applicationTimeout[name]
    applicationTimeout[name] = setTimeout () ->
        console.log "stop : " + name
        if name isnt "home" and name isnt "proxy"
            Application.all (err, apps) ->
                for app in apps
                    if app.name is name
                        if app.isStoppable
                            stop_app app
    , 15000

port = process.env.PORT || 9260
american.ostart name: 'kyou', port: port, (app) -
