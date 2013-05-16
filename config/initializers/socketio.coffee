module.exports = (compound) ->

    compound.models.Notification.destroyAll () ->
        console.log "All notifications have been deleted."

    initializer = require('cozy-realtime-adapter')
    AlarmManager = require '../../lib/alarm_manager'
    {User, Alarm, Application, Notification} = compound.models


    # notification and application events should be proxyed to client
    realtime = initializer compound, ['notification.*', 'application.*']


    # setup alarm manager for alarm events handling
    User.all (err, users) ->
        if err? or users.length is 0
            console.info "Internal server error. Can't retrieve users or no user exists."
        else
            timezone = users[0].timezone
            alarmManager = new AlarmManager(timezone, Alarm)
            compound.alarmManager = alarmManager
            realtime.on 'alarm.*', alarmManager.handleAlarm

    # also create a notification when an app install is complete
    realtime.on 'application.update', (event, id) ->
        Application.find id, (err, app) ->
            return console.log err.stack if err # no notification, no big deal
            switch app.state
                when 'installed'
                    notif =
                        text: "#{app.name} is ready."
                        channel: 'DISPLAY'
                        status: 'PENDING'
                        resource:
                            app: app.slug
                            url: "/"
                when 'broken'
                    notif =
                        text: "#{app.name}'s installation failled."
                        channel: 'DISPLAY'
                        status: 'PENDING'
                        resource:
                            app: 'home'
                            url: "/"
                else return

            Notification.create notif, (err) ->
                console.log err.stack if err