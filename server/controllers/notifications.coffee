# Deprecated, won't be used with cozy-notifications-helper >0.3.3

Notification = require '../models/notification'

module.exports =
    all: (req, res, next) ->
        Notification.all (err, notifs) =>
            if err then next err
            else res.send 200, notifs

    deleteAll: (req, res, next) ->
        Notification.destroyAll (err) ->
            if err then next err
            else res.send 204, success: true

    show: (req, res, next) ->
        Notification.find req.params.notifid, (err, notif) =>
            if err then next err
            else if not notif
                res.send 404, error: 'Notification not found'
            else
                res.send 200, notif

    delete: (req, res, next) ->
        Notification.find req.params.notifid, (err, notif) =>
            if err then next err
            else if not notif
                res.send 404, error: 'Notification not found'
            else
                notif.destroy (err) ->
                    if err then next err
                    else
                        res.send 204, success: true

    create: (req, res, next) ->
        attributes = req.body
        attributes.type = 'temporary'

        attributes.resource ?=
            app: attributes.app or null
            url: attributes.url or '/'

        Notification.create attributes, (err, notif) =>
            if err then next err
            else
                res.send 201, success: 'Notification created'

    updateOrCreate: (req, res, next) ->
        if not req.params.app or not req.params.ref
            return res.send 500, error: 'Wrong usage'

        attributes = req.body
        attributes.type = 'persistent'
        attributes.ref = req.params.ref
        attributes.app = req.params.app

        attributes.resource ?=
            app: attributes.app
            url: attributes.url or '/'

        params = key: [req.params.app, req.params.ref]

        Notification.request 'byApps', params, (err, notifs) =>
            if err then next err
            else if not notifs or notifs.length is 0
                Notification.create attributes, (err, notif) ->
                    if err then next err
                    else
                        res.send 201, notif
            else
                notifs[0].updateAttributes attributes, (err, notif) ->
                    if err then next err
                    else
                        res.send 200, notif

    destroy: (req, res, next) ->
        params = key: [req.params.app, req.params.ref]

        Notification.request 'byApps', params, (err, notifs) =>
            if err then next err
            else if not notifs or notifs.length is 0
                res.send 204, success: true
            else
                notifs[0].destroy (err) ->
                    if err then next err
                    else
                        res.send 204, success: true
