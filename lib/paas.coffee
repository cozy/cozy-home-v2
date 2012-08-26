haibu = require('haibu')
HttpClient = require("../common/test/client").Client


# Class to facilitate communications with Haibu, the application server 
# and the cozy proxy to manage application installation.
class exports.AppManager

    # Setup haibu client and proxyClient.
    constructor: ->
        @proxyClient = new HttpClient "http://localhost:4000/"
        @client = new haibu.drone.Client
            host: '127.0.0.1'
            port: 9002

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
                @_addRouteToProxy app, result, callback

    # Add a new route that matches given app to proxy.
    _addRouteToProxy: (app, result, callback) ->
        data =
            route: "/apps/#{app.slug}"
            port: result.drone.port

        @proxyClient.post "routes/add", data, (error, response, body) ->
            if error
                console.log error.message
                callback error
            else if response.statusCode != 201
                callback new Error "Something went wrong on proxy side when \
creating a new route"
            else
                console.info "Proxy successfuly updated with " + \
                            "#{data.route} => #{data.port}"
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
                console.info "Update proxy..."
                @_removeRouteFromProxy app, result, callback

    # Remove from proxy the route that matches given app.
    _removeRouteFromProxy: (app, result, callback) ->
        data =
            route: "/apps/#{app.slug}"

        @proxyClient.put "routes/del", data, (error, response, body) ->
            if error
                console.log error.message
                callback error
            else if response.statusCode != 204
                callback new Error "Something went wrong on proxy side when \
removing a route"
            else
                console.info "Proxy successfuly updated"
                callback null, result
