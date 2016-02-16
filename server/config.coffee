americano = require 'americano'
fs        = require 'fs'
path      = require 'path'

clientPath   = path.resolve(__dirname, '..', 'client', 'public')
useBuildView = fs.existsSync path.resolve(__dirname, 'views', 'index.js')

config =

    common:
        set:
            'view engine': if useBuildView then 'js' else 'jade'
            'views': path.resolve __dirname, 'views'
        engine:
            js: (path, locales, callback) ->
                callback null, require(path)(locales)
        use: [
            americano.bodyParser()
            americano.methodOverride()
            americano.errorHandler
                dumpExceptions: true
                showStack: true
            americano.static clientPath,
                maxAge: 86400000
        ]

    development: [
        americano.logger 'dev'
    ]

    production: [
        americano.logger 'short'
    ]

    plugins: [
        'cozydb'
    ]

module.exports = config
