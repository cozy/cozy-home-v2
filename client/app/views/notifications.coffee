BaseView = require 'lib/base_view'
SocketListener = require 'lib/socket_listener'
notifTemplate = require "templates/notification_item"

module.exports = class NotificationsView extends BaseView

    el:'#notifications-container'
    template: require 'templates/notifications'

    events:
        "hover": "onMouseOver"

    initialize: ->

        @socketListener = new SocketListener(@)
        super()

    afterRender: =>

        @counter = @$('a span')
        @notifList = @$('#notifications')

        @$('a').tooltip
             placement: 'right'
             title: 'Notifications'

    onMouseOver: (event) ->
        if event.type is "mouseenter"
            @notifList.show()
        else
            @notifList.hide()

    addNotification: (data) ->
        @manageCounter(1)
        @notifList.prepend(notifTemplate(content: data.value))

    manageCounter: (delta) ->

        if @counter.html() is ""
            @counter.html delta
        else
            newCount = parseInt(@counter.html()) + delta
            if newCount > 0
                @counter.html newCount
            else
                @counter.html ""
