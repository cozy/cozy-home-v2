
exports.clearDb = (callback) ->
    User.destroyAll ->
        Application.destroyAll ->
            CozyInstance.destroyAll ->
                callback()
