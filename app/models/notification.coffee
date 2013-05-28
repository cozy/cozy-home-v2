module.exports = (compound, Notification) ->

    Notification.all = (callback) ->
        Notification.request "all", callback