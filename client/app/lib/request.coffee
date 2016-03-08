# Make ajax request easier to write.


# Expected callback: err as first parameter
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
            callback? null, data
        error: (data) ->
            fired = true

            if data?.getResponseHeader("X-Cozy-Login-Page")
                window.location.replace '/login'

            else if callback? and data?
                try
                    data = JSON.parse data.responseText
                catch err
                    data = data.responseText

                msg = data.msg or data.error or "Server error occured"
                err = new Error msg
                err.data = data
                callback err

            else
                callback?()

    req.always ->
        unless fired
            callback new Error "Server error occured", data


# Sends a get request
exports.get = (url, callback) ->
    exports.request "GET", url, null, callback

# Sends a post request
exports.post = (url, data, callback) ->
    exports.request "POST", url, data, callback

# Sends a put request with data as body
exports.put = (url, data, callback) ->
    exports.request "PUT", url, data, callback

# Sends a delete request with data as body
exports.del = (url, callback) ->
    exports.request "DELETE", url, null, callback

# Sends a head request
exports.head = (url, callback) ->
    exports.request "HEAD", url, null, callback


$(document).ajaxError (event, xhr) ->
    if xhr?.getResponseHeader("X-Cozy-Login-Page")
        window.location.replace '/login'
