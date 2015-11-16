ViewCollection = require 'lib/view_collection'
ApplicationRow = require 'views/config_application'
PopoverDescriptionView = require 'views/popover_description'
ApplicationsList = require '../collections/application'

module.exports = class ApplicationsListView extends ViewCollection
    id: 'config-application-list'
    tagName: 'div'
    template: require 'templates/config_application_list'
    itemView: require 'views/config_application'
    itemViewOptions: (model) ->
        app = @market.get model.get('slug')
        # By default, apps are 'community contribution'.
        # Used for "install from Git"
        comment = if app? then app.get('comment') else 'community contribution'
        model.set 'comment', comment

    constructor: (apps, market) ->
        @apps = apps
        @market = market
        super collection: @apps


    afterRender: =>
        @appList = @$ "#app-list"
        @apps.sort()


    appendView: (view) ->
        if @$el.is ':empty'
            @$el.append view.el
        else
            views = _.values @views
            sortedViews = _.sortBy views, (view) ->
                if view?.model?.get('displayName')?
                    return view.model.get('displayName').toLowerCase()
                else
                    return 'unknown'
            index = _.indexOf(sortedViews, view) - 1
            if index >= 0
                previous = @$el.find ".config-application:eq(#{index})"
                view.$el.insertAfter previous
            else
                next = @$el.find ".config-application:eq(#{index + 1})"
                view.$el.insertBefore next



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

