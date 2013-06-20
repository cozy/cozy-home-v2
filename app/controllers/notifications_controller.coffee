action 'all', ->
    Notification.all (err, notifs) =>
        if err
            send 'Server error occurred while retrieving data', 500
        else
            send notifs

action 'deleteAll', ->
    Notification.destroyAll (err) ->
        if err
            send 'Server error', 500
        else
            send '', 204

action 'show', ->
    Notification.find req.params.id, (err, notif) =>
        if err
            send 'Server error', 500
        else if not notif
            send 'Notification not found', 404
        else
            send notif

action 'delete', ->
    Notification.find req.params.id, (err, notif) =>
        if err
            send 'Server error', 500
        else if not notif
            send 'Notification not found', 404
        else
            notif.destroy (err) ->
                if err
                    send 'Server error', 500
                else
                    send 'Notification deleted', 204

action 'create', ->

    attributes      = req.body
    attributes.type = 'temporary'

    attributes.resource ?=
        app: attributes.app or null
        url: attributes.url or '/'

    Notification.create attributes, (err, notif) =>
        if err
            send 'Server error while creating notification.', 500
        else
            send success: 'Notification created', 201

action 'updateOrCreate', ->

    if not req.params.app or not req.params.ref
        send 'Wrong usage', 500

    attributes = req.body
    attributes.type = 'persistent'
    attributes.ref = req.params.ref
    attributes.app = req.params.app

    attributes.resource ?=
        app: attributes.app
        url: attributes.url or '/'

    params = key: [req.params.app, req.params.ref]

    Notification.request 'byApps', params, (err, notifs) =>
        if err
            send 'Server error', 500
        else if not notifs or notifs.length is 0
            Notification.create attributes, (err, notif) ->
                if err
                    send 'Server error while saving notification', 500
                else
                    send notif, 201
        else
            notifs[0].updateAttributes attributes, (err, notif) ->
                if err
                    send 'Server error while saving notification', 500
                else
                    send notif, 200

action 'destroy', ->

    params = key: [req.params.app, req.params.ref]

    Notification.request 'byApps', params, (err, notifs) =>
        if err
            send 'Server error', 500
        else if not notifs or notifs.length is 0
            send success: 'Does not exists', 204
        else
            notifs[0].destroy (err) ->
                if err
                    send 'Server error while deleting notification', 500
                else
                    send success: 'Deleted', 204

