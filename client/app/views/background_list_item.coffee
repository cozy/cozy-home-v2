BaseView = require 'lib/base_view'


# Row displaying application name and attributes
module.exports = class BackgroundListItem extends BaseView
    className: "mod w33 left background-button"
    tagName: "div"
    template: require 'templates/background_list_item'
    events:
        'click': 'onClicked'

    afterRender: ->
        @$el.addClass 'selected' if @model.get 'selected'

    onClicked: ->
        @model.set 'selected', true
        @$el.addClass 'selected'
