template = require('../templates/reset')

# View describing main screen for user once he is logged
class exports.ResetView extends Backbone.View
    id: 'reset-view'

    ### Constructor ###

    constructor: ->
        super()

    fetchData: ->

    setKey: (key) ->
        @key = key

    onDataSubmit: (event) =>
        if @passwordField1.val() != @passwordField2.val()
            alert "Passwords do not match, type them again"
        else
            form =
                key: @key
                password1: @passwordField1.val()
                password2: @passwordField2.val()
            @sendForm form

    sendForm: (form) ->
        $.ajax
            type: "POST"
            url: "password/reset/#{@key}"
            data: form
            success: (data) =>
                if data.success
                    alert "New password is now set."
                    app.routers.main.navigate 'login', true
                else
                    alert "Something went wrong, your password was not updated."
            error: =>
                alert "Server errer occured, change failed."


    ### Configuration ###

    render: ->
        $(@el).html template()
        @el

    setListeners: ->
        @buttons = $ "#buttons"
        @buttons.hide()

        @passwordField1 = $ "#reset-password1-field"
        @passwordField2 = $ "#reset-password2-field"

        @resetDataButton = $ "#reset-form-button"
        @resetDataButton.click @onDataSubmit

