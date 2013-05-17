#!/usr/bin/env coffee
app = module.exports = (params) ->
    params = params || {}
    params.root = params.root || __dirname
    return require('compound').createServer params

if not module.parent

    port = process.env.PORT or 9103
    host = process.env.HOST or "127.0.0.1"
    server = app()

    server.listen port, host, ->
        console.log(
            "Railway server listening on #{host}:#{port} within " +
            "#{server.set('env')} environment"
        )
