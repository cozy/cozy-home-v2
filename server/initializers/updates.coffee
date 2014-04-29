NotificationsHelper = require 'cozy-notifications-helper'
log = require('printit')
    prefix: 'application updates'

Application = require '../models/application'


# Time (in ms) between two checks for updates, for all apps
TIME_BETWEEN_UPDATE_CHECKS = 1000 * 60 * 60 * 24 # once a day


checkUpdate = (notifier, app) ->
    log.info "#{app.name} - checking for an update..."
    app.checkForUpdate (err, setUpdate) ->
        log.debug "#{app.version}"
        if err?
            log.error "#{app.name} - Error while checking update."
            console.log err
        else if setUpdate
            log.info "#{app.name} - update required."
            notifier.createTemporary
                text: "A new version of #{app.name} is available!"
                resource: {app: 'home'}
        else
            log.info "#{app.name} - no update required."


checkUpdates = ->
    notifier = new NotificationsHelper 'home'

    log.info 'Checking if app updates are available...'
    Application.all (err, apps) ->
        if err
            log.error "Error when checking apps versions:"
            console.log err
        else
            for app in apps
                checkUpdate notifier, app


module.exports = ->
    checkUpdates()
    setInterval checkUpdates, TIME_BETWEEN_UPDATE_CHECKS
