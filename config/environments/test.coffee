module.exports = (compound) ->
    express = require('express')
    app = compound.app

    app.configure 'test', ->
        app.enable 'quiet'
        app.enable 'view cache'
        app.enable 'model cache'
        app.enable 'eval cache'
        app.use express.errorHandler
            dumpExceptions: true
            showStack: true
