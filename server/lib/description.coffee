fs = require 'fs'
https = require 'https'
url = require 'url'
util = require 'util'
request = require 'request-json'

# Class to facilitate application' permissions management
class exports.DescriptionManager

    constructor: () ->
        @description = " "

    get: (app, callback) ->
        metaData = {}

        getStars = ->
            clientStars = request.newClient "https://api.github.com/"
            path = "repos/#{basePath}/stargazers"
            clientStars.get path, (err, res, body) ->
                metaData.stars = body.length
                callback metaData

        # Download file with application's permissions
        basePath = (app.git).substring(19, (app.git.length - 4))
        if app.branch?
            basePath = basePath + '/' + app.branch
        else
            basePath = basePath + '/master'
        path =  basePath + '/package.json'
        client = request.newClient "https://raw.github.com/"
        client.get path, (err, res, config) =>

            if res.statusCode is 404
                callback {code: 404, msgs: ['package.json not found']}, null

            else if res.statusCode is 500
                callback {code: 500, msgs: ['server error occured']}, null

            else
                if config.description?
                    metaData.description = config.description

                if config.name?
                    metaData.name = config.name.replace 'cozy-', ''

                if config['cozy-displayName']?
                    metaData.displayName = config['cozy-displayName']
                else
                    metaData.displayName = config.name.replace 'cozy-', ''

                if config['cozy-permissions']?
                    metaData.permissions = config['cozy-permissions']

                getStars()
