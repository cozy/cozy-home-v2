request = require 'request-json'
client = request.newClient 'http://localhost:9103'

User = require './server/models/user'
CozyInstance = require './server/models/cozyinstance'
Application = require './server/models/application'

runCmd = ->
    switch process.argv[2]
        when 'cleanuser'
            User.destroyAll (error) ->
                if error
                     console.log error.stack
                     console.log "Cleaning Users failed."
                else
                     console.log "All users are removed."
            break
        when 'cleanapps'
            Application.destroyAll (error) ->
                 if error
                     console.log error.stack
                     console.log "Cleaning Applications failed."
                 else
                     console.log "All applications and users are removed."
            break
        when 'cleandb'
            destroyApplications = ->
                Application.destroyAll (error) ->
                     if error
                         console.log error.stack
                         console.log "Cleaning Applications failed."
                     else
                         console.log "All applications and users are removed."

            destroyInstances = ->
                CozyInstance.destroyAll (error) ->
                    if error
                         console.log error.stack
                         console.log "Cleaning instances failed."
                    else
                         destroyApplications()

            destroyUsers = ->
                User.destroyAll (error) ->
                    if error
                         console.log error.stack
                         console.log "Cleaning Users failed."
                    else
                         destroyInstances()

            destroyUsers()
            break

        when 'set_help_url'
            url = process.argv[3]

            client.post 'api/instance', helpUrl: url, (err, res, body) ->
                if err then console.log err
                else if res.statusCode isnt 200
                    console.log 'Something went wrong while changing help url'
                    console.log body
                else console.log "Help url name set with #{url}"
                process.exit 0
            break

        when 'setdomain'
            domain = process.argv[3]
            client.post 'api/instance', domain: domain, (err, res, body) ->
                if err then console.log err
                else if res.statusCode isnt 200
                    console.log 'Something went wrong while changing domain'
                    console.log body
                else console.log "Domain name set with #{domain}"
                process.exit 0
            break

        when 'getdomain'
            client.get 'api/instances', (err, res, instances) ->
                if err
                    console.log '{domain:"error"}'
                    process.exit 1
                else if instances.rows.length is 0
                    console.log '{domain:null}'
                    process.exit 0
                else
                    console.log "{domain:\"#{instances.rows[0].domain}}\""
                    process.exit 0
            break

runCmd()
