request = require 'request-json'
logger = require('printit')
    prefix: 'market'
exec = require('child_process').exec
fs = require 'fs'
del = require('del')
apps = []

module.exports.download = (callback) ->
    if apps.length > 0
        # Market are already downloaded
        callback null, apps
    else
        if process.env.MARKET?
            # Use a specific market
            url = "https://gitlab.cozycloud.cc/zoe/cozy-registry.git"
            branch = process.env.MARKET
        else
            # Use default market
            url = "https://github.com/cozy-labs/cozy-registry.git"
            branch = "master"

        # Clone market (cannot use github API due to rate limit)
        command =  "git clone #{url} market && " + \
              "cd market && " + \
              "git checkout #{branch} && " + \
              "git submodule update --init --recursive"
        # Remove old clone
        del './market', (err) ->
            exec command, {}, (err, stdout, stderr) ->
                # Read all files (each app is declared in a file)
                fs.readdir './market/apps', (err, files) ->
                    for file in files
                        try
                            # Node js
                            apps.push require "../../../market/apps/#{file}"
                        catch
                            # Coffeescript
                            apps.push require "../../market/apps/#{file}"
                    callback err, apps
