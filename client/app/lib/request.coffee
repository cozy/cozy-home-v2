# Make ajax request easier to write.

# Expected callbacks: success and error
exports.request = (type, url, data, callback) ->
    body = if data? then JSON.stringify data else null

    fired = false
    req = $.ajax
        type: type
        url: url
        data: body
        contentType: "application/json"
        dataType: "json"
        success: (data) ->
            fired = true
            callback null, data if callback?
        error: (data) ->
            fired = true
            if data?
                data = JSON.parse data.responseText
                if data.msg? and callback?
                    callback new Error data.msg, data
                else if data.error? and callback?
                    data.msg = data.error
                    callback new Error data.msg, data
            else if callback?
                callback new Error "Server error occured", data
    req.always ->
        unless fired
            callback new Error "Server error occured", data

# Sends a get request with data as body
# Expected callbacks: success and error
exports.get = (url, callback) ->
    exports.request "GET", url, null, callback

# Sends a post request with data as body
# Expected callbacks: success and error
exports.post = (url, data, callback) ->
    exports.request "POST", url, data, callback

# Sends a put request with data as body
# Expected callbacks: success and error
exports.put = (url, data, callback) ->
    exports.request "PUT", url, data, callback

# Sends a delete request with data as body
# Expected callbacks: success and error
exports.del = (url, callback) ->
    exports.request "DELETE", url, null, callback
