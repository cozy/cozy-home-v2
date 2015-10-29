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
IntentManager          = require 'lib/intent_manager'

# View describing main screen for user once he is logged
module.exports = class HomeView extends BaseView
    el: 'body'

    template: require 'templates/layout'

    subscriptions:
        'backgroundChanged': 'changeBackground'
        'app-state:changed': 'onAppStateChanged'


    constructor: ->
        @apps          = new AppCollection window.applications
        @stackApps     = new StackAppCollection window.stack_applications
        @devices       = new DeviceCollection window.devices
        @market        = new AppCollection window.market_applications
        @notifications = new NotificationCollection()
        @intentManager = new IntentManager()
        SocketListener.watch @apps
        SocketListener.watch @notifications
        SocketListener.watch @devices
        super


    # Initialize all views, register main widgets and ensure that currently
    # displayed iframe is rerendered to be rendered properly after everything
    # is loaded.
    afterRender: =>
        @navbar = new NavbarView @apps, @notifications
        @applicationListView = new ApplicationsListView @apps, @market
        @configApplications = new ConfigApplicationsView(
            @apps, @devices, @stackApps, @market)
        @accountView = new AccountView()
        @helpView = new HelpView()
        @marketView = new MarketView @apps, @market

        @frames = @$ '#app-frames'
        @content = @$ '#content'
        @changeBackground window.app.instance.background
        @backButton = @$ '.back-button'
        @backButton.hide()

        $(window).resize @forceIframeRendering
        @forceIframeRendering()


    ### Functions ###


    # Change the background of the content element. It builds the background
    # image url with given value. If no param is given of default background is
    # given, background image is removed.
    changeBackground: (background='background_07') ->
        if background is undefined or background is null
            @content.css 'background_07.jpg', 'none'
        if background is 'background-none'
            @content.css 'background-image', 'none'
        else
            # It's a pre-defined background
            if background.indexOf('background') > -1
                name = background.replace '-', '_'
                val = "url('/img/backgrounds/#{name}.jpg')"
            else
                val = "url('/api/backgrounds/#{background}/picture.jpg')"

            @content.css 'background-image', val


    # Send a logout request to server then reload current window to redirect
    # user to automatically redirect user to login page (he's not logged
    # anymore, so cozy proxy will do the redirection).
    logout: (event) ->
        user = new User()
        user.logout
            success: (data) ->
                window.location = window.location.origin + '/login/'
            error: ->
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
            @forceIframeRendering()
            @content.scrollTop 0

        if @currentView?

            if view is @currentView
                @frames.hide()
                @content.show()
                @forceIframeRendering()
                return

            @currentView.$el.hide()
            @currentView.$el.detach()
            displayView()
        else
            displayView()


    # Display application manager page, hides app frames, active home button.
    displayApplicationsList: =>
        @displayView @applicationListView
        window.document.title = t "cozy home title"


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


    displayConfigApplications: =>
        @displayView @configApplications, t "cozy applications title"


    displayUpdateApplication: (slug) =>
        @displayView @configApplications, t "cozy applications title"
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
    #
    # Display a spinner if it's the first time that the application is loaded.
    displayApplication: (slug, hash) ->
        if @apps.length is 0
            @apps.once ?= @apps.on
            @apps.once ?= @apps.on if typeof(@apps.once) isnt 'function'
            @apps.once 'reset', =>
                @displayApplication slug, hash
            return null

        @$("#app-btn-#{slug} .spinner").show()
        @$("#app-btn-#{slug} .icon").hide()

        frame = @$("##{slug}-frame")
        onLoad = =>

            # We display back the iframes
            @frames.css 'top', '0'
            @frames.css 'left', '0'
            @frames.css 'position', 'inherit'
            @frames.show()

            @content.hide()
            @backButton.show()

            @$('#app-frames').find('iframe').hide()
            frame.show()

            @selectedApp = slug
            app = @apps.get slug
            name = app.get('displayName') or app.get('name') or ''

            window.document.title = "Cozy - #{name}"
            $("#current-application").html name

            @$("#app-btn-#{slug} .spinner").hide()
            @$("#app-btn-#{slug} .icon").show()


        if frame.length is 0
            frame = @createApplicationIframe slug, hash

            # We show frames right now because to load properly the app
            # requires a proper height.
            @frames.show()

            # Then we hide the frames by moving them far.
            @frames.css 'top', '-9999px'
            @frames.css 'left', '-9999px'
            @frames.css 'position', 'absolute'

            frame.on 'load', _.once onLoad

        # if the app was already open, we want to change its hash
        # only if there is a hash in the home given url.
        else if hash
            contentWindow = frame.prop('contentWindow')
            # Same origin policy may prevent to access location hash
            try
                currentHash = contentWindow.location.hash.substring 1
            catch err
                console.err err
            onLoad()

        else if frame.is(':visible')
            # Same origin policy may prevent to access location hash
            try
                frame.prop('contentWindow').location.hash = ''
            catch err
                console.err err
            onLoad()

        else
            onLoad()


    createApplicationIframe: (slug, hash="") ->

        # prepends '#' only if there is an actual hash
        hash = "##{hash}" if hash?.length > 0

        iframeHTML = appIframeTemplate(id: slug, hash:hash)
        iframe$    = $(iframeHTML).appendTo @frames
        iframe$.prop('contentWindow').addEventListener 'hashchange', =>
            location = iframe$.prop('contentWindow').location
            newhash  = location.hash.replace '#', ''
            @onAppHashChanged slug, newhash

        @forceIframeRendering()
        # declare the iframe to the intent manager.
        # TODO : when each iFrame will
        # have its own domain, then precise it
        # (ex : https://app1.joe.cozycloud.cc:8080)
        @intentManager.registerIframe iframe$[0], '*'

        return iframe$


    onAppHashChanged: (slug, newhash) =>
        if slug is @selectedApp
            currentHash = location.hash.substring "#apps/#{slug}/".length
            if currentHash isnt newhash
                app?.routers.main.navigate "apps/#{slug}/#{newhash}", false

            # Ugly trick required because app state changes sometime
            # breaks the iframe layout.
            @forceIframeRendering()


    # If an application is broken, removed or updating, its corresponding
    # iframe is removed.
    onAppStateChanged: (appState) ->
        if appState.status in ['updating', 'broken', 'uninstalled']
            frame = @getAppFrame appState.slug
            frame.remove()
            frame.off 'load'


    # Ugly trick for redrawing iframes. It's required because sometimes the
    # browser breaks the Iframe layout (I didn't find any reason for that).
    forceIframeRendering: =>
        @frames.find('iframe').height "99%"
        setTimeout =>
            @frames.find('iframe').height "100%"
        , 10


    # Returns app iframe corresponding for given app slug.
    getAppFrame: (slug) ->
        return @$("##{slug}-frame")

