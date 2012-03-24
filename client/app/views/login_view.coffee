template = require('../templates/login')


# Describes screen which allows user to sign in
class exports.LoginView extends Backbone.View
    id: 'login-view'
    className: 'center'

    ### Constructor ###

    ### Listeners ###


    ### Functions ###

    submitPassword: =>
      @logUser @passwordField.val()

    # Send a login request to backend. If it succeeds, home view is displayed
    # else an error message is displayed.
    logUser: (password) =>
        @errorAlert.hide()
        $.ajax
            type: 'POST'
            url: "login/"
            data: password: password
            success: (data) =>
                if data.success
                    app.routers.main.navigate 'home', true
                else
                    @errorAlert.fadeIn()
            error: =>
                @errorAlert.fadeIn()

    # Load data from server
    fetchData: ->
        true


    # Configuration

    render: ->
        $(@el).html template()
        @el

    setListeners: ->
        @passwordField = $("#login-password")
        @errorAlert = $("#login-error")
        @errorAlert.hide()
        @logoutButton = $("#logout-button")
        @logoutButton.hide()

        @passwordField.keyup (event) =>
             @submitPassword() if event.which == 13

        #@passwordField.focus()
