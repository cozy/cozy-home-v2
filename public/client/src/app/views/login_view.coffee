template = require('../templates/login')


class exports.LoginView extends Backbone.View
    id: 'login-view'

    ### Constructor ###

    ### Listeners ###

    ### Functions ###

    submitPassword: =>
        @errorAlert.hide()
        $.ajax
            type: 'POST'
            url: "/login/"
            data: password: @passwordField.val()
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

    render: ->
        $(@el).html template()
        @el

    setListeners: ->
        @passwordField = $("#login-password")
        @errorAlert = $("#login-error")

        @passwordField.keyup (event) =>
             @submitPassword() if event.which == 13

