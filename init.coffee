server = require './server'
eyes = require 'eyes'


## Small script to intialize list of available applications.

app = new Application
    name: "My Pedia"
    state: "installed"
    index: 0
    slug: "noty-plus"

app.save (error) ->
    if error
        eyes.inspect error
        console.log "Initialization failed."
        process.exit(0)
    else
        console.log "Initialization succeeds."
        process.exit(0)

