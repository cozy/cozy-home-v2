request = require("request-json")
fs = require('fs')
slugify = require 'cozy-slug'
exec = require('child_process').exec
log = require('printit')
    prefix: "applications"

StackApplication = require '../models/stack_application'


module.exports =

    get: (req, res, next) ->
        StackApplication.all (err, apps) ->
            if err then next err
            else res.send rows: apps

    update: (req, res, next) ->
        exec "cozy-monitor update-all-cozy-stack #{process.env.TOKEN}", (err) ->
            return sendError res, err if err

