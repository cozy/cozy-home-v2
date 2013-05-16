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


# Application descrbies an application installed inside the Cozy instance.
Application = define 'Application', ->
    property 'name', String
    property 'slug', String
    property 'state', String
    property 'date', String, default: Date.now
    property 'icon', String
    property 'git', String
    property 'errormsg', String
    property 'branch', String
    property 'port', Number

# Notifications are messages sent to the user
Notification = define 'Notification', ->
    property 'text', String
    property 'publishDate', String
    property 'status', String
    property 'channel', String
    property 'resource', String


# Alarms are one end-user notification type
Alarm = define 'Alarm', ->
    property 'action', String, default: 'DISPLAY'
    property 'trigg', String
    property 'description', String

    property 'related', String, default: null


