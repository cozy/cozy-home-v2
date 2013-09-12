module.exports = class MainRouter extends Backbone.Router
    routes :
        "home": "applicationList"
        "applications": "market"
        "config-applications": "configApplications"
        "account": "account"
        "help": "help"
        "logout": "logout"
        "apps/:slug" : "application"
        "apps/:slug/*hash" : "application"
        "*path": "applicationList"
        '*notFound': 'applicationList'

    ## Route behaviors


    applicationList: ->
        app.mainView.displayApplicationsList()

    configApplications: ->
        app.mainView.displayConfigApplications()

    help: ->
        app.mainView.displayHelp()

    market: ->
        app.mainView.displayMarket()

    account: ->
        app.mainView.displayAccount()

    help: ->
        app.mainView.displayHelp()

    application: (slug, hash) ->
        app.mainView.displayApplication slug, hash

    logout: ->
        app.mainView.logout()


