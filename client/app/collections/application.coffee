BaseCollection = require("collections/collections").BaseCollection
Application = require("models/application").Application


# List of installed applications.
class exports.ApplicationCollection extends BaseCollection
    
  model: Application
  url: '/api/applications/'

  constructor: () ->
    super()


