BaseCollection = require 'lib/base_collection'
Application = require 'models/application'



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

    comparator: (modelLeft, modelRight) ->
        leftIsOfficial = modelLeft.isOfficial()
        rightIsOfficial = modelRight.isOfficial()

        if leftIsOfficial and rightIsOfficial
            modelLeft.get('name').localeCompare modelRight.get 'displayName'
        else if leftIsOfficial
            -1
        else if rightIsOfficial
            1
        else
            modelLeft.get('name').localeCompare modelRight.get 'displayName'

