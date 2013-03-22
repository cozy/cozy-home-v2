module.exports = (compound) ->
    express = require('express')
    app = compound.app
    app.use express.errorHandler()
    app.enable 'quiet'
