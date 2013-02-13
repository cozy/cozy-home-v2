class exports.MainRouter extends Backbone.Router
    routes :
        "home": "home"
        "applications": "applications"
        "account": "account"
        "apps/:slug": "application"

    ## Route behaviors

    home: ->
        @applications()

    applications: ->
        app.views.home.home()

    application: (slug) ->
        app.views.home.loadApp slug

    account: ->
        app.views.home.account()
