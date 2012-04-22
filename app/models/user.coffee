User.validatesUniquenessOf 'email', message: 'email is not unique'

User.destroySome = (condition, callback) ->

    # Replace this with async lib call.
    wait = 0
    error = null
    done = (err) ->
        error = error || err
        if --wait == 0
            callback(error)

    User.all condition, (err, data) ->
        if err then return callback(err)
        if data.length == 0 then return callback(null)

        wait = data.length
        data.forEach (obj) ->
            console.log obj.title
            obj.destroy done


User.destroyAll = (callback) ->
    User.destroySome {}, callback

