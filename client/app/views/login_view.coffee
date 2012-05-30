template = require "../templates/login"
User = require("../models/user").User


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
        @errorAlert = $ "#login-error" if not @errorAlert?
        @errorAlert.hide()

        user = new User(null, password)
        user.login
            success: (data) =>
                app.routers.main.navigate 'home', true
            error: (data) =>
                if data?.responseText?
                    info = JSON.parse data.responseText if data?.responseText?
                else
                    info = data.msg
                @displayError info.msg

    # Load data from server
    fetchData: ->


    # Send a password reset request to backend. If it succeeds, instructions 
    # are displayed else an error message is displayed.
    onForgotButtonClicked: =>
        $.ajax
            type: "POST"
            url: "login/forgot/"
            success: (data) =>
                if data.success
                    @displayInfo data.success
                else
                    @displayError data.msg
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

