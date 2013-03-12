# Base class to share common methods between collections.
module.exports = class BaseCollection  extends Backbone.Collection

    # Select which field from backend response to use for parsing to populate
    # collection.
    parse: (response) ->
        response.rows
