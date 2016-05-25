async               = require 'async'

NotificationsHelper = require 'cozy-notifications-helper'
RealtimeAdapter     = require 'cozy-realtime-adapter'
autostop            = require '../lib/autostop'
AlarmManager        = require '../lib/alarm_manager'
localizationManager = require '../helpers/localization_manager'
SharingManager      = require '../lib/sharing_manager'

User                = require '../models/user'
CozyInstance        = require '../models/cozyinstance'
Application         = require '../models/application'
Notification        = require '../models/notification'


# notification and application events should be proxyed to client
notifhelper = new NotificationsHelper 'home'

module.exports = (app, callback) ->

    eventsToForward = ['notification.*', 'application.*', 'device.*']
    realtime = RealtimeAdapter app.server, eventsToForward

    # also create a notification when an app install is complete
    realtime.on 'application.update', (event, id) ->
        Application.find id, (err, app) ->
            if err # no notification, no big deal
                console.log err.stack
            else if app?.state is 'broken'
                messageKey = 'installation message failure'
                options = appName: app.displayName
                message = localizationManager.t messageKey, options
                notifhelper.createTemporary
                    text: message
                    resource: app: 'home'

    realtime.on 'usage.application', (event, name) ->
        if name isnt 'home' and name isnt 'proxy'
            autostop.restartTimeout name


    # listen for modifications on the sharing
    realtime.on 'sharing.*', (event, id) ->
        SharingManager.handleNotification event, id, (err) ->
            callback err


    # setup alarm manager for alarm events handling
    User.all (err, users) ->
        if err? or users.length is 0
            console.info "Internal server error. Can't retrieve users or " + \
                         "no user exists."
        else
            user = users[0]
            options =
                timezone: user.timezone
                notificationHelper: notifhelper
            alarmManager = new AlarmManager options
            app.alarmManager = alarmManager
            realtime.on 'event.*', alarmManager.handleAlarm
        callback()
