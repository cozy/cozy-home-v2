homeTemplate = require('../templates/home')

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
    $.ajax
        type: 'GET'
        url: "logout/"
        success: (data) =>
            if data.success
                app.routers.main.navigate 'login', true
            else
                alert "Server error occured, logout failed."
        error: =>
           alert "Server error occured, logout failed."


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
    @logoutButton = $("#logout-button")

    @logoutButton.show()
    @logoutButton.click @logout

