module.exports = (compound) ->

    # Bring models in context
    {Application, CozyInstance, User, Notification, Alarm} = compound.models

    requests = require "../../common/requests"
    User.defineRequest "all", requests.all, requests.checkError
    Alarm.defineRequest        "all", requests.all, requests.checkError
    CozyInstance.defineRequest "all", requests.all, requests.checkError
    Notification.defineRequest "all", requests.all, requests.checkError

    byApps = -> emit [doc.app, doc.ref], doc if doc.type is 'persistent'
    Notification.defineRequest "byApps", byApps, requests.checkError

    allSlug = -> emit doc.slug, doc
    Application.defineRequest "all", allSlug, requests.checkError

