BaseCollection = require 'lib/base_collection'
StackApplication = require 'models/stack_application'


# List of installed applications.
module.exports = class ApplicationCollection extends BaseCollection

    model: StackApplication
    url: 'api/applications/stack'