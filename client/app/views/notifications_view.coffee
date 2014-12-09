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
        "click #clickcatcher"        : "hideNotifList"
        "click #dismiss-all"         : "dismissAll"

    appendView: (view) ->
        @notifList.prepend view.el
        # TODO use visibility.js to only play sound
        # when window is not visible
        @sound.play() unless @initializing
        @$('#notifications-toggle img').attr 'src', 'img/notification-orange.png'
        @$('#notifications-toggle').addClass 'highlight'

    afterRender: =>
        @counter    = @$ '#notifications-counter'
        @counter.html '10'
        @clickcatcher = @$ '#clickcatcher'
        @clickcatcher.hide()
        @noNotifMsg = @$ '#no-notif-msg'
        @notifList  = @$ '#notifications'
        @sound      = @$('#notification-sound')[0]
        @dismissButton = @$ "#dismiss-all"

        super
        @initializing = true
        @collection.fetch().always -> @initializing = false

        $(window).on 'click', @windowClicked

    remove: =>
        $(window).off 'click', @hideNotifList
        super

    checkIfEmpty: =>
        newCount = @collection.length
        @$('#no-notif-msg').toggle(newCount is 0)
        @$('#dismiss-all').toggle(newCount isnt 0)
        if newCount is 0 #hide 0 counter
            @counter.html ""
            @counter.hide()
            imgPath = 'img/notification-white.png'
            @$('#notifications-toggle img').attr 'src', imgPath
            @$('#notifications-toggle').removeClass 'highlight'
        else
            @counter.html newCount
            @counter.show()

    windowClicked: =>
        if event? and @$el.has($(event.target)).length is 0
            @hideNotifList()

    showNotifList: () ->
        if @notifList.is ':visible'
            @notifList.hide()
            @clickcatcher.hide()
            @$el.removeClass 'active'
        else
            @$el.addClass 'active'
            @notifList.slideDown 100
            @clickcatcher.show()

    dismissAll: () ->
        @dismissButton.css 'color', 'transparent'
        @dismissButton.spin 'small'
        @collection.removeAll
            success: =>
                @dismissButton.spin()
                @dismissButton.css 'color', '#333'
            error: =>
                @dismissButton.spin()
                @dismissButton.css 'color', '#333'

    hideNotifList: (event) =>
        @notifList.slideUp 100
        @clickcatcher.hide()
        @$el.removeClass 'active'
