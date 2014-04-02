americano = require 'americano-cozy'

module.exports = RemoteCozy = americano.getModel 'RemoteCozy',
    url: String
    password: String

RemoteCozy.all = (params, callback) ->
    RemoteCozy.request "all", params, callback