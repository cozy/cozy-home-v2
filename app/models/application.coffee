
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


