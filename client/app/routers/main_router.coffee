ObjectPickerCroper = require '../views/object_picker'
Token = require "../models/token"

module.exports = class MainRouter extends Backbone.Router

    routes :
        "home"                : "applicationList"
        "customize"           : "applicationListEdit"
        "applications"        : "market"
        "config-applications" : "configApplications"
        "account"             : "account"
        "help"                : "help"
        "logout"              : "logout"
        "update/:slug"        : "updateApp"
        "update-stack"        : "updateStack"
        "apps/:slug"          : "application"
        "apps/:slug/*hash"    : "application"
        "*path"               : "applicationList"
        '*notFound'           : 'applicationList'

    initialize: ->

        # Wait for applications to send intents. Intents are sent trough
        # messages. Messages between app and home are possible only when the
        # app is displayed with the home top bar.
        window.addEventListener 'message', (event) =>
            return false unless event.origin is window.location.origin
            intent = event.data
            switch intent.action
                when 'getToken'
                    iframeName = document.activeElement.id
                    appName = iframeName.substring 0, iframeName.indexOf '-'
                    token = new Token appName
                    token.getToken
                        success: (data) ->
                            app.mainView.displayToken data, appName
                        error: ->
                            alert 'Server error occured, get token failed.'
                when 'goto'
                    @navigate "apps/#{intent.params}", true
                when undefined
                    intentType = 'application/x-talkerjs-v1+json'
                    try
                        if JSON.parse(intent).type isnt intentType
                            console.log "Weird intent, cannot handle it", intent
                    catch e
                        console.log "Weird intent, cannot handle it", intent
                        # Log error server side
                        window.onerror "Error handling intent: " + intent, \
                            "MainRouter.initialize", null, null, \
                            new Error()
                else
                    console.log "Weird intent, cannot handle it.", intent


    ## Route behaviors

    applicationList: ->
        app.mainView.displayApplicationsList()

    configApplications: ->
        app.mainView.displayConfigApplications()

    updateApp: (slug) ->
        app.mainView.displayUpdateApplication slug

    updateStack: ->
        app.mainView.displayUpdateStack()

    help: ->
        app.mainView.displayHelp()

    market: ->
        app.mainView.displayMarket()

    account: ->
        app.mainView.displayAccount()

    application: (slug, hash) ->
        app.mainView.displayApplication slug, hash

    logout: ->
        app.mainView.logout()