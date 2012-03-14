express = require 'express'


##
# Authentication configuration
# TODO find a right place to put this code

passport = require 'passport'
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
        if err
            console.log err
            done(err, null)
        else if users is undefined or not users
            done(err, null)
        else if users and users.length == 0
            done(err, null)
        else if users[0].password != password
            console.log "wrong password"
            done(err, null)
        else
            done(err, users[0])



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


#httpProxy = require('http-proxy')
#proxy = new httpProxy.RoutingProxy()

#doProxy(req, res, next)
#    proxy.proxyRequest(req, res,
#        host: 'localhost'
#        port: 3000



#   target:
#       host: '127.0.0.1'
#       port: '4567'

#app.all "/noty-plus", (req, res) ->
#    proxy.proxyRequest(req, res)


