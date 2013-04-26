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
        "click": "showNotifList"

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

        @model.fetch
            initialization: true
            success: ->
                console.log "Fetch notifications: success"
            error: ->
                console.log "Fetch notifications: error"

        $(window).click (event) =>
            @hideNotifList(event)

        @$('a').tooltip
             placement: 'right'
             title: 'Notifications'

    onAddNotification: (notification, collection, options) ->

        notifView = new NotificationView
                            id: notification.cid
                            model: notification

        @views[notification.cid] = notifView

        @notifList.prepend notifView.render().$el
        @sound[0].play() if not options.initialization?
        @manageCounter()

        @markPendingAsRead() if @notifList.is ':visible'

    manageCounter: () ->
        newCount = @model.where({status: 'PENDING'}).length
        if newCount > 0
            @counter.html newCount
        else
            @counter.html ""

    showNotifList: () ->

        if @notifList.is ':visible'
            @notifList.hide()
        else
            @notifList.show()
            @markPendingAsRead()

    hideNotifList: (event) ->
        # A click can be done anywhere to hide notification
        # except on the notification button itself
        if @$el.has($(event.target)).length is 0
            @notifList.hide()

    markPendingAsRead: () ->

        timeBeforeMarkAsOld = 3 * 1000 # milliseconds

        pendings = @model.where({ status: 'PENDING'})
        pendings.forEach (item) =>
            view = @views[item.cid]
            item.set 'status', 'READ'
            item.save null,
                        success: =>
                            @manageCounter()

            # change the color after a short time
            setTimeout((
                () ->
                   view.$el.addClass 'transition'

            ), timeBeforeMarkAsOld)
