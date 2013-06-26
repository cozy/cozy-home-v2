BaseView = require 'lib/base_view'
timezones = require('helpers/timezone').timezones
locales =   require('helpers/locales' ).locales

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
                    @displayErrors data.msg or data.responseText
                @loadingIndicator.spin()
            error: (data) =>
                $("#account-password0-field").val null
                @displayErrors data.msg or data.responseText
                @loadingIndicator.spin()

    submitData: (form, url='api/user/') ->
        d = new $.Deferred
        $.ajax
            type: 'POST'
            url: url
            data: form
            success: (data) =>
                if data.success
                    window.location.reload()
                    d.resolve()
                else d.reject(data.msg or data.responseText)
            error: (data) =>
               d.reject(data.msg or data.responseText)
        d

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
            instance = data.rows?[0]
            domain = instance?.domain or 'no.domain.set'
            locale = instance?.locale or 'en'

            @domainField.html domain
            @domainField.editable
                url: (params) =>
                    @submitData domain: params.value, 'api/instance/'
                type: 'text'
                send: 'always'
                value: domain

            @localeField.html locales[locale]
            localeData = (value: code, text: txt for code, txt of locales)
            @localeField.editable
                url: (params) =>
                    @submitData locale: params.value, 'api/instance/'
                type: 'select'
                send: 'always'
                source: localeData
                value: locale

    ### Configuration ###

    afterRender: ->
        # app.views.home.selectNavButton app.views.home.accountButton
        @emailField = @$ '#account-email-field'
        @timezoneField = @$ '#account-timezone-field'
        @domainField = @$ '#account-domain-field'
        @localeField = @$ '#account-locale-field'
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
