cozydb = require 'cozydb'

{Manifest} = require '../lib/manifest'
HttpClient = require("request-json").JsonClient
dataClient = new HttpClient "http://localhost:9101/"


module.exports = Application = cozydb.getModel 'Application',
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
    path: String
    type: String
    color: {type: String, default: null}
    package: String
    git: String
    errormsg: String
    errorcode: String
    branch: String
    port: Number
    homeposition: Object
    widget: String
    version: String
    comment: String
    needsUpdate: {type: Boolean, default: false}
    lastVersion: String
    favorite: {type: Boolean, default: false}

# Get token from token file if in production mode.
getToken = ->
    if process.env.NODE_ENV in ['production', 'test']
        try
            token = process.env.TOKEN
            return token
        catch err
            console.log err.message
            console.log err.stack
            return null
    else
        return ""

# Create application access
#   access contains :
#       * password
#       * login
#       * permissions
Application.createAccess = (access, callback) ->
    dataClient.setBasicAuth 'home', getToken()
    access.type = "application"
    dataClient.post 'access/', access, (err, res, body) ->
        callback err, new Application(body)

# Remove application access
Application::destroyAccess = (callback) ->
    dataClient.setBasicAuth 'home', getToken()
    dataClient.del "access/#{@id}/", callback

# Update application access
Application::updateAccess = (access, callback) ->
    dataClient.setBasicAuth 'home', getToken()
    access.type = "application"
    dataClient.put "access/#{@id}/",  access, (err, res, body) ->
        callback err, new Application(body)

Application::getAccess = (callback) ->
    dataClient.setBasicAuth 'home', getToken()
    dataClient.post "request/access/byApp/", key: @id, (err, res, body) ->
        if err
            callback err
        else
            callback null, body[0].value

# get token for static app
Application.getToken = (id, callback) ->
    dataClient.setBasicAuth 'home', getToken()
    dataClient.post "request/access/byApp/", key: id, (err, res, body) ->
        if err
            callback err
        else
            callback null, body[0].value

Application.all = (params, callback) ->
    Application.request "bySlug", params, callback

Application.destroyAll = (params, callback) ->
    Application.requestDestroy "all", params, callback

# Checks for an update for the current app and sets the flag needsUpdate in the
# database in this case.
#
# callback: function(err, needsUpdate)
Application::checkForUpdate = (callback) ->
    setFlag = (repoVersion) =>
        @updateAttributes needsUpdate: true, lastVersion: repoVersion, (err) ->
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
                    setFlag repoVersion

                else if @version isnt repoVersion
                    setFlag repoVersion

                else
                    callback null, false


Application::getHaibuDescriptor = () ->
    descriptor =
        user: @slug
        name: @slug
        type: @type
        domain: "127.0.0.1"
        package: @package
        repository:
            type: "git",
            url: @git
        scripts:
            start: "server.coffee"
        password: @password
    if @branch? and @branch isnt "null"
        descriptor.repository.branch = @branch
    return descriptor

