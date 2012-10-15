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
        @loadView app.views.applications

    application: (slug) ->
        app.views.home.loadApp slug

    account: ->
        @loadView app.views.account

    ## functions

    # Fill main content with given view data.
    loadView: (view) ->
        $("#content").html view.render()
        view.fetchData()
        view.setListeners()


