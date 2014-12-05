async = require 'async'

NotificationsHelper = require 'cozy-notifications-helper'
RealtimeAdapter = require 'cozy-realtime-adapter'
autostop = require '../lib/autostop'
AlarmManager = require '../lib/alarm_manager'

User = require '../models/user'
Alarm = require '../models/alarm'
Event = require '../models/event'
CozyInstance = require '../models/cozyinstance'
Application = require '../models/application'
Notification = require '../models/notification'


# notification and application events should be proxyed to client
notifhelper = new NotificationsHelper 'home'


module.exports = (app, callback) ->

    eventsToForward = ['notification.*', 'application.*', 'device.*']
    realtime = RealtimeAdapter app, eventsToForward

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
    async.parallel [User.all, CozyInstance.all], (err, results) ->
        if err? or results.length isnt 2
            console.info "Internal server error. Can't retrieve users or no user exists."
        else
            [users, instances] = results
            user = users[0]
            instance = instances[0]
            options =
                timezone: user.timezone
                locale: instance.locale
                Event: Event
                notificationHelper: notifhelper
            alarmManager = new AlarmManager options
            app.alarmManager = alarmManager
            realtime.on 'event.*', alarmManager.handleAlarm
        callback()
