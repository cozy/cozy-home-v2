class exports.MainRouter extends Backbone.Router
    routes :
        "home": "home"
        "login": "login"
        "applications": "applications"
        "register": "register"
        "account": "account"
        "password/reset/:key": "resetPassword"

    ## Route behaviors

    home: ->
        @applications()

    applications: ->
        @loadView app.views.applications

    login: ->
        @loadView app.views.login

    register: ->
        @loadView app.views.register

    account: ->
        @loadView app.views.account

    resetPassword: (key) ->
        @loadView app.views.reset
        app.views.reset.setKey key


    ## functions

    # Fill main content with given view data.
    loadView: (view) ->
        $("#content").html view.render()
        view.fetchData()
        view.setListeners()


