cozydb = require 'cozydb'

module.exports = Sharing = cozydb.getModel 'Sharing',
    sharerUrl: String
    sharerName: String
    desc: String
    rules: [Object]
    targets: [Object]

Sharing.all = (params, callback) ->
    Sharing.request "all", params, callback