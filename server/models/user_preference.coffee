americano = require('americano-cozy')

module.exports = UserPreference = americano.getModel 'UserPreference',
    backgroundColor: String
    buttonColor: String
    buttonHoverColor: String

# Request methods

UserPreference.all = (callback) ->
    UserPreference.request "all", callback
