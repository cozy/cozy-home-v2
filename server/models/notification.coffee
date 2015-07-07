cozydb = require 'cozydb'

module.exports = Notification = cozydb.getModel 'Notification',
    text: String
    type: String
    resource: {type: cozydb.NoSchema, default: null}
    publishDate: {type: String, default: Date.now}

    app: String # the app that created that notif
    ref: String # for apps with multiple notifs to manage

Notification.all = (callback) ->
    Notification.request "byDate", callback
