client = require 'helpers/client'

# Describes an application installed in mycloud.
module.exports = class Token

    constructor: (name) ->
        @name = name

    getToken: (callbacks) ->
        client.get "api/getToken/#{@name}", callbacks

