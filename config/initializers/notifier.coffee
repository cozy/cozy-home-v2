module.exports = (compound) ->

    NotificationManager = require '../../lib/notification_manager'

    # Make the server a socket server
    sio = require 'socket.io'
    compound.io = sio.listen compound.server

    compound.io.set 'log level', 2
    compound.io.set 'transports', ['websocket']

    Alarm = compound.models.Alarm
    User = compound.models.User

    User.all (err, users) ->
        if err? or users.length is 0
            console.info "Internal server error. Can't retrieve users or no user exists."
        else
            timezone = users[0].timezone

            notifManager = new NotificationManager(compound.io, timezone)

            # Listen to redis for event on the alarm doctype
            redis = require 'redis'
            client = redis.createClient()
            console.log ' socket.io initialized !'

            # We get the alarm and start the notification logic
            Alarm.all (err, alarms) ->
                for alarm in alarms
                    notifManager.addNotification alarm

            client.on 'pmessage', (pat, ch, msg) ->
                console.log pat, ch, msg
                if ch is "alarm.create"
                    Alarm.find msg, (err, alarm) ->
                        notifManager.addNotification alarm
                else if ch is "alarm.update"
                    Alarm.find msg, (err, alarm) ->
                        notifManager.updateNotification alarm
                else if ch is "alarm.delete"
                    notifManager.removeNotification msg


            client.psubscribe 'alarm.*'
