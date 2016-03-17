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


    # Apps are automatically sorted by display name. Official apps are
    # sorted first.
    comparator: (modelLeft, modelRight) ->
        leftIsOfficial = modelLeft.isOfficial()
        rightIsOfficial = modelRight.isOfficial()

        if leftIsOfficial and not rightIsOfficial
            -1
        else if rightIsOfficial and not leftIsOfficial
            1
        else
            left = modelLeft.get('displayName') or modelLeft.get('name')
            right = modelRight.get('displayName') or modelRight.get('name')
            left.localeCompare right

