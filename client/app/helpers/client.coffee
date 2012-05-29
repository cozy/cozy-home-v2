
exports.post = (url, data, callbacks) ->
    $.ajax
        type: 'POST'
        url: url
        data: data
        success: (response) =>
            if response.success == true
                callbacks.success(response)
            else
                callbacks.error(response)
        error: (response) =>
            callbacks.error response

