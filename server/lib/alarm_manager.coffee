time = require 'time'
tDate = time.Date
CozyAdapter = require('jugglingdb-cozy-adapter')
RRule = require('rrule').RRule

oneDay = 24*60*60*1000

module.exports = class AlarmManager

    dailytimer: null
    timeouts: {}

    constructor: (@timezone, @Alarm, @notificationhelper) ->
        @fetchAlarms()

    # retrieve alarms from DS and call addAlarmCounters for
    # each one
    fetchAlarms: () =>
        @dailytimer = setTimeout @fetchAlarms, oneDay
        # We load the alarms for the next 24h
        @Alarm.all (err, alarms) =>
            @addAlarmCounters alarm for alarm in alarms

    # cancel all timeouts for a given id
    clearTimeouts: (id) ->
        if @timeouts[id]?
            clearTimeout timeout for timeout in @timeouts[id]
            delete @timeouts[id]

    # Analyze upcoming event from Data System and act with it.
    handleAlarm: (event, msg) =>
        switch event
            when "alarm.create"
                @Alarm.find msg, (err, alarm) =>
                    @addAlarmCounters alarm if alarm

            when "alarm.update"
                @Alarm.find msg, (err, alarm) =>
                    @addAlarmCounters alarm if alarm

            when "alarm.delete"
                @clearTimeouts msg

    # find all notifications for a DS's alarm object
    # and call addAlarmCounter for each one
    addAlarmCounters: (alarm) ->
        @clearTimeouts alarm._id
        now = new tDate()
        now.setTimezone @timezone
        in24h = new tDate(now.getTime() + oneDay)
        in24h.setTimezone @timezone
        trigg = new tDate alarm.trigg
        trigg.setTimezone 'UTC'

        if alarm.rrule
            rrule = RRule.parseString alarm.rrule
            rrule.dtstart = trigg
            occurences = new RRule(rrule).between(now, in24h)
            occurences = occurences.map (string) ->
                occurence = new tDate string
                occurence.setTimezone @timezone
                return occurence
        else if now.getTime() <= trigg.getTime() < in24h.getTime()
                occurences = [trigg]
        else
                occurences = []

        for occurence in occurences
            @addAlarmCounter alarm, occurence


    # setup a timeout to call handleNotification at
    # triggerDate
    addAlarmCounter: (alarm, triggerDate) ->

        now = new tDate()
        now.setTimezone @timezone
        triggerDate.setTimezone @timezone

        delta = triggerDate.getTime() - now.getTime()

        if delta > 0
            console.info "Notification in #{delta/1000} seconds."
            @timeouts[alarm._id] ?= []
            @timeouts[alarm._id].push setTimeout (=> @handleNotification alarm) , delta


    # immediately create the Notification object
    # and/or send Email for a given alarm
    handleNotification = (alarm) =>

        if alarm.action in ['DISPLAY', 'BOTH']
            resource = if alarm.related? then alarm.related
            else
                app: 'calendar'
                url: "/#list" #TODO go to the alarm itself

            @notificationhelper.createTemporary
                text: "Reminder: #{alarm.description}"
                resource: resource


        else if alarm.action in ['EMAIL', 'BOTH']
            data =
                from: "Cozy Agenda <no-reply@cozycloud.cc>"
                subject: "[Cozy-Agenda] Reminder"
                content: "Reminder: #{alarm.description}"

            CozyAdapter.sendMailToUser data, (error, response) ->
                console.info error if error?

        else
            console.log "UNKNOWN ACTION TYPE"