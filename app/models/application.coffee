module.exports = (compound, Application) ->

    # Validators

    # TODO find a way to make this validation works.
    #Application.validatesUniquenessOf 'slug', message: 'slug is not unique'


    # Access functions

    Application.all = (params, callback) ->
        Application.request "all", params, callback

    Application.destroyAll = (params, callback) ->
        Application.requestDestroy "all", params, callback

    # Build descriptor required by haibu from application data.
    Application::getHaibuDescriptor = (app, callback) ->
        descriptor =
            user: @slug
            name: @slug
            domain: "127.0.0.1"
            repository:
                type: "git",
                url: @git
            scripts:
                start: "server.coffee"
        descriptor.repository.branch = @branch if @branch?
        return descriptor
