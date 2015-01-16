Application = require '../models/application'
{AppManager} = require "../lib/paas"

applicationTimeout = []

###
Mark application broken
   * Update application state in database
###
markBroken = (app, err) ->
    app.state = "broken"
    app.password = null
    app.errormsg = err.message
    app.save (saveErr) ->
        return send_error saveErr if saveErr

###
Stop application <app> :
   * Stop process (via controller)
   * Update application state in database
   * Reset proxy routes
###
stopApp = (app) ->
    manager = new AppManager
    manager.stop app, (err, result) =>
        return markBroken app, err if err
        data =
            state: "stopped"
            port: 0
        app.updateAttributes data, (err) =>
            return send_error err if err
            manager.resetProxy (err) =>
                return markBroken app, err if err

###
Start timeout for application other than proxy and home
    * After 3 minutes of inactivity, application are stopped
    if application is stoppable.
###
startTimeout = (name) ->
    applicationTimeout[name] = setTimeout () ->
        if name isnt "home" and name isnt "proxy"
            Application.all (err, apps) ->
                for app in apps
                    if app.slug is name and
                        app.isStoppable and
                        app.state is "installed"
                            console.log "stop : " + name
                            stopApp app
    ,5 * 60 * 1000

###
Restart tiemout for application.
    * Remove old timeout if it exists
    * Start new timeout (3 minutes)
###
module.exports.restartTimeout = (name) ->
    if applicationTimeout[name]?
        clearTimeout applicationTimeout[name]
    startTimeout name

###
Init timeout
    When home is started, it start timeout for all installed application
###
module.exports.init = () ->
    Application.all (err, apps) ->
        for app in apps
            if app.state is 'installed' and app.isStoppable
                startTimeout app.slug
