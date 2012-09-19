# TODO find a way to make this validation works.
#Application.validatesUniquenessOf 'slug', message: 'slug is not unique'

Application.all = (params, callback) ->
    Application.request "all", params, callback

Application.destroyAll = (params, callback) ->
    Application.requestDestroy "all", params, callback

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


