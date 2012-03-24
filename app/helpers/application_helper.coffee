
exports.success = (send, msg, code) ->
    code = 200 if code == null
    send success: true, msg: msg, 200


exports.error = (send, msg, code) ->
    code = 500 if code == null
    send error: true, msg: msg, 500


