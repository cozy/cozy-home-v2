client = require '../helpers/client'
applicationsTemplate = require('../templates/applications')
User = require('../models/user').User

AppRow = require('views/application').ApplicationRow
AppCollection = require('collections/application').ApplicationCollection
Application = require("models/application").Application


# Small widget used to changed installatio button style easily
class InstallButton

    constructor: (@button) ->

    displayOrange: (text) ->
        @button.html text
        @button.removeClass "btn-red"
        @button.removeClass "btn-green"
        @button.addClass "btn-orange"

    displayGreen: (text) ->
        @button.html text
        @button.addClass "btn-green"
        @button.removeClass "btn-red"
        @button.removeClass "btn-orange"

    displayRed: (text) ->
        @button.html text
        @button.removeClass "btn-green"
        @button.addClass  "btn-red"
        @button.removeClass "btn-orange"


# View describing main screen for user once he is logged
class exports.ApplicationsView extends Backbone.View
    id: 'applications-view'

    ### Constructor ###

    constructor: ->
        super()

        @isManaging = false
        @isInstalling = false
        @apps = new AppCollection @

    ### Listeners ###

    onAddClicked: =>
        @installAppButton.displayOrange "install"
        @appNameField.val null
        @appGitField.val null

        @addApplicationForm.show()
        @addApplicationModal.toggle()
        @appNameField.focus()
        @isInstalling = false

    onInstallClicked: =>
        return true if @isInstalling
        @isInstalling = true
        data =
            name: @$("#app-name-field").val()
            git: @$("#app-git-field").val()

        @hideError()
        @installAppButton.displayOrange "install"

        dataChecking = @checkData data
        if not dataChecking.error
            @errorAlert.hide()
            @installAppButton.button.html "installing..."
            @installInfo.spin()

            app = new Application data
            app.install
                success: (data) =>
                    if (data.status? == "broken") or not data.success
                        @apps.add app
                        # TODO: refactor that with backbone mediator
                        window.app.views.home.addApplication app
                        @installAppButton.displayRed "Install failed"
                        @installInfo.spin()
                        setTimeout =>
                            @addApplicationForm.slideToggle()
                        , 1000
                    else
                        @apps.add app
                        # TODO: refactor that with backbone mediator
                        window.app.views.home.addApplication app
                        @installAppButton.displayGreen "Install succeeded!"
                        @installInfo.spin()
                        setTimeout =>
                            @addApplicationForm.slideToggle()
                        , 1000

                error: (data) =>
                    @isInstalling = false
                    @installAppButton.displayRed "Install failed"
                    @installInfo.spin()
        else
            @isInstalling = false
            @displayError dataChecking.msg

    onManageAppsClicked: =>
        if not @machineInfos.is(':visible')
            @$('.application-outer').show()
            @machineInfos.find('.progress').spin()
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

        @machineInfos.toggle()
        @isManaging = not @isManaging

    onCloseAddAppClicked: =>
        @addApplicationModal.hide()
        @isInstalling = false

    ### Functions ###

    # Clear current application list.
    clearApps: =>
        @appList.html null

    # Add an application row to the app list.
    # Add application to home view toolbar
    addApplication: (application) =>
        row = new AppRow application
        el = row.render()
        @appList.append el
        appButton = @$(el)
        appButton.hide()
        appButton.fadeIn()
        appButton.find(".application-outer").show() if @isManaging

    # Check that given data are corrects.
    checkData: (data) =>
        rightData = true
        for property of data
            rightData = data[property]? and data[property].length > 0
            break if not rightData

        if not rightData
            error: true, msg: "All fields are required"

        else if not data.git?.match /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?.git$/
                {
                    error: true
                    msg: "Git url should be of form https://.../my-repo.git"
                }
        else
            error: false

    # Display message inside info box.
    displayInfo: (msg) =>
        @errorAlert.hide()
        @infoAlert.html msg
        @infoAlert.show()

    # Display message inside error box.
    displayError: (msg) =>
        @infoAlert.hide()
        @errorAlert.html msg
        @errorAlert.show()
    
    hideError: =>
        @errorAlert.hide()

    displayMemory: (freeMem, totalMem)->
        total = Math.floor(totalMem / 1024) + "Mo"
        @machineInfos.find('.memory .total').html total

        usedMemory = ((totalMem - freeMem) / totalMem) * 100
        @machineInfos.find('.memory .bar').css('width', usedMemory + '%')

    displayDiskSpace: (usedSpace, totalSpace)->
        @machineInfos.find('.disk .total').html(totalSpace + "Go")
        @machineInfos.find('.disk .bar').css('width', usedSpace + '%')
        
    displayNoAppMessage: ->
        @noAppMessage.show()

    ### Init functions ###

    fetchData: ->
        @apps.fetch()

    render: ->
        $(@el).html applicationsTemplate()
        @isManaging = false
        @el

    setListeners: ->
        @appList = @$ "#app-list"

        @addApplicationButton = @$ "#add-app-button"
        @addApplicationButton.click @onAddClicked
        @addApplicationForm = @$ "#add-app-form"
        @addApplicationModal = @$ "#add-app-modal"
        @manageAppsButton = @$ "#manage-app-button"
        @manageAppsButton.click @onManageAppsClicked
        @installAppButton = new InstallButton @$ "#add-app-submit"
        @installAppButton.button.click @onInstallClicked
        @infoAlert = @$ "#add-app-form .info"
        @errorAlert = @$ "#add-app-form .error"
        @machineInfos = @$ ".machine-infos"
        @noAppMessage = @$ '#no-app-message'

        @appNameField = @$ "#app-name-field"
        @appGitField = @$ "#app-git-field"
        @appNameField.keyup (event) =>
            @appGitField.focus() if event.which == 13
        @appGitField.keyup (event) =>
            @onInstallClicked() if event.which == 13

        @installInfo = @$ "#add-app-modal .loading-indicator"
        @errorAlert.hide()
        @infoAlert.hide()
        @machineInfos.hide()

        @addApplicationCloseCross = @$ "#add-app-modal .close"
        @addApplicationCloseCross.click @onCloseAddAppClicked
