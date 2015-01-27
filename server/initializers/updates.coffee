async = require 'async'
NotificationsHelper = require 'cozy-notifications-helper'
log = require('printit')
    prefix: 'application updates'

Application = require '../models/application'
StackApplication = require '../models/stack_application'
localization = require '../lib/localization_manager'

# Time (in ms) between two checks for updates, for all apps
TIME_BETWEEN_UPDATE_CHECKS = 1000 * 60 * 60 * 24 # once a day


# Check updates download the application manifest and extract version from it.
# Then it compares it with the actual version number. If it's higher, a
# *needUpdate* flag is set to true on the application model.
checkUpdate = (app, callback) ->
    log.info "#{app.name} - checking for an update..."
    app.checkForUpdate (err, setUpdate) ->
        if err?
            log.error "#{app.name} - Error while checking update."
            log.raw err
        else if setUpdate
            log.info "#{app.name} - update required."
        else
            log.info "#{app.name} - no update required."

        shouldBeUpdated = not err? and setUpdate
        callback shouldBeUpdated


# Creates a notification to inform the app can be updated
createAppUpdateNotification = (notifier, app) ->
    messageKey = 'update available notification'
    message = localization.t messageKey, appName: app.name
    notificationSlug = "home_update_notification_app_#{app.name}"
    notifier.createOrUpdatePersistent notificationSlug,
        app: 'konnectors'
        text: message
        resource:
            app: 'home'
            url: "update/#{app.slug}"
    , (err) ->
        log.error err if err?


createStackUpdateNotification = (notifier) ->
    messageKey = 'stack update available notification'
    message = localization.t messageKey
    notificationSlug = "home_update_notification_stack"
    notifier.createOrUpdatePersistent notificationSlug,
        app: 'konnectors'
        text: message
        resource:
            app: 'home'
            url: "update-stack"
    , (err) ->
        log.error err if err?


# Check if a new version of an application is available for each of application
# listed in the Cozy.
checkUpdates = ->
    notifier = new NotificationsHelper 'home'

    log.info 'Checking if app updates are available...'
    async.series
        applications: Application.all
        stackApplications: StackApplication.all
    , (err, results) ->
        if err?
            log.error "Error when checking apps versions:"
            log.raw err
        else
            {applications, stackApplications} = results
            # Creates an update notification for each app that has a new version
            # available.
            async.filterSeries applications, checkUpdate, (appsToUpdate) ->
                for application in appsToUpdate
                    createAppUpdateNotification notifier, application

                # Creates an update notification for the stack, if one of the
                # stack application has a new version available.
                async.some stackApplications, checkUpdate, (shouldBeUpdated) ->
                    createStackUpdateNotification notifier if shouldBeUpdated


# Start check update cron.
module.exports = ->
    checkUpdates()
    setInterval checkUpdates, TIME_BETWEEN_UPDATE_CHECKS
