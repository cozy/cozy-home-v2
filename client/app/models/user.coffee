BaseModel = require("models/models").BaseModel
client = require('../helpers/client')

# Describes an application installed in mycloud.
class exports.User extends BaseModel

    constructor: (@email, @password) ->
        super()
   
    logout: (callbacks) ->
        client.get "logout/", callbacks
