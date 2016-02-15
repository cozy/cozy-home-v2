# Deprecated, won't be used with cozy-notifications-helper >0.3.3

Notification        = require '../models/notification'
localizationManager = require '../helpers/localization_manager'

module.exports =
    all: (req, res, next) ->
        Notification.all (err, notifs) ->
            if err then next err
            else res.status(200).send notifs

    deleteAll: (req, res, next) ->
        Notification.destroyAll (err) ->
            if err then next err
            else res.status(204).send success: true

    show: (req, res, next) ->
        Notification.find req.params.notifid, (err, notif) ->
            if err then next err
            else if not notif
                res.status(404).send error: localizationManager.t 'notification not found'
            else
                res.status(200).send notif

    delete: (req, res, next) ->
        Notification.find req.params.notifid, (err, notif) ->
            if err then next err
            else if not notif
                res.status(404).send error: localizationManager.t 'notification not found'
            else
                notif.destroy (err) ->
                    if err then next err
                    else
                        res.status(204).send success: true

    create: (req, res, next) ->
        attributes = req.body
        attributes.type = 'temporary'

        attributes.resource ?=
            app: attributes.app or null
            url: attributes.url or '/'

        Notification.create attributes, (err, notif) ->
            if err then next err
            else
                res.status(201).send success: localizationManager.t 'notification created'

    updateOrCreate: (req, res, next) ->
        if not req.params.app or not req.params.ref
            return res.status(500).send error: localizationManager.t 'wrong usage'

        attributes = req.body
        attributes.type = 'persistent'
        attributes.ref = req.params.ref
        attributes.app = req.params.app

        attributes.resource ?=
            app: attributes.app
            url: attributes.url or '/'

        params = key: [req.params.app, req.params.ref]

        Notification.request 'byApps', params, (err, notifs) ->
            if err then next err
            else if not notifs or notifs.length is 0
                Notification.create attributes, (err, notif) ->
                    if err then next err
                    else
                        res.status(201).send notif
            else
                notifs[0].updateAttributes attributes, (err, notif) ->
                    if err then next err
                    else
                        res.status(200).send notif

    destroy: (req, res, next) ->
        params = key: [req.params.app, req.params.ref]

        Notification.request 'byApps', params, (err, notifs) ->
            if err then next err
            else if not notifs or notifs.length is 0
                res.status(204).send success: true
            else
                notifs[0].destroy (err) ->
                    if err then next err
                    else
                        res.status(204).send success: true
