fs = require 'fs'
path = require 'path'
async = require 'async'


# Utilities to retrieve log paths and contents.
module.exports = logs =


    # Blue, green and red markers
    colors: /(\x1B\[\d+m)/g


    # Return the log path for a given app slug.
    getLogPath: (slug) ->
        filename = "#{slug}.log"
        return path.join '/', 'usr', 'local', 'var', 'log', 'cozy', filename


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
                logContents[slug] = content.replace logs.colors, ''

                next()
        , ->
            callback null, logContents

