module.exports = class MainRouter extends Backbone.Router
    routes :
        "home": "applicationList"
        "applications": "applicationList"
        "market": "market"
        "account": "account"
        "logout": "logout"
        "apps/:slug" : "application"
        "apps/:slug/*hash" : "application"

    ## Route behaviors

    market: ->
        app.mainView.displayMarket()

    account: ->
        app.mainView.displayAccount()

    applicationList: ->
        app.mainView.displayApplicationsList()

    application: (slug, hash) ->
        app.mainView.displayApplication slug, hash

    logout: ->
        app.mainView.logout()


