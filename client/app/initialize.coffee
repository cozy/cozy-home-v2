MainRouter = require 'routers/main_router'
MainView = require 'views/main'
colorSet = require '../helpers/color-set'

class exports.Application

    constructor: ->
        # initialize on DOMReady
        $ @initialize

    initialize: =>

        @instance = window.cozy_instance
        @locale = @instance?.locale or 'en'

        try
            locales = require 'locales/' + @locale
        catch err
            locales = require 'locales/en'

        window.app = @

        @polyglot = new Polyglot()
        @polyglot.extend locales
        window.t = @polyglot.t.bind @polyglot

        # Defines the application's color set once
        ColorHash.addScheme 'cozy', colorSet

        @routers = {}
        @mainView =  new MainView()
        @routers.main = new MainRouter()

        Backbone.history.start()
        if Backbone.history.getFragment() is ''
            @routers.main.navigate 'home', true


        SocketListener = require 'lib/socket_listener'
        SocketListener.socket.on 'installerror', (err) ->
            console.log "An error occured while attempting to install app"
            console.log err


new exports.Application
