ViewCollection = require 'lib/view_collection'

# View describing main screen for user once he is logged
module.exports = class ApplicationsListView extends ViewCollection
    id: 'applications-view'
    template: require 'templates/home'
    itemView: require 'views/home_application'

    ### Constructor ###

    constructor: (apps) ->
        @apps = apps
        @state = 'view'
        @isLoading = true
        super collection: apps

    initialize: =>
        @listenTo @collection, 'request', => @isLoading = true
        @listenTo @collection, 'reset', => @isLoading = false

        super

    afterRender: =>
        @$("#no-app-message").hide()
        $(".menu-btn a").click (event) =>
            $(".menu-btn").removeClass 'active'
            $(event.target).closest('.menu-btn').addClass 'active'

        super

    checkIfEmpty: ->
        noapps = @apps.size() is 0 and not @isLoading
        @$("#no-app-message").toggle noapps
        if noapps
            window.app.routers.main.navigate 'home/install', trigger: true


    appendView: (view) ->
        sectionName = view.model.getSection()
        section = @$ "section#apps-#{sectionName}"
        section.append view.$el
