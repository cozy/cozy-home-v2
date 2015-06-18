cozydb = require 'cozydb'

byApps = -> emit [doc.app, doc.ref], doc if doc.type is 'persistent'

allSlug = -> emit doc.slug, doc

imageByDate = (doc) ->
    if doc.class is "image" and doc.binary?.file?
        emit doc.lastModification, doc

module.exports =

    user:
        all: cozydb.defaultRequests.all

    alarm:
        all: cozydb.defaultRequests.all

    event:
        all: cozydb.defaultRequests.all

    cozyinstance:
        all: cozydb.defaultRequests.all

    notification:
        all: (doc) ->
            emit doc.publishDate, doc
        byApps: byApps

    application:
        all: cozydb.defaultRequests.all
        bySlug: allSlug

    stack_application:
        all: cozydb.defaultRequests.all

    background:
        all: cozydb.defaultRequests.all

    file:
        imageByDate : imageByDate
        imageByMonth:
            map: (doc) ->
                if doc.class is "image" and doc.binary?.file?
                    d = new Date(doc.lastModification)
                    emit([d.getFullYear(),d.getMonth()+1,d.getDate()], doc._id)
            reduce: '_count'
