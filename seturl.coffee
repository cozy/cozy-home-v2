server = require './server'

User.all (err, users) ->
    if err
        console.log err
        process.exit(0)
    else
        user = users[0]
        url = process.argv[2]
        user.updateAttributes { url: url }, (err) ->
            console.log err if err
            console.log "User url changed with #{url}"
            process.exit(0)

