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
        @errorAlert = $ "#login-error" if @errorAlert?
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


    onForgotButtonClicked: =>
        $.ajax
            type: "POST"
            url: "login/forgot/"
            success: (data) =>
                if data.success
                    @displayInfo data.success
                else
                    @displayError data.error
            error: =>
                @displayError "Server error occured."

    # Show error div and fill it with given text
    displayError: (text) ->
        $("#login-form-error-text").html text
        @errorAlert.show()

    # Show info div and fill it with given text
    displayInfo: (text) ->
        $("#login-info-text").html text
        @infoAlert.show()



    # Configuration

    render: ->
        $(@el).html template()
        @el

    setListeners: ->
        @passwordField = $ "#login-password"
        @homeButton = $ "#home-button"
        @homeButton.hide()
        @accountButton = $ "#account-button"
        @accountButton.hide()
        @logoutButton = $ "#logout-button"
        @logoutButton.hide()
        @forgotButton = $ "#forgot-password-button"
        @forgotButton.click @onForgotButtonClicked

        @passwordField = $ "#login-password"
        @infoAlert = $ "#login-info"
        @infoAlert.hide()
        @errorAlert = $ "#login-error"
        @errorAlert.hide()
        @passwordField.keyup (event) =>
             @submitPassword() if event.which == 13

