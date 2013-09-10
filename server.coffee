americano = require 'americano'
request = require 'request-json'
initProxy = require './server/initializers/proxy'
setupRealtime = require './server/initializers/realtime'


process.on 'uncaughtException', (err) ->
    console.error err
    console.error err.stack


port = process.env.PORT || 9103
americano.start name: 'Cozy Home', port: port, (app, server) ->

    if process.env.NODE_ENV isnt "test"
        initProxy()

    # Don't why this one doesn't work with the Americano route file.
    app.param 'slug', require('./server/controllers/applications').loadApplication

    app.server = server
    setupRealtime app

