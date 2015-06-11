BaseCollection = require 'lib/base_collection'
Application = require 'models/application'
client = require '../lib/client'



# List of installed applications.
module.exports = class ApplicationCollection extends BaseCollection

    model: Application
    url: 'api/applications/'
    apps: []


    get: (idorslug) ->
        out = super idorslug
        return out if out

        for app in @models
            return app if idorslug is app.get 'id'

