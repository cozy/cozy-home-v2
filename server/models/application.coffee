americano = require 'americano-cozy'

{Manifest} = require '../lib/manifest'


module.exports = Application = americano.getModel 'Application',
    name: String
    displayName: String
    description: String
    slug: String
    state: String
    isStoppable: {type: Boolean, default: true}
    date: {type: Date, default: Date.now}
    icon: String
    iconPath: String
    iconType: String
    color: {type: String, default: null}
    git: String
    errormsg: String
    branch: String
    port: Number
    permissions: Object
    password: String
    homeposition: Object
    widget: String
    version: String
    needsUpdate: {type: Boolean, default: false}
    _attachments: Object

Application.all = (params, callback) ->
    Application.request "bySlug", params, callback

Application.destroyAll = (params, callback) ->
    Application.requestDestroy "all", params, callback

# Checks for an update for the current app and sets the flag needsUpdate in the
# database in this case.
#
# callback: function(err, needsUpdate)
Application::checkForUpdate = (callback) ->
    setFlag = =>
        @updateAttributes needsUpdate: true, (err) ->
            if err
                callback err
            else
                callback null, true

    # abort early if the app already has the set flag
    if @needsUpdate
        callback null, false
    else
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
                    setFlag()

                else if @version isnt repoVersion
                    setFlag()

                else
                    callback null, false


Application::getHaibuDescriptor = () ->
    descriptor =
        user: @slug
        name: @slug
        domain: "127.0.0.1"
        repository:
            type: "git",
            url: @git
        scripts:
            start: "server.coffee"
        password: @password
    if @branch? and @branch isnt "null"
        descriptor.repository.branch = @branch
    return descriptor
