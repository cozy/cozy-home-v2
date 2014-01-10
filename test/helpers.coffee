bcrypt = require('bcrypt')
http = require('http')
Client = require('request-json').JsonClient
americano = require 'americano'

# Bring models in context
Application = require '../server/models/application'
Alarm = require '../server/models/alarm'
CozyInstance = require '../server/models/cozyinstance'
Notification = require '../server/models/notification'
User = require '../server/models/user'
time = require 'time'

process.env.NAME = "home"
process.env.TOKEN = "token"

helpers = {}

# init the compound application
# will create @app in context
# usage : before helpers.init port
_init = (ctx, port, done) ->
    params = name: 'Cozy Home', port: port
    americano.start params, (app, server) =>
        app.server = server
        ctx.app = app
        done()

# This function remove everythin from the db
_clearDb = (callback) ->
    User.destroyAll (err) ->
        return callback err if err
        Application.destroyAll (err) ->
            return callback err if err
            CozyInstance.destroyAll (err) ->
                return callback err if err
                Notification.destroyAll (err) ->
                    return callback err if err
                    Alarm.destroyAll (err) ->
                        callback err

helpers.setup = (port) ->
    (done) ->
        @timeout 5000
        _init this, port, (err) =>
            return done err if err
            _clearDb done

helpers.takeDown = (done) ->
    @app.server.close()
    _clearDb done

helpers.wait = (ms) -> (done) ->
    @timeout ms + 1000
    setTimeout done, ms

# function factory for creating user
helpers.createUser = (email, password) -> (callback) ->
    salt = bcrypt.genSaltSync(10)
    hash = bcrypt.hashSync(password, salt)
    user = new User
        email: email
        owner: true
        password: hash
        activated: true

    user.save callback

# function factory for creating application
helpers.createApp = (name, slug, index, state) -> (callback) ->
    app = new Application
        name: name
        state: state
        index: index
        slug: slug

    app.save callback

helpers.fakeServer = (json, code=200) ->

    lastCall = {}

    server = http.createServer (req, res) ->
        body = ""
        req.on 'data', (chunk) ->
            body += chunk
        req.on 'end', ->
            res.writeHead code, 'Content-Type': 'application/json'
            res.end(JSON.stringify json)
            data = JSON.parse body if body? and body.length > 0
            lastCall = request:req, body:data

    server.lastCall = -> lastCall
    server.reset = -> lastCall = {}
    return server


helpers.getClient = (port, context) ->
    old = new Client "http://localhost:#{port}/"
    old.setBasicAuth "proxy", "token"

    store = if context? then context else {}

    callbackFactory = (done) -> (error, response, body) =>
        #throw error if error? and not body
        store.response = response
        store.body = body
        done()

    clean = ->
        store.response = null
        store.body = null

    return (
        get: (url, done) ->
            clean()
            old.get url, callbackFactory(done)
        post: (url, data, done) ->
            clean()
            old.post url, data, callbackFactory(done)
        put: (url, data, done) ->
            clean()
            old.put url, data, callbackFactory(done)
        del: (url, done) ->
            clean()
            old.del url, callbackFactory(done)
        last: store
        clean: clean
        )

module.exports = helpers
