BaseView = require 'lib/BaseView'
client = require 'helpers/client'
ApplicationRow = require 'views/home_application'


String::startsWith = (prefix) ->
     @indexOf(prefix, 0) is 0

String::endsWith = (suffix) ->
     @indexOf(suffix, @length - suffix.length) isnt -1

# View describing main screen for user once he is logged
module.exports = class ApplicationsListView extends BaseView
    id: 'applications-view'
    template: require 'templates/home'

    events:
        'click #add-app-button':'onAddClicked'
        'click #manage-app-button':'onManageAppsClicked'

    ### Constructor ###

    constructor: (apps) ->
        @apps = apps
        @isManaging = false

        super()

    afterRender: =>
        @appList = @$ "#app-list"
        @manageAppsButton = @$ "#manage-app-button"
        @addApplicationButton = @$ "#add-app-button"
        @infoAlert = @$ "#add-app-form .info"
        @errorAlert = @$ "#add-app-form .error"
        @machineInfos = @$ ".machine-infos"
        @machineInfos.hide()
        @noAppMessage = @$ '#no-app-message'

        if @apps.length > 0
            onApplicationListReady(@apps)

        @apps.bind 'reset', @onApplicationListReady
        @apps.bind 'add', @addApplication
        @apps.bind 'remove', @onAppRemoved


    ### Collection Listeners ###
    onApplicationListReady: (apps) =>
        @appList.html null
        if apps.length is 0
            @noAppMessage.show()
        else
            apps.forEach @addApplication

    # Add an application row to the app list.
    addApplication: (application) =>
        row = new ApplicationRow(application)
        @appList.append row.el
        appButton = @$(row.el)
        appButton.hide().fadeIn()
        appButton.find(".application-outer").css 'display', 'block' if @isManaging
        @noAppMessage.hide()

    onAppRemoved: (slug) =>
        if @apps.length is 0
            @noAppMessage.show()

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
        total = Math.floor(totalMem / 1024) + "Mo"
        @machineInfos.find('.memory .total').html total

        usedMemory = ((totalMem - freeMem) / totalMem) * 100
        @machineInfos.find('.memory .bar').css('width', usedMemory + '%')

    displayDiskSpace: (usedSpace, totalSpace)->
        @machineInfos.find('.disk .total').html(totalSpace + "Go")
        @machineInfos.find('.disk .bar').css('width', usedSpace + '%')

    # Display message inside info box.
    #displayInfo: (msg) =>
    #    @errorAlert.hide()
    #    @infoAlert.html msg
    #    @infoAlert.show()

    # Display message inside error box.
    #displayError: (msg) =>
    #    @infoAlert.hide()
    #    @errorAlert.html msg
    #    @errorAlert.show()
    
    #hideError: =>
    #    @errorAlert.hide()
