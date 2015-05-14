americano = require 'americano-cozy'

byApps = -> emit [doc.app, doc.ref], doc if doc.type is 'persistent'

allSlug = -> emit doc.slug, doc

imageByDate = (doc) ->
    if doc.class is "image" and doc.binary?.file?
        emit doc.lastModification, doc

module.exports =

    user:
        all: americano.defaultRequests.all

    alarm:
        all: americano.defaultRequests.all

    event:
        all: americano.defaultRequests.all

    cozyinstance:
        all: americano.defaultRequests.all

    notification:
        all: (doc) ->
            emit doc.publishDate, doc
        byApps: byApps

    application:
        all: americano.defaultRequests.all
        bySlug: allSlug

    stack_application:
        all: americano.defaultRequests.all

    file:
        imageByDate : imageByDate
        imageByMonth:
            map: (doc) ->
                if doc.class is "image" and doc.binary?.file?
                    d = new Date(doc.lastModification)
                    emit([d.getFullYear(),d.getMonth()+1,d.getDate()], doc._id)
            reduce: '_count'
