class exports.MainRouter extends Backbone.Router
  routes :
    "home": "home"
    "market": "market"

  ## Route behaviors

  home: ->
    @loadView(app.views.home)

  market: ->
    @loadView(app.views.market)


  ## functions

  # Fill main content with given view data.
  loadView: (view) ->
    $('#content').html view.render()
    view.fetchData()

