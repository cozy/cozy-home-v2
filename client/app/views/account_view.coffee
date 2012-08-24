template = require('../templates/account')

# View describing main screen for user once he is logged
class exports.AccountView extends Backbone.View
  id: 'account-view'


  ### Constructor ###

  constructor: ->
    super()

  fetchData: ->
    $.get "api/users/", (data) =>
      @emailField.val data.rows[0].email

  onDataSubmit: (event) =>
    form =
        email: $("#account-email-field").val()
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
                msgs = JSON.parse(data.responseText).msg
                errorString = ""
                for msg in msgs
                    errorString += msg + "<br />"
                @errorAlert.html errorString
                @errorAlert.show()
        error: (data) =>
            msgs = JSON.parse(data.responseText).msg
            errorString = ""
            for msg in msgs
                console.log msg
                errorString += msg + "<br />"
            @errorAlert.html errorString
            @errorAlert.show()


  ### Configuration ###

  render: ->
    $(@el).html template()
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

