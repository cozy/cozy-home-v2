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
      @emailField.val data.rows[0].email
      @timezoneField.val data.rows[0].timezone

  # When data are submited, it sends a request to backend to save them.
  # If an error occurs, message is displayed.
  onDataSubmit: (event) =>
    @loadingIndicator.spin()
    form =
        email: @emailField.val()
        timezone: @timezoneField.val()
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
        

  ### Functions ###

  displayErrors: (msgs) =>
      errorString = ""
      for msg in msgs
          errorString += msg + "<br />"
      @errorAlert.html errorString
      @errorAlert.show()


  ### Configuration ###

  render: ->
    $(@el).html template()
    timezoneIndex = {}
    @timezoneField = @$ "#account-timezone-field"
    for timezone in timezones
        @timezoneField.append("<option>#{timezone}</option>")

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
    @emailField = $ "#account-email-field"
    @infoAlert = $ "#account-info"
    @infoAlert.hide()
    @errorAlert = $ "#account-error"
    @errorAlert.hide()

    @accountDataButton = $ "#account-form-button"
    @accountDataButton.click @onDataSubmit

    @loadingIndicator = @$ ".loading-indicator"

