BaseModel = require("models/models").BaseModel

# Describes an application installed in mycloud.
class exports.Application extends BaseModel

  url: '/api/applications/'

  constructor: (@app) ->
    super()
    @slug = app.slug
    @name = app.name
    @description = app.description
    @icon = app.icon
    @
    
