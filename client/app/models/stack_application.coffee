request = require "../lib/request"


module.exports = class StackApplication extends Backbone.Model

    idAttribute: 'name'

    url: ->
        base = "/api/applications/stack"
        return "#{base}byid/#{@get('id')}" if @get('id')
        return base


    # Send a series of requests to the server to ensure that it is up.
    # The callback is fired only when the servers responds successfully to
    # *remainingSteps* requests.
    waitServerIsUp: (remainingSteps, callback) ->
        request.head "api/applications/stack", (err) =>
            if err
                console.log 'Server looks down...'
            else
                console.log 'Server looks up...'
                remainingSteps--

            if remainingSteps is 0
                console.log 'Server is up!'
                callback()
            else
                setTimeout =>
                    @waitServerIsUp remainingSteps, callback
                , 1000


    # Ask to the server to update all the Cozy stack. This operation
    # will kill the server. So to guess when the update is done, it keeps
    # sending request to the server. It considers the server as up when
    # three requests got proper response. It's the sign that the update is
    # done.
    updateStack: (callback) ->
        request.put "/api/applications/update/stack", {}, (err) =>
            return callback err if err
            console.log 'Waiting for reboot...'
            @waitServerIsUp 3, callback


    # Ask to the server to reboot the Cozy stack. This operation
    # will kill the server. So to guess when the reboot is done, it keeps
    # sending request to the server. It considers the server as up when
    # three requests got proper response. It's the sign that the reboot is
    # done.
    rebootStack: (callback) ->
        request.put "/api/applications/reboot/stack", {}, (err) =>
            return callback err if err
            console.log 'Waiting for reboot...'
            @waitServerIsUp 3, callback

