BaseView = require 'lib/base_view'
ColorButton = require 'widgets/install_button'
PopoverPermissionsView = require 'views/popover_permissions'

# Row displaying application name and attributes
module.exports = class ApplicationRow extends BaseView
    className: "application"
    tagName: "div"

    template: require 'templates/home_application'

    getRenderData: ->
        app: @model.attributes

    events:
        "click .application-inner" : "onAppClicked"
        "click .remove-app"        : "onRemoveClicked"
        "click .update-app"        : "onUpdateClicked"
        "click .start-stop-btn"    : "onStartStopClicked"
        "click .app-stoppable"     : "onStoppableClicked"

    ### Constructor ####

    constructor: (options) ->
        @id = "app-btn-#{options.model.id}"
        super

    afterRender: =>
        @icon = @$ 'img'
        @updateButton = new ColorButton @$ ".update-app"
        @removeButton = new ColorButton @$ ".remove-app"
        @startStopBtn = new ColorButton @$ ".start-stop-btn"
        @stateLabel = @$ '.state-label'

        @listenTo @model, 'change', @onAppChanged
        @onAppChanged @model

    ### Listener ###

    onAppChanged: (app) =>
        switch @model.get 'state'
            when 'broken'
                @icon.attr 'src', "img/broken.png"
                @stateLabel.show().text t 'broken'
                @removeButton.displayGrey t 'abort'
                @updateButton.displayGrey t 'retry'
                @startStopBtn.hide()
            when 'installed'
                @icon.attr 'src', "apps/#{app.id}/icons/main_icon.png"
                @stateLabel.hide()
                @removeButton.displayGrey t 'remove'
                @updateButton.displayGrey t 'update'
                @startStopBtn.displayGrey t 'stop this app'
            when 'installing'
                @icon.attr 'src', "img/installing.gif"
                @stateLabel.hide()
                #@stateLabel.show().text 'installing'
                @removeButton.displayGrey 'abort'
                @updateButton.hide()
                @startStopBtn.hide()
            when 'stopped'
                @icon.attr 'src', "img/stopped.png"
                @stateLabel.show().text t 'stopped'
                @removeButton.displayGrey t 'remove'
                @updateButton.hide()
                @startStopBtn.displayGrey t 'start this app'

    onAppClicked: (event) =>
        event.preventDefault()
        switch @model.get 'state'
            when 'broken'
                msg = 'This app is broken. Try install again.'
                errormsg = @model.get 'errormsg'
                msg += " Error was : #{errormsg}" if errormsg
                alert msg
            when 'installed'
                @launchApp()
            when 'installing'
                alert t 'this app is being installed. Wait a little'
            when 'stopped'
                @model.start success: @launchApp

    onStoppableClicked: (event) =>
        bool = not @model.get('isStoppable')
        @model.save {isStoppable: bool},
            success: => @$('.app-stoppable').attr 'checked', bool
            error: =>
                @$('.app-stoppable').attr 'checked', !bool
                alert 'oh no !'

    onRemoveClicked: (event) =>
        event.preventDefault()
        @removeButton.displayGrey "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
        @removeButton.spin true
        @model.uninstall
            success: => @remove()
            error: => @removeButton.displayRed t "failed"

    onUpdateClicked: (event) =>
        event.preventDefault()
        @showPopover()

    showPopover: () ->
        @popover = new PopoverPermissionsView
            model: @model
            confirm: (application) =>
                @popover.remove()
                @updateApp()
            cancel: (application) =>
                @popover.remove()
        @$el.append @popover.$el

    onStartStopClicked: (event) =>
        event.preventDefault()
        @startStopBtn.displayGrey "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
        @startStopBtn.spin true
        if(@model.isRunning())
            @model.stop
                success: =>
                    @startStopBtn.spin false
                error: =>
                    @startStopBtn.spin false

        else
            @model.start
                success: =>
                    @startStopBtn.spin false
                error: =>
                    @startStopBtn.spin false

    ### Functions ###

    launchApp: =>
        window.app.routers.main.navigate "apps/#{@model.id}/", true

    remove: =>
        return super unless @model.get('state') is 'installed'
        @removeButton.spin false
        @removeButton.displayGreen t "Removed"
        setTimeout =>
            @$el.fadeOut =>
                super
        , 1000

    updateApp: ->
        @updateButton.displayGrey "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
        @updateButton.spin false
        @updateButton.spin true
        @model.updateApp
            success: =>
                @updateButton.displayGreen t "Updated"
            error: (jqXHR) =>
                error = JSON.parse(jqXHR.responseText)
                console.log error
                alert error.message
                @updateButton.displayRed t "failed"
