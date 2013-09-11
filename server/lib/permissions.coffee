fs = require 'fs'
url = require 'url'
request = require 'request-json'

# Class to facilitate application' permissions management
class exports.PermissionsManager

    constructor: () ->
        @docTypes = {}

    get: (app, callback) ->
        path = (app.git).substring(19, (app.git.length - 4))

        client = request.newClient "https://raw.github.com/"

        config = ""
        client.get path + '/master/package.json', (err, res, body) =>
            if err
                console.log err
                callback null, {}
            else
                if res.statusCode isnt 404
                    if body["cozy-permissions"]?
                        @docTypes = body["cozy-permissions"]
                    callback null, @docTypes
                else
                    callback null, {}
