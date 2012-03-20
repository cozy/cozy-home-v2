appTemplate = require('../templates/app')
BaseRow = require('views/row').BaseRow


class exports.AppRow extends BaseRow

  className: "app"

  events:
    "click .button": "onInstallClicked"

  constructor: (@model) ->
    super(@model)

  onInstallClicked: (event) =>
    event.preventDefault()
    @installApp()

  installApp: ->
    @$(".info-text").html "Installing..."
    $.ajax
     type: 'POST'
     dataType: "json"
     contentType: "application/json"
     url: "/api/installed-apps/"
     data: '{"name": "' + @model.name + '", "slug": "' + @model.slug + '"}'
     success: =>
       @$(".info-text").html "Installed!"
     error: =>
       @$(".info-text").html "Install failed."

  render: ->
    $(@el).html(appTemplate(app: @model))
    @el.id = @model.slug
    @el

