fs = require 'fs'
async = require 'async'
HttpClient = require("request-json").JsonClient
{ControllerClient} = require 'cozy-clients'
{MemoryManager} = require './memory'


# Class to facilitate communications with Haibu, the application server
# and the cozy proxy to manage application installation.
class AppManager

    # helpers
    status2XX = (res) ->
        return false unless res
        res.statusCode / 100 is 2

    # Setup controller client and proxyClient.
    constructor: ->
        @proxyClient = new HttpClient "http://localhost:9104/"
        @client = new ControllerClient
            token: @getAuthController()
        @memoryManager = new MemoryManager()

        # Process blocking actions one by one
        # Blocking actions are: install, update, unsinstall
        @queue = async.queue @processBlockingActions.bind(@), 1

    processBlockingActions: (action, done) ->
        {method, app, callback} = action
        processor = @[method]

        # handles developer input error
        if processor?
            # executes the actual function
            processor.call @, app, (err, result) ->
                # first, call user callback
                callback.call null, err, result

                # then, mark this action as over
                done()
        else
            msg = "Cannot process action. Method '#{method}' doesn't exist"
            console.log msg
            callback.call null, msg
            done()

    # Get token from token file if in production mode.
    getAuthController: ->
        if process.env.NODE_ENV is 'production'
            try
                token = process.env.TOKEN
                return token
            catch err
                console.log err.message
                console.log err.stack
                return null
        else
            return ""

    checkMemory: (callback) ->
        @memoryManager.isEnoughMemory (err, enoughMemory) =>
            err ?= 'Not enough Memory' unless enoughMemory
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
        method = 'processInstall'
        @queue.push {method, app, callback}

    processInstall: (app, callback) ->
        manifest = app.getHaibuDescriptor()
        console.info "Request controller for spawning #{app.name}..."
        console.info "with manifest : "
        console.info JSON.stringify manifest

        @checkMemory (err) =>
            return callback err if err

            @client.start manifest, (err, res, body) ->
                err ?= body.error unless status2XX res

                if err
                    console.log "Error spawning app: #{app.name}"
                    callback err
                else
                    console.info "Successfully spawned app: #{app.name}"
                    callback null, body


    # Remove and reinstall app inside Haibu.
    updateApp: (app, callback) ->
        method = 'processUpdate'
        @queue.push {method, app, callback}


    processUpdate: (app, callback) ->
        manifest = app.getHaibuDescriptor()

        console.info "Request controller for updating #{app.name}..."
        @checkMemory (err) =>
            return callback err if err

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
        method = 'processUninstall'
        @queue.push {method, app, callback}


    processUninstall: (app, callback) ->
        if app?
            manifest = app.getHaibuDescriptor()
            console.info "Request controller for cleaning #{app.name}..."

            @client.clean manifest, (err, res, body) =>
                err ?= body.error unless status2XX res
                errMsg = 'application not installed'
                if err? and err.indexOf? and err.indexOf(errMsg) is -1
                    err = new Error err
                    console.log "Error cleaning app: #{app.name}"
                    console.log err.message
                    console.log err.stack
                    callback err
                else
                    if err
                        console.log "[Warning] #{err}"
                    console.info "Successfully cleaning app: #{app.name}"
                    callback null
        else
            callback null


    # Send a start request to controller server
    start: (app, callback) ->
        manifest = app.getHaibuDescriptor()
        console.info "Request controller for starting #{app.name}..."

        @client.stop app.slug, (err, res, body) =>
            @checkMemory (err) ->
                return callback err if err

                @client.start manifest, (err, res, body) =>
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

        @client.stop app.slug, (err,res, body) =>
            err ?= body.error unless status2XX res
            if err and err.indexOf('application not started') is -1
                err = new Error err
                console.log "Error stopping app: #{app.name}"
                console.log err.message
                console.log err.stack
                callback err
            else
                if err
                    console.log "[Warning] #{err}"
                console.info "Successfully stopping app: #{app.name}"
                callback null

    # Remove and reinstall app inside Haibu.
    updateStack: (callback) ->
        console.info "Request controller for updating stack..."
        @client.updateStack (err, res, body) ->
            err ?= new Error body.error.message unless status2XX res
            if err
                console.log "Error updating stack"
                console.log err.stack
                callback err
            else
                console.info "Successfully updated stack"
                callback null, body

    # Remove and reinstall app inside Haibu.
    restartController: (callback) ->
        console.info "Request controller for restarting stack..."
        @client.restartController (err, res, body) ->
            err ?= new Error body.error.message unless status2XX res
            if err
                console.log "Error reboot stack"
                console.log err.stack
                callback err
            else
                console.info "Successfully reboot stack"
                callback null, body

# Exports the class itself to ease testing
module.exports.AppManager = AppManager

# `get` returns a singleton instance to allow use across HTTP requests
singleton = new AppManager()
module.exports.get = -> return singleton
