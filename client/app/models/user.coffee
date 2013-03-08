{BaseModel} = require 'lib/BaseModel'
client = require 'helpers/client'

# Describes an application installed in mycloud.
module.exports = class User extends BaseModel

    constructor: (@email, @password) ->
        super()
   
    logout: (callbacks) ->
        client.get "logout/", callbacks
