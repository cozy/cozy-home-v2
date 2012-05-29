BaseModel = require("models/models").BaseModel
client = require('../helpers/client')

# Describes an application installed in mycloud.
class exports.User extends BaseModel

    constructor: (@email, @password) ->
        super()
   
    # Send a register request with user password and email as data.
    register: (callbacks) ->
        client.post "register", { email: @email, password: @password }, \
            callbacks

    login: (callbacks) ->
        client.post "login/", { password: @password }, callbacks

    logout: (callbacks) ->
        client.get "logout/", callbacks
