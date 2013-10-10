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

    # Don't why this one doesn't work with the Americano route file.
    ctrler = require('./server/controllers/applications').loadApplication
    app.param 'slug', ctrler

    setupRealtime app
    setupChecking()

    if process.env.NODE_ENV is "production"
        format = '[:date] :method :url :status :response-time ms'
        env = process.env.NODE_ENV
        fs.mkdirSync 'log' unless fs.existsSync './log'
        logFile = fs.createWriteStream "./log/production.log", flags: 'w'
        @app.use express.logger
            stream: logFile
            format: '[:date] :method :url :status :response-time ms'

        console.log = (text) ->
            logFile.write(text + '\n')

    callback app if callback?

