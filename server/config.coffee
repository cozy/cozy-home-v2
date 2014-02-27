americano = require 'americano'
fs = require 'fs'

# public path depends on what app is running (./server or ./build/server)
publicPath = __dirname + '/../client/public'
try
    fs.lstatSync publicPath
catch e
    publicPath = __dirname + '/../../client/public'

config =
    common: [
        americano.bodyParser()
        americano.methodOverride()
        americano.errorHandler
            dumpExceptions: true
            showStack: true
        americano.static publicPath,
            maxAge: 86400000
    ]
    development: [
        americano.logger 'dev'
    ]
    production: [
        americano.logger 'short'
    ]
    plugins: [
        'americano-cozy'
    ]

module.exports = config
