client = require 'helpers/client'

# Describes an application installed in mycloud.
module.exports = class Token

    constructor: (id) ->
        @id = id
   
    getToken: (callbacks) ->
        client.get "api/getToken/#{@id}", callbacks
