# Base class that contains commomn methods for models.
class exports.BaseModel extends Backbone.Model

  isNew: () ->
    @id is undefined
