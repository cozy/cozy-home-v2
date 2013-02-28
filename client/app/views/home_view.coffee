homeTemplate = require('../templates/home')
appButtonTemplate = require "../templates/application_button"
appIframeTemplate = require "../templates/application_iframe"
AppCollection = require('../collections/application').ApplicationCollection
User = require("../models/user").User


# View describing main screen for user once he is logged
class exports.HomeView extends Backbone.View
    id: 'home-view'

    constructor: ->
        super()
        @apps = new AppCollection @

    subscriptions:
        "app:removed": "onAppRemoved"
        
    onAppRemoved: (slug) =>
        @buttons.find("##{slug}").remove()

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

    # Display application manager page, hides app frames, active home button.
    home: =>
        app?.routers.main.navigate 'home', false
        @content.show()
        @frames.hide()
        view = app.views.applications
        $("#content").html view.render()
        view.fetchData()
        view.setListeners()

        @selectNavButton @homeButton
        window.document.title = "Cozy - Home"

    # Display account manager page, hides app frames, active account button.
    account: =>
        app?.routers.main.navigate 'account', true
        @content.show()
        @frames.hide()
        view = app.views.account
        $("#content").html view.render()
        view.fetchData()
        view.setListeners()

        @selectNavButton @accountButton
        window.document.title = "Cozy - Account"

    # Small trick to size properly iframe.
    resetLayoutSizes: =>
        header = @$ "#header"
        @frames.height $(window).height() - header.height()
        @content.height $(window).height() - header.height()
        
    # Desactivate all buttons and activate given button (visual activation).
    selectNavButton: (button) ->
        @buttons.find("li").removeClass "active"
        button.parent().addClass "active"

    # Remove all buttons from apps menu.
    clearApps: =>
            @$(".app-button a").unbind()
            @$(".app-button").remove()

    # Add an app button to cozy apps menu
    addApplication: (application) =>
        @buttons.find(".nav:last").append appButtonTemplate(app: application)
        button = @buttons.find("#" + application.slug)
        button.tooltip
             placement: 'bottom'
             title: '<a target="' + application.slug + '" href="/apps/' + \
                    application.slug + '/">open in a new tab</a>'
             delay: show: 500, hide: 1000
            
    # Get frame corresponding to slug if it exists, create before either.
    # Then this frame is displayed while we hide content div and other app
    # iframes. Then currently selected frame is registered
    loadApp: (slug, hash) ->
        @frames.show()
        frame = @$("##{slug}-frame")
        if frame.length is 0
            hash = '' if not hash?
            @frames.append appIframeTemplate(id: slug, hash:hash)
            frame = @$("##{slug}-frame")
            $(frame.prop('contentWindow')).on 'hashchange', ->
                location = frame.prop('contentWindow').location
                newhash = hash.replace '#', ''
                app?.routers.main.navigate "/apps/#{slug}/#{newhash}", false

        @content.hide()
        @$("#app-frames").find("iframe").hide()
        frame.show()

        @selectNavButton @$("##{slug}")
        @selectedApp = slug
        @setAppTitle()

    displayNoAppMessage: ->

    ### Configuration ###

    setAppTitle: ->
        application = @apps.filter (application) =>
            application.slug is @selectedApp

        if application.length > 0 then name = application[0].name else name = ""
        window.document.title = "Cozy - #{name}"

    fetch: ->
        @apps.fetch
            success: =>
                # Weird trick to set current app tab active once apps are loaded.
                @selectNavButton @$("##{@selectedApp}") if @selectedApp?
                @setAppTitle() if @selectedApp?
                @selectedApp = null
                @resetLayoutSizes()

    render: ->
        $(@el).html homeTemplate()
        @el

    setListeners: ->
        @$('#help-button').tooltip
             placement: 'bottom'
             title: 'Questions and help forum'
            
        @logoutButton = @$ '#logout-button'
        @logoutButton.click @logout
        @logoutButton.tooltip
             placement: 'bottom'
             title: 'Sign out'
            
        @accountButton = @$ '#account-button'
        @accountButton.click @account
        @homeButton = @$ '#home-button'
        @homeButton.click @home
        
        @buttons = @$ '#buttons'
        @selectNavButton @homeButton
        @frames = @$ '#app-frames'
        @content = @$ '#content'
        @buttons.fadeIn()

        @content = @$ '#content'
        $(window).resize @resetLayoutSizes
        @resetLayoutSizes()
