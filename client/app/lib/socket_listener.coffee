class SocketListener extends CozySocketListener

    models:
        'notification': require 'models/notification'

    events: ['notification.create','notification.update', 'notification.delete']

    onRemoteCreate: (notification) ->
        @collection.add notification

    onRemoteDelete: (notification) ->
        @collection.remove notification


module.exports = new SocketListener()