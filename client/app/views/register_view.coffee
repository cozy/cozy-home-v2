template = require('../templates/register')
User = require('../models/user').User

# Describes screen allowing user to register.
class exports.RegisterView extends Backbone.View
    id: 'register-view'
    className: 'center'
    path: 'register'


    ### Constructor ###

    ### Listeners ###


    ### Functions ###

    submitData: =>
        email = @emailField.val()
        password = @passwordField.val()

        user = new User(email, password)

        @errorAlert.fadeOut =>
            user.register
                success: =>
                    app.views.login.logUser password
                error: (data) =>
                    error = JSON.parse data.responseText
                    @errorAlert.html error.msg
                    @errorAlert.fadeIn()
            
    fetchData: ->

    ### Configuration ###

    render: ->
        $(@el).html template()
        @el

    setListeners: ->
        @emailField = $("#register-email")
        @passwordField = $("#register-password")
        @errorAlert = $("#register-error")
        @errorAlert.hide()
        @buttons = $("#buttons")
        @buttons.hide()

        @passwordField.keyup (event) =>
             @submitData() if event.which == 13

