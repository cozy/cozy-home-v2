# User defines user that can interact with the Cozy instance.
User = define 'User', ->
    property 'email', String
    property 'timezone', String, default: "Europe/Paris"
    property 'password', String
    property 'owner', Boolean, default: false
    property 'activated', Boolean, default: false


# Data linked to current CozyInstance
CozyInstance = define 'CozyInstance', ->
    property 'domain', String
    property 'locale', String
    property 'helpUrl', String


# Application descrbies an application installed inside the Cozy instance.
Application = define 'Application', ->
    property 'name', String
    property 'description', String
    property 'slug', String
    property 'state', String
    property 'isStoppable', Boolean, default: false
    property 'date', String, default: Date.now
    property 'icon', String
    property 'git', String
    property 'errormsg', String
    property 'branch', String
    property 'port', Number
    property 'permissions'
    property 'password', String

# Notifications are messages sent to the user
Notification = define 'Notification', ->
    property 'text', String
    property 'type', String
    property 'resource', Object, default: null
    property 'publishDate', String, default: Date.now

    property 'app', String # the app that created that notif
    property 'ref', String # for apps with multiple notifs to manage

# Alarms are one end-user notification type
Alarm = define 'Alarm', ->
    property 'action', String, default: 'DISPLAY'
    property 'trigg', String
    property 'description', String
    property 'related', String, default: null


