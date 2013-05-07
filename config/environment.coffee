module.exports = (compound) ->

    express = require 'express'
    fs = require 'fs'
    app = compound.app

    app.configure ->
        app.enable 'coffee'

        app.use express.static  "#{app.root}/client/public", maxAge: 86400000
        app.use express.bodyParser()
        app.use express.methodOverride()
        format = '
            \\n \\033[33;22m :date \\033[0m
            \\n \\033[37;1m :method \\033[0m \\033[30;1m :url \\033[0m
            \\n  >>> perform
            \\n  Send to client: :status
            \\n  <<<  [:response-time ms]'
        if process.env.NODE_ENV is "production"
            logFile = fs.createWriteStream './log/production.log', {flags: 'a'}
            app.use express.logger {stream: logFile, format: format}

        app.use app.router