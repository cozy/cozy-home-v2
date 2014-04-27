americano = require 'americano-cozy'

module.exports = Application = americano.getModel 'Application',
    name: String
    displayName: String
    description: String
    slug: String
    state: String
    isStoppable: {type: Boolean, default: false}
    date: {type: Date, default: Date.now}
    icon: String
    git: String
    errormsg: String
    branch: String
    port: Number
    permissions: Object
    password: String
    homeposition: Object
    widget: String
    version: String
    needsUpdate: {type: Boolean, default: false}
    _attachments: Object

Application.all = (params, callback) ->
    Application.request "bySlug", params, callback

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
