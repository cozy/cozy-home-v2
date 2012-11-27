# Base class for row displayed inside my cloud gateway.
class exports.BaseRow extends Backbone.View

    tagName: "div"

    constructor: (@model) ->
        super()
        
        @id = @model.slug
        @model.view = @

    remove: ->
        @$el.remove()
