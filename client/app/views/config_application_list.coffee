ViewCollection = require 'lib/view_collection'
ApplicationRow = require 'views/config_application'
PopoverDescriptionView = require 'views/popover_description'

module.exports = class ApplicationsListView extends ViewCollection
    id: 'config-application-list'
    tagName: 'div'
    template: require 'templates/config_application_list'
    itemView: require 'views/config_application'
    itemViewOptions: ->
    constructor: (apps) ->
        @apps = apps
        super collection: apps

    afterRender: =>
        @appList = @$ "#app-list"

    openUpdatePopover: (slug) ->
        appToUpdateView = null
        for cid, view of @views
            if view.model.get('slug') is slug
                appToUpdateView = view
                break

        appToUpdateView.openPopover() if appToUpdateView?


