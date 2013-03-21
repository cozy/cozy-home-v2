module.exports = (compound, CozyInstance) ->
    CozyInstance.all = (callback) ->
        CozyInstance.request "all", callback


    CozyInstance.destroyAll = (callback) ->
        CozyInstance.requestDestroy "all", callback
