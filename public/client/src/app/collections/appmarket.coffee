BaseCollection = require("collections/collections").BaseCollection
App = require("models/app").App

# List of available applications.
class exports.AppCollection extends BaseCollection

  model: App
  url: '/api/market/apps/'

  constructor: () ->
    super()

