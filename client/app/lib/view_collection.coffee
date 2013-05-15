BaseView = require 'lib/base_view'

# View that display a collection of subitems
# used to DRY views
# Usage : new ViewCollection(collection:collection)
# Automatically populate itself by creating a itemView for each item
# in its collection

# can use a template that will be displayed alongside the itemViews

# itemView       : the Backbone.View to be used for items
# itemViewOptions : the options that will be passed to itemViews

module.exports = class ViewCollection extends BaseView

    views: {}

    itemView: null


    itemViewOptions: ->

    # add 'empty' class to view when there is no subview
    checkIfEmpty: ->
        @$el.toggleClass 'empty', _.size(@views) is 0

    # can be overriden if we want to place the subviews somewhere else
    appendView: (view) ->
        @$el.append view.el

    # bind listeners to the collection
    initialize: ->
        super
        @views = {}
        @listenTo @collection, "reset",   @onReset
        @listenTo @collection, "add",     @addItem
        @listenTo @collection, "remove",  @removeItem
        @onReset @collection

    # if we have views before a render call, we detach them
    render: ->
        view.$el.detach() for id, view of @views
        super

    # after render, we reattach the views
    afterRender: ->
        @appendView view for id, view of @views
        @checkIfEmpty @views

    # destroy all sub views before remove
    remove: ->
        @onReset []
        super

    # event listener for reset
    onReset: (newcollection) ->
        view.remove() for id, view of @views
        newcollection.forEach @addItem

    # event listeners for add
    addItem: (model) =>
        options = _.extend {}, {model: model}, @itemViewOptions(model)
        view = new @itemView(options)
        @views[model.cid] = view.render()
        @appendView view
        @checkIfEmpty @views

    # event listeners for remove
    removeItem: (model) =>
        @views[model.cid].remove()
        delete @views[model.cid]
        @checkIfEmpty @views



