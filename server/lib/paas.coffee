fs = require 'fs'
async = require 'async'
HttpClient = require("request-json").JsonClient
{ControllerClient} = require 'cozy-clients'
{MemoryManager} = require './memory'
log = require('printit')
    prefix: 'Paas'


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
            log.info msg
            callback.call null, msg
            done()

    # Get token from token file if in production mode.
    getAuthController: ->
        if process.env.NODE_ENV in ['production', 'test']
            try
                token = process.env.TOKEN
                return token
            catch err
                log.error err
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
        log.info "Request for proxy reseting..."
        @proxyClient.get "routes/reset", (err, res, body) ->
            unless status2XX res
                err ?= new Error "Something went wrong on proxy side when \
reseting routes"
            if err
                log.error "Error reseting routes"
                log.error err
                callback err
            else
                log.info "Proxy successfully reset."
                callback null

    # 1. Send a install request to controller server ("start" request).
    # 2. Send a request to proxy to add a new route
    installApp: (app, callback) ->
        method = 'processInstall'
        @queue.push {method, app, callback}

    processInstall: (app, callback) ->
        manifest = app.getHaibuDescriptor()
        log.info "Request controller for spawning #{app.name}..."

        @checkMemory (err) =>
            return callback err if err

            @client.start manifest, (err, res, body) ->
                err ?= body unless status2XX res

                if err
                    log.error "Error spawning app: #{app.name}"
                    callback err
                else
                    log.info "Successfully spawned app: #{app.name}"
                    callback null, body


    # Update app inside Controller.
    updateApp: (app, callback) ->
        method = 'processUpdate'
        @queue.push {method, app, callback}


    processUpdate: (app, callback) ->
        manifest = app.getHaibuDescriptor()

        log.info "Request controller for updating #{app.name}..."
        @checkMemory (err) =>
            return callback err if err

            @client.lightUpdate manifest, (err, res, body) ->
                err ?= new Error body.error.message unless status2XX res

                if err
                    log.error "Error updating app: #{app.name}"
                    log.error err
                    callback err
                else
                    log.info "Successfully updated app: #{app.name}"
                    callback null, body

    # Change application branch inside Controller.
    changeBranch: (app, branch, callback) ->
        method = 'processChangeBranch'
        app = [app, branch]
        @queue.push {method, app, callback}


    processChangeBranch: (params, callback) ->
        [app, branch] = params
        manifest = app.getHaibuDescriptor()

        log.info "Request controller for change #{app.name} branch..."

        @client.changeBranch manifest, branch, (err, res, body) ->
            err ?= new Error body.error.message unless status2XX res

            if err
                log.error "Error change branch of app: #{app.name}"
                log.error err
                callback err
            else
                log.info "Successfully branch change for app: #{app.name}"
                callback null, body


    # Send a uninstall request to controller server ("clean" request).
    uninstallApp: (app, callback) ->
        method = 'processUninstall'
        @queue.push {method, app, callback}


    processUninstall: (app, callback) ->
        if app?
            manifest = app.getHaibuDescriptor()
            log.info "Request controller for cleaning #{app.name}..."

            @client.clean manifest, (err, res, body) ->
                err ?= body.error unless status2XX res
                errMsg = 'application not installed'
                # err may be a string or an error object
                if err? and typeof err is 'string' and
                        err.indexOf? and err.indexOf(errMsg) is -1
                    err = new Error err
                    log.error "Error cleaning app: #{app.name}"
                    log.error err
                    callback err
                else
                    log.warn err if err
                    log.info "Successfully cleaning app: #{app.name}"
                    callback null
        else
            callback null

    checkAppStopped: (app, callback) ->
        @client.get 'running', (err, res, body) =>
            return callback err if err
            if app.slug in  Object.keys(body.app)
                @client.stop app.slug, (err, res, body) ->
                    callback err
            else
                callback()

    # Send a start request to controller server
    start: (app, callback) ->
        manifest = app.getHaibuDescriptor()
        log.info "Request controller for starting #{app.name}..."
        @checkAppStopped app, (err) =>
            log.error err if err?
            @checkMemory (err) ->
                return callback err if err

                @client.start manifest, (err, res, body) ->
                    err ?= new Error body.error.message unless status2XX res

                    if err
                        log.error "Error starting app: #{app.name}"
                        log.error err
                        callback err
                    else
                        log.info "Successfully starting app: #{app.name}"
                        callback null, res.body


    # Send a stop request to controller server
    stop: (app, callback) ->
        manifest = app.getHaibuDescriptor()
        log.info "Request controller for stopping #{app.name}..."

        if app.type is 'static'
            # don't need to stop app in controller if it's a static app
            log.info "Successfully stopping app: #{app.name}"
            callback null
        else
            @client.stop app.slug, (err,res, body) ->
                err ?= body.error unless status2XX res
                errMsg = 'application not installed'
                # err may be a string or an error object
                if err? and typeof err is 'string' and
                        err.indexOf? and err.indexOf(errMsg) is -1
                    err = new Error err
                    log.error "Error stopping app: #{app.name}"
                    log.error err
                    callback err
                else
                    log.warn err if err
                    log.info "Successfully stopping app: #{app.name}"
                    callback null

    # Remove and reinstall app inside Haibu.
    updateStack: (callback) ->
        log.info "Request controller for updating stack..."
        @client.updateStack (err, res, body) ->
            err ?= new Error body.error.message unless status2XX res
            if err
                log.error "Error updating stack"
                log.error err
                callback err
            else
                log.info "Successfully updated stack"
                callback null, body

    # Remove and reinstall app inside Haibu.
    restartController: (callback) ->
        log.info "Request controller for restarting stack..."
        @client.restartController (err, res, body) ->
            err ?= new Error body.error.message unless status2XX res
            if err
                log.error "Error reboot stack"
                log.error err
                callback err
            else
                log.info "Successfully reboot stack"
                callback null, body

# Exports the class itself to ease testing
module.exports.AppManager = AppManager

# `get` returns a singleton instance to allow use across HTTP requests
singleton = new AppManager()
module.exports.get = -> return singleton
