async = require 'async'
log = require('printit')
    prefix: 'lib:auto-stop'

Application = require '../models/application'
{AppManager} = require "../lib/paas"

applicationTimeout = []

MINUTE = 60 * 1000 # ms

###
Mark application broken
   * Update application state in database
###
module.exports.markBroken = (app, err) ->
    data =
        state: "broken"
        password: null
        errormsg: err.message

    app.updateAttributes data, (saveErr) ->
        log.error saveErr if saveErr?


###
Stop application <app> :
   * Stop process (via controller)
   * Update application state in database
   * Reset proxy routes
###
module.exports.stopApp = (app) ->
    manager = new AppManager
    async.series
        stop: (next) -> manager.stop app, next
        update: (next) ->
            app.updateAttributes state: "stopped", port: 0, next
        reset: (next) -> manager.resetProxy next
    , (err) ->
        module.exports.markBroken app, err if err?


###
Start timeout for application other than proxy and home
    * After 5 minutes of inactivity, application are stopped
    if application is stoppable.
###
module.exports.startTimeout = (slug) ->
    unless slug in ['home', 'proxy']
        applicationTimeout[slug] = setTimeout ->
            Application.all key: slug, (err, apps) ->
                return log.error err if err?
                return log.error "App #{slug} not found" unless apps?.length > 0

                app = apps[0]
                if app.isStoppable and app.state is "installed"
                    log.info "stopping #{slug}"
                    module.exports.stopApp app
        , 5 * MINUTE


###
Restart tiemout for application.
    * Remove old timeout if it exists
    * Start new timeout
###
module.exports.restartTimeout = (slug) ->
    if applicationTimeout[slug]?
        clearTimeout applicationTimeout[slug]
        delete applicationTimeout[slug]
    module.exports.startTimeout slug


###
Init timeout
    When home is started, it start timeout for all installed application
###
module.exports.init = (callback = ->) ->
    Application.all (err, apps) ->

        if err?
            log.error err
            callback err
        else

            for app in apps when app.state is 'installed' and app.isStoppable
                module.exports.startTimeout app.slug

            callback()
