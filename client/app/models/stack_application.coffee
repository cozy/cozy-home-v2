client = require "../helpers/client"

# Describes a stack application.
module.exports = class StackApplication extends Backbone.Model

    idAttribute: 'name'

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


    waitReboot: (callback) ->
        console.log "waitReboot"
        client.get "api/applications/stack",
            success: =>
                console.log "ok"
                callback()
            error: =>
                console.log 'WAIT'
                setTimeout () ->
                    waitReboot callback
                , 500

    updateStack: (callbacks) ->
        client.put "/api/applications/update/stack", {}, (err, res, body) ->
            @waitReboot callbacks

    rebootStack: (callbacks) ->
        client.put "/api/applications/reboot/stack", {},  (err, res, body) ->
            @waitReboot callbacks