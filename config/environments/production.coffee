express = require 'express'
logging = require '../../lib/logging'

module.exports = (compound) ->
    app = compound.app
    logging.init compound, (stream) ->
        app.configure 'production', ->
            app.set 'quiet', true
            app.use express.errorHandler