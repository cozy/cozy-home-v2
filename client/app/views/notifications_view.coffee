BaseView = require 'lib/base_view'
SocketListener = require 'lib/socket_listener'
NotificationCollection = require 'collections/notifications'
Notification = require 'models/notification'

SocketListener = require '../lib/socket_listener'

module.exports = class NotificationsView extends ViewCollection

    el:'#notifications-container'
    itemView: require 'views/notification_view'
    template: require 'templates/notifications'

    events:
        "click #notifications-toggle": "showNotifList"

    initialize: () ->
        @collection ?= new NotificationCollection()
        SocketListener.watch @collection
        super

    appendView: (view) ->
        @notifList.prepend view.el
        # TODO use visibility.js to only play sound when not visible
        @sound.play() unless @initializing

    afterRender: =>
        super
        @counter = @$('#notifications-counter')
        @sound = @$('#notification-sound')[0]
        @notifList = @$('#notifications')

        @initializing = true
        @collection.fetch().always ->
            @initializing = false

        $(window).on 'click', @hideNotifList

        @$('a').tooltip
            placement: 'right'
            title: 'Notifications'

    remove: =>
        $(window).off 'click', @hideNotifList
        super

    checkIfEmpty: () ->
        newCount = @model.where(status: 'PENDING').length
        newCount = "" if newCount is 0 #hide 0 counter
        @counter.html newCount

    showNotifList: () ->
        if @notifList.is ':visible'
            @notifList.hide()
            @$el.removeClass 'active'
        else
            @$el.addClass 'active'
            @notifList.show()

    hideNotifList: (event) ->
        # A click can be done anywhere to hide notification
        # except on the notification button itself
        if @$el.has($(event.target)).length is 0
            @notifList.hide()
            @$el.removeClass 'active'
