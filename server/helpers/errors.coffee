
module.exports.NotFound = (what) ->
    err = new Error what + ': Not Found'
    err.status = 404
    return err


module.exports.NotAllowed = ->
    err = new Error 'Not allowed'
    err.status = 401
    return err

module.exports.BadUsage = ->
    err = new Error 'Bad Usage'
    err.status = 400
    return err
