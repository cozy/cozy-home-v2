request = require("request-json")
fs = require('fs')
Device = require '../models/device'

module.exports =

    devices: (req, res, next) ->
        Device.all (err, devices) ->
            if err then next err
            else res.send rows: devices