fs = require 'fs'
path = require 'path'
async = require 'async'
fstream = require 'fstream'
tar = require 'tar'
zlib = require 'zlib'


# Utilities to retrieve log paths and contents.
module.exports = logs =


    # Blue, green and red markers
    colors: /(\x1B\[\d+m)/g


    # Return the log path for a given app slug.
    getLogPath: (slug) ->
        filename = "#{slug}.log"
        filepath = path.join '/', 'usr', 'local', 'var', 'log', 'cozy', filename
        backuppath = "#{filepath}-backup"
        if (not fs.existsSync filepath) and fs.existsSync backuppath
            return backuppath
        else
            return filepath


    # Returns log content for given app.
    # It removes color markers from the result.
    getLogs: (slug, callback) ->
        logPath = logs.getLogPath slug
        fs.readFile logPath, (err, logContent) ->
            callback err, logContent?.toString().replace logs.colors, ''


    # Return log contents for given set of apps.
    # It removes color markers from the result.
    # Data are returned as object where keys are slug and values are contents.
    getManyLogs: (slugs, callback) ->
        logContents = {}

        async.eachSeries slugs, (slug, next) ->
            logPath = logs.getLogPath slug
            # We ignore error. It shouldn't break the flow is a file is
            # missing
            fs.readFile logPath, (err, logContent) ->
                content = logContent?.toString()
                logContents[slug] = content?.replace logs.colors, ''

                next()
        , ->
            callback null, logContents

    getCompressLogs: (callback) ->
        archivePath = path.join __dirname, '..', '..', 'cozy.tar.gz'
        logPath = '/usr/local/var/log/cozy'
        readStream = fstream.Reader 'path': logPath, 'type': 'Directory'
        readStream.pipe(tar.Pack())
        .pipe(zlib.Gzip())
        .pipe fstream.Writer('path': archivePath)
        readStream.on 'end', () ->
            callback archivePath


