cozydb = require 'cozydb'

module.exports = User = cozydb.getModel 'User',
    email: String
    public_name: String
    timezone: {type: String, default: "Europe/Paris"}
    password: String
    owner: {type: Boolean, default: false}
    activated: {type: Boolean, default: false}
    authType: String
    encryptedOtpKey: String
    hotpCounter: Number
    encryptedRecoveryCodes: String
    mesinfosUseTracker: {type: Boolean, default: false}


# Request methods

User.all = (callback) ->
    User.request "all", callback

User.first = (callback) ->
    User.all (err, users) -> callback err, users?[0]

User.destroyAll = (callback) ->
    User.requestDestroy "all", callback
