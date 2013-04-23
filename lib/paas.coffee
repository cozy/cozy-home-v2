haibu = require('haibu-api')
fs = require 'fs'
compound = require 'compound'
HttpClient = require("request-json").JsonClient
MemoryManager = require("./memory").MemoryManager
haibuUrl = "http://localhost:9002/"
controllerClient = new HttpClient haibuUrl


# Class to facilitate communications with Haibu, the application server
# and the cozy proxy to manage application installation.
class exports.AppManager

    # Setup haibu client and proxyClient.
    constructor: ->
        @proxyClient = new HttpClient "http://localhost:9104/"
        @controllerClient = new HttpClient "http://localhost:9002/"
        @memoryManager = new MemoryManager()
        @client = haibu.createClient(
            host: '127.0.0.1'
            port: 9002
        ).drone

        getAuthController = (callback) ->
            if process.env.ENV_VARIABLE == 'production' 
                fs.readFile '/etc/cozy/controller.token', 'utf8', (err, data) =>
                    if err isnt null
                        console.log "Cannot read token"
                        callback err
                    else
                        token = data.split('\n')[0]
                        callback null, token
            else
                callback null, ""

        @client.brunch = (manifest, callback) =>
            data = brunch: manifest
            getAuthController (err, token) =>
                controllerClient.setToken token
                controllerClient.post "drones/#{manifest.name}/brunch", data, callback

        @client.startApp = (manifest, callback) ->
            data = start: manifest
            getAuthController (err, token) =>
                controllerClient.setToken token
                controllerClient.post "drones/#{manifest.name}/start", data, callback

        # Send a uninstall request to haibu server ("clean" request).
        @client.uninstallApp = (manifest, callback) ->
            data = manifest
            getAuthController (err, token) =>
                controllerClient.setToken token
                controllerClient.post "drones/#{manifest.name}/clean", data, callback

        # Send a stop request to haibu server
        @client.stopApp = (manifest, callback) ->
            data = stop: manifest
            getAuthController (err, token) =>
                controllerClient.setToken token
                controllerClient.post "drones/#{manifest.name}/stop", data, callback

    # Ask to proxy to rebuild his routes.
    # Because route commands are public, we can't allow that someone add or
    # remove routes.
    resetProxy: (callback) ->
        console.info "Request for proxy reseting..."
        @proxyClient.get "routes/reset", (error, response, body) ->
            if error
                console.log error.message
                callback error
            else if response.statusCode != 200
                callback new Error "Something went wrong on proxy side when \
reseting routes"
            else
                console.info "Proxy successfully reseted."
                callback null


    # 1. Send a install request to haibu server ("start" request).
    # 2. Send a request to proxy to add a new route
    installApp: (app, callback) ->
        console.info "Request haibu for spawning #{app.name}..."
        console.info "haibu descriptor : "
        console.info JSON.stringify(app.getHaibuDescriptor())

        @memoryManager.isEnoughMemory (err, enoughMemory) =>
            err ?= new Error 'Not enough Memory' unless enoughMemory
            if err
                callback err
            else
                @client.startApp app.getHaibuDescriptor(), (err, res, body) =>
                    if err or res.statusCode isnt 200
                        console.log "Error spawning app: #{app.name}"
                        if err
                            console.log err.message
                            console.log err.stack
                            callback err
                        else
                            console.log res.body
                            callback(res.body)
                    else
                        @client.brunch app.getHaibuDescriptor(), (err, result) =>
                            console.info "Successfully spawned app: #{app.name}"
                            console.info "Update proxy..."
                            callback null, body

    # Remove and reinstall app inside Haibu.
    updateApp: (app, callback) ->
        console.info "Request haibu for updating #{app.name}..."

        console.info "Step 1: remove #{app.name}..."
        @client.uninstallApp app.getHaibuDescriptor(), (err, res, body) =>
            if err or res.statusCode isnt 200
                console.log "Error cleaning app: #{app.name}"
                if err
                    console.log err.message
                    console.log err.stack
                    callback(err)
                else
                    console.log res.body
                    callback(res.body)
            else
                console.info "Step 2: re install #{app.name}..."
                @memoryManager.isEnoughMemory (err, enoughMemory) =>
                    err ?= new Error 'Not enough Memory' unless enoughMemory
                    if err
                        console.log "Error spawning app: #{app.name}"
                        console.log err.message
                        callback err
                    else
                        @client.startApp app.getHaibuDescriptor(), (err, res, body) =>
                            if err or res.statusCode isnt 200
                                console.log "Error spawning app: #{app.name}"
                                if err
                                    console.log err.message
                                    console.log err.stack
                                    callback err
                            else
                                @client.brunch app.getHaibuDescriptor(), (err, result) =>
                                    console.info "Successfully update app: #{app.name}"
                                    callback null, body


    # Send a uninstall request to haibu server ("clean" request).
    uninstallApp: (app, callback) ->

        console.info "Request haibu for cleaning #{app.name}..."
        @client.uninstallApp app.getHaibuDescriptor(), (err, res, body) =>
            if err or res.statusCode isnt 200
                console.log "Error cleaning app: #{app.name}"
                if err
                    console.log err.message
                    console.log err.stack
                    callback(err)
                else
                    console.log res.body
                    callback(res.body)
            else
                console.info "Successfully cleaning app: #{app.name}"
                callback null

    # Send a start request to haibu server
    start: (app, callback) ->

        @memoryManager.isEnoughMemory (err, enoughMemory) =>
            err ?= new Error 'Not enough Memory' unless enoughMemory
            if err
                console.log "Error spawning app: #{app.name}"
                console.log err.message
                callback err
            else
                @client.startApp app.getHaibuDescriptor(), (err, res, body) =>
                    if err or res.statusCode isnt 200
                        console.log "Error starting app: #{app.name}"
                        if err
                            console.log err.message
                            console.log err.stack
                            callback(err)
                        else
                            console.log res.body
                            callback(res.body)
                    else
                        console.info "Successfully starting app: #{app.name}"
                        callback null, res.body

    # Send a stop request to haibu server
    stop: (app, callback) ->

        @client.stopApp app.getHaibuDescriptor(), (err,res, body) =>
            if err or res.statusCode isnt 200
                console.log "Error stopping app: #{app.name}"
                if err
                    console.log err.message
                    console.log err.stack
                    callback(err)
                else
                    console.log res.body
                    callback(res.body)
            else
                console.info "Successfully stoppingg app: #{app.name}"
                callback null
