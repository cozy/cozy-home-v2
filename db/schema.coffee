# User defines user that can interact with the Cozy instance.
User = define 'User', ->
    property 'email', String, index: true
    property 'password', String
    property 'activated', Boolean, default: false


# Application descrbies an application installed inside the Cozy instance.
Application = describe 'Application', () ->
    property 'name', String, index: true
    property 'path', String
    property 'state', String
    property 'index', Number
    property 'date', String, default: Date.now
