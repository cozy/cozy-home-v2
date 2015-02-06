module.exports = class MainRouter extends Backbone.Router

    routes :
        "home": "applicationList"
        "customize": "applicationListEdit"
        "applications": "market"
        "config-applications": "configApplications"
        "account": "account"
        "help": "help"
        "home/install": "installWizard"
        "home/quicktour": "quickTourWizard"
        "logout": "logout"
        "update/:slug": "updateApp"
        "update-stack": "updateStack"
        "apps/:slug" : "application"
        "apps/:slug/*hash" : "application"
        "*path": "applicationList"
        '*notFound': 'applicationList'

    initialize: ->
        # expect applications to send intents
        window.addEventListener 'message', (event) =>
            return false unless event.origin is window.location.origin
            intent = event.data
            switch intent.action
                when 'goto' then @navigate "apps/#{intent.params}", true
                else console.log "WEIRD INTENT", intent

    selectIcon: (index) ->
        unless index is -1
            $('.menu-btn.active').removeClass 'active'
            $($('.menu-btn').get(index)).addClass 'active'
        else # no active button
            $('.menu-btn.active').removeClass 'active'

        # dirty trick to prevent the custom menu to stay when doing:
        # custom view => random view => display application list
        app.mainView.applicationListView.setMode 'view' if index isnt 3

    ## Route behaviors

    applicationList: ->
        app.mainView.displayApplicationsList()
        @selectIcon 0 # no highlighted button

    applicationListEdit: ->
        app.mainView.displayApplicationsListEdit()
        @selectIcon 3

    configApplications: ->
        app.mainView.displayConfigApplications()
        @selectIcon 2

    updateApp: (slug) ->
        app.mainView.displayUpdateApplication slug
        @selectIcon 2

    updateStack: ->
        app.mainView.displayUpdateStack()
        @selectIcon 2

    help: ->
        app.mainView.displayHelp()
        @selectIcon 5

    market: ->
        app.mainView.displayMarket()
        @selectIcon 1

    account: ->
        app.mainView.displayAccount()
        @selectIcon 4

    application: (slug, hash) ->
        app.mainView.displayApplication slug, hash

    installWizard: ->
        app.mainView.displayInstallWizard()
        @selectIcon 0 # no highlighted button

    quickTourWizard: ->
        app.mainView.displayQuickTourWizard()
        @selectIcon 0 # no highlighted button

    logout: ->
        app.mainView.logout()
