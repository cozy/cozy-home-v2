BaseView = require 'lib/base_view'
timezones = require('helpers/timezone').timezones
locales =   require('helpers/locales' ).locales
request = require 'lib/request'

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
                @password0Field.focus()
                $(window).trigger 'resize'

    closePasswordForm: =>
        @changePasswordForm.fadeOut =>
            @changePasswordButton.fadeIn()

    # When data are submited, it sends a request to backend to save them.
    # If an error occurs, message is displayed.
    onNewPasswordSubmit: (event) =>
        form =
            password0: @password0Field.val()
            password1: @password1Field.val()
            password2: @password2Field.val()

        @infoAlert.hide()
        @errorAlert.hide()

        @accountSubmitButton.spin 'small'
        @accountSubmitButton.css 'color', 'transparent'
        request.post 'api/user', form, (err, data) =>
            if err
                @password0Field.val null
                @password1Field.val null
                @password2Field.val null
                if data?
                    @displayErrors data.msg
                else
                    @displayErrors err.message
            else
                if data.success
                    @infoAlert.html data.msg
                    @infoAlert.show()
                    @password0Field.val null
                    @password1Field.val null
                    @password2Field.val null
                else
                    @displayErrors data.msg
            @accountSubmitButton.css 'color', 'white'
            @accountSubmitButton.spin()


    ### Functions ###
    displayErrors: (msgs) =>
        errorString = ""
        msgs = msgs.split ',' if typeof(msgs) is 'string'
        errorString += "#{msg}<br />" for msg in msgs

        @errorAlert.html errorString
        @errorAlert.show()


    # Build a function that save given data when triggered and display
    # a loading indicator on the save button of the field.
    getSaveFunction: (fieldName, fieldWidget, path) ->
        saveButton = fieldWidget.parent().find('.btn')
        saveFunction = ->
            saveButton.css 'color', 'transparent'
            saveButton.spin 'small', 'white'

            data = {}
            data[fieldName] = fieldWidget.val()
            request.post "api/#{path}", data, (err) ->

                saveButton.spin()
                saveButton.css 'color', 'white'

                if err
                    saveButton.addClass 'red'
                    saveButton.html 'error'
                else
                    saveButton.addClass 'green'
                    saveButton.html t 'saved'
                    if fieldName is 'locale'
                        alert t 'changing locale requires reload'
                        window.location.reload()
                    setTimeout ->
                        window.location.reload() if fieldName is 'locale'
                    , 1000


        saveButton.click saveFunction
        saveFunction


    # Fetch data from backend and fill form with collected data.
    fetchData: ->

        $.get "api/users/", (data) =>
            timezoneData = []

            userData = data.rows[0]
            @emailField.val userData.email
            @publicNameField.val userData.public_name
            @timezoneField.val userData.timezone

            saveEmail = @getSaveFunction 'email', @emailField, 'user'
            @emailField.on 'keyup', (event) ->
                saveEmail() if event.keyCode is 13 or event.which is 13

            savePublicName = @getSaveFunction 'public_name', \
                                            @publicNameField, 'user'
            @emailField.on 'keyup', (event) ->
                savePublicName() if event.keyCode is 13 or event.which is 13

            saveTimezone = @getSaveFunction 'timezone', @timezoneField, 'user'
            @timezoneField.change saveTimezone

        $.get "api/instances/", (data) =>
            instance = data.rows?[0]
            domain = instance?.domain or t('no domain set')
            locale = instance?.locale or 'en'

            saveDomain = @getSaveFunction 'domain', @domainField, 'instance'
            @domainField.on 'keyup', (event) =>
                saveDomain() if event.keyCode is 13 or event.which is 13
            @domainField.val domain

            saveLocale = @getSaveFunction 'locale', @localeField, 'instance'
            @localeField.change saveLocale
            @localeField.val locale

            # Don't know why password fields can't be configured too early...
            @password0Field = @$('#account-password0-field')
            @password1Field = @$('#account-password1-field')
            @password2Field = @$('#account-password2-field')
            @password0Field.keyup (event) =>
                if event.keyCode is 13 or event.which is 13
                    @password1Field.focus()
            @password1Field.keyup (event) =>
                if event.keyCode is 13 or event.which is 13
                    @password2Field.focus()
            @password2Field.keyup (event) =>
                if event.keyCode is 13 or event.which is 13
                    @onNewPasswordSubmit()


    ### Configuration ###

    afterRender: ->
        # app.views.home.selectNavButton app.views.home.accountButton
        @emailField = @$ '#account-email-field'
        @publicNameField = @$ '#account-public-name-field'
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

        @accountSubmitButton.click (event) =>
            event.preventDefault()
            @onNewPasswordSubmit()

        for timezone in timezones
            @timezoneField.append(
                "<option value=\"#{timezone}\">#{timezone}</option>"
            )

        @fetchData()
