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
                when 'installed'
                    notifhelper.createTemporary
                        text: "#{app.name} is ready."
                        resource: {app: app.slug}
                when 'broken'
                    notifhelper.createTemporary
                        text: "#{app.name}'s installation failled."
                        resource: {app: 'home'}
                else return