client = require "../helpers/client"
request = require "../lib/request"

# Describes an application installed in mycloud.
module.exports = class Application extends Backbone.Model

    idAttribute: 'slug'

    url: ->
        base = "/api/applications/"
        return "#{base}byid/#{@get('id')}" if @get('id')
        return base

    isIconSvg: ->
        iconType = @get 'iconType' or @get 'icon' or @get 'iconPath'
        if iconType
            return iconType is 'svg'
        else
            return true

    isRunning: -> @get('state') is 'installed'
    isBroken: -> @get('state') is 'broken'

    # use same events as backbone to enable socket-listener
    prepareCallbacks: (callbacks, presuccess, preerror) ->
        {success, error} = callbacks or {}
        presuccess ?= (data) =>
            if data.app?.description?
                # for applications not in the market
                data.app.remoteDescription = data.app.description
                delete data.app.description
            @set data.app if data.app?
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
        if @get('state') isnt 'broken'
            @prepareCallbacks callbacks
            client.put "/api/applications/#{@id}/update", {}, callbacks
        else
            client.del "/api/applications/#{@id}/uninstall",
                success: =>
                    @install callbacks
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

    # In which of the home section does this application go
    # returns one of 'other', 'official', 'leave'
    getSection: ->
        section = 'misc'
        name = @get 'slug'
        favorite = @get 'favorite'

        if favorite
            section = 'favorite'
        else if name in [
            'calendar', 'contacts', 'emails', 'files', 'photos'
        ]
            section = 'main'
        else if name in [
            'blog', 'feeds', 'bookmarks', 'quickmarks', 'zero-feeds'
        ]
            section = 'watch'
        else if name in [
            'kresus', 'konnectors', 'kyou', 'databrowser', 'import-from-google'
        ]
            section = 'data'
        else if name in ['todos', 'notes', 'tasky']
            section = 'productivity'
        else if name in ['sync']
            section = 'platform'

        return section


    # Request the server to run the update all apps procedure.
    updateAll: (callback) ->
        request.put "/api/applications/update/all", {}, (err, data) ->
            callback err, data?.permissionChanges


    # Return true is the app is considered as an official Cozy application.
    isOfficial: ->
        @get('comment') is 'official application'

