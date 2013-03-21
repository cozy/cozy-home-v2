module.exports = (compound) ->

    express = require 'express'
    app = compound.app
    app.enable 'coffee'

    app.use express.static  "#{app.root}/client/public", maxAge: 86400000
    app.use express.bodyParser()
    app.use express.methodOverride()
    app.use app.router
