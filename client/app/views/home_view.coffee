homeTemplate = require('../templates/home')
User = require("../models/user").User

AppRow = require('views/application').ApplicationRow
AppCollection = require('collections/application').ApplicationCollection


# View describing main screen for user once he is logged
class exports.HomeView extends Backbone.View
  id: 'home-view'


  ### Constructor ###

  constructor: ->
    super()

    @apps = new AppCollection()
    @apps.bind('reset', @fillApps)

 
  ### Listeners ###


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

  account: =>
    app.routers.main.navigate 'account', true


  # Load data from server
  fetchData: ->
    @apps.fetch()


  # Grabs categories from server then display them as a list.
  fillApps: =>
    @appList = $("#app-list")
    @appList.html null
    @apps.forEach (app) =>
      row = new AppRow app
      el = row.render()
      @appList.append el


  ### Configuration ###

  render: ->
    $(@el).html homeTemplate()
    @el

  setListeners: ->
    @appList = $("#app-list")

    if @logoutButton == undefined
        @logoutButton = $("#logout-button")
        @logoutButton.click @logout
    if @accountButton == undefined
        @accountButton = $("#account-button")
        @accountButton.click @account
    if @homeButton == undefined
        @homeButton = $("#home-button")
        @homeButton.click @home
    
    @buttons = $("#buttons")
    @buttons.show()

    @homeButton.hide()
    @accountButton.show()
    @logoutButton.show()

