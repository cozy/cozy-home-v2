fs = require 'fs'
logs = require '../lib/logs'

module.exports =

    # This controller pipes the log file corresponding to given app slug.
    # It loads them from the folder /usr/local/var/log/cozy.
    logs: (req, res, next) ->
        filepath = logs.getLogPath req.params.moduleslug

        fs.exists filepath, (exists) ->
            if exists
                stream = fs.createReadStream("#{filepath}")

                # We remove color markers during the stream.
                stream.on 'data', (data) ->
                    res.write data.toString().replace logs.colors, ''
                stream.on 'end', ->
                    res.end()
            else
                res.status(404).send 'File not found'
