BaseCollection = require("collections/collections").BaseCollection
Application = require("models/application").Application


# List of installed applications.
class exports.ApplicationCollection extends BaseCollection
        
    model: Application
    url: 'api/applications/'

    constructor: (@view) ->
        super()

        @bind 'reset', @onReset
        @bind 'add', @onAdd

    # Clear view app list and add to it each app of the collection.
    onReset: =>
        @view.clearApps()
        @forEach (app) =>
            @view.addAppRow app

    # Add added app to the view app list.
    onAdd: (app) =>
        @view.addAppRow app
