{BrunchApplication} = require 'helpers'

MainRouter = require('routers/main_router').MainRouter
HomeView = require('views/home_view').HomeView
AccountView = require('views/account_view').AccountView
ApplicationsView = require('views/applications_view').ApplicationsView


class exports.Application extends BrunchApplication
  # This callback would be executed on document ready event.
  # If you have a big application, perhaps it's a good idea to
  # group things by their type e.g. `@views = {}; @views.home = new HomeView`.
  initialize: ->
    @initializeJQueryExtensions()

    @routers = {}
    @views = {}

    @routers.main = new MainRouter()
    @views.home = new HomeView()
    @views.account = new AccountView()
    @views.applications = new ApplicationsView()
    
    
    # render layout
    $("body").html @views.home.render()
    @views.home.setListeners()
    @views.home.fetch()

    window.app = @
    Backbone.history.start()
    if Backbone.history.getFragment() is ''
        window.app.routers.main.navigate 'home', true

new exports.Application
