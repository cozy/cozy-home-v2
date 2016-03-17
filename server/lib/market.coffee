request = require 'request-json'
Client = request.JsonClient
fs = require 'fs'
url = require 'url'

apps = []
isDownloading = false

download = module.exports.download = (callback) ->

    isDownloading = true

    # Retrieve market url
    if process.env.MARKET?
        # Use a specific market
        urlRegistry =  url.parse process.env.MARKET
    else
        # Use default market
        urlRegistry =  url.parse "https://registry.cozycloud.cc/cozy-registry.json"

    version = 0
    commit = 0
    if fs.existsSync './market.json'
        data = fs.readFileSync './market.json', 'utf8'
        try
            oldMarket = JSON.parse(data)
            version = oldMarket.version
            commit = oldMarket.commit

    # Turn these two line on to experiment with market locally
    # apps = oldMarket.apps_list
    # return callback null, apps

    client = new Client "#{urlRegistry.protocol}//#{urlRegistry.host}"
    switch process.env.NODE_ENV
        when 'production'
            client.headers['user-agent'] = 'cozy'
        when 'test'
            client.headers['user-agent'] = 'cozy-test'
        else
            client.headers['user-agent'] = 'cozy-dev'
    client.get "#{urlRegistry.pathname}?version=#{version}&commit=#{commit}", (err, res, body) ->
        if not err and body.apps_list? and Object.keys(body.apps_list).length > 0
            apps = body.apps_list
            fs.writeFileSync './market.json', JSON.stringify(body)
        else if oldMarket?
            apps = oldMarket.apps_list
        else
            apps = []
        callback err, apps


getApps = module.exports.getApps = (cb) ->
    if Object.keys(apps).length > 0
        cb null, apps
    else if fs.existsSync './market.json'
        data = fs.readFileSync './market.json', 'utf8'
        market = JSON.parse(data)
        cb null, market.apps_list
    else
        if isDownloading
            setTimeout () ->
                getApps cb
            , 1000
        else
            download cb


module.exports.getApp = (appli) ->
    appsMap = {}
    appsMap[app.slug] = app for app in apps
    return appsMap[appli]
