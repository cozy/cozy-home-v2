icons = require '../lib/icon'
manager = require('../lib/paas').get()
{Manifest} = require '../lib/manifest'
NotificationsHelper = require 'cozy-notifications-helper'

log = require('printit')
    prefix: "applications"

# Remove a notification after an update
removeAppUpdateNotification = (app) ->
    notifier = new NotificationsHelper 'home'
    notificationSlug = "home_update_notification_app_#{app.name}"
    notifier.destroy notificationSlug, (err) ->
        log.error err if err?


module.exports = appHelpers =


    # Create an access token at the format expected by the Data System.
    # The token is randomly created and is big enough to ensure uniqueness
    # of every token.
    newAccessToken: ->
        length = 32
        string = ""
        while (string.length < length)
            string = string + Math.random().toString(36).substr(2)
        return string.substr 0, length


    # Mark application as broken by changing its state field.
    # It's useful when an error occurs while doing install or update operations
    # on the application.
    markBroken: (app, err, callback) ->
        log.error "Marking app #{app.name} as broken because"
        log.raw err.stack if process.env.NODE_ENV isnt 'test'

        data =
            state: 'broken'
            password: null

        if err.result?
            data.errormsg = "#{err.message}:\n #{err.result}"
        else if err.message?
            data.errormsg = "#{err.message}:\n #{err.stack}"
        else
            data.errormsg = err

        data.errorcode = err.code
        app.updateAttributes data, (saveErr) ->
            log.error saveErr if saveErr
            callback?()


    # Update app Metadata after an install.
    markInstalled: (appli, callback=->) ->

        if appli.type is 'static'
            updatedData =
                state: "installed"
                type: appli.type
                path: appli.path
        else
            updatedData =
                state: "installed"
                port: appli.port

        appli.updateAttributes updatedData, (err) ->
            return callback err if err
            if appli.type isnt 'static'
                log.info "Port saved for #{appli.name}: #{appli.port}"
            else
                log.info "Static app successfully installed: #{appli.name}."

            manager.resetProxy (err) ->
                return callback err if err
                log.info 'Proxy updated.'
                callback()


    # Get icon local location from manifest, then attach it to the application
    # document.
    setIcon: (appli, callback) ->

        try
            iconInfos = icons.getIconInfos appli
        catch err
            log.error err if process.env.NODE_ENV isnt 'test'
            iconInfos = null

        appli.iconType = iconInfos?.extension or null
        icons.save appli, iconInfos, (err) ->
            if err
                log.error err
            else
                log.info "Icon attached for #{appli.name}"
            callback appli


    # Launch installation process. Build app metadata, save icon fetch app
    # then update app information in database.
    install: (appli, manifest, access, callback) ->
        infos = JSON.stringify appli

        log.info "Attempt to install app #{infos}"
        appli.password = access.password
        appli.iconPath = manifest.getIconPath()
        appli.color = manifest.getColor()

        appHelpers._runInstall appli, (appli) ->
            appHelpers.setIcon appli, (appli) ->
                appHelpers.markInstalled appli, callback


    # Run the whole application update process:
    #
    # * Update new metadata from the online manifest
    # * Run update from controller
    # * Persist metadata.
    update: (app, callback) ->
        data = {}
        manifest = new Manifest()
        previousVersion = app.version

        # Get updated manifest.
        manifest.download app, (err) ->
            if err?
                callback err
            else
                app.password = appHelpers.newAccessToken()

                # Extract access information
                access =
                    permissions: manifest.getPermissions()
                    slug: app.slug
                    password: app.password

                # Extract application metadata from manifest
                data.widget = manifest.getWidget()
                data.version = manifest.getVersion()
                data.iconPath = manifest.getIconPath()
                data.color = manifest.getColor()
                data.needsUpdate = false
                infos =
                    git: app.git
                    name: app.name
                    icon: app.icon
                    iconPath: data.iconPath
                    slug: app.slug

                # Set icons information.
                try
                    iconInfos = icons.getIconInfos infos
                catch err
                    log.error err if process.env.NODE_ENV isnt 'test'
                    iconInfos = null
                data.iconType = iconInfos?.extension or null

                # Run the application process based on collected data.
                appHelpers._runUpdate app, data, iconInfos, access, (err) ->
                    if err
                        app.updateAttributes version: previousVersion, ->
                            callback err
                    else
                        callback()


    # Check if an update is required then returns an object with two flags
    #
    # A first flag that tells if an update is required:
    #
    # * Remote version number changes.
    # * If the app is marked as requiring an update.
    #
    # The second flag tells if the new version permissions are different from
    # the current version.
    isUpdateNeeded: (app, callback) ->
        manifest = new Manifest()
        manifest.download app, (err) ->
            return callback err if err

            app.getAccess (err, access) ->
                return callback err if err

                oldPermissions = JSON.stringify access.permissions
                newPermissions = JSON.stringify manifest.getPermissions()
                isNewVersion = app.version isnt manifest.getVersion()
                isInstalled = app.state in ["installed", "stopped"]
                isUpdateNeeded = app.needsUpdate? and app.needsUpdate
                isUpdateNeeded = \
                    (isUpdateNeeded or isNewVersion) and isInstalled

                callback null,
                    isUpdateNeeded: isUpdateNeeded
                    isPermissionsChanged: oldPermissions isnt newPermissions


    # Request controller for installation.
    _runInstall: (appli, callback) ->
        manager.installApp appli, (err, result) ->
            if err
                appHelpers.markBroken appli, err
                log.error err if err

            else if not result.drone?
                err = new Error(
                    "Controller didn't return informations about #{appli.name}."
                )
                log.error err if err

            else
                if result.drone.type is 'static'
                    appli.type = result.drone.type
                    appli.path = result.drone.path
                    msg = "Static app successfully installed."
                else
                    appli.port = result.drone.port
                    msg = "Install succeeded, app is running on port "
                    msg += "#{appli.port}."

                log.info msg
                callback appli


    # Run Update process based on given metadata:
    #
    # * Request the controller to run the update.
    # * Persist metadata.
    _runUpdate: (app, data, iconInfos, access, callback) ->

        # Update access token.
        app.updateAccess access, (err) ->
            return callback err if err?

            # Update application
            manager.updateApp app, (err, result) ->
                return callback err if err?
                data.state = "installed" if app.state isnt "stopped"

                # Update metadata and icon.
                app.updateAttributes data, (err) ->
                    removeAppUpdateNotification app

                    icons.save app, iconInfos, (err) ->
                        if err
                            log.error err
                        else
                            log.info 'icon attached'
                        manager.resetProxy callback

