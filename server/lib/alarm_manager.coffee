CozyAdapter = require 'jugglingdb-cozy-adapter'
RRule = require('rrule').RRule
moment = require 'moment-timezone'
log = require('printit')
    prefix: 'alarm-manager'
localization = require './localization_manager'
Event = require '../models/event'

oneDay = 24 * 60 * 60 * 1000

module.exports = class AlarmManager

    dailytimer: null
    timeouts: {}

    constructor: (options) ->
        @timezone = options.timezone or 'UTC'
        @notificationHelper = options.notificationHelper
        @fetchAlarms()

    # retrieve alarms from DS and call addAlarmCounters for
    # each one
    fetchAlarms: =>
        @dailytimer = setTimeout @fetchAlarms, oneDay
        Event.all (err, events) =>
            @addEventCounters event for event in events

    # cancel all timeouts for a given id
    clearTimeouts: (id) ->
        if @timeouts[id]?
            clearTimeout timeout for timeout in @timeouts[id]
            delete @timeouts[id]

    # Analyze upcoming event from Data System and act with it.
    handleAlarm: (event, msg) =>
        switch event
            when "event.create", "event.update"
                Event.find msg, (err, event) =>
                    @addEventCounters event if event?

            when "event.delete"
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
        triggerDate = moment.tz alarm.trigg, 'UTC'
        triggerDate.tz timezone

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

            message = alarm.description or ''
            @notificationHelper.createTemporary
                text: localization.t 'reminder message', {message}
                resource: resource

        if alarm.action in ['EMAIL', 'BOTH']
            if alarm.event?
                event = alarm.event
                agenda = event.tags[0] or ''
                titleKey = 'reminder title email expanded'
                titleOptions =
                    description: event.description
                    date: event.start.format 'llll'
                    calendarName: agenda

                contentKey = 'reminder message expanded'
                contentOptions =
                    description: event.description
                    start: event.start.format 'LLLL'
                    end: event.end.format 'LLLL'
                    place: event.place
                    details: event.details
                    timezone: timezone
                data =
                    from: 'Cozy Calendar <no-reply@cozycloud.cc>'
                    subject: @polyglot.t titleKey, titleOptions
                    content: @polyglot.t contentKey, contentOptions

            else
                data =
                    from: "Cozy Calendar <no-reply@cozycloud.cc>"
                    subject: @polyglot.t 'reminder title email'
                    content: @polyglot.t 'reminder message', {message}

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
