BaseView = require 'lib/BaseView'
appIframeTemplate = require 'templates/application_iframe'
AppCollection = require 'collections/application'
NavbarView = require 'views/navbar'
AccountView = require 'views/account'
MarketView = require 'views/market'
ApplicationsListView = require 'views/home'

User = require 'models/user'


# View describing main screen for user once he is logged
module.exports = class HomeView extends BaseView
    el: 'body'

    template: require 'templates/layout'

    constructor: ->
        @apps = new AppCollection()
        super()

    afterRender: =>
        @navbar = new NavbarView(@apps)
        @applicationListView = new ApplicationsListView(@apps)
        @accountView = new AccountView()
        @marketView = new MarketView(@apps)

        @frames = @$ '#app-frames'
        @content = @$ '#content'

        @resetLayoutSizes()
        $(window).resize @resetLayoutSizes

        @apps.fetch()

    ### Functions ###

    # Send a logout request to server then reload current window to redirect
    # user to automatically redirect user to login page (he's not logged
    # anymore, so cozy proxy will do the redirection).
    logout: (event) =>
        user = new User()
        user.logout
            success: (data) =>
                window.location.reload()
            error: =>
                alert "Server error occured, logout failed."
        event.preventDefault()

    displayView: (view) =>
        if @currentView?
            @currentView.$el.detach()

        @content.show()
        @frames.hide()
        @content.append(view.$el)
        @currentView = view
        $('#favicon').attr 'href', "favicon.ico"

    # Display application manager page, hides app frames, active home button.
    displayApplicationsList: =>
        @displayView @applicationListView
        @navbar.selectButton "home-button"
        window.document.title = "Cozy - Home"

    # Display application manager page, hides app frames, active home button.
    displayMarket: =>
        @displayView @marketView
        @navbar.selectButton "market-button"
        window.document.title = "Cozy - Market"

    # Display account manager page, hides app frames, active account button.
    displayAccount: =>
        @displayView @accountView
        @navbar.selectButton "account-button"
        window.document.title = "Cozy - Account"

    # Get frame corresponding to slug if it exists, create before either.
    # Then this frame is displayed while we hide content div and other app
    # iframes. Then currently selected frame is registered
    displayApplication: (slug, hash) ->

        # @dirtyhack
        if @apps.length is 0
            once = =>
                @apps.off 'reset', once
                @displayApplication(slug, hash)
            @apps.on 'reset', once
            return null

        @frames.show()
        @content.hide()

        frame = @$("##{slug}-frame")
        frame = @createApplicationIframe(slug, hash) if frame.length is 0
            
        @$("#app-frames").find("iframe").hide()
        frame.show()

        @navbar.selectButton slug
        @selectedApp = slug

        name = @apps.get(slug).get('name')
        name = '' if not name?
        window.document.title = "Cozy - #{name}"
        $('#favicon').attr 'href', "/apps/#{slug}/favicon.ico"

    createApplicationIframe: (slug, hash="")->
        @frames.append appIframeTemplate(id: slug, hash:hash)
        frame = @$("##{slug}-frame")
        $(frame.prop('contentWindow')).on 'hashchange', =>
            location = frame.prop('contentWindow').location
            newhash = location.hash.replace '#', ''
            @onAppHashChanged(slug, newhash)
        return frame

    onAppHashChanged: (slug, newhash) =>
        if slug is @selectedApp
            app?.routers.main.navigate "/apps/#{slug}/#{newhash}", false

    ### Configuration ###

    # Small trick to size properly iframe.
    resetLayoutSizes: =>
        header = @$ "#header"
        @frames.height $(window).height() - header.height()
        @content.height $(window).height() - header.height()