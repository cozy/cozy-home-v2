http = require 'http'

# Module to handle file download with the low level http api instead of
# request. This is due to a too high memory consumption while dowloading big
# files with request.
module.exports =

    # Returns the file in a callback as a readable stream of data.
    download: (path, callback) ->
        id = process.env.NAME
        pwd = process.env.TOKEN

        basic = "Basic #{new Buffer("#{id}:#{pwd}").toString('base64')}"
        options =
            host: 'localhost'
            port: 9101
            path: path
            headers:
                Authorization: basic

        http.get options, callback
