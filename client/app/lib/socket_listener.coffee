class SocketListener

    events: ['notification']

    constructor: (@notifView) ->

        try
            @connect()
        catch err
            console.log "Error while connecting to socket.io"
            console.log err.stack

    connect: ->
        url = window.location.origin
        pathToSocketIO = "#{window.location.pathname.substring(1)}socket.io"
        socket = io.connect url,
                resource: pathToSocketIO

        for event in @events
            socket.on event, @process


    process: (data) =>
        @notifView.addNotification(data)


module.exports = SocketListener