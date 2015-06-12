request = require 'lib/request'


# Model to describe instance options required at home startup like locale,
# background, etc.
module.exports = class Instance extends Backbone.Model

    saveData: (data, callback) ->
        @set data
        request.post "api/instance", data, callback

