americano = require 'americano-cozy'

module.exports = Alarm = americano.getModel 'Alarm',
    action: type: String, default: 'DISPLAY'
    trigg: String
    rrule: String
    timezone: String
    description: String
    related: type: String, default: null

Alarm.all = (params, callback) ->
    Alarm.request "all", params, callback
