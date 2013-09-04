americano = require 'americano-cozy'

module.exports = Application = americano.getModel 'Application',
    name: String
    displayName: String
    description: String
    slug: String
    state: String
    isStoppable: {type: name: Boolean, default: false}
    date: {type: name: String, default: Date.now}
    icon: String
    git: String
    errormsg: String
    branch: String
    port: Number
    permissions: String
    password: String
    _attachments: Object

Application.all = (params, callback) ->
    Application.request "all", params, callback

Application.destroyAll = (params, callback) ->
    Application.requestDestroy "all", params, callback

Application::getHaibuDescriptor = () ->
    descriptor =
        user: @slug
        name: @slug
        domain: "127.0.0.1"
        repository:
            type: "git",
            url: @git
        scripts:
            start: "server.coffee"
        password: @password
    if @branch? and @branch isnt "null"
        descriptor.repository.branch = @branch
    return descriptor
