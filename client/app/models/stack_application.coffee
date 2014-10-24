client = require "../helpers/client"

# Describes an application installed in mycloud.
module.exports = class Application extends Backbone.Model

    idAttribute: 'slug'

    url: ->
        base = "/api/applications/stack"
        # return base + @id         if @id #slug
        return base + "byid/" + @get('id') if @get('id')
        return base

    # use same events as backbone to enable socket-listener
    prepareCallbacks: (callbacks, presuccess, preerror) ->
        {success, error} = callbacks or {}
        presuccess ?= (data) => @set data.app
        @trigger 'request', @, null, callbacks
        callbacks.success = (data) =>
            presuccess data if presuccess
            @trigger 'sync', @, null, callbacks
            success data    if success
        callbacks.error = (jqXHR) =>
            preerror jqXHR if preerror
            @trigger 'error', @, jqXHR, {}
            error jqXHR     if error