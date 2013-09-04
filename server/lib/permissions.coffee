fs = require 'fs'
https = require 'https'
url = require 'url'

# Class to facilitate application' permissions management
class exports.PermissionsManager

    constructor: () ->
        @docTypes = {}

    get: (app, callback) ->
        path = (app.git).substring(19, (app.git.length - 4))
        path = "https://raw.github.com/" + path + '/master/package.json'
        options =
            host: url.parse(path).host
            path: url.parse(path).path
        config = ""
        request = https.get options, (response) =>
            if response.headers.status isnt "404 Not Found"
                response.on('data', (data) =>
                    config = JSON.parse(data)
                ).on 'end', () =>
                    # Read application's permissions
                    if config["cozy-permissions"]?
                        @docTypes = config["cozy-permissions"]
                    callback null, @docTypes
            else
                callback null, {}
        request.on 'error', (error) =>
            callback null, {}
