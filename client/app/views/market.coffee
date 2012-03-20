homeTemplate = require('../templates/market')

AppRow = require('views/application').ApplicationRow
AppCollection = require('collections/application').ApplicationCollection


class exports.MarketView extends Backbone.View
  id: 'market-view'


  ### Constructor ###

  constructor: ->
    super()

    @apps = new AppCollection()
    @apps.bind('reset', @fillApps)
 

  ### Listeners ###


  ### Functions ###

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

    @el

