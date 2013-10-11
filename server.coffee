americano = require 'americano'
request = require 'request-json'
initProxy = require './server/initializers/proxy'
setupRealtime = require './server/initializers/realtime'
setupChecking = require './server/initializers/checking'


process.on 'uncaughtException', (err) ->
    console.error err
    console.error err.stack

port = process.env.PORT || 9103
americano.start name: 'Cozy Home', port: port, (app, server) ->
    app.server = server

    if process.env.NODE_ENV isnt "test"
        initProxy()

    setupRealtime app
    setupChecking()

    callback app if callback?

