# This initializer aims to check
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
checkUpdate = (notifier, app) ->
    log.info "#{app.name} - checking for an update..."
    app.checkForUpdate (err, setUpdate) ->
        if err?
            log.error "#{app.name} - Error while checking update."
            log.raw err
        else if setUpdate
            log.info "#{app.name} - update required."
            messageKey = 'update available notification'
            message = localization.t messageKey, appName: app.name
            notifier.createTemporary
                text: message
                resource: app: 'home'
        else
            log.info "#{app.name} - no update required."


# Check if a new version of an application is available for each of application
# listed in the Cozy.
checkUpdates = ->
    notifier = new NotificationsHelper 'home'

    log.info 'Checking if app updates are available...'
    Application.all (err, apps) ->
        if err
            log.error "Error when checking apps versions:"
            log.raw err
        else
            for app in apps
                checkUpdate notifier, app
        StackApplication.all (err, apps) ->
            if err
                log.error "Error when checking apps versions:"
                log.raw err
            else
                for app in apps
                    checkUpdate notifier, app


# Start check update cron.
module.exports = ->
    checkUpdates()
    setInterval checkUpdates, TIME_BETWEEN_UPDATE_CHECKS
