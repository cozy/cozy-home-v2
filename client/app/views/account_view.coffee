template = require('../templates/account')
timezones = require('../helpers/timezone').timezones

# View describing main screen for user once he is logged
class exports.AccountView extends Backbone.View
  id: 'account-view'


  ### Constructor ###

  constructor: ->
    super()


  # Fetch data from backend and fill form with collected data.
  fetchData: ->
    $.get "api/users/", (data) =>
      @emailField.html data.rows[0].email
      console.log data
      timezoneIndex = {}
      @timezoneField = @$ "#account-timezone-field"
      @timezoneField.html data.rows[0].timezone
      timezoneData = []
      for timezone in timezones
          timezoneData.push value: timezone, text: timezone

      @timezoneField.editable
         url: (params) =>
              @submitData timezone: params.value
         type: 'select'
         send: 'always'
         source: timezoneData
         value: data.rows[0].timezone

        $.get "api/instances/", (data) =>
            @domainField = $ '#account-domain-field'
            @domainField.html data.rows[0].domain
            @domainField.editable
                url: (params) =>
                    @submitData domain: params.value, 'api/instance/'
                type: 'text'
                send: 'always'


  # When data are submited, it sends a request to backend to save them.
  # If an error occurs, message is displayed.
  onDataSubmit: (event) =>
    @loadingIndicator.spin()
    form =
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
            else
                @displayErrors JSON.parse(data.responseText).msg
            @loadingIndicator.spin()
        error: (data) =>
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


  ### Configuration ###

  render: ->
    @$el.html template()

    @el

  setListeners: ->
    if app.views.home.logoutButton == undefined
        app.views.home.logoutButton = $("#logout-button")
        app.views.home.logoutButton.click app.views.home.logout
    if app.views.home.accountButton == undefined
        app.views.home.accountButton = $("#account-button")
        app.views.home.accountButton.click app.views.home.account
    if app.views.home.homeButton == undefined
        app.views.home.homeButton = $("#home-button")
        app.views.home.homeButton.click app.views.home.home
    app.views.home.selectNavButton app.views.home.accountButton
    @emailField = @$ "#account-email-field"
    @infoAlert = @$ "#account-info"
    @infoAlert.hide()
    @errorAlert = @$ "#account-error"
    @errorAlert.hide()

    @emailField.editable
        url: (params) =>
            @submitData email: params.value
        type: 'text'
        send: 'always'

    @changePasswordForm = @$ '#change-password-form'
    @changePasswordForm.hide()
    @changePasswordButton = @$ '#change-password-button'
    @changePasswordButton.click =>
        @changePasswordButton.fadeOut =>
            @changePasswordForm.fadeIn()
    @accountDataButton = @$ "#account-form-button"
    @accountDataButton.click @onDataSubmit

    @loadingIndicator = @$ ".loading-indicator"

