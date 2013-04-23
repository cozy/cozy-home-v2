time = require 'time'

module.exports = class NotificationManager

    timeouts: {}

    constructor: (iosocket, timezone) ->
        @ios = iosocket
        @timezone = timezone

    addNotification: (alarm) ->

        triggerDate = new time.Date(alarm.trigg)
        triggerDate.setTimezone(@timezone)
        now = new time.Date()
        now.setTimezone(@timezone)

        delta = triggerDate.getTime() - now.getTime()
        #console.info delta
        #console.info triggerDate.toString()
        #console.info now.toString()

        if delta > 0
            console.info "Notification in #{delta/1000} seconds."
            @timeouts[alarm._id] = setTimeout((
                () =>
                    @ios.sockets.emit 'notification',
                        value: "Remind: #{alarm.description}"
                    console.info "NOTIFICATION: #{alarm.description}"
                ), delta)

    removeNotification: (id) ->
        if @timeouts[id]?
            clearTimeout @timeouts[id]
            delete @timeouts[id]


    updateNotification: (alarm) ->
        if @timeouts[alarm._id]?
            clearTimeout @timeouts[alarm._id]
            @addNotification alarm
