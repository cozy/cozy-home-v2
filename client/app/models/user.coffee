BaseModel = require("models/models").BaseModel

# Describes an application installed in mycloud.
class exports.User extends BaseModel

    constructor: (@mail, @password) ->
        super()
   
    # Send a register request with user password and email as data.
    register: (callbacks) ->
        client.post "register", { email: @email, password: @password },
            success: callbacks.success
                app.views.login.logUser password
            error: callbacks.success
