express = require 'express'

#httpProxy = require 'http-proxy'
#routingProxy = new httpProxy.ReverseProxy()
#apiProxy = (pattern, host, port) ->
#  (req, res, next) ->
#    if req.url.match(pattern)
#      routingProxy.proxyRequest req, res, host: host, port: port
#    else
#      next()


app.configure ->
    cwd = process.cwd()
    
    app.set 'views', cwd + '/app/views'
    app.set 'view engine', 'jade'
    app.set 'view options', complexNames: true
    app.enable 'coffee'

    app.use express.static cwd + '/public', maxAge: 86400000
    app.use express.bodyParser()
    app.use express.cookieParser 'secret'
    app.use express.session secret: 'secret'
    app.use express.methodOverride()
    app.use app.router

#    app.use apiProxy /noty-plus/, 4567, "localhost"
    #require('proxy-by-url')({
    # '/noty-plus': { port: 4567, host: 'localhost' },
    #})


# Tools
#railway.tools.database = ->
#    switch (railway.args.shift())
#        when 'clean' then console.log "clean"
#        when 'initialize' then console.log "initialize"
#        else
#            console.log 'Usage: railway database [clean|backup|restore]'



