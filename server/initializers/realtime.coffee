NotificationsHelper = require 'cozy-notifications-helper'
RealtimeAdapter = require 'cozy-realtime-adapter'
autostop = require '../lib/autostop'
AlarmManager = require '../lib/alarm_manager'

User = require '../models/user'
Alarm = require '../models/alarm'
Event = require '../models/event'
Application = require '../models/application'
Notification = require '../models/notification'


# notification and application events should be proxyed to client
notifhelper = new NotificationsHelper 'home'


module.exports = (app, callback) ->

    realtime = RealtimeAdapter app, ['notification.*', 'application.*']

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
        if name isnt 'home' and name isnt 'proxy'
            autostop.restartTimeout name


    # setup alarm manager for alarm events handling
    User.all (err, users) ->
        if err? or users.length is 0
            console.info "Internal server error. Can't retrieve users or no user exists."
        else
            timezone = users[0].timezone
            alarmManager = new AlarmManager timezone, Alarm, Event, notifhelper
            app.alarmManager = alarmManager
            realtime.on 'alarm.*', alarmManager.handleAlarm
            realtime.on 'event.*', alarmManager.handleAlarm
        callback()
