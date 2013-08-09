time = require 'time'
CozyAdapter = require('jugglingdb-cozy-adapter')

module.exports = class AlarmManager

    timeouts: {}

    constructor: (@timezone, @Alarm, @notificationhelper) ->
        # We load the existing alarms
        @Alarm.all (err, alarms) =>
            for alarm in alarms
                @addAlarmCounter alarm

    handleAlarm: (event, msg) =>

        if event is "alarm.create"
            @Alarm.find msg, (err, alarm) =>
                @addAlarmCounter alarm
        else if event is "alarm.update"
            @Alarm.find msg, (err, alarm) =>
                @updateAlarmCounter alarm
        else if event is "alarm.delete"
            @removeAlarmCounter msg

    addAlarmCounter: (alarm) ->
        triggerDate = new time.Date(alarm.trigg)
        triggerDate.setTimezone(@timezone)
        now = new time.Date()
        now.setTimezone(@timezone)
        delta = triggerDate.getTime() - now.getTime()
        if delta > 0

            console.info "Notification in #{delta/1000} seconds."
            @timeouts[alarm._id] = setTimeout((
                () =>
                    if alarm.action is "DISPLAY"
                        resource = if alarm.related? then alarm.related
                        else
                            app: 'agenda'
                            url: "/" #TODO go to the alarm itself

                        @notificationhelper.createTemporary
                            text: "Reminder: #{alarm.description}"
                            resource: resource
                    else
                        data =
                            from: "Cozy Agenda <no-reply@cozycloud.cc>"
                            subject: "[Cozy-Agenda] Reminder"
                            content: "Reminder: #{alarm.description}"

                        CozyAdapter.sendMailToUser data, (error, response) ->
                            console.info error if error?

                ), delta)

    removeAlarmCounter: (id) ->
        if @timeouts[id]?
            clearTimeout @timeouts[id]
            delete @timeouts[id]

    updateAlarmCounter: (alarm) ->
        if @timeouts[alarm._id]?
            clearTimeout @timeouts[alarm._id]

        @addAlarmCounter alarm

