BaseView               = require 'lib/base_view'
appIframeTemplate      = require 'templates/application_iframe'
AppCollection          = require 'collections/application'
StackAppCollection     = require 'collections/stackApplication'
NotificationCollection = require 'collections/notifications'
DeviceCollection       = require 'collections/device'
NavbarView             = require 'views/navbar'
AccountView            = require 'views/account'
HelpView               = require 'views/help'
ConfigApplicationsView = require 'views/config_applications'
MarketView             = require 'views/market'
ApplicationsListView   = require 'views/home'
SocketListener         = require 'lib/socket_listener'
User                   = require 'models/user'
IntentManager          = require 'lib/intentManager'
ThumbPreloader         = require 'lib/thumb_preloader'

# View describing main screen for user once he is logged
module.exports = class HomeView extends BaseView
    el: 'body'

    template: require 'templates/layout'

    subscriptions:
        'backgroundChanged': 'changeBackground'

    wizards: ['quicktour']

    constructor: ->
        @apps          = new AppCollection(window.applications)
        @stackApps     = new StackAppCollection(window.stack_applications)
        @devices       = new DeviceCollection(window.devices)
        @market        = new AppCollection(window.market_applications)
        @notifications = new NotificationCollection()
        @intentManager = new IntentManager()
        SocketListener.watch @apps
        SocketListener.watch @notifications
        SocketListener.watch @devices
        super
        thumbPreloader = new ThumbPreloader()
        thumbPreloader.start()

    afterRender: =>
        @navbar = new NavbarView @apps, @notifications
        @applicationListView = new ApplicationsListView @apps
        @configApplications = new ConfigApplicationsView(
            @apps, @devices, @stackApps, @market)
        @accountView = new AccountView()
        @helpView = new HelpView()
        @marketView = new MarketView @apps, @market

        @frames = @$ '#app-frames'
        @content = @$ '#content'
        @changeBackground window.app.instance.background
        #@content.niceScroll()
        @backButton = @$ '.back-button'
        @backButton.hide()

        $(window).resize @resetLayoutSizes
        @resetLayoutSizes()


    ### Functions ###


    # Change the background of the content element. It builds the background
    # image url with given value. If no param is given of default background is
    # given, background image is removed.
    changeBackground: (background) ->
        if background is undefined or background is null
            @content.css 'background_07.jpg', 'none'
        if background is 'background-none'
            @content.css 'background-image', 'none'
        else
            val = "url('/img/backgrounds/#{background.replace '-', '_'}.jpg')"
            @content.css 'background-image', val


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

    displayView: (view, title) =>

        if title?
            title = title.substring 6
        else
            title ?= t 'home'

        window.document.title = title
        $('#current-application').html title

        if view is @applicationListView
            @backButton.hide()
        else
            @backButton.show()


        displayView = =>
            @frames.hide()
            view.$el.hide()
            @content.show()
            $('#home-content').append view.$el
            view.$el.show()
            @currentView = view
            @resetLayoutSizes()

        if @currentView?

            if view is @currentView
                @frames.hide()
                @content.show()
                @resetLayoutSizes()
                return

            @currentView.$el.hide()
            @currentView.$el.detach()
            displayView()
        else
            displayView()

    # Display application manager page, hides app frames, active home button.
    displayApplicationsList: (wizard=null) =>
        @displayView @applicationListView
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
        @displayView @applicationListView, t "cozy home title"

    # Display application manager page, hides app frames, active home button.
    displayMarket: =>
        @displayView @marketView, t "cozy app store title"

    # Display account manager page, hides app frames, active account button.
    displayAccount: =>
        @displayView @accountView, t 'cozy account title'

    displayHelp: =>
        @displayView @helpView, t "cozy help title"

    displayInstallWizard: ->
        @displayApplicationsList 'install'

    displayQuickTourWizard: ->
        @displayApplicationsList 'quicktour'

    displayConfigApplications: =>
        @displayView @configApplications, t "cozy applications title"


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
        @backButton.show()

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

        iframeHTML = appIframeTemplate(id: slug, hash:hash)
        iframe     = @frames.append(iframeHTML)[0].lastChild
        iframe$    = $(iframe)
        iframe$.prop('contentWindow').addEventListener 'hashchange', =>
            location = iframe$.prop('contentWindow').location
            newhash  = location.hash.replace '#', ''
            @onAppHashChanged slug, newhash
        @resetLayoutSizes()
        # declare the iframe to the intent manager.
        # TODO : when each iFrame will
        # have its own domain, then precise it
        # (ex : https://app1.joe.cozycloud.cc:8080)
        @intentManager.registerIframe(iframe,'*')
        return iframe$

    onAppHashChanged: (slug, newhash) =>
        if slug is @selectedApp
            app?.routers.main.navigate "/apps/#{slug}/#{newhash}", false
        @resetLayoutSizes()

    ### Configuration ###

    # Small trick to size properly iframe.
    resetLayoutSizes: =>
        @frames.height $(window).height() - 36

        if $(window).width() > 640
            @content.height $(window).height() - 36
        else
            @content.height $(window).height()
