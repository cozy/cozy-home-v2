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
    property 'branch', String
    property 'port', Number
