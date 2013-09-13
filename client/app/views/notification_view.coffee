BaseView = require 'lib/base_view'

module.exports = class NotificationView extends BaseView

    tagName: 'li'
    className: 'notification clearfix'
    template: require 'templates/notification'
    events:
        "click .doaction": "doaction"
        "click .dismiss" : "dismiss"

    initialize: ->
        @listenTo @model, 'change', @render

    doaction: ->
        console.log "action"
        console.log @model
        action = @model.get 'resource'
        action = app: home unless action?

        if typeof action is 'string'
            url = action
        else if action.app?
            # .replace is a quickfix
            url = if action.app is 'home' then "/" else "/apps/#{action.app}/"
            url += action.url or ''
            url = url.replace '//', '/'
        else
            url = null

        window.app.routers.main.navigate url, true if url
        @dismiss() if @model.get('type') is 'temporary'

    dismiss: (event) ->
        event?.preventDefault()
        event?.stopPropagation()
        @model.destroy()
