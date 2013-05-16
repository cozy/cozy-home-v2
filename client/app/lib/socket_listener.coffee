Application  = require 'models/application'
Notification = require 'models/notification'

application_idx  = 0
notification_idx = 1

class SocketListener extends CozySocketListener


    models:
        'notification': Notification
        'application' : Application

    events: [
        'notification.create', 'notification.update', 'notification.delete',
        'application.create', 'application.update', 'application.delete'
    ]

    onRemoteCreate: (model) ->
        if model instanceof Application
            @collections[application_idx].add model
        else if model instanceof Notification
            @collections[notification_idx].add model

    onRemoteDelete: (model) ->
        if model instanceof Application
            @collections[application_idx].remove model
        else if model instanceof Notification
            @collections[notification_idx].remove model


module.exports = new SocketListener()