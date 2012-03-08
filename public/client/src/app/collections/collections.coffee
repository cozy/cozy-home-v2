# Base class to share common methods between collections.
class exports.BaseCollection  extends Backbone.Collection

  # Select which field from backend response to use for parsing to populate
  # collection.
  parse: (response) ->
    response.rows

