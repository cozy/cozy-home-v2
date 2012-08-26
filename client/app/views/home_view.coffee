homeTemplate = require('../templates/home')
User = require("../models/user").User


# View describing main screen for user once he is logged
class exports.HomeView extends Backbone.View
  id: 'home-view'

  ### Functions ###

  logout: =>
    user = new User()
    user.logout
        success: (data) =>
            app.routers.main.navigate 'login', true
        error: =>
            alert "Server error occured, logout failed."

  home: =>
    app.routers.main.navigate 'home', true
    @selectNavButton @homeButton

  account: =>
    app.routers.main.navigate 'account', true
    @selectNavButton @accountButton

  selectNavButton: (button) ->
    @buttons.find("li").removeClass "active"
    button.parent().addClass "active"


  ### Configuration ###

  render: ->
    $(@el).html homeTemplate()
    @el

  setListeners: ->
    @appList = $("#app-list")

    @logoutButton = $("#logout-button")
    @logoutButton.click @logout
    @accountButton = $("#account-button")
    @accountButton.click @account
    @homeButton = $("#home-button")
    @homeButton.click @home
    
    @buttons = @$("#buttons")
    @selectNavButton @homeButton
    @buttons.fadeIn()

