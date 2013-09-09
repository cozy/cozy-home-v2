ViewCollection = require 'lib/view_collection'
ApplicationRow = require 'views/config_application'


module.exports = class ApplicationsListView extends ViewCollection
    id: 'config-application-list'
    tagName: 'div'
    template: require 'templates/config_application_list'
    itemView: require 'views/config_application'

    constructor: (apps) ->
        @apps = apps
        @isManaging = false
        super collection: apps
        if @apps.length is 0
            @displayNoAppMessage()

    afterRender: =>
        @appList = @$ "#app-list"

    displayNoAppMessage: ->
        @$el.append 'There is no application installed.'

