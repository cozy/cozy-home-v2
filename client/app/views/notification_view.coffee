BaseView = require 'lib/base_view'


module.exports = class NotificationView extends BaseView

    tagName: 'li'
    className: 'notification clearfix'
    template: require 'templates/notification'
    events:
        "click .doaction": "doaction"
        "click .dismiss" : "dismiss"


    getRenderData: ->
        model: _.extend @model.attributes,
            actionText: @actionText or null
            date: moment(parseInt @model.get 'publishDate').fromNow()


    initialize: ->
        @listenTo @model, 'change', @render

        action = @model.get 'resource'
        if action?
            if action.app? and action.app isnt 'home'
                @actionText = 'notification open application'
            else if action.url?
                if action.url.indexOf('update-stack') >= 0
                    @actionText = 'notification update stack'
                else if action.url.indexOf('update') >= 0
                    @actionText = 'notification update application'


    doaction: ->
        action = @model.get 'resource'
        unless action?
            action = app: home
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


    dismiss: (event) ->
        event?.preventDefault()
        event?.stopPropagation()
        @model.destroy()
