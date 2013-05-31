fs = require 'fs'
https = require 'https'
url = require 'url'

# Class to facilitate application' permissions management
class exports.PermissionsManager

    constructor: () ->
        @docTypes = {}

    get: (app, callback) ->
        # Download file with application's permissions
        try
            fs.unlink('/etc/cozy/manifests/#{app.name}.json')
        path = (app.git).substring(19, (app.git.length - 4))
        path = "https://raw.github.com/" + path + '/master/package.json'
        options = 
            host: url.parse(path).host
            path: url.parse(path).path
        config = ""
        file = fs.createWriteStream "/etc/cozy/manifests/#{app.name}.json"
        https.get options, (response) =>
            response.on('data', (data) =>
                console.log data
                config = JSON.parse(data)
            ).on 'end', () =>
                # Read application's permissions
                if config.permissions?
                    docTypes = config.permissions
                callback null, docTypes

    add: () ->

