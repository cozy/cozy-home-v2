express = require 'express'


##
# Common configuration

app.configure ->
    cwd = process.cwd()
    
    app.set 'views', cwd + '/app/views'
    app.set 'view engine', 'jade'
    app.set 'view options', complexNames: true
    app.enable 'coffee'

    app.use express.static cwd + '/client/public', maxAge: 86400000
    app.use express.bodyParser()
    app.use express.methodOverride()
    app.use app.router


