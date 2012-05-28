server = require './server'

# Small script to remove all data for Cozy home.

destroyApplications = ->
    Application.destroyAll (error) ->
         if error
             console.log error.stack
             console.log "Cleaning Applications failed."
             process.exit(0)
         else
             console.log "All applications and users are removed."
             process.exit(0)

destroyUsers = ->
    User.destroyAll (error) ->
        if error
             console.log error.stack
             console.log "Cleaning Users failed."
             process.exit(0)
        else
             destroyApplications()
        
destroyUsers()
