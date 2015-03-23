bcrypt = require 'bcrypt'
http = require 'http'
Client = require('request-json').JsonClient

helpers = {}

if process.env.USE_JS
    helpers.prefix = '../build/'
else
    helpers.prefix = '../'

# Bring models in context
Application = require "#{helpers.prefix}server/models/application"
Alarm = require "#{helpers.prefix}server/models/alarm"
Event = require "#{helpers.prefix}server/models/event"
CozyInstance = require "#{helpers.prefix}server/models/cozyinstance"
Notification = require "#{helpers.prefix}server/models/notification"
User = require "#{helpers.prefix}server/models/user"

process.env.NAME = "home"
process.env.TOKEN = "token"

initializeApplication = require "#{helpers.prefix}server"

# github mock
nock = require 'nock'
nockOptions = allowUnmocked: true
#nock.recorder.rec()
nock 'https://raw.github.com', nockOptions
    .persist()
    .get '/mycozycloud/my-app/master/package.json'
    .reply 200,
        name: 'my-app'
        'cozy-displayName': 'My App'
        'cozy-permissions':
            'contact': description: 'description'

nock 'https://raw.github.com', nockOptions
    .persist()
    .get '/mycozycloud/my-app2/mybranch/package.json'
    .reply 200,
        name: 'my-app'
        'cozy-displayName': 'My App'
        'cozy-permissions':
            'contact': description: 'description'


# init the compound application
# will create @app in context
# usage : before helpers.init port
_init = (ctx, port, done) ->
    process.env.PORT = port
    initializeApplication (app, server) ->
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
                        Event.destroyAll (err) ->
                            callback err

helpers.setup = (port) ->
    (done) ->
        @timeout 15000
        _init this, port, (err) =>
            return done err if err
            _clearDb done

helpers.takeDown = (done) ->
    @timeout 10000
    @app.server.close -> _clearDb done

helpers.wait = (ms) -> (done) ->
    @timeout ms + 1000
    setTimeout done, ms

# function factory for creating user
helpers.createUser = (email, password) -> (callback) ->
    salt = bcrypt.genSaltSync(10)
    hash = bcrypt.hashSync(password, salt)
    user =
        email: email
        owner: true
        password: hash
        activated: true
        docType: 'User'
    dbClient = new Client('http://localhost:9101/')
    dbClient.setBasicAuth "proxy", "token"
    dbClient.post '/user/', user, callback

# function factory for creating application
helpers.createApp = (name, slug, index, state) -> (callback) ->
    app = new Application
        name: name
        state: state
        index: index
        slug: slug
        password: slug
        permissions:
            Event: description: 'access the events'

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
