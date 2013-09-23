fs = require 'fs'
url = require 'url'
request = require 'request-json'

# Class to facilitate application' permissions management
class exports.WidgetManager

    constructor: () ->

    get: (app, callback) ->
        path = (app.git).substring(19, (app.git.length - 4))
        if app.branch?
            path = path + '/' + app.branch
        else
            path = path + '/master'

        client = request.newClient "https://raw.github.com/"

        client.get path + '/package.json', (err, res, body) =>
            if err
                console.log err
                callback null, {}
            else
                if res.statusCode isnt 404
                    if body["cozy-widget"]?
                        @widget = body["cozy-widget"]
                    else
                        @widget = null
                    console.log @widget
                    callback null, @widget
                else
                    callback null, null
