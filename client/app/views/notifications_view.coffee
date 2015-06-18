ViewCollection = require 'lib/view_collection'
SocketListener = require 'lib/socket_listener'
Notification = require 'models/notification'

SocketListener = require '../lib/socket_listener'

module.exports = class NotificationsView extends ViewCollection

    el:'#notifications-container'
    itemView: require 'views/notification_view'
    template: require 'templates/notifications'

    events:
        "click #notifications-toggle": "showNotifList"
        "click #clickcatcher": "hideNotifList"

    initialize: ->
        super
        @initializing = true

    appendView: (view) ->
        @notifList ?= $ '#notifications-list'
        @notifList.prepend view.el
        @sound.play() unless @initializing

    afterRender: =>
        @counter = @$ '#notifications-counter'
        @counter.html '0'
        @clickcatcher = @$ '#clickcatcher'
        @clickcatcher.hide()
        @noNotifMsg = $ '#no-notif-msg'
        @notifList  = $ '#notifications-list'
        @hideNotifList()
        @sound = $('#notification-sound')[0]
        @dismissButton = $ "#dismiss-all"
        @dismissButton.click @dismissAll

        super
        @initializing = false
        @collection.fetch()
        if window.cozy_user?
            @noNotifMsg.html t 'you have no notifications',
                name: window.cozy_user.public_name or ''

    remove: =>
        super

    checkIfEmpty: =>
        newCount = @collection.length
        @noNotifMsg.toggle(newCount is 0)
        if newCount is 0 # hide 0 counter
            @counter.html ""
            @counter.hide()
        else
            @counter.html newCount
            @counter.show()

    windowClicked: =>
        if event? and @$el.has($(event.target)).length is 0
            @hideNotifList()

    showNotifList: =>
        if $('.right-menu').is ':visible'
            @hideNotifList()
        else
            $('.right-menu').show()
            @clickcatcher.show()

    hideNotifList: (event) =>
        $('.right-menu').hide()
        @clickcatcher.hide()

    dismissAll: =>
        @dismissButton.spin true
        @collection.removeAll
            success: =>
                @dismissButton.spin false
            error: =>
                @dismissButton.spin false

