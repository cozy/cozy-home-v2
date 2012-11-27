template = require('../templates/application')
BaseRow = require('views/row').BaseRow

# Row displaying application name and attributes
class exports.ApplicationRow extends BaseRow
    className: "application"

    events:
        "click .remove-app": "onRemoveClicked"
        "click .update-app": "onUpdateClicked"

    ### Constructor ####

    constructor: (@model) ->
        super(@model)


    ### Listener ###

    onRemoveClicked: (event) =>
        event.preventDefault()
        @removeApp()

    onUpdateClicked: (event) =>
        event.preventDefault()
        @updateApp()

    ### Functions ###

    removeApp: ->
        @$(".remove-app").html "Removing..."
        @model.uninstall
            success: =>
                @$(".remove-app").html "Removed!"
            error: =>
                @$(".remove-app").html "failed."

    updateApp: ->
        @$(".update-app").html "Updating..."
        @model.updateApp
            success: =>
                @$(".update-app").html "Updated!"
            error: =>
                @$(".update-app").html "failed."

    ### configuration ###

    render: ->
        @$el.html(template(app: @model))
        @el.id = @model.slug
        if @model.state == "broken"
             @$el.addClass "broken"
             @$el.find(".application-inner").append '<p class="broken-notifier">broken app<p>'
             
        if @model.state == "stopped"
            @$el.addClass "stopped"
            @$(".stop-app").hide()
            @$(".start-app").hide()
        else
            @$(".stop-app").hide()
            @$(".start-app").hide()

        @el
