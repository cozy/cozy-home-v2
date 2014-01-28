module.exports = class MainRouter extends Backbone.Router


    routes :
        "home": "applicationList"
        "customize": "applicationListEdit"
        "applications": "market"
        "config-applications": "configApplications"
        "account": "account"
        "help": "help"
        "logout": "logout"
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
        app.mainView.applicationListView.setMode 'view' if index isnt 2

    ## Route behaviors

    applicationList: ->
        app.mainView.displayApplicationsList()
        @selectIcon -1 # no highlighted button

    applicationListEdit: ->
        app.mainView.displayApplicationsListEdit()
        @selectIcon 2

    configApplications: ->
        app.mainView.displayConfigApplications()
        @selectIcon 1

    help: ->
        app.mainView.displayHelp()
        @selectIcon 4

    market: ->
        app.mainView.displayMarket()
        @selectIcon 0

    account: ->
        app.mainView.displayAccount()
        @selectIcon 3

    application: (slug, hash) ->
        app.mainView.displayApplication slug, hash

    logout: ->
        app.mainView.logout()


