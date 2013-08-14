BaseView = require 'lib/base_view'
appIframeTemplate = require 'templates/application_iframe'
AppCollection = require 'collections/application'
NavbarView = require 'views/navbar'
AccountView = require 'views/account'
MarketView = require 'views/market'
ApplicationsListView = require 'views/home'
socketListener = require('lib/socket_listener')

User = require 'models/user'


# View describing main screen for user once he is logged
module.exports = class HomeView extends BaseView
    el: 'body'

    template: require 'templates/layout'

    constructor: ->
        @apps = new AppCollection()
        socketListener.watch @apps
        super

    afterRender: =>
        @navbar = new NavbarView @apps
        @applicationListView = new ApplicationsListView @apps
        @accountView = new AccountView()
        @marketView = new MarketView @apps

        @frames = @$ '#app-frames'
        @content = @$ '#content'

        @favicon = @$ 'fav1'
        @favicon2 = @$ 'fav2'

        $(window).resize @resetLayoutSizes
        @apps.fetch
            reset: true
            success: => @applicationListView.displayNoAppMessage()
        @resetLayoutSizes()


    ### Functions ###

    # Send a logout request to server then reload current window to redirect
    # user to automatically redirect user to login page (he's not logged
    # anymore, so cozy proxy will do the redirection).
    logout: (event) =>
        user = new User()
        user.logout
            success: (data) =>
                window.location = window.location.origin
            error: =>
                alert 'Server error occured, logout failed.'
        event.preventDefault()

    displayView: (view) =>
        displayView = =>
            @content.show()
            @frames.hide()
            view.$el.hide()
            @content.append view.$el
            view.$el.fadeIn()
            @currentView = view
            @changeFavicon "favicon.ico"
            @resetLayoutSizes()

        if @currentView?
            @currentView.$el.fadeOut =>
                @currentView.$el.detach()
                displayView()
        else
            displayView()

    # Display application manager page, hides app frames, active home button.
    displayApplicationsList: =>
        @displayView @applicationListView
        @navbar.selectButton 'home-button'
        window.document.title = "Cozy - Home"

    # Display application manager page, hides app frames, active home button.
    displayMarket: =>
        @displayView @marketView
        @navbar.selectButton 'market-button'
        window.document.title = "Cozy - Market"

    # Display account manager page, hides app frames, active account button.
    displayAccount: =>
        @displayView @accountView
        @navbar.selectButton 'account-button'
        window.document.title = 'Cozy - Account'

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
        frame = @createApplicationIframe(slug, hash) if frame.length is 0

        @$('#app-frames').find('iframe').hide()
        frame.show()

        @navbar.selectButton slug
        @selectedApp = slug

        name = @apps.get(slug).get('name')
        name = '' if not name?
        window.document.title = "Cozy - #{name}"
        @changeFavicon "/apps/#{slug}/favicon.ico"
        @resetLayoutSizes()

    createApplicationIframe: (slug, hash="")->
        @frames.append appIframeTemplate(id: slug, hash:hash)
        frame = @$("##{slug}-frame")
        $(frame.prop('contentWindow')).on 'hashchange', =>
            location = frame.prop('contentWindow').location
            newhash = location.hash.replace '#', ''
            @onAppHashChanged(slug, newhash)
        @resetLayoutSizes()
        return frame

    onAppHashChanged: (slug, newhash) =>
        if slug is @selectedApp
            app?.routers.main.navigate "/apps/#{slug}/#{newhash}", false
        @resetLayoutSizes()

    changeFavicon: (url) ->
        @favicon?.remove()
        @favicon2?.remove()
        newfav = '<link rel="icon" type="image/x-icon" href="' + url + '" />"'
        @favicon = $ newfav
        @favicon2 = @favicon.clone().attr 'rel', 'shortcut icon'
        $('head').append @favicon, @favicon2

    ### Configuration ###

    # Small trick to size properly iframe.
    resetLayoutSizes: =>
        height = @$("#header").height() + 1
        @frames.height $(window).height() - height
        @content.height $(window).height() - height
