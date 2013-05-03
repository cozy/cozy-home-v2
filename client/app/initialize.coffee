{BrunchApplication} = require './helpers'

MainRouter = require 'routers/main_router'
MainView = require 'views/main'


class exports.Application extends BrunchApplication
    # This callback would be executed on document ready event.
    # If you have a big application, perhaps it's a good idea to
    # group things by their type e.g. `@views = {}; @views.home = new HomeView`.
    initialize: ->
        @initializeJQueryExtensions()

        @routers = {}
        @mainView =  new MainView()
        @routers.main = new MainRouter()

        # render layout
        #$("body").html @mainView.el

        window.app = @
        Backbone.history.start()
        if Backbone.history.getFragment() is ''
            @routers.main.navigate 'home', true

new exports.Application
