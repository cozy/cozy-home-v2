BaseCollection = require 'lib/base_collection'
Notification = require 'models/notification'


# List of installed applications.
module.exports = class NotificationCollection extends Backbone.Collection

    model: Notification
    url: 'api/notifications'


    removeAll: (options) ->
        options ?= {}
        success = options.success
        options.success = =>
            @reset []
            success?.apply this, arguments

        @sync 'delete', this, options
