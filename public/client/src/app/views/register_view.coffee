template = require('../templates/register')


class exports.RegisterView extends Backbone.View
    id: 'register-view'
    path: 'register'

    ### Constructor ###

    ### Listeners ###

    ### Functions ###

    submitData: =>
        @errorAlert.hide()
        $.ajax
            type: 'POST'
            url: "/register/"
            data:
                email: @emailField.val()
                password: @passwordField.val()
            success: (data) =>
                if data.success
                    app.routers.main.navigate 'login', true
                else
                    @errorAlert.fadeIn()
            error: =>
                @errorAlert.fadeIn()
            
    # Load data from server
    fetchData: ->
        true

    render: ->
        $(@el).html template()
        @el

    setListeners: ->
        @emailField = $("#register-email")
        @passwordField = $("#register-password")
        @errorAlert = $("#register-error")

        @passwordField.keyup (event) =>
             @submitData() if event.which == 13

