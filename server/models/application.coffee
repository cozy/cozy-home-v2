americano = require 'americano-cozy'
printit = require 'printit'
{Manifest} = require '../lib/manifest'

module.exports = Application = americano.getModel 'Application',
    name: String
    displayName: String
    description: String
    slug: String
    state: String
    isStoppable: {type: Boolean, default: false}
    date: {type: Date, default: Date.now}
    icon: String
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
# cb: function(err, needsUpdate)
Application::checkForUpdate = (cb) ->
    setFlag = () =>
        @needsUpdate = true
        @save (ers) =>
            if ers
                cb "Error when setting the needsUpdate flag: #{ers}"
                return
            cb null, true
            return
        return

    # abort early if the app already has the set flag
    if @needsUpdate
        cb null, false
        return

    # Retrieve manifest
    manifest = new Manifest()
    manifest.download @, (erm) =>
        if erm
            cb "Error when downloading manifest: #{erm}"
            return

        # Maybe set the needsUpdate flag
        repoVersion = manifest.getVersion()
        if not repoVersion?
            cb null, false
            return

        if not @version?
            # if the app has not version but the version on the repo has one, we
            # set the needsUpdate flag, in doubt. In the worst case, the app
            # on the cozy has the same version, but there's no way we can
            # figure out.
            setFlag()
            return

        if @version isnt repoVersion
            setFlag()
            return

        cb null, false
        return
    @

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
