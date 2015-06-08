fs = require 'fs'
path = require 'path'

module.exports =

    # This controller pipes the log file corresponding to given app slug.
    # It loads them from the folder /usr/local/var/log/cozy.
    logs: (req, res, next) ->
        filename = "#{req.params.moduleslug}.log"
        filepath = path.join '/', 'usr', 'local', 'var', 'log', 'cozy', filename
        fs.exists filepath, (exists) ->
            if exists
                fs.createReadStream("#{filepath}").pipe res
            else
                res.status(404).send 'File not found'
