module.exports = (compound) ->
    compound.tools.database = ->
        {User, CozyInstance, Application} = compound.models

        switch process.argv[3]
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
            when 'setdomain'
                domain = process.argv[4]
                CozyInstance.all (err, instances) ->
                    if err
                        console.log err
                    else if instances.length is 0
                        CozyInstance.create domain: domain, (err) ->
                            if err then console.log err
                            else console.log "Domain name set with #{domain}"
                    else
                        instance = instances[0]
                        instance.domain = domain
                        instance.save (err) ->
                            if err then console.log err
                            else console.log "Domain name set with #{domain}"
                break
            else
                console.log 'Usage: compound database [cleanuser|cleanapps|cleandb|setdomain]'
