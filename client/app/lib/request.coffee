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

            if callback? and data?
                try
                    data = JSON.parse data.responseText
                catch err
                    data = data.responseText

                if data.msg?
                    msg = data.msg

                else if data.error?
                    msg = data.error

                else
                    msg = "Server error occured"

                err = new Error msg
                err.data = data
                callback err

            else
                callback?()

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

# Sends a head request
# Expected callbacks: success and error
exports.head = (url, callbacks) ->
    exports.request "HEAD", url, null, callbacks

