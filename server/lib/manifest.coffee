request = require 'request-json'
logger = require('printit')
    prefix: 'manifest'

# Class to facilitate applications' permissions management
class exports.Manifest

    download: (app, callback) ->

        # we can be smarter here
        if app.git?
            providerName = app.git.match /(github\.com|gitlab\.cozycloud\.cc)/
            providerName = providerName[0]

            # This could be moved to a separate factory class...
            if providerName is "gitlab.cozycloud.cc"
                Provider = require('./git_providers').CozyGitlabProvider
            else # fallback to github
                Provider = require('./git_providers').GithubProvider

            provider = new Provider app
            provider.getManifest (err, data) =>
                if err?
                    callback err
                else
                    @config = data
                    provider.getStars (err, stars) =>
                        if err?
                            callback err
                        else
                            @config.stars = stars
                            callback null
        else
            logger.warn 'App manifest without git URL'
            logger.raw app
            callback null


    getPermissions: =>
        if @config["cozy-permissions"]?
            return @config["cozy-permissions"]
        else
            return {}

    getWidget: =>
        if @config['cozy-widget']?
            return @config["cozy-widget"]
        else
            return null

    getVersion: =>
        if @config['version']?
            return @config['version']
        else
            return "0.0.0"

    getDescription: =>
        if @config['description']?
            return  @config["description"]
        else
            return null

    getIconPath: =>
        if @config['icon-path']?
            return @config['icon-path']
        else
            return null

    getColor: ->
        if @config['cozy-color']?
            return @config['cozy-color']
        else
            return null

    getMetaData: =>
        metaData = {}

        if @config.description?
            metaData.description = @config.description

        if @config.name?
            metaData.name = @config.name.replace 'cozy-', ''

        if @config['cozy-displayName']?
            metaData.displayName = @config['cozy-displayName']
        else
            metaData.displayName = @config.name.replace 'cozy-', ''
            metaData.displayName = metaData.displayName.replace '-', ' '

        if @config['icon-path']?
            metaData.iconPath = @config['icon-path']

        if @config['cozy-permissions']?
            metaData.permissions = @config['cozy-permissions']

        if @config.stars?
            metaData.stars = @config.stars

        if @config['cozy-color']
            metaData.color = @config['cozy-color']

        return metaData
