module.exports = (compound) ->
    express = require('express')
    app = compound.app
    app.configure 'development', ->
        app.enable 'log actions'
        app.enable 'env info'
        app.use express.errorHandler
            dumpExceptions: true
            showStack: true
