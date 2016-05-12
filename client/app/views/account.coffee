BaseView = require 'lib/base_view'

Background = require '../models/background'
timezones = require('helpers/timezone').timezones
locales =   require('helpers/locales' ).locales
request = require 'lib/request'
BackgroundList = require 'views/background_list'
Instance = require 'models/instance'
ObjectPicker = require './object_picker'


# View describing main screen for user once he is logged
module.exports = class exports.AccountView extends BaseView
    id: 'account-view'
    template: require 'templates/account'

    events:
        'click #background-add-button': 'onAddBackgroundClicked'


    afterRender: ->

        # Register widgets
        @emailField = @$ '#account-email-field'
        @publicNameField = @$ '#account-public-name-field'
        @timezoneField = @$ '#account-timezone-field'
        @domainField = @$ '#account-domain-field'
        @localeField = @$ '#account-locale-field'
        @infoAlert = @$ '#account-info'
        @infoAlert.hide()
        @errorAlert = @$ '#account-error'
        @errorAlert.hide()
        @info2faAlert = @$ '.account-2fa-info'
        @info2faAlert.hide()
        @error2faAlert = @$ '.account-2fa-error'
        @error2faAlert.hide()

        @twoFactorInfo = @$ '#2fa-infos'
        @twoFactorToken = @$ '#2fa-token'
        @changePasswordForm = @$ '#change-password-form'
        @twoFactorForm = @$ '#2fa-form'
        @accountSubmitButton = @$ '#account-form-button'
        @twoFactorSubmitButton = @$ '#account-2fa-button'
        @twoFactorOffButton = @$ '#account-2fa-off-button'
        @twoFactorStrategy = @$ '#2fa-strategy'
        @twoFactorResetForm = @$ '#2fa-hotp-reset'
        @twoFactorResetButton = @$ '#account-2fa-reset-button'

        @twoFactorQrCode = @$('#qrcode')
        
        # Configure Background
        @accountSubmitButton.click (event) =>
            event.preventDefault()
            @onNewPasswordSubmit()
        @twoFactorSubmitButton.click (event) =>
            event.preventDefault()
            @on2faEnableSubmit()
        @twoFactorOffButton.click (event) =>
            event.preventDefault()
            @on2faDisableSubmit()
        @twoFactorResetButton.click (event) =>
            event.preventDefault()
            @on2faResetSubmit()

        # Fill timezone selector
        for timezone in timezones
            @timezoneField.append(
                "<option value=\"#{timezone}\">#{timezone}</option>"
            )

        # Build and render background list. Listen to background changes.
        @backgroundList = new BackgroundList
            el: @$ '.background-list'
        @backgroundList.collection.on 'change', @onBackgroundChanged
        @backgroundAddButton = @$ '#background-add-button'

        # Load data once everything is built
        @fetchData()
        if window.managed
            @$('#account-domain-field')[0].disabled = true
            @$('#account-domain-field').parent().find('.btn').hide()


    # When password data are submited, it sends a request to backend to save
    # them. If an error occurs, message is displayed.
    onNewPasswordSubmit: (event) =>

        form =
            password0: @password0Field.val()
            password1: @password1Field.val()
            password2: @password2Field.val()

        @infoAlert.hide()
        @errorAlert.hide()

        hideFunc = null
        showError = (message) =>
            @errorAlert.html t message
            @errorAlert.fadeIn()
            clearTimeout hideFunc
            hideFunc = setTimeout =>
                @errorAlert.fadeOut()
            , 10000

        if form.password1.length < 5
            showError 'account change password short'

        else if form.password1 isnt form.password2
            showError 'account change password difference'

        else

            @accountSubmitButton.spin true
            request.post 'api/user', form, (err, data) =>

                @accountSubmitButton.spin false
                if err
                    @password0Field.val null
                    @password1Field.val null
                    @password2Field.val null
                    showError 'account change password error'

                else
                    if data.success
                        @infoAlert.show()
                        @password0Field.val null
                        @password1Field.val null
                        @password2Field.val null
                        setTimeout =>
                            @infoAlert.hide()
                        , 10000
                    else
                        showError 'account change password error'
                        
                                    
    # Displays success message on the two-factor auth panel and reload the page.
    # Only called when 2FA is enabled or disabled (else we don't reload).
    on2faStatusChageSuccess: (message) =>
        @info2faAlert.html t message
        @info2faAlert.fadeIn()
        clearTimeout hideFunc
        hideFunc = setTimeout =>
            window.location.reload()
        , 2000
    
    
    # Displays error on the two-factor auth panel.
    # This one is also used for counter reset.
    on2faError: =>
        console.error err
        @error2faAlert.fadeIn()
        setTimeout =>
            @error2faAlert.fadeOut()
        , 5000
            
    
    # Enables two-factor auth by generating a new key (if there's already one
    # in base, resetting it), and set the HOTP counter if the auth type is HOTP
    on2faEnableSubmit: (event) ->
        authType = @twoFactorField.val()
        
        form =
            authType: authType
            encryptedOtpKey: @getOtpKey()
            hotpCounter: 0 if authType is 'hotp'
        @twoFactorSubmitButton.spin true
        
        request.post 'api/user', form, (err, data) =>
            @twoFactorSubmitButton.spin false
            if err
                @on2faError()
            else
                if data.success
                    @on2faStatusChageSuccess 'account 2fa enabled'
                else
                    @on2faError()
                    
    
    # Disables two-factor auth. No resetting of the key nor the counter, but
    # that will happen if the user enables it back.
    on2faDisableSubmit: (event) ->
        form =
            authType: null
        @twoFactorSubmitButton.spin true
        
        request.post 'api/user', form, (err, data) =>
            @twoFactorSubmitButton.spin false
            if err
                @on2faError()
            else
                if data.success
                    @on2faStatusChageSuccess 'account 2fa disabled'
                else
                    @on2faError()


    # Resets the HOTP counter. This function can be called only in HOTP mode
    # (and it will set the 2FA mode to HOTP otherwise).
    # We don't use @on2faStatusChageSuccess here because we don't need to
    # reload the page after resetting the counter.
    on2faResetSubmit: (event) ->
        form =
            authType: 'hotp'
            hotpCounter: 0
        
        request.post 'api/user', form, (err, data) =>
            @twoFactorSubmitButton.spin false
            if err
                @on2faError()
            else
                if data.success
                    @info2faAlert.html t 'account 2fa reset'
                    @info2faAlert.fadeIn()
                    clearTimeout hideFunc
                    hideFunc = setTimeout =>
                        @info2faAlert.fadeOut()
                    , 5000
                else
                    @on2faError()


    # OTP key is generated client-side, in this function.
    getOtpKey: () ->
        PRNG = new Uint32Array 5
        window.crypto.getRandomValues PRNG

        key = PRNG.reduce (key, subkey) ->
            # pad each PRNG hex with '0'
            key += ('0000' + subkey.toString(16)).slice(-8)
        , ''
    
    
    # Retrieve two-factor auth specific token, which is the base32-encoded key
    # (10-char long string we first generate in the above function).
    getUserToken: (next) ->
        request.get 'api/user/2fa', (err, data) ->
            if err
                next err
            else 
                next null, data.token
    
    
    # Return the string to be encoded as a QR code, containing user datas and
    # encoded token
    get2faQRCodeString: (data, token) ->
        return "otpauth://#{data.authType}/Cozy:#{data.email}?secret=#{token}&issuer=Cozy"
        
        
    # Build a function that save given data when triggered and display
    # a loading indicator on the save button of the field.
    getSaveFunction: (fieldName, fieldWidget, path) ->
        saveButton = fieldWidget.parent().find('.btn')
        alertMsg = @$ ".error.#{fieldName}"
        saveFunction = ->
            saveButton.spin true

            data = {}
            data[fieldName] = fieldWidget.val()
            request.post "api/#{path}", data, (err) ->
                saveButton.spin false

                if err
                    err = err.toString()
                    err = err.replace 'Error: ', ''
                    saveButton.addClass 'red'
                    saveButton.html t 'error'
                    alertMsg.html "#{t(err)}"
                    alertMsg.show()
                else
                    saveButton.removeClass 'red'
                    saveButton.addClass 'green'
                    saveButton.html t 'saved'
                    alertMsg.hide()
                    if fieldName is 'locale'
                        alert t 'changing locale requires reload'
                        window.location.reload()
                    setTimeout ->
                        window.location.reload() if fieldName is 'locale'
                    , 1000


        saveButton.click saveFunction
        saveFunction


    # Fetch data from backend and fill form with collected data.
    # Then set all listeners: listen to keyup for each field and to click
    # for each button.
    fetchData: ->

        userData = window.cozy_user or {}
        @emailField.val userData.email
        @publicNameField.val userData.public_name
        @timezoneField.val userData.timezone

        saveEmail = @getSaveFunction 'email', @emailField, 'user'
        @emailField.on 'keyup', (event) ->
            saveEmail() if event.keyCode is 13 or event.which is 13

        savePublicName = @getSaveFunction 'public_name', \
                                        @publicNameField, 'user'
        @publicNameField.on 'keyup', (event) ->
            savePublicName() if event.keyCode is 13 or event.which is 13

        saveTimezone = @getSaveFunction 'timezone', @timezoneField, 'user'
        @timezoneField.change saveTimezone

        instance = window.cozy_instance or {}
        @instance = new Instance instance
        domain = instance?.domain or t('no domain set')
        locale = instance?.locale or 'en'

        if not window.managed
            saveDomain = @getSaveFunction 'domain', @domainField, 'instance'
            @domainField.on 'keyup', (event) ->
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
        
        # Two-factor authentication
        if userData.authType
            @twoFactorForm.hide()
            @twoFactorInfo.show()
            @twoFactorStrategy.html t '2fa strategy ' + userData.authType
            # If HOTP is enabled, show the conter reset panel
            if userData.authType is 'hotp'
                @twoFactorResetForm.show()
            # Retrieve 2FA token, display it and generate a QR code from it
            @getUserToken (err, token) =>
                if err
                    console.error err
                else if token
                    @twoFactorToken.html token
                    # Retrieve the QR Code data URL and fill the img tag's
                    # src attribute with it
                    data = qr.toDataURL
                        mime: 'image/png'
                        size: 10
                        level: 'H'
                        value: @get2faQRCodeString userData, token
                    @twoFactorQrCode.attr 'src', data
                else
                    @twoFactorToken.html t 'cant find token'
        else
            # No 2FA strategy enabled, we just display the activation panel
            @twoFactorForm.show()
            @twoFactorInfo.hide()
            @twoFactorField = @$('#account-2fa-field')


    # When add background button is clicked, it displays the photo selector
    # modal. From the selector result it sends a multipart form to the server.
    # That way the background can saved. Once it's done the background is
    # added to the available background list.
    onAddBackgroundClicked: ->
        params =
            type: 'singlePhoto'
            defaultTab: 'photoUpload'

        new ObjectPicker params, (newPhotoChosen, dataUrl) =>

            if dataUrl?
                @backgroundAddButton.spin true
                binary = atob dataUrl.split(',')[1]
                array = []
                array.push binary.charCodeAt i for i in [0..binary.length]
                blob = new Blob [new Uint8Array(array)], type: 'image/jpeg'

                form = new FormData()
                form.append 'picture', blob
                $.ajax
                    type: "POST"
                    url: "/api/backgrounds"
                    data: form
                    contentType: false
                    processData: false
                    success: (data) =>
                        background = new Background data
                        @backgroundList.collection.add background
                        @backgroundList.select background

                    error: (data) ->
                        alert t 'account background added error'
                    complete: =>
                        @backgroundAddButton.spin false


    # When background is changed, data are saved and a backgroundChanged event
    # is emitted. That way the main view can be notified.
    onBackgroundChanged: (model) =>
        data = background: model.get('id')
        @instance.saveData data, (err) ->
            if err
                alert t 'account background saved error'
            else
                Backbone.Mediator.pub 'backgroundChanged', data.background

