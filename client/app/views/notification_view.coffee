BaseView = require 'lib/base_view'

module.exports = class NotificationView extends BaseView

    className: () =>

        if @model.get('status') is 'PENDING'
            subClass = 'new'
        else
            subClass = 'old'

        return "notification #{subClass}"

    tagName: 'li'
    template: require 'templates/notification_item'