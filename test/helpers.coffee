Client = require('request-json').JsonClient
bcrypt = require('bcrypt')
http = require('http')

# Bring models in context
Application = null
CozyInstance = null
Notification = null
User = null

process.env.NAME = "home"
process.env.TOKEN = "token"

helpers = {}

# init the compound application
# will create @app in context
# usage : before helpers.init require '../server'
helpers.init = (instantiator) -> (done) ->
    this.timeout 5000
    @app = instantiator()
    @app.compound.on 'models', (models) ->
        {Application, CozyInstance, User, Notification} = models

        setTimeout () ->
            done()
        , 3000 #wait 3s for defineRequests

# This function remove everythin from the db
helpers.clearDb = (callback) ->
    this.timeout 5000
    User.destroyAll (err) ->
        return callback err if err
        Application.destroyAll (err) ->
            return callback err if err
            CozyInstance.destroyAll (err) ->
                return callback err if err
                Notification.destroyAll (err) ->
                    callback err

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
