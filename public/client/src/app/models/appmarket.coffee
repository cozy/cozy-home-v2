BaseModel = require("models/models").BaseModel

# Describes an application available in the market place.
class exports.App extends BaseModel

  url: '/api/market/apps/'

  constructor: (app) ->
    super()
    @slug = app.slug
    @name = app.name
    @path = "/#{app.slug}/"
    
