request             = require("request-json")
fs                  = require('fs')
slugify             = require 'cozy-slug'
spawn               = require('child_process').spawn
log                 = require('printit')
    prefix: "applications"

{AppManager}        = require '../lib/paas'
StackApplication    = require '../models/stack_application'
localizationManager = require '../helpers/localization_manager'


sendError = (res, err, code=500) ->
    err ?=
        stack:   null
        message: localizationManager.t "server error"

    console.log "Sending error to client:"
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
        manager = new AppManager()
        manager.updateStack (err, result) ->
            if err?
                log.error err
                sendError res, err
            else
                res.send 200


    reboot: (req, res, next) ->
        manager = new AppManager()
        manager.restartController (err, result) ->
            if err?
                log.error err
                sendError res, err
            else
                res.send 200

