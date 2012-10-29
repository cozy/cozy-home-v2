#!/usr/bin/env coffee
app = module.exports = require('railway').createServer()

if not module.parent
    port = process.env.PORT or 3000
    app.listen port, "127.0.0.1"
    console.log "Railway server listening on port %d within %s environment", port, app.settings.env
