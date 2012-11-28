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
        if @length > 0
            @forEach (app) =>
                @view.addApplication app
        else
            @view.displayNoAppMessage()

    # Add added app to the view app list.
    onAdd: (app) =>
        @view.addApplication app
