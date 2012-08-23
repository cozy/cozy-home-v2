template = require('../templates/application')
BaseRow = require('views/row').BaseRow

# Row displaying application name and attributes
class exports.ApplicationRow extends BaseRow
    className: "application"

    events:
        "click .remove-app": "onRemoveClicked"


    ### Constructor ####

    constructor: (@model) ->
        super(@model)


    ### Listener ###

    onRemoveClicked: (event) =>
        event.preventDefault()
        @removeApp()


    ### Functions ###

    removeApp: ->
        @$(".remove-app").html "Removing..."
        @model.uninstall
                success: =>
                        @$(".remove-app").html "Removed!"
                error: =>
                        @$(".remove-app").html "Remove failed."

    ### configuration ###

    render: ->
        $(@el).html(template(app: @model))
        @el.id = @model.slug
        if @model.state == "broken"
             $(@el).addClass "broken"
             $(@el).find(".application-inner").append '<p class="broken-notifier">broken app<p>'
             
        @el

