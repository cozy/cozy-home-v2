request = require 'request-json'
localizationManager = require '../helpers/localization_manager'
logger = require('printit')
    prefix: 'manifest'
cozydb = require 'cozydb'


# Abstraction for application manifest helpers (download and information
# extraction).
class exports.Manifest


    # Attempt to download application NPM manifest from three different
    # location (location selection is based on manifest information):
    #
    # * NPM registry
    # * Gitlab repository
    # * Github repository
    download: (app, callback) ->

        if app.package?

            if app.package is '[object Object]'
                # the app is corrupted, we have lost package name
                packageName = app.name # try with the app name
                @downloadFromNpm packageName, (err, manifest) ->
                    return callback null, manifest unless err

                    err = new Error("Application #{app.name} manifest was lost")
                    # the app name isnt package name
                    if app.id
                        cozydb.updateAttributes 'application', app.id, {
                            state: 'broken'
                            password: null
                            errormsg: "#{err.message}:\n #{err.stack}"
                            errorcode: 500
                        }, -> callback err
                    else
                        callback err

            else if typeof(app.package) is 'string'
                packageName = app.package
                @downloadFromNpm packageName, callback

            else if app.package.type is 'npm'
                packageName = app.package.name
                @downloadFromNpm packageName, callback

            else
                logger.warn(
                    "Cannot get manifest for #{app.name}, wrong package type")
                @config = {}
                callback null, {}

        else if app.git?

            providerName = app.git.match /(github\.com|gitlab\.cozycloud\.cc|framagit\.org)/
            if not providerName?
                logger.warn "Unknown provider '#{app.git}'"

            # By default, the provider will be Gitlab
            if providerName?[0] is "github.com"
                Provider = require('./git_providers').GithubProvider
            else
                Provider = require('./git_providers').CozyGitlabProvider

            provider = new Provider app
            provider.getManifest (err, data) =>
                @config = {}
                @config = data unless err?
                callback err, data

        else
            @config = {}
            logger.warn(
                'App manifest without recognized git URL or package field')
            logger.raw app
            callback null, {}


    # Download the manifest from the NPM registry. This manifest has many
    # information (it includes history). So we extract the latest version
    # of the application manifest.
    downloadFromNpm: (packageName, callback) ->
        client = request.createClient "https://registry.npmjs.org/"
        client.get packageName, (err, res, data) =>
            if res?.statusCode is 404
                callback localizationManager.t 'manifest not found'
            else if err
                callback err
            else
                manifest = data.versions[data['dist-tags'].latest]
                @config = manifest
                callback null, manifest


    getPermissions: =>
        if @config?["cozy-permissions"]?
            return @config["cozy-permissions"]
        else
            return {}


    getWidget: =>
        if @config['cozy-widget']?
            return @config["cozy-widget"]
        else
            return null


    getVersion: =>
        if @config?['version']?
            return @config['version']
        else
            return "0.0.0"


    getDescription: =>
        if @config?['description']?
            return  @config["description"]
        else
            return null


    getIconPath: =>
        if @config?['icon-path']?
            return @config['icon-path']
        else
            return null


    getColor: ->
        if @config?['cozy-color']?
            return @config['cozy-color']
        else
            return null


    getType: =>
        return @config?['cozy-type'] or {}


    getMetaData: =>
        metaData = {}

        if @config.description?
            metaData.description = @config.description

        if @config.name?
            metaData.name = @config.name.replace 'cozy-', ''

        if @config.slug?
            metaData.slug = @config.slug

        # add the fact it's a static app in metadata
        if @config['cozy-type']?
            metaData.type = @config['cozy-type']

        if @config['cozy-displayName']?
            metaData.displayName = @config['cozy-displayName']
        else
            # Some app not in marketplace may have no name
            metaData.displayName = @config.name?.replace 'cozy-', ''
            metaData.displayName = metaData.displayName?.replace '-', ' '

        if @config['icon-path']?
            metaData.iconPath = @config['icon-path']

        if @config['cozy-permissions']?
            metaData.permissions = @config['cozy-permissions']

        if @config['cozy-color']
            metaData.color = @config['cozy-color']

        return metaData
