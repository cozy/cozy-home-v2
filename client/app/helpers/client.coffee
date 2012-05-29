
exports.post = (url, data, callbacks) ->
    $.ajax
        type: 'POST'
        url: url
        data: data
        success: (response) =>
            if response.success == true
                callback.success(response)
            else
                callback.error(response)
        error: =>
            callback.error(response)

