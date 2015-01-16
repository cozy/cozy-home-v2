client = require "../helpers/client"

# Describes a stack application.
module.exports = class StackApplication extends Backbone.Model

    idAttribute: 'name'

    url: ->
        base = "/api/applications/stack"
        return "#{base}byid/#{@get('id')}" if @get('id')
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


    waitReboot: (step, total_step, callback) ->
        client.get "api/applications/stack",
            success: =>
                if step is total_step
                    callback()
                else
                    if step is 1
                        step += step
                    setTimeout () =>
                        @waitReboot step, total_step, callback
                    , 500
            error: =>
                setTimeout () =>
                    if step is 0 or step is 2
                        step = step + 1
                    @waitReboot step, total_step, callback
                , 500

    updateStack: (callbacks) ->
        client.put "/api/applications/update/stack", {},
            sucess: =>
                @waitReboot 0, 2, callbacks
            error: =>
                @waitReboot 0, 2, callbacks

    rebootStack: (callbacks) ->
        client.put "/api/applications/reboot/stack", {},
            sucess: =>
                @waitReboot 0, 1, callbacks
            error: =>
                @waitReboot 0, 1, callbacks