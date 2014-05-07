Client = require("request-json").JsonClient
fs = require('fs')
Device = require '../models/device'

ds = new Client "http://localhost:9101/"
if process.env.NODE_ENV in ['test', 'production']
    ds.setBasicAuth process.env.NAME, process.env.TOKEN

module.exports =

    devices: (req, res, next) ->
        Device.all (err, devices) ->
            if err then next err
            else res.send rows: devices

    remove: (req, res, next) ->
        id = req.params.id
        Device.find id, (err, device) ->
            if err? then next err
            else
                ds.del "device/#{id}/", (err, res, body) ->
                    err = err or body.error
                    if err? then next err
                    else
                        res.send 200, success: true
