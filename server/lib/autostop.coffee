Application = require '../models/application'
{AppManager} = require "../lib/paas"

applicationTimeout = []

mark_broken = (app, err) ->
    app.state = "broken"
    app.password = null
    app.errormsg = err.message
    app.save (saveErr) ->
        return send_error saveErr if saveErr

stop_app = (app) ->
    manager = new AppManager
    manager.stop app, (err, result) =>
        return mark_broken app, err if err
        data =
            state: "stopped"
            port: 0
        app.updateAttributes data, (err) =>
            return send_error err if err
            manager.resetProxy (err) =>
                return mark_broken app, err if err

start_timeout = (name) ->
    applicationTimeout[name] = setTimeout () ->
        if name isnt "home" and name isnt "proxy"
            Application.all (err, apps) ->
                for app in apps
                    if app.name is name and app.isStoppable
                        console.log "stop : " + name
                        stop_app app
    , 180000

module.exports.restartTimeout = (name) ->
    if applicationTimeout[name]?
        clearTimeout applicationTimeout[name]
    start_timeout name

module.exports.init = () ->
    Application.all (err, apps) ->
        for app in apps
            if app.state is 'installed' and app.isStoppable
                start_timeout app.name
