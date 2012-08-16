homeTemplate = require('../templates/home')
User = require("../models/user").User

AppRow = require('views/application').ApplicationRow
AppCollection = require('collections/application').ApplicationCollection
Application = require("models/application").Application


# View describing main screen for user once he is logged
class exports.HomeView extends Backbone.View
  id: 'home-view'


  ### Constructor ###

  constructor: ->
    super()

    @apps = new AppCollection @

 
  ### Listeners ###

  onAddClicked: =>
    @addApplicationForm.toggle()

  onInstallClicked: =>
    data =
      name: @$("#app-name-field").val()
      description: @$("#app-description-field").val()
      git: @$("#app-git-field").val()

    if @checkData data
        @errorAlert.hide()

        app = new Application data
        app.install
            success: =>
                @apps.add app
                @displayInfo "Application successfully installed"
            error: (data) =>
                @displayError data.msg
    else
        @displayError "All fields are required"

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

  # Clear current application list.
  clearApps: =>
      @appList.html null

  # Add an application row to the app list.
  addAppRow: (app) =>
      row = new AppRow app
      el = row.render()
      @appList.append el

  # Check that given data are corrects.
  checkData: (data) =>
    rightData = true
    for property of data
      rightData = data[property]? and data[property].length > 0
      break if not rightData
    rightData

  # Display message inside info box.
  displayInfo: (msg) =>
    @errorAlert.hide()
    @infoAlert.html msg
    @infoAlert.show()

  # Display message inside error box.
  displayError: (msg) =>
    @infoAlert.hide()
    @errorAlert.html msg
    @errorAlert.show()

  fetchData: ->
    @apps.fetch()


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

    @addApplicationButton = @$("#add-app-button")
    @addApplicationButton.click @onAddClicked
    @addApplicationForm = @$("#add-app-form")
    @addApplicationForm.hide()
    @installAppButton = @$("#add-app-submit")
    @installAppButton.click @onInstallClicked
    @infoAlert = @$("#add-app-form .info")
    @errorAlert = @$("#add-app-form .error")

    @appNameField = @$("#app-name-field")
    @appDescriptionField = @$("#app-description-field")
    @appGitField = @$("#app-git-field")
