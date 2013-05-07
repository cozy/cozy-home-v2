module.exports = class BaseView extends Backbone.View
    tagName: 'section'

    template: ->

    initialize: ->
        @render()
        super()

    getRenderData: ->
        model: @model?.toJSON()

    render: ->
        # console.debug "Rendering #{@constructor.name}", @
        @beforeRender()
        @$el.html @template(@getRenderData())
        @afterRender()
        @

    beforeRender: ->

    afterRender: ->

    destroy: ->
        @undelegateEvents()
        @$el.removeData().unbind()
        @remove()
        Backbone.View::remove.call @