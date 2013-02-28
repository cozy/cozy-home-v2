class exports.MainRouter extends Backbone.Router
    routes :
        "home": "home"
        "applications": "applications"
        "account": "account"
        "apps/:slug" : "application"
        "apps/:slug/*hash" : "application"

    ## Route behaviors

    home: ->
        @applications()

    applications: ->
        app.views.home.home()

    application: (slug, hash) ->
        app.views.home.loadApp slug, hash

    account: ->
        app.views.home.account()
