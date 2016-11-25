###
 App usage tracking
###

moment = require 'moment-timezone'
UseTracker = require '../models/usetracker'

TIMING = 10 * 1000 # 10s
appTracker = {}

module.exports =
    heartbeat: (req, res, next) ->
        appName = req.body.appName

        # Tracking logic
        if not appTracker[appName]?
            appTracker[appName] =
                dateStart: req.body.timestamp
                dateEnd: null
                timeout: null

        appInfo = appTracker[appName]
        appInfo.dateEnd = req.body.timestamp
        clearTimeout appInfo.timeout
        # When the timeout proc, the session is considered terminated
        appInfo.timeout = setTimeout ->
            duration = moment(appInfo.dateEnd) - moment(appInfo.dateStart)
            # Actually, precision is just up to 1s.
            duration = Math.round(duration / 1000) * 1000

            data =
                app: appName
                dateStart: appInfo.dateStart
                dateEnd: appInfo.dateEnd
                duration: duration
            delete appTracker[appName]
            UseTracker.create data, (err, res, body) ->
                console.log "Couldn't add app tracking info -- #{err}" if err?
        , TIMING

        res.status(201).send('ok')
