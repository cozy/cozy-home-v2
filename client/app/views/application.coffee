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
        @removeButton.html "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
        @removeButton.spin "small"
        @model.uninstall
            success: =>
                @removeButton.html "Removed"
                @removeButton.addClass 'btn-green'
                Backbone.Mediator.publish "app:removed", @model.slug
                @updateButton.unbind()
                @removeButton.unbind()
                setTimeout =>
                    @$el.fadeOut =>
                        @remove()
                , 1000
            error: =>
                @removeButton.html "failed."
                @removeButton.addClass 'btn-red'

    updateApp: ->
        @updateButton.html "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
        @updateButton.spin "small"
        @updateButton.removeClass 'btn-green'
        @updateButton.removeClass 'btn-red'
        @model.updateApp
            success: =>
                @updateButton.html "Updated"
                @updateButton.addClass 'btn-green'
            error: =>
                @updateButton.html "failed"
                @updateButton.addClass 'btn-red'

    ### configuration ###

    render: ->
        @$el.html(template(app: @model))
        @el.id = @model.slug
        if @model.state == "broken"
             @$el.addClass "broken"
             @$el.find(".application-inner")
                 .append '<p class="broken-notifier">broken app<p>'
             
        if @model.state == "stopped"
            @$el.addClass "stopped"
            @$(".stop-app").hide()
            @$(".start-app").hide()
        else
            @$(".stop-app").hide()
            @$(".start-app").hide()

        @$el.find('.application-inner').click (event) =>
            event.preventDefault()
            window.app.routers.main.navigate "apps/#{@model.slug}", true

        @updateButton = @$(".update-app")
        @removeButton = @$(".remove-app")

        @el
