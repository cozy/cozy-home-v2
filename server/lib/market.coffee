request = require 'request-json'
log = require('printit')
    prefix: 'market'
exec = require('child_process').exec
fs = require 'fs'
del = require('del')
apps = []
isDownloading = false

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

readApps = (cb) ->
    fs.readdir './market/apps', (err, files) ->
        log.error "[Error] Read market: #{err}" if err?
        return cb(err) if err?
        apps = []
        for file in files
            try
                # Node js
                apps.push require "../../../market/apps/#{file}"
            catch
                # Coffeescript
                apps.push require "../../market/apps/#{file}"
        apps.sort comparator
        cb null, apps


download = module.exports.download = (callback) ->
    isDownloading = true

    # Retrieve market path
    if process.env.MARKET?
        # Use a specific market
        url = "https://gitlab.cozycloud.cc/zoe/cozy-registry.git"
        branch = process.env.MARKET
    else
        # Use default market
        url = "https://github.com/cozy/cozy-registry.git"
        branch = "master"

    # Clone market (cannot use github API due to rate limit)
    command =  "git clone #{url} markettmp && " + \
          "cd markettmp && " + \
          "git checkout #{branch}"
    # Clone new market in temporary folder
    exec command, {}, (err, stdout, stderr) ->

        if err?
            # If clone doesn't work, keep old market
            log.error "[Error] Clone market: #{err}" if err?
            del './markettmp', (error) ->
                callback(err) if err?

        else
            # Remove old market
            del './market', (err) ->
                log.error "[Error] delete market : #{err}" if err?
                # Replace ol;d market by new one
                exec "mv markettmp/ market", (err, stdout, stderr) ->
                    log.error "[Error] Copie market: #{err}" if err?
                    # Read all files (each app is declared in a file)
                    readApps (err, apps) ->
                        isDownloading = false
                        callback err, apps


getApps = module.exports.getApps = (cb) ->
    if apps.length > 0
        cb null, apps
    else if fs.existsSync './market/apps'
        readApps cb
    else
        if isDownloading
            setTimeout () ->
                getApps cb
            , 1000
        else
            download cb

module.exports.getApp = (app) ->
    try
        return [null, require "../../../market/apps/#{app}"]
    catch
        try
            return [null, require "../../market/apps/#{app}"]
        catch
            return ['not found', null]
