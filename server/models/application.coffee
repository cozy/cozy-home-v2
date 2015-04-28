americano = require 'americano-cozy'

{Manifest} = require '../lib/manifest'
HttpClient = require("request-json").JsonClient
dataClient = new HttpClient "http://localhost:9101/"


module.exports = Application = americano.getModel 'Application',
    name: String
    displayName: String
    description: String
    slug: String
    state: String
    isStoppable: {type: Boolean, default: false}
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

# Get token from token file if in production mode.
getToken = ->
    if process.env.NODE_ENV is 'production'
        try
            token = process.env.TOKEN
            return token
        catch err
            console.log err.message
            console.log err.stack
            return null
    else
        return ""


Application.createAccess = (params, callback) ->
    dataClient.setBasicAuth 'home', getToken()
    params.type = "application"
    dataClient.post 'access/', params, (err, res, body) ->
        callback err, new Application(body)

Application::destroyAccess = (callback) ->
    dataClient.setBasicAuth 'home', getToken()
    dataClient.del "access/#{@id}/", callback

Application::updateAccess = (params, callback) ->
    dataClient.setBasicAuth 'home', getToken()
    dataClient.put "access/#{@id}/",  params, (err, res, body) ->
        callback err, new Application(body)

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
        callback null, true
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
