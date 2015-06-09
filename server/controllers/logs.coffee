fs = require 'fs'
path = require 'path'

# Blue, green and red markers
colors = /(\x1B\[[0-9]*m)/g

module.exports =

    # This controller pipes the log file corresponding to given app slug.
    # It loads them from the folder /usr/local/var/log/cozy.
    logs: (req, res, next) ->
        filename = "#{req.params.moduleslug}.log"
        filepath = path.join '/', 'usr', 'local', 'var', 'log', 'cozy', filename

        fs.exists filepath, (exists) ->
            if exists
                stream = fs.createReadStream("#{filepath}")

                # We remove color markers during the stream.
                stream.on 'data', (data) ->
                    res.write data.toString().replace colors, ''
                stream.on 'end', ->
                    res.end()
            else
                res.status(404).send 'File not found'
