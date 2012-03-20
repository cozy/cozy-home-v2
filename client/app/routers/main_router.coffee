class exports.MainRouter extends Backbone.Router
    routes :
        "home": "home"
        "login": "login"
        "market": "market"
        "register": "register"

    ## Route behaviors

    home: ->
        @loadView(app.views.home)

    market: ->
        @loadView(app.views.market)

    login: ->
        @loadView(app.views.login)

    register: ->
        @loadView(app.views.register)

    ## functions

    # Fill main content with given view data.
    loadView: (view) ->
        $('#content').html view.render()
        view.fetchData()
        view.setListeners()

