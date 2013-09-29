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
            CozyInstance.all (err, instances) ->
                if err
                    console.log err
                else if instances.length is 0
                    console.log "No instance found"
                    process.exit 1
                else
                    instance = instances[0]
                    instance.helpUrl = url
                    instance.save (err) ->
                        if err then console.log err
                        else console.log "Help url name set with #{url}"
                        process.exit 0
            break

        when 'setdomain'
            domain = process.argv[3]
            CozyInstance.all (err, instances) ->
                if err
                    console.log err
                    process.exit 1
                else if instances.length is 0
                    CozyInstance.create domain: domain, (err) ->
                        if err then console.log err
                        else console.log "Domain name set with #{domain}"
                        process.exit 0
                else
                    instance = instances[0]
                    instance.domain = domain
                    instance.save (err) ->
                        if err then console.log err
                        else console.log "Domain name set with #{domain}"
                        process.exit 0
            break

        when 'getdomain'
            CozyInstance.all (err, instances) ->
                if err
                    console.log '{domain:"error"}'
                    process.exit 1
                else if instances.length is 0
                    console.log '{domain:null}'
                    process.exit 0
                else
                    console.log "{domain:\"#{instances[0].domain}}\""
                    process.exit 0
            break

runCmd()
