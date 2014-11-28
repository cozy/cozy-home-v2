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

Event::isAllDay = -> return @start.length is 10

# Handle only unique units strings.
iCalDurationToUnitValue = (s) ->
    m = s.match /(\d+)(W|D|H|M|S)/
    o = {}
    o[m[2].toLowerCase()] = parseInt m[1]

    return o

Event::getAlarms = (defaultTimezone) ->

    alarms = []
    ALLDAY_FORMAT = 'YYYY-MM-DD'

    timezone = @timezone or defaultTimezone
    for alarm in @alarms?.items

        startDates = []

        if @rrule? and @rrule.length > 0
            now = moment().tz timezone
            in24h = moment(now).add 1, 'days'
            rrule = RRule.parseString @rrule
            occurrences = new RRule(rrule).between now.toDate(), in24h.toDate()
            for occurrence in occurrences
                if @isAllDay()
                    date = moment.tz occurrence, ALLDAY_FORMAT, timezone
                else
                    date = moment.tz occurrence, timezone
                startDates.push date

        else if @isAllDay()
            startDates = [moment.tz @start, ALLDAY_FORMAT, timezone]

        else
            startDates = [moment.tz @start, 'UTC']

        for startDate in startDates

            # builds the trigger date based on event start and
            # relative unit values
            trigg = moment.tz startDate, timezone
            unitValues = iCalDurationToUnitValue alarm.trigg
            for key, value of unitValues
                trigg.subtract value, key

            # formats like a Cozy alarm
            cozyAlarm =
                _id: @_id
                action: alarm.action
                trigg: trigg.format()
                description: @description
                timezone: timezone

            alarms.push cozyAlarm

    return alarms

