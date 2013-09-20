ViewCollection = require 'lib/view_collection'
client = require 'helpers/client'
ApplicationRow = require 'views/home_application'


String::startsWith = (prefix) ->
     @indexOf(prefix, 0) is 0

String::endsWith = (suffix) ->
     @indexOf(suffix, @length - suffix.length) isnt -1

# View describing main screen for user once he is logged
module.exports = class ApplicationsListView extends ViewCollection
    id: 'applications-view'
    template: require 'templates/home'
    itemView: require 'views/home_application'

    events:
        'click #add-app-button': 'onAddClicked'
        'click #manage-app-button': 'onManageAppsClicked'

    ### Constructor ###

    constructor: (apps) ->
        @apps = apps
        @isManaging = false

        super collection: apps

    afterRender: =>
        @appList = @$ "#app-list"
        @manageAppsButton = @$ "#manage-app-button"
        @addApplicationButton = @$ "#add-app-button"
        @machineInfos = @$(".machine-infos").hide()
        @$("#no-app-message").hide()

    displayNoAppMessage: ->
        if @apps.size() is 0
            @$("#no-app-message").show()
        else
            @$("#no-app-message").hide()

    appendView: (view) =>
        @appList.append view.el
        view.$el.hide().fadeIn()
        if @isManaging
            view.$el.find(".application-outer").css 'display', 'block'

    ### Listeners ###

    onAddClicked: (event) =>
        event.preventDefault()
        app?.routers.main.navigate 'market', true

    onManageAppsClicked: (event) =>
        event.preventDefault()
        if not @machineInfos.is(':visible')
            @$('.application-outer').show()
            @machineInfos.find('.progress').spin()
            @manageAppsButton.addClass 'pressed'
            client.get 'api/sys-data',
                success: (data) =>
                    @machineInfos.find('.progress').spin()
                    @displayMemory(data.freeMem, data.totalMem)
                    @displayDiskSpace(data.usedDiskSpace, data.totalDiskSpace)
                error: =>
                    @machineInfos.find('.progress').spin()
                    alert 'Server error occured, infos cannot be displayed.'
        else
            @$('.application-outer').hide()
            @manageAppsButton.removeClass 'pressed'

        @machineInfos.toggle()
        @isManaging = not @isManaging

    displayMemory: (freeMem, totalMem)->
        total = Math.floor(totalMem / 1024) + "MB"
        @machineInfos.find('.memory .total').html total

        usedMemory = ((totalMem - freeMem) / totalMem) * 100
        @machineInfos.find('.memory .bar').css('width', usedMemory + '%')

    displayDiskSpace: (usedSpace, totalSpace)->
        @machineInfos.find('.disk .total').html(totalSpace + "GB")
        @machineInfos.find('.disk .bar').css('width', usedSpace + '%')
