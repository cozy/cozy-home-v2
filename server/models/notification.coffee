americano = require 'americano-cozy'

module.exports = Notification = americano.getModel 'Notification',
    text: String
    type: String
    resource: {type: Object, default: null}
    publishDate: {String, default: Date.now}

    app: String # the app that created that notif
    ref: String # for apps with multiple notifs to manage

Notification.all = (callback) ->
    Notification.request "all", callback
