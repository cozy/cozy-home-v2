{BaseModel} = require 'lib/base_model'

# Describes a device installed in mycloud.
module.exports = class Device extends Backbone.Model

    urlRoot: 'api/preference/'
