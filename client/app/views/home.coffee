ViewCollection = require 'lib/view_collection'

# View describing main screen for user once he is logged
module.exports = class ApplicationsListView extends ViewCollection
    id: 'applications-view'
    template: require 'templates/home'
    itemView: require 'views/home_application'

    subscriptions:
        'app:changed:favorite': 'render'


    ### Constructor ###


    constructor: (apps, market) ->
        @apps = apps
        @market = market
        @state = 'view'
        @isLoading = true
        @itemViewOptions = => market: @market
        super collection: apps


    initialize: =>
        @listenTo @collection, 'request', => @isLoading = true
        @listenTo @collection, 'reset', => @isLoading = false
        # do not use listenTo because it prevents market view to listen to
        # the event too.
        @collection.on 'remove', @onAppRemoved

        super


    afterRender: =>
        @$("#no-app-message").hide()
        $(".menu-btn a").click (event) ->
            $(".menu-btn").removeClass 'active'
            $(event.target).closest('.menu-btn').addClass 'active'

        super


    checkIfEmpty: ->
        noapps = @apps.size() is 0 and not @isLoading
        @$("#no-app-message").toggle noapps


    appendView: (view) ->
        sectionName = view.model.getSection()
        section = @$ "section#apps-#{sectionName}"
        section_apps= @$ "section#apps-#{sectionName} .application-container"
        section_apps.append view.$el
        section.addClass 'show'
        section.show()


    # Hide section if there is no more application displayed.
    onAppRemoved: (model) =>
        sectionName = model.getSection()
        section = @$ "section#apps-#{sectionName}"
        if section.find('.application-container').children().length is 1
            section.hide()

