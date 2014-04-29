Application = require '../models/application'
{Manifest} = require '../lib/manifest'


fakePermission = '[object Object]'


updatePermissions = (app) =>
    manifest = new Manifest()
    manifest.download app, (err) =>
        if err then console.log err
        manifest.getPermissions (docTypes) ->
            app.updateAttributes permissions: docTypes, (err) ->
                if err then console.log err

module.exports = () ->
    Application.all (err, apps) =>
        for app in apps
            if app.permissions?.toString() is fakePermission.toString()
                updatePermissions app
