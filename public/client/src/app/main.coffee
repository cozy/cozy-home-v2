window.app = {}
app.routers = {}
app.models = {}
app.collections = {}
app.views = {}

MainRouter = require('routers/main_router').MainRouter
HomeView = require('views/home_view').HomeView
MarketView = require('views/market').MarketView

# app bootstrapping on document ready
$(document).ready ->
  app.initialize = ->
    app.routers.main = new MainRouter()
    app.views.home = new HomeView()
    app.views.market = new MarketView()

    if Backbone.history.getFragment() is ''
      app.routers.main.navigate 'home', true

      
  app.initialize()
  Backbone.history.start()
