emailValidator = (err) ->
    re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    err() if not re.test(@email)
    

User.validate 'email', emailValidator,
    message: 'Given email is not a proper email.'

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
            obj.destroy done


User.destroyAll = (callback) ->
    User.destroySome {}, callback

