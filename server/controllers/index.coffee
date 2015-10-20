async = require 'async'
Device = require '../models/device'
Application = require '../models/application'
StackApplication = require '../models/stack_application'
CozyInstance = require '../models/cozyinstance'
CozyUser = require '../models/user'
Notification = require '../models/notification'
Market = require '../lib/market'


module.exports =

    index: (req, res, next) ->

        async.parallel
            devices:             (cb) -> Device.all cb
            cozy_user:           (cb) -> CozyUser.first cb
            applications:        (cb) -> Application.all cb
            notifications:       (cb) -> Notification.all cb
            cozy_instance:       (cb) -> CozyInstance.first cb
            stack_application:   (cb) -> StackApplication.all cb
            market_applications: (cb) -> Market.getApps cb
        , (err, results) ->
            if err then next err
            else
                imports = ""
                for key, value of results
                    imports += "window.#{key} = #{JSON.stringify(value)};\n"
                imports += "window.managed = #{process.env.MANAGED};\n"

                res.render 'index', {imports}
