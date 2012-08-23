express = require 'express'
RedisStore = require('connect-redis')(express)
passport = require "passport"


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
    # TODO Generate a real secret key
    app.use express.cookieParser 'secret'
    app.use express.session secret: 'secret', store: new RedisStore(db:'cozy')
    app.use express.methodOverride()
    app.use passport.initialize()
    app.use passport.session()
    app.use app.router


