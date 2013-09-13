ViewCollection = require 'lib/view_collection'
client = require 'helpers/client'
ApplicationRow = require 'views/home_application'


String::startsWith = (prefix) ->
     @indexOf(prefix, 0) is 0

String::endsWith = (suffix) ->
     @indexOf(suffix, @length - suffix.length) isnt -1

# View describing main screen for user once he is logged
module.exports = class ApplicationsListView extends ViewCollection
    id: 'applications-view'
    template: require 'templates/home'
    itemView: require 'views/home_application'

    events:
        'click #add-app-button': 'onAddClicked'
        'click #manage-app-button': 'onManageAppsClicked'

    ### Constructor ###

    constructor: (apps) ->
        @apps = apps
        @isManaging = false

        super collection: apps

    afterRender: =>
        @appList = @$ "#app-list"
        @manageAppsButton = @$ "#manage-app-button"
        @addApplicationButton = @$ "#add-app-button"
        @machineInfos = @$(".machine-infos").hide()
        @$("#no-app-message").hide()
        $(".menu-btn a").click (event) =>
            $(".menu-btn").removeClass 'active'
            target = $(event.target)
            target = target.parent() unless target.hasClass 'menu-btn'
            target = target.parent() unless target.hasClass 'menu-btn'
            target.addClass 'active'

    displayNoAppMessage: ->
        if @apps.size() is 0 #and app.mainView.marketView.installedApps is 0
            @$("#no-app-message").show()
        else
            @$("#no-app-message").hide()

    appendView: (view) =>
        @appList.append view.el
        view.$el.hide().fadeIn()
        if @isManaging
            view.$el.find(".application-outer").css 'display', 'block'
