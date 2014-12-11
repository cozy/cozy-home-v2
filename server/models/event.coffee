americano = require 'americano-cozy'
moment = require 'moment-timezone'
{RRule} = require 'rrule'

module.exports = Event = americano.getModel 'Event',
    start       : type : String
    end         : type : String
    place       : type : String
    details     : type : String
    description : type : String
    rrule       : type : String
    tags        : type : (x) -> x # DAMN IT JUGGLING
    attendees   : type : [Object]
    related     : type : String, default: null
    timezone    : type : String
    alarms      : type : [Object]

# 'start' and 'end' use those format,
# According to allDay or rrules.
Event.dateFormat = 'YYYY-MM-DD'
Event.ambiguousDTFormat = 'YYYY-MM-DDTHH:mm:00.000'
Event.utcDTFormat = 'YYYY-MM-DDTHH:mm:00.000Z'

# Handle only unique units strings.
Event.alarmTriggRegex = /(\+?|-)PT?(\d+)(W|D|H|M|S)/

Event.all = (params, callback) ->
    Event.request "all", params, callback

Event::isRecurring = ->
    return @rrule? and @rrule.length > 0

Event::isAllDay = -> return @start.length is 10

# Handle only unique units strings.
iCalDurationToUnitValue = (s) ->
    m = s.match /(\d+)(W|D|H|M|S)/
    o = {}
    o[m[2].toLowerCase()] = parseInt m[1]

    return o

# Generate the start date of this recurring event, between the given bounds.
# Return an Array of moment datetime, in @timezone.
Event::_getRecurringStartDates = (startingBound, endingBound) ->
    starts = []
    # skip errors
    return starts if not @isRecurring()

    startMDate = moment.tz @start, @timezone

    startJsDate = new Date startMDate.toISOString()

    options = RRule.parseString @rrule
    options.dtstart = startJsDate

    rrule = new RRule options

    # RRule generate event with browser's timezone. But DST changing day
    # may be different between browser's timezone, and eventTimezone, which
    # may shift event from one hour. This function do that fix.
    fixDSTTroubles = (rruleStartJsDate) =>
        # rruleStartJsDate.toISOString is the UTC start date of the event.
        # unless, DST of browser's timezone is different from event's timezone.
        startRealMDate = moment.tz rruleStartJsDate.toISOString(), @timezone

        # Fix DST troubles :
        # The hour of the recurring event is fixed in its timezone.
        # So we use it as reference.
        diff = startMDate.hour() - startRealMDate.hour()
        # Correction is -1, 1 or 0.
        if diff is 23
            diff = -1
        else if diff is -23
            diff = 1

        startRealMDate.add diff, 'hours'
        return startRealMDate

    startDates = rrule.between startingBound.toDate(), endingBound.toDate()
                    .map fixDSTTroubles

    return startDates


Event::getAlarms = (userTimezone) ->

    alarms = []

    for alarm, key in @alarms?.items
        startDates = []

        if @isRecurring()
            now = moment().tz userTimezone
            in24h = moment(now).add 1, 'days'
            startDates = @_getRecurringStartDates(now, in24h)

        else
            startDates = [moment.tz @start, 'UTC']

        for startDate in startDates
            # Put in user timezone, as it will be used in frontend.
            startDate.tz userTimezone

            # builds the trigger date based on event start and
            # relative unit values
            trigg = startDate.clone()
            unitValues = iCalDurationToUnitValue alarm.trigg
            for key, value of unitValues
                trigg.subtract value, key

            # formats like a Cozy alarm
            cozyAlarm =
                _id: "#{@_id}_#{alarm.id}"
                action: alarm.action
                trigg: trigg.toISOString() # Cozy alarm uses UTC.
                description: @description

            # Generate the realevent this reminder is about.
            # Compute realevent end as event.start + event.duration.
            # Don't bother with timezone, as we only need a diff.
            duration = moment(@end).diff moment(@start), 'seconds'
            endDate = startDate.clone().add duration, 'seconds'

            event =
                start: startDate
                end: endDate
                place: @place
                details: @details
                description: @description
                tags: @tags

            # Push the real event as a back link on alarm.
            cozyAlarm.event = event

            alarms.push cozyAlarm

    return alarms

