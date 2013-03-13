client = require "../helpers/client"

# Describes an application installed in mycloud.
module.exports = class Application extends Backbone.Model

    url: '/api/applications/'
    idAttribute: 'slug'

    isRunning: () -> @get('state') is 'installed'
    isBroken: () -> @get('state') is 'broken'

    # Send to server installation request.
    # Will create a new app in the database.
    install: (callbacks) ->
        client.post '/api/applications/install', @attributes,
            success: (data) =>
                @set(data.app)
                callbacks.success data
            error: callbacks.error

    # Send to server uninstallation request.
    # Will delete the app in the database.
    uninstall: (callbacks) =>
        client.del "/api/applications/#{@id}/uninstall", 
            success: (data) =>
                @trigger 'destroy', @, @collection
                callbacks.success data
            error: callbacks.error

    # Send to server an update request.
    updateApp: (callbacks) ->
        client.put "/api/applications/#{@id}/update", {}, 
            success: (data) =>
                @set(data.app)
                callbacks.success data
            error: callbacks.error

    # Send to server a start request
    start: (callbacks) ->
        return null if @isRunning() 
        if not callbacks?
            callbacks = 
                success: ->
                error: ->
        client.post "/api/applications/#{@id}/start", {}, 
            success: (data) =>
                @set(data.app)
                callbacks.success data
            error: callbacks.error

    # Send to server a stop request.
    stop: (callbacks) ->
        return null if not @isRunning() 
        if not callbacks?
            callbacks = 
                success: ->
                error: ->
        client.post "/api/applications/#{@id}/stop", {}, 
            success: (data) =>
                @set(data.app)
                callbacks.success data
            error: callbacks.error


