request = require 'request-json'

# Class to facilitate application' permissions management
class exports.Manifest

    download: (app, callback) ->
        @basePath = (app.git).substring(19, (app.git.length - 4))

        client = request.newClient "https://raw.github.com/"
        if app.branch?
            path = @basePath + '/' + app.branch
        else
            path = @basePath + '/master'

        client.get path + '/package.json', (err, res, body) =>
            callback err if err
            @config = body
            clientStars = request.newClient "https://api.github.com/"
            path = "repos/#{@basePath}/stargazers"
            clientStars.get path, (err, res, body) =>
                @config.stars = body.length
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

    getDescription: =>
        if @config['description']?
            return  @config["description"]
        else
            return null

    getMetaData: =>
        metaData = {}
        path = @basePath + '/master/package.json'

        getStars = (callback) ->
            clientStars = request.newClient "https://api.github.com/"
            path = "repos/#{@basePath}/stargazers"
            clientStars.get path, (err, res, body) ->
                metaData.stars = body.length
                callback metaData

        if @config.description?
            metaData.description = @config.description

        if @config.name?
            metaData.name = @config.name.replace 'cozy-', ''

        if @config['cozy-displayName']?
            metaData.displayName = @config['cozy-displayName']
        else
            metaData.displayName = @config.name.replace 'cozy-', ''

        if @config['cozy-permissions']?
            metaData.permissions = @config['cozy-permissions']

        if @config.stars?
            metaData.stars = @config.stars

        return metaData
