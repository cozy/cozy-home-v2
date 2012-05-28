server = require './server'


## Small script to intialize list of available applications.

app = new Application
    name: "Notes"
    state: "installed"
    index: 0
    slug: "notes"
    icon: "notes_icon.png"
    description: """
    Organize your interests
    """

app.save (error) ->
    if error
        eyes.inspect error
        console.log "Initialization failed."
        process.exit(0)
    else
        console.log "Initialization succeeds."
        process.exit(0)

