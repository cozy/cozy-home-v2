BaseView = require 'lib/base_view'

module.exports = class NotificationView extends BaseView

    tagName: 'li'
    className: 'notification'
    template: require 'templates/notification_item'
    events:
        "click .doaction": "doaction"
        "click .dismiss" : "dismiss"

    doaction: ->
        action = @model.get 'related'
        if typeof action is 'string'
            url = action
        else if action.app? and action.url
            url = "/apps/#{action.app}/#{action.url}"
        else
            url = null

        window.app.router.navigateInApp url if url
        @dismiss() if @model.get('type') is 'temporary'

    dismiss: ->
        switch @model.get 'type'
            when 'temporary'
                @model.destroy()
            when 'persistent'
                @model.save status: 'READ'