BaseView = require 'lib/base_view'
appIframeTemplate = require 'templates/application_iframe'
AppCollection = require 'collections/application'
StackAppCollection = require 'collections/stackApplication'
NotificationCollection = require 'collections/notifications'
DeviceCollection = require 'collections/device'
NavbarView = require 'views/navbar'
AccountView = require 'views/account'
HelpView = require 'views/help'
ConfigApplicationsView = require 'views/config_applications'
MarketView = require 'views/market'
ApplicationsListView = require 'views/home'
SocketListener = require 'lib/socket_listener'

User = require 'models/user'


# View describing main screen for user once he is logged
module.exports = class HomeView extends BaseView
    el: 'body'

    template: require 'templates/layout'

    wizards: ['install', 'quicktour']

    constructor: ->
        @apps = new AppCollection()
        @stackApps = new StackAppCollection()
        @devices = new DeviceCollection()
        @notifications = new NotificationCollection()
        SocketListener.watch @apps
        SocketListener.watch @notifications
        SocketListener.watch @devices

        super

    afterRender: =>
        @navbar = new NavbarView @apps, @notifications
        @applicationListView = new ApplicationsListView @apps
        @configApplications = new ConfigApplicationsView @apps, @devices, @stackApps
        @accountView = new AccountView()
        @helpView = new HelpView()
        @marketView = new MarketView @apps

        $("#content").niceScroll()
        @frames = @$ '#app-frames'
        @content = @$ '#content'

        $(window).resize @resetLayoutSizes
        @apps.fetch reset: true
        @devices.fetch reset: true
        @stackApps.fetch reset: true
        @resetLayoutSizes()

    ### Functions ###

    # Send a logout request to server then reload current window to redirect
    # user to automatically redirect user to login page (he's not logged
    # anymore, so cozy proxy will do the redirection).
    logout: (event) =>
        user = new User()
        user.logout
            success: (data) =>
                window.location = window.location.origin + '/login/'
            error: =>
                alert 'Server error occured, logout failed.'

    displayView: (view) =>
        $("#current-application").html 'home'
        displayView = =>
            @frames.hide()
            view.$el.hide()
            @content.show()
            $('#home-content').append view.$el
            view.$el.fadeIn()
            @currentView = view
            @resetLayoutSizes()

        if @currentView?

            if view is @currentView
                @frames.hide()
                @content.show()
                @resetLayoutSizes()
                return

            @currentView.$el.fadeOut =>
                @currentView.$el.detach()
                displayView()
        else
            displayView()

    # Display application manager page, hides app frames, active home button.
    displayApplicationsList: (wizard=null) =>
        @displayView @applicationListView
        @applicationListView.setMode 'view'
        window.document.title = t "cozy home title"

        for wiz in @wizards
            wview = "#{wiz}WizardView"
            @[wview].dispose() if @[wview]? and wizard isnt wiz

        if wizard? and wizard in @wizards
            wview = "#{wizard}WizardView"
            WView = require "views/#{wizard}_wizard"

            options = market: @marketView if wizard is 'install'
            @[wview] = new WView options
            @$el.append @[wview].render().$el
            @[wview].show()

    displayApplicationsListEdit: =>
        @displayView @applicationListView
        @applicationListView.setMode 'edit'
        window.document.title = t "cozy home title"

    # Display application manager page, hides app frames, active home button.
    displayMarket: =>
        @displayView @marketView
        window.document.title = t "cozy app store title"

    # Display account manager page, hides app frames, active account button.
    displayAccount: =>
        @displayView @accountView
        window.document.title = t 'cozy account title'

    displayHelp: =>
        @displayView @helpView
        window.document.title = t "cozy help title"

    displayInstallWizard: ->
        @displayApplicationsList 'install'

    displayQuickTourWizard: ->
        @displayApplicationsList 'quicktour'

    displayConfigApplications: =>
        @displayView @configApplications
        window.document.title = t "cozy applications title"


    displayUpdateApplication: (slug) =>
        @displayView @configApplications
        window.document.title = t "cozy applications title"
        window.app.routers.main.navigate 'config-applications', false

        # When the route is called on browser loading, it must wait for
        # apps list to be retrieved
        method = @configApplications.openUpdatePopover
        action = method.bind @configApplications, slug
        timeout = null

        if @apps.length is 0
            @listenToOnce @apps, 'reset', ->
                # stop the timeout so the action is not executed twice
                clearTimeout timeout
                action()

            # if there is no app installed, this timeout will trigger
            # the action
            timeout = setTimeout action, 1500
        else
            # wait for 500ms before triggering the popover opening, because
            # the configApplications view is not completely rendered yet (??)
            setTimeout action, 500


    displayUpdateStack: ->
        @displayView @configApplications
        window.document.title = t "cozy applications title"
        window.app.routers.main.navigate 'config-applications', false

        # wait for 500ms before triggering the popover opening, because
        # the configApplications view is not completely rendered yet (??)
        setTimeout =>
            @configApplications.onUpdateStackClicked()
        , 500


    # Get frame corresponding to slug if it exists, create before either.
    # Then this frame is displayed while we hide content div and other app
    # iframes. Then currently selected frame is registered
    displayApplication: (slug, hash) ->

        if @apps.length is 0
            @apps.once 'reset', =>
                @displayApplication slug, hash
            return null

        @frames.show()
        @content.hide()

        frame = @$("##{slug}-frame")
        if frame.length is 0
            frame = @createApplicationIframe(slug, hash)

        # if the app was already open, we want to change its hash
        # only if there is a hash in the home given url.
        else if hash
            frame.prop('contentWindow').location.hash = hash

        @$('#app-frames').find('iframe').hide()
        frame.show()

        @selectedApp = slug

        name = @apps.get(slug).get('name')
        name = '' if not name?
        window.document.title = "Cozy - #{name}"
        $("#current-application").html name
        @resetLayoutSizes()

    createApplicationIframe: (slug, hash="") ->

        # prepends '#' only if there is an actual hash
        hash = "##{hash}" if hash?.length > 0

        @frames.append appIframeTemplate(id: slug, hash:hash)
        frame = @$("##{slug}-frame")
        $(frame.prop('contentWindow')).on 'hashchange', =>
            location = frame.prop('contentWindow').location
            newhash = location.hash.replace '#', ''
            @onAppHashChanged slug, newhash
        @resetLayoutSizes()
        return frame

    onAppHashChanged: (slug, newhash) =>
        if slug is @selectedApp
            app?.routers.main.navigate "/apps/#{slug}/#{newhash}", false
        @resetLayoutSizes()

    ### Configuration ###

    # Small trick to size properly iframe.
    resetLayoutSizes: =>
        @frames.height $(window).height() - 50

        if $(window).width() > 640
            @content.height $(window).height() - 48
        else
            @content.height $(window).height()
