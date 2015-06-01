MainRouter = require 'routers/main_router'
MainView = require 'views/main'
Instance = require 'models/instance'
colorSet = require '../helpers/color-set'

class exports.Application

    constructor: ->
        # initialize on DOMReady
        $ @initialize

    initialize: =>

        @instance = window.cozy_instance or {}
        @locale = @instance?.locale or 'en'

        try
            locales = require 'locales/' + @locale
        catch err
            locales = require 'locales/en'

        window.app = @

        # Translation
        @polyglot = new Polyglot()
        @polyglot.extend locales
        window.t = @polyglot.t.bind @polyglot

        # Date parser and format library
        moment.locale(@locale)

        # Defines the application's color set once
        ColorHash.addScheme 'cozy', colorSet

        # Build main view and main router.
        @routers = {}
        @mainView =  new MainView()
        @routers.main = new MainRouter()
        Backbone.history.start()

        # Display wizard only if user was never connected. If the wizard is
        # displayed, a flag connected once is set at the instance level.
        if not window.cozy_instance.connectedOnce
            @routers.main.navigate 'home/quicktour', true
            data = connectedOnce: true
            instance = new Instance window.cozy_instance
            instance.saveData data, (err) ->
                console.log 'connectedOnce saved'
                console.log err

        # Else go to the home page if no hash is given in the URL.
        else if Backbone.history.getFragment() is ''
            @routers.main.navigate 'home', true

        # Configure realtime (to show automatic update of applications).
        SocketListener = require 'lib/socket_listener'
        SocketListener.socket.on 'installerror', (err) ->
            console.log "An error occured while attempting to install app"
            console.log err


new exports.Application
