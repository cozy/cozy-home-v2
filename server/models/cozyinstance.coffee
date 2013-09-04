americano = require('americano-cozy')

module.exports = CozyInstance = americano.getModel 'CozyInstance',
    domain: String
    locale: String
    helpUrl: String

CozyInstance.all = (callback) ->
    CozyInstance.request 'all', callback

CozyInstance.destroyAll = (callback) ->
    CozyInstance.requestDestroy 'all', callback
