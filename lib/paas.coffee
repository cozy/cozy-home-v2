haibu = require('haibu-api')
HttpClient = require("request-json").JsonClient


# Class to facilitate communications with Haibu, the application server 
# and the cozy proxy to manage application installation.
class exports.AppManager

    # Setup haibu client and proxyClient.
    constructor: ->
        @proxyClient = new HttpClient "http://localhost:9104/"
        @client = haibu.createClient(
            host: '127.0.0.1'
            port: 9002
        ).drone

    # Ask to proxy to rebuild his routes.
    # Because route commands are public, we can't allow that someone add or
    # remove routes.
    resetProxy: (callback) ->
        railway.logger.write "Update proxy..."
        @proxyClient.get "routes/reset", (error, response, body) ->
            if error
                console.log error.message
                callback error
            else if response.statusCode != 200
                callback new Error "Something went wrong on proxy side when \
reseting routes"
            else
                railway.logger.write "Proxy successfuly updated."
                callback null


    # 1. Send a install request to haibu server ("start" request).
    # 2. Send a request to proxy to add a new route
    installApp: (app, callback) ->
        console.info "Request haibu for spawning #{app.name}..."
        
        @client.start app.getHaibuDescriptor(), (err, result) =>
            if err
                console.log "Error spawning app: #{app.name}"
                console.log err.message
                console.log err.stack
                callback(err)
            else
                console.info "Successfully spawned app: #{app.name}"
                console.info "Update proxy..."
                callback null, result

    # Remove and reinstall app inside Haibu.
    updateApp: (app, callback) ->
        railway.logger.write "Request haibu for updating #{app.name}..."
        
        railway.logger.write "Step 1: remove #{app.name}..."
        @client.clean app.getHaibuDescriptor(), (err, result) =>
            if err
                console.log "Error cleaning app: #{app.name}"
                console.log err.message
                console.log err.stack
                callback(err)
            else
                railway.logger.write "Step 2: re install #{app.name}..."
                @client.start app.getHaibuDescriptor(), (err, result) =>
                    if err
                        console.log "Error spawning app: #{app.name}"
                        console.log err.message
                        console.log err.stack
                        callback(err)
                    else
                        console.info "Successfully update app: #{app.name}"
                        callback null, result


    # Send a uninstall request to haibu server ("clean" request).
    uninstallApp: (app, callback) ->

        console.info "Request haibu for cleaning #{app.name}..."
        @client.clean app.getHaibuDescriptor(), (err, result) =>
            if err
                console.log "Error cleaning app: #{app.name}"
                console.log err.message
                console.log err.stack
                callback(err)
            else
                console.info "Successfully cleaning app: #{app.name}"
                callback null
