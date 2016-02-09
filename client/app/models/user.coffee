{BaseModel} = require 'lib/base_model'
client = require 'lib/request'

# Describes an application installed in mycloud.
module.exports = class User extends BaseModel


    constructor: (@email, @password) ->
        super()


    logout: (callback) ->
        client.get "logout/", callback

