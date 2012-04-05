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

