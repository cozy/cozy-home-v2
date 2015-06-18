BaseView = require 'lib/base_view'


# Row displaying application name and attributes
module.exports = class BackgroundListItem extends BaseView
    className: "mod w33 left background-button"
    tagName: "div"
    template: require 'templates/background_list_item'
    events:
        'click .delete-background-button': 'onDeleteClicked'
        'click': 'onClicked'


    getRenderData: ->
        model:
            src: @model.getThumbSrc()


    afterRender: ->
        @deleteButton = @$ '.delete-background-button'
        @deleteButton.hide() if @model.get 'predefined'
        @model.on 'change', =>
            @$el.addClass 'selected' if @model.get 'selected'


    # When item is clicked it is marked as selected.
    onClicked: ->
        @model.set 'selected', true


    # When delete button is clicked, the model is deleted remotely and the
    # current background item is removed from DOM.
    onDeleteClicked: ->
        @deleteButton.spin true
        @model.destroy()

