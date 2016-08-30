BaseView = require 'lib/base_view'
appButtonTemplate = require "templates/navbar_app_btn"
NotificationsView = require './notifications_view'
HelpView          = require './help'
SearchBarMix     = require './search_bar_mix'
AppsMenu = require './menu_applications'

module.exports = class NavbarView extends BaseView

    el:'.navbar'
    template: require 'templates/navbar'

    events:
        'click #help-toggle': 'toggleHelp'

    constructor: (apps, notifications) ->
        @apps = apps
        @notifications = notifications
        super()

    afterRender: =>
        @notifications = new NotificationsView collection: @notifications
        @helpView = new HelpView()
        @appMenu = new AppsMenu @apps
        @searchBar = new SearchBarMix()

    toggleHelp: (event) ->
        event.preventDefault()
        @helpView.toggle()
