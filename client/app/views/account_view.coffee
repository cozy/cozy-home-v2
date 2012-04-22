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

    $.ajax
        type: 'POST'
        url: "api/user/"
        data: form
        success: (data) =>
            if data.success
                alert "Data were correctly changed."
            else
                alert "Something went wrong, your data were not updated."
        error: =>
            alert "Server errer occured, change failed."


  ### Configuration ###

  render: ->
    $(@el).html template()
    @el

  setListeners: ->
    @accountButton = $ "#account-button"
    @accountButton.hide()
    @homeButton = $ "#home-button"
    @homeButton.show()
    @emailField = $ "#account-email-field"

    @accountDataButton = $ "#account-form-button"
    @accountDataButton.click @onDataSubmit

