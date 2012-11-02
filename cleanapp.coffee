server = require './server'

# Small script to remove all application data for Cozy home.

destroyApplications = ->
    Application.destroyAll (error) ->
         if error
             console.log error.stack
             console.log "Cleaning Applications failed."
             process.exit(0)
         else
             console.log "All applications and users are removed."
             process.exit(0)

destroyApplications()
