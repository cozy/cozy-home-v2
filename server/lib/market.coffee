request = require 'request-json'
log = require('printit')
    prefix: 'market'
exec = require('child_process').exec
fs = require 'fs'
del = require('del')
apps = []

# sort the applications list by official/community status, then by name
comparator = (a, b) ->
    if a.comment is 'official application' \
    and b.comment isnt 'official application'
        return -1
    else if a.comment isnt 'official application' \
    and b.comment is 'official application'
        return 1
    else if a.name > b.name
        return 1
    else if a.name < b.name
        return -1
    else
        return 0

module.exports.download = (callback) ->
    if apps.length > 0
        # Market is already downloaded
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
              "git checkout #{branch}"
        # Remove old clone
        del './market', (err) ->
            log.error "[Error] delete market : #{err}" if err?
            exec command, {}, (err, stdout, stderr) ->
                log.error "[Error] Clone market: #{err}" if err?
                return callback(err) if err?
                # Read all files (each app is declared in a file)
                fs.readdir './market/apps', (err, files) ->
                    log.error "[Error] Read market: #{err}" if err?
                    return callback(err) if err?
                    for file in files
                        try
                            # Node js
                            apps.push require "../../../market/apps/#{file}"
                        catch
                            # Coffeescript
                            apps.push require "../../market/apps/#{file}"

                    apps.sort comparator
                    callback err, apps
