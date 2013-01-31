client = require '../helpers/client'
applicationsTemplate = require('../templates/applications')
User = require('../models/user').User

AppRow = require('views/application').ApplicationRow
AppCollection = require('collections/application').ApplicationCollection
Application = require("models/application").Application
InstallButton = require("views/install_button")


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

        @mailsButton.showParent()
        @bookmarksButton.showParent()
        @feedsButton.showParent()

        for app in @apps.toArray()
            
            #if app.name is "mails"
                #@mailsButton.hideParent()

            if app.name is "bookmarks"
                @bookmarksButton.hideParent()

            if app.name is "feeds"
                @feedsButton.hideParent()

        if @bookmarksButton.isHidden() and @feedsButton.isHidden()
            $(".app-introduction").hide()
        else
            $(".app-introduction").show()

    onInstallClicked: (event) =>
        data =
            git: @$("#app-git-field").val()

        @runInstallation data, @installAppButton
        event.preventDefault()
        false

    runInstallation: (data, button) =>
        return true if @isInstalling
        return true if button.isGreen()
        @isInstalling = true
        @hideError()
        button.displayOrange "install"
        dataChecking = @checkData data
        if not dataChecking.error
            data.name = @extractName data.git
            @errorAlert.hide()
            button.button.html "&nbsp;&nbsp;&nbsp;&nbsp;"
            button.spin()

            app = new Application data
            app.install
                success: (data) =>
                    if (data.status? == "broken") or not data.success
                        @apps.add app
                        # TODO: refactor that with backbone mediator
                        window.app.views.home.addApplication app
                        button.spin()
                        button.displayRed "Install failed"
                        @isInstalling = false
                    else
                        @apps.add app
                        # TODO: refactor that with backbone mediator
                        window.app.views.home.addApplication app
                        button.spin()
                        button.displayGreen "Install succeeded!"
                        @isInstalling = false

                error: (data) =>
                    @isInstalling = false
                    button.displayRed "Install failed"
                    button.spin()
        else
            @isInstalling = false
            @displayError dataChecking.msg

    # TODO: Set extraction on server side too.
    # Return application name deduce from the github account name.
    extractName: (gitUrl) =>
        strings = gitUrl.split("/")
        name = strings[strings.length - 1]
        name = name.substring(0, name.length - 4)
        name = name.replace /-|_/g, " "
        if name.indexOf("cozy ") is 0
            name = name.substring(5)
        name

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
        
        @mailsButton = new InstallButton @$ "#add-mails-submit"
        @mailsButton.button.click =>
            data = git: "https://github.com/mycozycloud/cozy-mails.git"
            return false if @mailsButton.isGreen()
            @runInstallation data, @mailsButton
        @bookmarksButton = new InstallButton @$ "#add-bookmarks-submit"
        @bookmarksButton.button.click =>
            data = git: "https://github.com/Piour/cozy-bookmarks.git"
            return false if @bookmarksButton.isGreen()
            @runInstallation data, @bookmarksButton
        @feedsButton = new InstallButton @$ "#add-feeds-submit"
        @feedsButton.button.click =>
            data = git: "https://github.com/Piour/cozy-feeds.git"
            return false if @feedsButton.isGreen()
            @runInstallation data, @feedsButton
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
