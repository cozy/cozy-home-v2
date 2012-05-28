template = require('../templates/register')

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


        @errorAlert.hide()
        $.ajax
            type: 'POST'
            url: "register/"
            data:
                email: email
                password: password
            success: (data) =>
                if data.success == true
                    app.views.login.logUser password
                else
                    @errorAlert.fadeIn()
            error: =>
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

        @passwordField.keyup (event) =>
             @submitData() if event.which == 13

