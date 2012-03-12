express = require 'express'


##
# Authentication configuration
# TODO find a right place to put this code

passport = require 'passport'
LocalStrategy = require('passport-local').Strategy

passport.serializeUser = (user, done) ->
    done null, user.email
  
passport.deserializeUser = (email, done) ->
    User.find 1, (err, user) ->
        done err, user

passport.use new LocalStrategy (email, password, done) ->
    User.find 1, (err, user) ->
        user = null if user is undefined or not user
        user = null if user and user.password != password
        done(err, user)


##
# Common configuration

app.configure ->
    cwd = process.cwd()
    
    app.set 'views', cwd + '/app/views'
    app.set 'view engine', 'jade'
    app.set 'view options', complexNames: true
    app.enable 'coffee'

    app.use express.static cwd + '/public', maxAge: 86400000
    app.use express.bodyParser()
    app.use express.cookieParser 'secret'
    app.use express.session secret: 'secret'
    app.use express.methodOverride()
    app.use passport.initialize()
    app.use passport.session()
    app.use app.router

