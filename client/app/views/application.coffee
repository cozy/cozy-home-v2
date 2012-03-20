template = require('../templates/application')
BaseRow = require('views/row').BaseRow

# Row displaying application name and attributes
class exports.ApplicationRow extends BaseRow
  className: "application"

#  events:
#    "click .button": "onRemoveClicked"


  ### Constructor ####

  constructor: (@model) ->
    super(@model)


  ### Listener ###

  onRemoveClicked: (event) =>
    event.preventDefault()
    @removeApp()


  ### Functions ###

#  removeApp: ->
#    @$(".info-text").html "Removing..."
#    $.ajax
#     type: 'DELETE'
#     url: "/api/installed-apps/#{@id}/"
#     success: =>
#       @$(".info-text").html "Removed!"
#     error: =>
#       @$(".info-text").html "Remove failed."

  ### configuration ###

  render: ->
    $(@el).html(template(app: @model))
    @el.id = @model.slug
    @el

