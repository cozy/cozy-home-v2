module.exports = (compound) ->
    express = require('express')
    app = compound.app

    app.configure 'production', ->
        app.use express.errorHandler()
        app.enable 'quiet'
