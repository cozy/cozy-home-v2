NotificationsHelper = require 'cozy-notifications-helper'
Sharing = require '../models/sharing'
Client = require("request-json").JsonClient
localizationManager = require '../helpers/localization_manager'
log = require('printit')
    prefix: 'sharing-manager'

# We need to access the DS directly because of the genericity of the
# received docTypes
clientDS = new Client "http://localhost:9101/"

if process.env.NODE_ENV in ['test', 'production']
    clientDS.setBasicAuth process.env.NAME, process.env.TOKEN

# WARNING : this should be temporary.
# We need this to create an association between a received docType and
# an application for the notifications.
apps = {}
apps["event"] = "calendar"


createPersistentNotif = (app, slug, text, callback) ->
    notifhelper = new NotificationsHelper 'home'
    notifhelper.createOrUpdatePersistent slug,
        text: text
        resource: app: app
    , (err) ->
        callback err


createTemporaryNotif = (app, text, callback) ->
    notifhelper = new NotificationsHelper 'home'
    notifhelper.createTemporary
        text: text
        resource: app: app
    , (err) ->
        callback err

# Utility function to get the docType linked to an id in the sharing rules
extractDocType = (rules, id) ->
    docType = (rule.docType for rule in rules when rule.id is id)
    return docType[0]


# Utility function to split the concatenated id and shareID
extractIds = (ids) ->
    tokens = ids.split ":"
    return [tokens[0], tokens[1]]


# Utility function to determine the undefined article in the notification
articleBeforeDocType = (docType) ->
    l = docType.charAt 0
    # The 'u' has too many exceptions...
    if l is 'a' or l is 'e' or l is 'i' or l is 'o'
        article = "an"
    else
        article = "a"

# Retreive all the sharing informations to build a human-readable notification
getSharingInfos = (id, shareID, callback) ->
    path = "request/sharing/byShareID"
    options =
        key: shareID
        include_docs: true

    # Get the sharing doc
    clientDS.post path, options, (err, result, body) ->
        doc = body[0]?.doc
        docType = extractDocType doc.rules, id
        callback err, doc, docType


# Called after a sharing event published by the Data-System
# 3 cases must be handled on the recipient side :
# a sharing request creation, an updated shared doc and a deleted shared doc.
module.exports.handleNotification = (event, id, callback) ->
    # Split the published event
    tokens = event.split "."

    # A new sharing request has been received
    if tokens[1] is "create"
        Sharing.find id, (err, sharing) ->
            if err?
                log.error err
            # The sharer shouldn't be notified as he created the request
            else if not sharing.targets?
                docType = sharing.rules[0].docType
                article = articleBeforeDocType docType
                messageKey = 'sharing create request notification'
                message = localizationManager.t messageKey,
                        sharerName: sharing.sharerName
                        article: article
                        docType: docType
                createTemporaryNotif apps[docType], message, callback

    # A shared document has been updated by the sharer
    else if tokens[2] is "update"
        # The doc id and the shareID are concatenated
        [id, shareID] = extractIds id

        if id? and shareID?
            getSharingInfos id, shareID, (err, sharing, docType) ->
                if err?
                    log.error err
                # The sharer shouldn't be notified as he created the request
                else if not sharing.targets? and docType?
                    sharerName = sharing.sharerName
                    article = articleBeforeDocType docType
                    messageKey = 'sharing update notification'
                    message = localizationManager.t messageKey,
                        article: article
                        docType: docType
                        sharerName: sharerName
                    slug = "sharing_update_notification"
                    createPersistentNotif apps[docType], slug, message, callback

    # A shared document has been deleted by the sharer
    else if tokens[2] is "delete"
        # The doc id and the shareID are concatenated
        [id, shareID] = extractIds id

        if id? and shareID?
            getSharingInfos id, shareID, (err, sharing, docType) ->
                if err?
                    log.error err
                # The sharer shouldn't be notified as he created the request
                else if not sharing.targets? and docType?
                    sharerName = sharing.sharerName
                    article = articleBeforeDocType docType
                    messageKey = 'sharing delete notification'
                    message = localizationManager.t messageKey,
                        article: article
                        docType: docType
                        sharerName: sharerName
                    slug = "sharing_delete_notification"
                    createPersistentNotif apps[docType], slug, message, callback




