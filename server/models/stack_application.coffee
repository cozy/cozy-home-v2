cozydb = require 'cozydb'

{Manifest} = require '../lib/manifest'


module.exports = StackApplication = cozydb.getModel 'StackApplication',
    name: String
    version: String
    lastVersion: String
    git: String

StackApplication.all = (params, callback) ->
    StackApplication.request "all", params, callback


# Checks for an update for the current app and sets the flag needsUpdate in the
# database in this case.
#
# callback: function(err, needsUpdate)
StackApplication::checkForUpdate = (callback) ->
    setFlag = (repoVersion, cb) =>
        @updateAttributes lastVersion: repoVersion, (err) ->
            if err
                cb err
            else
                cb()

    # Retrieve manifest
    manifest = new Manifest()
    manifest.download @, (err) =>
        if err
            callback err
        else
            # Maybe set the needsUpdate flag
            repoVersion = manifest.getVersion()
            if not repoVersion?
                callback null, false

            else
                setFlag repoVersion, (err) =>
                    return callback err if err?
                    if not @version? or @version isnt repoVersion
                        # if the app has not version but the version on the repo
                        # has one, we set the needsUpdate flag, in doubt. In the
                        # worst case, the app on the cozy has the same version,
                        # but there's no way we can figure out.
                        callback null, true
                    else
                        callback null, false
