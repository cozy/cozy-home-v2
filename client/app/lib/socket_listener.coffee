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
            @collection[application_idx].add model
        else if model instanceof Notification
            @collection[notification_idx].add model

    onRemoteDelete: (notification) ->
        if model instanceof Application
            @collection[application_idx].add model
        else if model instanceof Notification
            @collection[notification_idx].add model


module.exports = new SocketListener()