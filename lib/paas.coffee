haibu = require('haibu-api')
fs = require 'fs'
HttpClient = require("request-json").JsonClient
MemoryManager = require("./memory").MemoryManager
controllerUrl = "http://localhost:9002/"
controllerClient = new HttpClient controllerUrl


# Class to facilitate communications with Haibu, the application server
# and the cozy proxy to manage application installation.
class exports.AppManager

    # helpers
    status2XX = (res) ->
        return false unless res
        res.statusCode / 100 is 2

    # Setup controller client and proxyClient.
    constructor: ->
        @proxyClient = new HttpClient "http://localhost:9104/"
        @controllerClient = new HttpClient "http://localhost:9002/"
        @memoryManager = new MemoryManager()
        @client = {}

        getAuthController = (callback) ->
            if process.env.NODE_ENV is 'production'
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

        # Send a uninstall request to controller server ("clean" request).
        @client.uninstallApp = (manifest, callback) ->
            data = manifest
            getAuthController (err, token) =>
                controllerClient.setToken token
                controllerClient.post "drones/#{manifest.name}/clean", data, callback

        # Send a stop request to controller server
        @client.stopApp = (manifest, callback) ->
            data = stop: manifest
            getAuthController (err, token) =>
                controllerClient.setToken token
                controllerClient.post "drones/#{manifest.name}/stop", data, callback

        @client.lightUpdate = (manifest, callback) ->
            data = update: manifest
            getAuthController (err, token) =>
                controllerClient.setToken token
                controllerClient.post "drones/#{manifest.name}/light-update", data, callback

        @client.updateApp = (manifest, callback) ->
            data = update: manifest
            getAuthController (err, token) =>
                controllerClient.setToken token
                controllerClient.post "drones/#{manifest.name}/update", data, callback

    checkMemory: (callback) ->
        @memoryManager.isEnoughMemory (err, enoughMemory) =>
            err ?= new Error 'Not enough Memory' unless enoughMemory
            callback.call @, err


    # Ask to proxy to rebuild his routes.
    # Because route commands are public, we can't allow that someone add or
    # remove routes.
    resetProxy: (callback) ->
        console.info "Request for proxy reseting..."
        @proxyClient.get "routes/reset", (err, res, body) ->

            unless status2XX res
                err ?= new Error "Something went wrong on proxy side when \
reseting routes"

            if err
                console.log "Error reseting routes"
                console.log err.message
                console.log err.stack
                callback err
            else
                console.info "Proxy successfully reseted."
                callback null


    # 1. Send a install request to controller server ("start" request).
    # 2. Send a request to proxy to add a new route
    installApp: (app, callback) ->
        manifest = app.getHaibuDescriptor()
        console.info "Request controller for spawning #{app.name}..."
        console.info "with manifest : "
        console.info JSON.stringify manifest

        @checkMemory (err) ->
            return callback err if err

            @client.startApp manifest, (err, res, body) =>

                err ?= new Error body.error.message unless status2XX res

                if err
                    console.log "Error spawning app: #{app.name}"
                    callback err
                else
                    console.info "Successfully spawned app: #{app.name}"
                    callback null, body

    # Remove and reinstall app inside Haibu.
    updateApp: (app, callback) ->
        manifest = app.getHaibuDescriptor()
        console.info "Request controller for updating #{app.name}..."

        @client.lightUpdate manifest, (err, res, body) ->

            err ?= new Error body.error.message unless status2XX res

            if err
                console.log "Error updating app: #{app.name}"
                console.log err.stack
                callback err
            else
                console.info "Successfully updated app: #{app.name}"
                callback null, body

    # Send a uninstall request to controller server ("clean" request).
    uninstallApp: (app, callback) ->
        manifest = app.getHaibuDescriptor()
        console.info "Request controller for cleaning #{app.name}..."

        @client.uninstallApp manifest, (err, res, body) =>

            err ?= new Error body.error.message unless status2XX res

            if err
                console.log "Error cleaning app: #{app.name}"
                console.log err.message
                console.log err.stack
                callback err
            else
                console.info "Successfully cleaning app: #{app.name}"
                callback null

    # Send a start request to controller server
    start: (app, callback) ->
        manifest = app.getHaibuDescriptor()
        console.info "Request controller for starting #{app.name}..."

        @client.stopApp manifest, (err, res, body) =>
            # ignore stop errors

            @checkMemory (err) ->

                return callback err if err

                @client.startApp manifest, (err, res, body) =>

                    err ?= new Error body.error.message unless status2XX res

                    if err
                        console.log "Error starting app: #{app.name}"
                        console.log err.message
                        console.log err.stack
                        callback err
                    else
                        console.info "Successfully starting app: #{app.name}"
                        callback null, res.body

    # Send a stop request to controller server
    stop: (app, callback) ->
        manifest = app.getHaibuDescriptor()
        console.info "Request controller for stopping #{app.name}..."

        @client.stopApp manifest, (err,res, body) =>

            err ?= new Error body.error.message unless status2XX res

            if err
                console.log "Error stopping app: #{app.name}"
                console.log err.message
                console.log err.stack
                callback err
            else
                console.info "Successfully stopping app: #{app.name}"
                callback null
