BaseView          = require 'lib/base_view'
appButtonTemplate = require "templates/navbar_app_btn"
NotificationsView = require './notifications_view'
SearchBarView     = require './menu_search_bar'
AppsMenu          = require './menu_applications'

module.exports = class NavbarView extends BaseView

    el:'.navbar'
    template: require 'templates/navbar'

    constructor: (apps, notifications) ->
        @apps = apps
        @notifications = notifications
        super()

    afterRender: =>
        @notifications = new NotificationsView collection: @notifications
        @appMenu       = new AppsMenu @apps
        @searchBar     = new SearchBarView()
