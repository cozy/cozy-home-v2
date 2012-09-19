# TODO find a way to make this validation works.
#Application.validatesUniquenessOf 'slug', message: 'slug is not unique'

Application.all = (params, callback) ->
    Application.request "all", params, callback

Application.destroyAll = (callback) ->
    # Replace this with async lib call.
    wait = 0
    error = null
    done = (err) ->
        error = error || err
        if --wait == 0
            callback(error)

    Application.all (err, data) ->
        if err then return callback(err)
        if data.length == 0 then return callback(null)

        wait = data.length
        data.forEach (obj) ->
            obj.destroy done

# Build descriptor required by haibu from application data.
Application::getHaibuDescriptor = (app, callback) ->
    user: "cozy"
    name: @slug
    domain: "127.0.0.1"
    repository:
        type: "git",
        url: @git
    scripts:
        start: "server.coffee"


