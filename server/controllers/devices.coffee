Client = require("request-json").JsonClient
fs = require('fs')
Device = require '../models/device'

# we need to access the DS directly because the /device/ api
# is specific therefore not handled by the ODM
ds = new Client "http://localhost:9101/"

# auth is required only in test and production env
if process.env.NODE_ENV in ['test', 'production']
    ds.setBasicAuth process.env.NAME, process.env.TOKEN

module.exports =

    devices: (req, res, next) ->
        Device.all (err, devices) ->
            if err then next err
            else res.send rows: devices

    remove: (req, res, next) ->
        id = req.params.deviceid
        Device.find id, (err, device) ->
            if err? then next err
            else
                # proper removal of the device (device doc and filter)
                ds.del "access/#{id}/", (err, response, body) ->
                    log.error err if err
                    device.destroy (err) ->
                        err = err or body.error
                        if err? then next err
                        else
                            res.send 200, success: true
