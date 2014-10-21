americano = require 'americano-cozy'

{Manifest} = require '../lib/manifest'


module.exports = StackApplication = americano.getModel 'StackApplication',
    name: String
    version: String
    needsUpdate: {type: Boolean, default: false}

StackApplication.all = (params, callback) ->
    StackApplication.request "all", params, callback