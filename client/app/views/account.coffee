BaseView = require 'lib/BaseView'
timezones = require('helpers/timezone').timezones

# View describing main screen for user once he is logged
module.exports = class exports.AccountView extends BaseView
    id: 'account-view'
    template: require 'templates/account'

    ### Constructor ###

    constructor: ->
        super()

    onChangePasswordClicked: =>
        @changePasswordButton.fadeOut =>
            @changePasswordForm.fadeIn =>
                @password1Field.focus()

    closePasswordForm: =>
        @changePasswordForm.fadeOut =>
            @changePasswordButton.fadeIn()

    # When data are submited, it sends a request to backend to save them.
    # If an error occurs, message is displayed.
    onDataSubmit: (event) =>
        @loadingIndicator.spin()
        form =
            password0: $("#account-password0-field").val()
            password1: $("#account-password1-field").val()
            password2: $("#account-password2-field").val()

        @infoAlert.hide()
        @errorAlert.hide()

        $.ajax
            type: 'POST'
            url: "api/user/"
            data: form
            success: (data) =>
                if data.success
                    @infoAlert.html data.msg
                    @infoAlert.show()
                    $("#account-password0-field").val null
                    $("#account-password1-field").val null
                    $("#account-password2-field").val null
                else
                    @displayErrors JSON.parse(data.responseText).msg
                @loadingIndicator.spin()
            error: (data) =>
                $("#account-password0-field").val null
                @displayErrors JSON.parse(data.responseText).msg
                @loadingIndicator.spin()
 
    submitData: (form, url='api/user/') ->
        $.ajax
            type: 'POST'
            url: url
            data: form
            success: (data) =>
                unless data.success
                   d = new $.Deferred
                   d.reject(JSON.parse(data.responseText).msg)
            error: (data) =>
               d = new $.Deferred
               d.reject(JSON.parse(data.responseText).msg)
              
    ### Functions ###
    displayErrors: (msgs) =>
        errorString = ""
        for msg in msgs
            errorString += msg + "<br />"
        @errorAlert.html errorString
        @errorAlert.show()

    # Fetch data from backend and fill form with collected data.
    fetchData: ->
        $.get "api/users/", (data) =>
            @emailField.html data.rows[0].email

            timezoneIndex = {}
            @timezoneField.html data.rows[0].timezone
            timezoneData = []
            for timezone in timezones
                    timezoneData.push value: timezone, text: timezone

            @emailField.editable
                url: (params) =>
                    @submitData email: params.value
                type: 'text'
                send: 'always'
                value: data.rows[0].email

            @timezoneField.editable
                 url: (params) =>
                    @submitData timezone: params.value
                 type: 'select'
                 send: 'always'
                 source: timezoneData
                 value: data.rows[0].timezone

            $.get "api/instances/", (data) =>
                if data.rows? and data.rows.length > 0
                    domain = data.rows[0].domain
                else
                    domain = 'no.domain.set'
                @domainField.html domain
                @domainField.editable
                    url: (params) =>
                        @submitData domain: params.value, 'api/instance/'
                    type: 'text'
                    send: 'always'
                    value: domain

    ### Configuration ###

    afterRender: ->
        # app.views.home.selectNavButton app.views.home.accountButton
        @emailField = @$ '#account-email-field'
        @timezoneField = @$ '#account-timezone-field'
        @domainField = @$ '#account-domain-field'
        @infoAlert = @$ '#account-info'
        @infoAlert.hide()
        @errorAlert = @$ '#account-error'
        @errorAlert.hide()

        @changePasswordForm = @$ '#change-password-form'
        @changePasswordForm.hide()
        @changePasswordButton = @$ '#change-password-button'
        @changePasswordButton.click @onChangePasswordClicked
        @accountSubmitButton = @$ '#account-form-button'
        @password1Field = $('#account-password1-field')
        @password2Field = $('#account-password2-field')
        @password1Field.keyup (event) =>
            @password2Field.focus() if event.which == 13
        @password2Field.keyup (event) =>
            @onDataSubmit() if event.which == 13
        @accountSubmitButton.click (event) =>
            event.preventDefault()
            @onDataSubmit()

        @installInfo = @$ '#add-app-modal .loading-indicator'
        @errorAlert.hide()
        @infoAlert.hide()

        @addApplicationCloseCross = @$ '#add-app-modal .close'
        @addApplicationCloseCross.click @onCloseAddAppClicked

        @loadingIndicator = @$ '.loading-indicator'

        @fetchData()
