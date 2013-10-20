ViewCollection = require 'lib/view_collection'
ApplicationRow = require 'views/config_application'


module.exports = class ApplicationsListView extends ViewCollection
    id: 'config-application-list'
    tagName: 'div'
    template: require 'templates/config_application_list'
    itemView: require 'views/config_application'

    constructor: (apps) ->
        @apps = apps
        super collection: apps

        #@displayNoAppMessage() if @apps.length is 0

    afterRender: =>
        @appList = @$ "#app-list"

    #displayNoAppMessage: ->
        #@$el.append t 'no application installed'

