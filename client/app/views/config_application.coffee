BaseView = require 'lib/base_view'
ColorButton = require 'widgets/install_button'
PopoverPermissionsView = require 'views/popover_permissions'

# Row displaying application name and attributes
module.exports = class ApplicationRow extends BaseView
    className: "line config-application clearfix"
    tagName: "div"
    template: require 'templates/config_application'

    getRenderData: ->
        app: @model.attributes

    events:
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
                @removeButton.displayGrey t 'remove'
                @updateButton.displayGrey t 'retry to install'
                @startStopBtn.hide()
            when 'installed'
                @icon.attr 'src', "api/applications/#{app.id}.png"
                @icon.removeClass 'stopped'
                @removeButton.displayGrey t 'remove'
                @updateButton.displayGrey t 'update'
                @startStopBtn.displayGrey t 'stop this app'
            when 'installing'
                @icon.attr 'src', "img/installing.gif"
                @icon.removeClass 'stopped'
                @stateLabel.show().text 'installing'
                @removeButton.displayGrey t 'abort'
                @updateButton.hide()
                @startStopBtn.hide()
            when 'stopped'
                @icon.attr 'src', "api/applications/#{app.id}.png"
                @icon.addClass 'stopped'
                @removeButton.displayGrey t 'remove'
                @updateButton.hide()
                @startStopBtn.displayGrey t 'start this app'

    onStoppableClicked: (event) =>
        bool = not @model.get('isStoppable')
        @model.save {isStoppable: bool},
            success: => @$('.app-stoppable').attr 'checked', !bool
            error: =>
                @$('.app-stoppable').attr 'checked', bool

    onRemoveClicked: (event) =>
        event.preventDefault()
        @removeButton.displayGrey "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
        @removeButton.spin true
        @model.uninstall
            success: =>
                @remove()
                Backbone.Mediator.pub 'app-state-changed', true
            error: =>
                @removeButton.displayRed t "retry to install"
                Backbone.Mediator.pub 'app-state-changed', true

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
                    @stateLabel.html t 'stopped'
                    Backbone.Mediator.pub 'app-state-changed', true
                error: =>
                    @startStopBtn.spin false

        else
            @model.start
                success: =>
                    @startStopBtn.spin false
                    @stateLabel.html t 'started'
                    Backbone.Mediator.pub 'app-state-changed', true
                error: =>
                    @startStopBtn.spin false

    remove: =>
        return super unless @model.get('state') is 'installed'
        @removeButton.spin false
        @removeButton.displayGreen t "Removed"
        setTimeout =>
            @$el.fadeOut =>
                super
        , 1000

    updateApp: ->
        @updateButton.displayRed t "installing"
        Backbone.Mediator.pub 'app-state-changed', true
        @updateButton.displayGrey "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
        @updateButton.spin false
        @updateButton.spin true
            success: =>
                @updateButton.displayGreen t "Updated"
                Backbone.Mediator.pub 'app-state-changed', true
            error: (jqXHR) =>
                error = JSON.parse(jqXHR.responseText)
                alert error.message
                @updateButton.displayRed t "failed"
                Backbone.Mediator.pub 'app-state-changed', true
