fs = require 'fs'
https = require 'https'
url = require 'url'
util = require 'util'

# Class to facilitate application' permissions management
class exports.DescriptionManager

    constructor: () ->
        @description = " "

    get: (app, callback) ->
        # Download file with application's permissions
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
                    @metaData = {}
                    err = []

                    if config.description?
                        @metaData.description = config.description
                    else
                        msg = 'package.json > description field is mandatory.'
                        err.push msg
                        console.log msg

                    if config.name?
                        @metaData.name = config.name
                    else
                        err.push 'package.json > name field is mandatory.'
                        console.log "name field mandatory"

                    if config['cozy-displayName']?
                        @metaData.displayName = config['cozy-displayName']
                    else
                        @metaData.displayName = config.name

                    if config['cozy-permissions']?
                        @metaData.permissions = config['cozy-permissions']
                    else
                        msg =  'package.json > permissions field is mandatory.'
                        err.push msg
                        console.log msg

                    if err.length > 0
                        code = 412
                    else
                        code = 200

                    callback {code: code, msgs: err}, @metaData
            else
                callback {code: 404, msgs: ['package.json not found']}, null
        request.on 'error', (error) =>
            callback null, " "