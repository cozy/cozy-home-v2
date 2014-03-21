americano = require('americano-cozy')

module.exports = User = americano.getModel 'User',
    email: String
    public_name: String
    timezone: {type: String, default: "Europe/Paris"}
    password: String
    owner: {type: Boolean, default: false}
    activated: {type: Boolean, default: false}


EMAILREGEX = ///^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|
(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|
(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$///

# Helpers

emailValidator = (err) ->
    err() if not EMAILREGEX.test(@email)

# Validators

User.validate 'email', emailValidator,
    message: 'Given email is not a proper email.'

# Request methods

User.all = (callback) ->
    User.request "all", callback

User.destroyAll = (callback) ->
    User.requestDestroy "all", callback
