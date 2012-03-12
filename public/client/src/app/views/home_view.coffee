homeTemplate = require('../templates/home')

AppRow = require('views/application').ApplicationRow
AppCollection = require('collections/application').ApplicationCollection


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
        url: "/logout/"
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
 

  render: ->
    $(@el).html homeTemplate()
    @appList = $("#app-list")
    @logoutButton = $("#logout-button")
    @logoutButton.show()

    @el

  setListeners: ->
    @logoutButton.click @logout

