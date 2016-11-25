MainRouter = require 'routers/main_router'
MainView = require 'views/main'
Instance = require 'models/instance'
colorSet = require '../helpers/color-set'

# Send client side errors to server
window.onerror = (msg, url, line, col, error) ->
    console.error msg, url, line, col, error, error?.stack
    exception = error?.toString() or msg
    if exception isnt window.lastError
        data =
            data:
                type: 'error'
                error:
                    msg: msg
                    name: error?.name
                    full: exception
                    stack: error?.stack
                url: url
                line: line
                col: col
                href: window.location.href
        xhr = new XMLHttpRequest()
        xhr.open 'POST', 'log', true
        xhr.setRequestHeader "Content-Type", "application/json;charset=UTF-8"
        xhr.send JSON.stringify(data)
        window.lastError = exception


# start application when DOM is ready (scripts execution is defered)
document.addEventListener 'DOMContentLoaded', ->
    try
        @mesinfosUseTracker = window.cozy_user.mesinfosUseTracker

        @instance = window.cozy_instance or {}
        @locale = @instance?.locale or 'en'

        defaultLocales = require 'locales/en'
        try
            locales = require 'locales/' + @locale
        catch err
            locales = defaultLocales

        window.app = @

        # Translation
        @polyglot = new Polyglot()
        @polyglot.extend locales
        @defaultPolyglot  = new Polyglot
            locale: 'en'
            phrases: defaultLocales
        window.t = (key, params = {}) =>
            params._ ?= @defaultPolyglot?.t(key, params)
            return @polyglot?.t(key, params)

        # Date parser and format library
        moment.locale(@locale)

        # Defines the application's color set once
        ColorHash.addScheme 'cozy', colorSet

        # Build main view and main router.
        @routers = {}
        @mainView =  new MainView()
        @routers.main = new MainRouter()
        Backbone.history.start()

        # Configure realtime (to show automatic update of applications).
        SocketListener = require 'lib/socket_listener'
        SocketListener.socket.on 'installerror', (err) ->
            console.log "An error occured while attempting to install app"
            console.log err

    # Send client side errors to server
    catch e
        console.error e, e?.stack
        exception = e.toString()
        if exception isnt window.lastError
            # Send client side errors to server
            data =
                data:
                    type: 'error'
                    error:
                        msg: e.message
                        name: e?.name
                        full: exception
                        stack: e?.stack
                    file: e?.fileName
                    line: e?.lineNumber
                    col: e?.columnNumber
                    href: window.location.href
            xhr = new XMLHttpRequest()
            xhr.open 'POST', 'log', true
            xhr.setRequestHeader "Content-Type",
                "application/json;charset=UTF-8"
            xhr.send JSON.stringify(data)
            window.lastError = exception
