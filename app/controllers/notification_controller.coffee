before ->
    Notification.find req.params.id, (err, notif) =>
        if err or not notif
            send error: true, msg: "Notification not found", 404
        else
            @notif = notif
            next()
# Make this pre-treatment only before update and delete action.
, only: ['getOne', 'update']


action 'all', ->

    Notification.all (err, notifs) =>
        if err
            send error: true, msg: 'Server error occurred while retrieving data'
        else
            send notifs

action 'getOne', ->
    send @notif, 200

action 'create', ->

    Notification.create req.body, (err, notif) =>
        if err
            send error: true, msg: "Server error while creating notification.", 500
        else
            send notif, 201

action 'update', ->

    @notif.updateAttributes body, (err, notif) =>
        if err?
            send error: true, msg: "Server error while saving notification", 500
        else
            send notification, 200