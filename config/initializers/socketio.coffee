module.exports = (compound) ->

    compound.models.Notification.destroyAll () ->
        console.log "All notifications have been deleted."

    initializer = require('cozy-realtime-adapter')
    AlarmManager = require '../../lib/alarm_manager'
    {User, Alarm} = compound.models

    User.all (err, users) ->
        if err? or users.length is 0
            console.info "Internal server error. Can't retrieve users or no user exists."
        else
            timezone = users[0].timezone
            alarmManager = new AlarmManager(timezone, Alarm)
            compound.alarmManager = alarmManager

            initializer(compound, ['notification.*', 'alarm.*'])
                .on 'alarm.*', (event, message) ->
                    alarmManager.handleAlarm(event, message)
