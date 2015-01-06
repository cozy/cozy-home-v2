{BrunchApplication} = require './helpers'

MainRouter = require 'routers/main_router'
MainView = require 'views/main'
colorSet = require '../helpers/color-set'

class exports.Application extends BrunchApplication
    # This callback would be executed on document ready event.
    # If you have a big application, perhaps it's a good idea to
    # group things by their type e.g. `@views = {}; @views.home = new HomeView`.
    initialize: ->
        @initializeJQueryExtensions()

        $.ajax('/api/instances/')
        .done (instances) =>
            @instance = instances?.rows?[0]
            @locale = @instance?.locale or 'en'
            @initialize2()
        .fail =>
            @locale = 'en'
            @initialize2()

    initialize2: ->
        try
            locales = require 'locales/' + @locale
        catch err
            locales = require 'locales/en'

        window.app = @

        @polyglot = new Polyglot()
        @polyglot.extend locales
        window.t = @polyglot.t.bind @polyglot

        @routers = {}
        @mainView =  new MainView()
        @routers.main = new MainRouter()

        # Defines the application's color set once
        ColorHash.addScheme 'cozy', colorSet

        Backbone.history.start()
        if Backbone.history.getFragment() is ''
            @routers.main.navigate 'home', true

        url = window.location.origin
        pathToSocketIO = "#{window.location.pathname.substring(1)}socket.io"
        socket = io.connect url, resource: pathToSocketIO
        socket.on 'installerror', (err) ->
            console.log "An error occured while attempting to install app"
            console.log err

new exports.Application
