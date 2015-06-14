cozydb = require 'cozydb'

module.exports = Device = cozydb.getModel 'Device',
    login: String
    configuration: Object

Device.all = (params, callback) ->
    Device.request "all", params, callback
