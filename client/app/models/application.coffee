BaseModel = require("models/models").BaseModel
client = require "lib/request"

# Describes an application installed in mycloud.
class exports.Application extends BaseModel

    url: '/api/applications/'

    constructor: (@app) ->
        super()
        @slug = app.slug
        @name = app.name
        @description = app.description
        @icon = app.icon
        @git = app.git
        @
        


    # Send to server installation request.
    # Will create a new app in the database.
    install: (callbacks) ->

        data =
            name: @name
            description: @description
            git: @git

        client.post '/api/applications/install', data, callbacks

    # Send to server uninstallation request.
    # Will delete the app in the database.
    uninstall: (callbacks) ->
        client.del "/api/applications/#{@slug}/uninstall", callbacks
