request = require("request-json")
fs = require('fs')
slugify = require 'cozy-slug'
spawn = require('child_process').spawn
log = require('printit')
    prefix: "applications"

StackApplication = require '../models/stack_application'

sendError = (res, err, code=500) ->
    err ?=
        stack:   null
        message: "Server error occured"

    console.log "Sending error to client :"
    console.log err.stack

    res.send code,
        error: true
        success: false
        message: err.message
        stack: err.stack


module.exports =

    get: (req, res, next) ->
        StackApplication.all (err, apps) ->
            if err then next err
            else res.send rows: apps

    update: (req, res, next) ->
        updateStack = spawn 'cozy-monitor', ['update-all-cozy-stack',  process.env.TOKEN], {'detached':true, 'stdio': ['ignore', 'ignore', 'ignore']}

        updateStack.unref()
