haibu = require('haibu')


class exports.AppManager

    constructor: ->
        @client = new haibu.drone.Client
            host: '127.0.0.1'
            port: 9002

    installApp: (app, callback) ->

        haibuDescriptor =
            user: "cozy"
            name: app.slug
            domain: "127.0.0.1"
            repository:
                type: "git",
                url: app.git
            scripts:
                start: "server.coffee"
   
        console.log "Request haibu for spawning #{app.name}...."
        @client.start haibuDescriptor, (err, result) ->
            if err
                console.log "Error spawning app: #{app.name}"
                console.log err.message
                console.log err.stack
                callback(err)
            else
                console.log "Successfully spawned app: #{app.name}"
                console.log result
                callback(null, result)


    uninstallApp: (app, callback) ->

        haibuDescriptor =
            user: "cozy"
            name: app.slug
            domain: "127.0.0.1"
            repository:
                type: "git",
                url: app.git
            scripts:
                start: "server.coffee"

        console.log "Request haibu for cleaning #{app.name}...."
        @client.clean haibuDescriptor, (err, result) ->
            console.log "finish request"
            if err
                console.log "Error cleaning app: #{app.name}"
                console.log err.message
                console.log err.stack
                callback(err)
            else
                console.log "Successfully cleaning app: #{app.name}"
                console.log result
                callback(null, result)

