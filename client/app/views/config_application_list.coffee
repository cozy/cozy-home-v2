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
        cids = Object.keys @views
        i = 0
        while cids[i]? and not appToUpdateView?
            view = @views[cids[i]]
            if view.model.get('slug') is slug
                appToUpdateView = view
            i++

        if appToUpdateView?
            appToUpdateView.openPopover()
        else
            alert t('error update uninstalled app')


