async            = require 'async'
Device           = require '../models/device'
Application      = require '../models/application'
StackApplication = require '../models/stack_application'
CozyInstance     = require '../models/cozyinstance'
CozyUser         = require '../models/user'
Notification     = require '../models/notification'
Market           = require '../lib/market'


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
                # if qwant application is installed
                isQwantInstalled = (results.applications.find((application) ->
                    application.name is 'qwant')) isnt undefined
                if isQwantInstalled
                    imports += "window.qwantInstalled = #{true};\n"
                # if node development environment
                if process.env.NODE_ENV is 'development'
                    imports += "window.DEV_ENV = #{true};\n"
                if process.env.ENABLE_QWANT_SEARCH is 'true'
                    imports += "window.ENABLE_QWANT_SEARCH = #{true};\n"
                if process.env.BEN_DEMO is 'true'
                    imports += "window.BEN_DEMO = #{true};\n"
                for key, value of results
                    imports += "window.#{key} = #{JSON.stringify(value)};\n"
                imports += "window.managed = #{process.env.MANAGED};\n"

                # function to grab queries from window.location.hash
                argsFromLocationHash = (hashString) ->
                    # remove the '?'
                    queryString =
                        hashString.substring (hashString.indexOf('?')+1)
                    # split by '&'
                    queries = queryString.split '&'
                    urlArguments = {}
                    for query of queries
                        if queries[query] is '' then continue
                        # query=value -> [query, value]
                        pair = queries[query].split '='
                        if pair.length isnt 2 then continue
                        # to check if many values
                        values = pair[1].split(',')
                        # if at least two values -> value is array
                        if values[1]
                            urlArguments[pair[0]] = values
                        else
                            # one value, value is string
                            urlArguments[pair[0]] = pair[1]
                    return urlArguments

                res.render 'index', {imports, argsFromLocationHash}
