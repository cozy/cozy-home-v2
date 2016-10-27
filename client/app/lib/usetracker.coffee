INTERVAL = 1 * 1000 # 1s

module.exports = class UseTracker

    constructor: ->
        if app.mesinfosUseTracker
            setInterval @_heartbeat, INTERVAL

    setApp: (appName) ->
        @appName = appName

    _heartbeat: =>
        if document.hasFocus()
            $.post 'usetrackers',
                timestamp: new Date().toISOString()
                appName: @appName
            , 'json'
