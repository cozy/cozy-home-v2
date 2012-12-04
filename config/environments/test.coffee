app.configure 'test', ->
    app.settings.quiet = true
    app.enable 'view cache'
    app.enable 'model cache'
    app.enable 'eval cache'
    app.use require('express').errorHandler
        dumpExceptions: true
        showStack: true
