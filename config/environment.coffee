express = require 'express'
RedisStore = require('connect-redis')(express)


##
# Authentication configuration
# TODO find a right place to put this code

passport = require 'passport'
bcrypt = require 'bcrypt'

LocalStrategy = require('passport-local').Strategy

passport.serializeUser = (user, done) ->
    done null, user.email
  
passport.deserializeUser = (email, done) ->
    User.all (err, users) ->
        if users.length > 0
            done err, users[0]
        else
            done err, null

passport.use new LocalStrategy (email, password, done) ->
    User.all (err, users) ->
        checkResult = (err, res) ->
            if err
                console.log "bcrypt checking failed"
                done err, null
            else if res
                done err, users[0]
            else
                console.log "wrong password"
                done err, null

        if err
            console.log err
            done err, null
        else if users is undefined or not users
            done err, null
        else if users and users.length == 0
            done err, null
        else
            bcrypt.compare password, users[0].password, checkResult


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


