# Small script to set programaticall domain name of the cozy instance.
#
server = require './server'

domain = process.argv[2]
CozyInstance.all (err, instances) ->
    if err
        console.log err
        process.exit(0)
    else if instances.length == 0
        CozyInstance.create domain: domain, (err) ->
            if err
                console.log err
            else
                console.log "Domain name set with #{domain}"
                process.exit(0)
    else
        instance = instances[0]
        instance.domain = domain
        instance.save (err) ->
            if err
                console.log err
            else
                console.log "Domain name set with #{domain}"
                process.exit(0)
