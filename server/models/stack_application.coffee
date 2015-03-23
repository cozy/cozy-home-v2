americano = require 'americano-cozy'

{Manifest} = require '../lib/manifest'


module.exports = StackApplication = americano.getModel 'StackApplication',
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
    setFlag = (repoVersion) =>
        @updateAttributes lastVersion: repoVersion, (err) =>
            if err
                callback err
            else
                callback null, true
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

            else if not @version?
                # if the app has not version but the version on the repo
                # has one, we set the needsUpdate flag, in doubt. In the
                # worst case, the app on the cozy has the same version, but
                # there's no way we can
                # figure out.
                setFlag repoVersion
            else if @version isnt repoVersion
                setFlag repoVersion
            else
                callback null, false
