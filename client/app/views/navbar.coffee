BaseView = require 'lib/base_view'
appButtonTemplate = require "templates/navbar_app_btn"
NotificationsView = require './notifications_view'
HelpView          = require './help'
SearchBarView     = require './search_bar'
SearchBarBen     = require './search_bar_ben'
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
        qwantMode = window.urlArguments && window.urlArguments.modes && window.urlArguments.modes.indexOf 'qwant_search' isnt -1
        if (window.DEV_ENV or qwantMode or window.ENABLE_QWANT_SEARCH) and (window.qwantInstalled) and !window.BEN_DEMO
            @searchBar = new SearchBarView()
        else if (window.DEV_ENV or qwantMode or window.ENABLE_QWANT_SEARCH) and (window.qwantInstalled) and window.BEN_DEMO
            @searchBar = new SearchBarMix()
        else if window.BEN_DEMO
            @searchBar = new SearchBarBen()

    toggleHelp: (event) ->
        event.preventDefault()
        @helpView.toggle()
