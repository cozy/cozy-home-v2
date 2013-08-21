client = require "../helpers/client"

# Describes an application installed in mycloud.
module.exports = class Application extends Backbone.Model

    idAttribute: 'slug'

    url: ->
        base = "/api/applications/"
        # return base + @id         if @id #slug
        return base + "byid/" + @get('id') if @get('id')
        return base


    isRunning: () -> @get('state') is 'installed'
    isBroken: () ->  @get('state') is 'broken'

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


    # Send to server installation request.
    # Will create a new app in the database.
    install: (callbacks) ->
        @prepareCallbacks callbacks
        params = @attributes
        delete params.id
        client.post '/api/applications/install', params, callbacks

    # Send to server uninstallation request.
    # Will delete the app in the database.
    uninstall: (callbacks) =>
        @prepareCallbacks callbacks, => @trigger 'destroy', @, @collection, {}
        client.del "/api/applications/#{@id}/uninstall", callbacks

    # Send to server an update request.
    updateApp: (callbacks) ->
        @prepareCallbacks callbacks
        if @get('state') isnt 'broken'
            client.put "/api/applications/#{@id}/update", {}, callbacks
        else
            client.del "/api/applications/#{@id}/uninstall",
                success: => @install callbacks
                error: callbacks.error

    # Send to server a start request
    start: (callbacks) ->
        return null if @isRunning()
        @prepareCallbacks callbacks
        client.post "/api/applications/#{@id}/start", {}, callbacks

    # Send to server a stop request.
    stop: (callbacks) ->
        return null unless @isRunning()
        @prepareCallbacks callbacks
        client.post "/api/applications/#{@id}/stop", {}, callbacks

    # Get application permission
    getPermissions: (callbacks) ->
        @prepareCallbacks callbacks
        client.post "/api/applications/getPermissions", @toJSON(), callbacks

    # Get application description
    getDescription: (callbacks) ->
        @prepareCallbacks callbacks
        client.post "/api/applications/getDescription", @toJSON(), callbacks

    # Get application's metadata
    getMetaData: (callbacks) ->
        @prepareCallbacks callbacks
        client.post "/api/applications/getMetaData", @toJSON(), callbacks



