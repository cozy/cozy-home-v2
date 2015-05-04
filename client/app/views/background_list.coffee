ViewCollection = require 'lib/view_collection'
BackgroundListItem = require 'views/background_list_item'
BackgroundCollection = require 'collections/background'



# View to manage the list of available background in the account view.
module.exports = class BackgroundList extends ViewCollection

    itemView: BackgroundListItem
    template: require 'templates/background_list'
    collection: new BackgroundCollection
    events: {}

    # Init collection with default values.
    # Add a change listener to mark the selected background as selected
    # and remove the selection from others.
    afterRender: ->
        @collection.init()

        @collection.on 'change', (changedModel) =>
            @collection.map (model) =>
                if changedModel.cid isnt model.cid
                    model.set {'selected': false}, {silent: true}
                    @views[model.cid].$el.removeClass 'selected'
