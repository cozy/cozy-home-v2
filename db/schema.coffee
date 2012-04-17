# User defines user that can interact with the Cozy instance.
User = define 'User', ->
    property 'email', String, index: true
    property 'password', String
    property 'owner', Boolean, default: false
    property 'activated', Boolean, default: false


# Application descrbies an application installed inside the Cozy instance.
Application = define 'Application', ->
    property 'name', String, index: true
    property 'slug', String
    property 'state', String
    property 'index', Number
    property 'date', String, default: Date.now

