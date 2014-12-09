Application  = require 'models/application'
Notification = require 'models/notification'
Device = require 'models/device'

application_idx  = 0
notification_idx = 1
device_idx = 2

class SocketListener extends CozySocketListener


    models:
        'notification': Notification
        'device': Device
        'application' : Application

    events: [
        'notification.create', 'notification.update', 'notification.delete',
        'device.create', 'device.update', 'device.delete',
        'application.create', 'application.update', 'application.delete'
    ]

    onRemoteCreate: (model) ->
        if model instanceof Application
            @collections[application_idx].add model
        else if model instanceof Notification
            @collections[notification_idx].add model
        else if model instanceof Device
            @collections[device_idx].add model

    onRemoteDelete: (model) ->
        if model instanceof Application
            @collections[application_idx].remove model
        else if model instanceof Notification
            @collections[notification_idx].remove model
        else if model instanceof Device
            @collections[device_idx].remove model


module.exports = new SocketListener()
