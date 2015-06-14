ObjectPickerCroper = require '../views/object-picker'

module.exports = class MainRouter extends Backbone.Router

    routes :
        "home"                : "applicationList"
        "customize"           : "applicationListEdit"
        "applications"        : "market"
        "config-applications" : "configApplications"
        "account"             : "account"
        "help"                : "help"
        "home/install"        : "installWizard"
        "home/quicktour"      : "quickTourWizard"
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
                when 'goto'
                    @navigate "apps/#{intent.params}", true
                when undefined
                    intentType = 'application/x-talkerjs-v1+json'
                    if JSON.parse(intent).type isnt  intentType
                        console.log "Weird intent, cannot handle it.", intent
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

    installWizard: ->
        app.mainView.displayInstallWizard()

    quickTourWizard: ->
        app.mainView.displayQuickTourWizard()

    logout: ->
        app.mainView.logout()

