BaseCollection = require 'lib/base_collection'
Notification = require 'models/notification'


# List of installed applications.
module.exports = class NotificationCollection extends BaseCollection

    model: Notification
    url: 'notifications'
