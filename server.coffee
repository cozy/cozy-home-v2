process.on 'uncaughtException', (err) ->
    console.error err
    console.error err.stack

application = module.exports = (callback) ->
    americano = require 'americano'
    request = require 'request-json'
    initProxy = require './server/initializers/proxy'
    setupRealtime = require './server/initializers/realtime'
    setupChecking = require './server/initializers/checking'
    versionChecking = require './server/initializers/updates'

    options =
        name: 'Cozy Home'
        port: process.env.PORT or 9103
        host: process.env.HOST or "127.0.0.1"
        root: __dirname

    americano.start options, (app, server) ->
        app.server = server

        if process.env.NODE_ENV isnt "test"
            initProxy()

        setupRealtime app, ->
            setupChecking()
            versionChecking()
            callback app, server if callback?

if not module.parent
    application()

