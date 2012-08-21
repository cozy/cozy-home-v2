
exports.request = (type, url, data, callbacks) ->
    $.ajax
        type: type
        url: url
        data: data
        success: callbacks.success
        error: callbacks.error

exports.post = (url, data, callbacks) ->
    exports.request "POST", url, data, callbacks

exports.del = (url, callbacks) ->
    exports.request "DELETE", url, null, callbacks
