americano = require('americano-cozy')
time = require 'time'

module.exports = Alarm = americano.getModel 'Alarm',
    action: {type: String, default: 'DISPLAY'}
    trigg: String
    rrule: String
    timezone: String
    description: String
    related: {type: String, default: null}

Alarm.all = (params, callback) ->
    Alarm.request "all", params, callback

Alarm::timezoned = (timezone) ->
    timezonedDate = new time.Date @trigg, 'UTC'
    timezonedDate.setTimezone timezone
    @trigg = timezonedDate.toString().slice 0, 24
    return @