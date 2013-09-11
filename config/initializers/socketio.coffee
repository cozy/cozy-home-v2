
{AppManager} = require "../../lib/paas"

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

applicationTimeout = []

module.exports = (compound) ->

    RealtimeAdapter     = require 'cozy-realtime-adapter'
    NotificationsHelper = require 'cozy-notifications-helper'
    AlarmManager        = require '../../lib/alarm_manager'
    {User, Alarm, Application, Notification} = compound.models


    # notification and application events should be proxyed to client
    realtime = RealtimeAdapter compound, ['notification.*', 'application.*']

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
        , 900000
