BaseView = require 'lib/base_view'

module.exports = class NotificationView extends BaseView

    className: 'notification'
    template: require 'templates/notification_item'