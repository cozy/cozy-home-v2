americano = require 'americano-cozy'

module.exports = Device = americano.getModel 'Device',
    login: String
    configuration: Object

Device.all = (params, callback) ->
    Device.request "all", params, callback