CozyAdapter = require 'jugglingdb-cozy-adapter'
RRule = require('rrule').RRule
moment = require 'moment-timezone'
log = require('printit')
    prefix: 'alarm-manager'

oneDay = 24 * 60 * 60 * 1000

module.exports = class AlarmManager

    dailytimer: null
    timeouts: {}

    constructor: (@timezone, @Alarm, @Event, @notificationhelper) ->
        @fetchAlarms()

    # retrieve alarms from DS and call addAlarmCounters for
    # each one
    fetchAlarms: =>
        @dailytimer = setTimeout @fetchAlarms, oneDay
        # We load the alarms for the next 24h
        @Alarm.all (err, alarms) =>
            @addAlarmCounters alarm for alarm in alarms

            @Event.all (err, events) =>
                @addEventCounters event for event in events

    # cancel all timeouts for a given id
    clearTimeouts: (id) ->
        if @timeouts[id]?
            clearTimeout timeout for timeout in @timeouts[id]
            delete @timeouts[id]

    # Analyze upcoming event from Data System and act with it.
    handleAlarm: (event, msg) =>
        switch event
            when "alarm.create", "alarm.update"
                @Alarm.find msg, (err, alarm) =>
                    @addAlarmCounters alarm if alarm?

            when "event.create", "event.update"
                @Event.find msg, (err, event) =>
                    @addEventCounters event if event?

            when "alarm.delete", "event.delete"
                @clearTimeouts msg

    # Handles event's alarms
    addEventCounters: (event) ->
        if event.alarms? and event.alarms.items?.length > 0
            cozyAlarms = event.getAlarms @timezone
            @addAlarmCounters cozyAlarm for cozyAlarm in cozyAlarms


    # find all notifications for a DS's alarm object
    # and call addAlarmCounter for each one
    addAlarmCounters: (alarm) ->
        @clearTimeouts alarm._id
        timezone = alarm.timezone or @timezone

        # single alarm, trigger date stored in UTC
        triggerDate = moment.tz alarm.trigg, timezone

        now = moment().tz timezone
        in24h = moment(now).add 1, 'days'

        if now.unix() <= triggerDate.unix() < in24h.unix()

            delta = triggerDate.valueOf() - now.valueOf()

            log.info "Notification in #{delta/1000} seconds."

            @timeouts[alarm._id] ?= []
            timeout = setTimeout @handleNotification.bind(@), delta, alarm
            @timeouts[alarm._id].push timeout

    # immediately create the Notification object
    # and/or send Email for a given alarm
    handleNotification: (alarm) =>

        if alarm.action in ['DISPLAY', 'BOTH']
            resource = if alarm.related? then alarm.related
            else
                app: 'calendar'
                url: "/#list" #TODO go to the alarm itself

            @notificationhelper.createTemporary
                text: "Reminder: #{alarm.description or ''}"
                resource: resource

        if alarm.action in ['EMAIL', 'BOTH']
            if alarm.event?
                event = alarm.event
                agenda = event.tags[0] or ''
                data =
                    from: 'Cozy Agenda <no-reply@cozycloud.cc>'
                    subject: "Reminder: #{event.description} - " +
                        "#{event.start.format 'llll'} " +
                        "(#{agenda} : Cozy-Calendar)"
                    content: "#{event.description} \n" +
                        "Start: #{event.start.format 'LLLL'} #{@timezone}\n" +
                        "End: #{event.end.format 'LLLL'} #{@timezone}\n" +
                        "Place: #{event.place}\n" +
                        "Description: #{event.details}\n"

            else
                data =
                    from: "Cozy Calendar <no-reply@cozycloud.cc>"
                    subject: "[Cozy-Calendar] Reminder"
                    content: "Reminder: ##{alarm.description}"

            CozyAdapter.sendMailToUser data, (error, response) ->
                if error?
                    log.error "Error while sending email -- #{error}"

        if alarm.action not in ['EMAIL', 'DISPLAY', 'BOTH']
            log.error "UNKNOWN ACTION TYPE (#{alarm.action})"

    # Handle only unique units strings.
    iCalDurationToUnitValue: (s) ->
        m = s.match /(\d+)(W|D|H|M|S)/
        o = {}
        o[m[2].toLowerCase()] = parseInt m[1]

        return o
