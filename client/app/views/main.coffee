BaseView = require 'lib/base_view'
appIframeTemplate = require 'templates/application_iframe'
AppCollection = require 'collections/application'
DeviceCollection = require 'collections/device'
NavbarView = require 'views/navbar'
AccountView = require 'views/account'
HelpView = require 'views/help'
ConfigApplicationsView = require 'views/config_applications'
MarketView = require 'views/market'
ApplicationsListView = require 'views/home'
socketListener = require('lib/socket_listener')
UserPreference = require '../models/user_preference'

User = require 'models/user'


# View describing main screen for user once he is logged
module.exports = class HomeView extends BaseView
    el: 'body'

    template: require 'templates/layout'

    constructor: ->
        @apps = new AppCollection()
        @listenTo @apps, 'reset', @testapps
        @devices = new DeviceCollection()
        @listenTo @devices, 'reset', @test
        socketListener.watch @apps
        socketListener.watch @devices

        @userPreference = new UserPreference()
        super

    afterRender: =>
        @navbar = new NavbarView @apps
        @applicationListView = new ApplicationsListView @apps, @userPreference
        @configApplications = new ConfigApplicationsView @apps, @devices
        @accountView = new AccountView()
        @helpView = new HelpView()
        @marketView = new MarketView @apps

        $("#content").niceScroll()
        @frames = @$ '#app-frames'
        @content = @$ '#content'

        @favicon = @$ 'fav1'
        @favicon2 = @$ 'fav2'

        $(window).resize @resetLayoutSizes
        @apps.fetch reset: true
        @devices.fetch reset: true
        @userPreference.fetch()
        @resetLayoutSizes()

    test: =>
        console.log('got devices', @devices.length)

    testapps: =>
        console.log('got apps', @apps.length)


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
            @changeFavicon "favicon.ico"
            @resetLayoutSizes()

        if @currentView?

            if view is @currentView
                @frames.hide()
                @content.show()
                @changeFavicon "favicon.ico"
                @resetLayoutSizes()
                return

            @currentView.$el.fadeOut =>
                @currentView.$el.detach()
                displayView()
        else
            displayView()

    # Display application manager page, hides app frames, active home button.
    displayApplicationsList: =>
        @displayView @applicationListView
        @applicationListView.setMode 'view'
        window.document.title = t "cozy home title"

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

    displayConfigApplications: =>
        @displayView @configApplications
        window.document.title = t "cozy applications title"

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

        @selectedApp = slug

        name = @apps.get(slug).get('name')
        name = '' if not name?
        window.document.title = "Cozy - #{name}"
        $("#current-application").html name
        @changeFavicon "/apps/#{slug}/favicon.ico"
        @resetLayoutSizes()
        if hash
            hash = '' if hash is '#'
            frame.prop('contentWindow').location.hash = hash

    createApplicationIframe: (slug, hash="") ->
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
        @frames.height $(window).height() - 50

        if $(window).width() > 500
            @content.height $(window).height() - 48
        else
            @content.height $(window).height()
