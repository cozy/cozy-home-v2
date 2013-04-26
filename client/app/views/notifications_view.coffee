BaseView = require 'lib/base_view'
SocketListener = require 'lib/socket_listener'
NotificationCollection = require 'collections/notifications'
Notification = require 'models/notification'
NotificationView = require 'views/notification_view'

notifTemplate = require "templates/notification_item"

SocketListener = require '../lib/socket_listener'

module.exports = class NotificationsView extends BaseView

    el:'#notifications-container'
    template: require 'templates/notifications'

    events:
        "hover": "onMouseOver"

    views: {}

    constructor: (options) ->

        options = {} if not options

        options.model = new NotificationCollection()

        super(options)

    initialize: () ->
        SocketListener.watch @model
        @listenTo @model, 'add', @onAddNotification
        @listenTo @model, 'update', @onUpdateNotification
        @listenTo @model, 'remove', @onRemoveNotification
        super()

    afterRender: =>

        @counter = @$('a span')
        @sound = @$('#notification-sound')
        @notifList = @$('#notifications')
        @notifList.show()

        @$('a').click () =>

            @model.create
                text: "This is another notification"
                channel: "DISPLAY"
                status: 'PENDING'
                resource: null,
                    wait: true

        @$('a').tooltip
             placement: 'right'
             title: 'Notifications'

    onAddNotification: (notification, collection, options) ->

        notifView = new NotificationView
                            id: notification.cid
                            model: notification

        @views[notification.cid] = notifView

        @notifList.prepend notifView.render().$el
        #@sound.play()
        @sound[0].play()
        #document.getElementById('notification-sound').play();
        @manageCounter()

    onMouseOver: (event) ->
        return;
        if event.type is "mouseenter"
            @notifList.show()
        else
            @notifList.hide()

    manageCounter: () ->
        newCount = @model.length
        if newCount > 0
            @counter.html newCount
        else
            @counter.html ""
