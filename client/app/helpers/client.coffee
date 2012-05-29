# Simple HTTP client to request backend easily.


exports.get = (url, callbacks) ->
    $.ajax
        type: 'GET'
        url: url
        success: (response) =>
            if response.success
                callbacks.success response
            else
                callbacks.error response
        error: (response) =>
            callbacks.error response

exports.post = (url, data, callbacks) ->
    $.ajax
        type: 'POST'
        url: url
        data: data
        success: (response) =>
            if response.success
                callbacks.success response
            else
                callbacks.error response
        error: (response) =>
            callbacks.error response

