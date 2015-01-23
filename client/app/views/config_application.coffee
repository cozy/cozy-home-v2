BaseView = require 'lib/base_view'
ColorButton = require 'widgets/install_button'
PopoverDescriptionView = require 'views/popover_description'


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

    initialize: ->
        # only re-render when 'version' changes, because it's the only displayed
        # field that can change during the update
        @listenTo @model, 'change:version', @render

    afterRender: =>
        @updateButton = new ColorButton @$ ".update-app"
        @removeButton = new ColorButton @$ ".remove-app"
        @startStopBtn = new ColorButton @$ ".start-stop-btn"
        @stateLabel = @$ '.state-label'
        @updateIcon = @$ '.update-notification-icon'
        @appStoppable  = @$ ".app-stoppable"

        @listenTo @model, 'change', @onAppChanged
        @onAppChanged @model


    ### Listener ###

    # When an app document changed, the UI is updated accordingly.
    onAppChanged: (app) =>
        switch @model.get 'state'
            when 'broken'
                @stateLabel.show().text t 'broken'
                @removeButton.displayGrey t 'remove'
                @updateButton.displayGrey t 'retry to install'
                @appStoppable.hide()
                @appStoppable.next().hide()
                @startStopBtn.hide()
            when 'installed'
                @stateLabel.show().text t 'started'
                @removeButton.displayGrey t 'remove'
                @updateButton.displayGrey t 'update'
                @appStoppable.show()
                @appStoppable.next().show()
                @startStopBtn.displayGrey t 'stop this app'
            when 'installing'
                @stateLabel.show().text t 'installing'
                @removeButton.displayGrey t 'abort'
                @updateButton.hide()
                @appStoppable.hide()
                @appStoppable.next().hide()
                @startStopBtn.hide()
            when 'stopped'
                @stateLabel.show().text t 'stopped'
                @removeButton.displayGrey t 'remove'
                @updateButton.displayGrey t 'update'
                @appStoppable.hide()
                @appStoppable.next().hide()
                @startStopBtn.displayGrey t 'start this app'

        @updateIcon.toggle @model.get 'needsUpdate'

        bool = @model.get 'isStoppable'
        @$('.app-stoppable').attr 'checked', bool

    onStoppableClicked: (event) =>
        bool = not @model.get('isStoppable')
        @model.save {isStoppable: bool},
            success: => @$('.app-stoppable').attr 'checked', bool
            error: =>
                @$('.app-stoppable').attr 'checked', !bool

    onRemoveClicked: (event) =>
        event.preventDefault()
        @removeButton.displayGrey "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
        @removeButton.spin true, '#ffffff'
        @stateLabel.html t 'removing'
        @model.uninstall
            success: =>
                @remove()
                Backbone.Mediator.pub 'app-state-changed', true
            error: =>
                @removeButton.displayRed t "retry to install"
                Backbone.Mediator.pub 'app-state-changed', true

    onUpdateClicked: (event) =>
        event.preventDefault()
        @openPopover()

    openPopover: ->
        @popover.hide() if @popover?

        @popover = new PopoverDescriptionView
            model: @model
            label: t 'update'
            confirm: (application) =>
                $('#no-app-message').hide()
                @popover.hide()
                @popover.remove()
                @updateApp()
            cancel: (application) =>
                @popover.hide()
                @popover.remove()
        $("#config-applications-view").append @popover.$el
        @popover.show()

    onStartStopClicked: (event) =>
        event.preventDefault()
        @startStopBtn.displayGrey "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
        @startStopBtn.spin true, '#ffffff'
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
                    @stateLabel.html t 'stopped'
                    Backbone.Mediator.pub 'app-state-changed', true
                    msg = 'This app cannot start.'
                    errormsg = @model.get 'errormsg'
                    msg += " Error was : #{errormsg}" if errormsg
                    alert msg

    remove: =>
        return super unless @model.get('state') is 'installed'
        @removeButton.spin false
        @removeButton.displayGreen t "removed"
        setTimeout =>
            @$el.fadeOut =>
                super
        , 1000

    updateApp: ->
        Backbone.Mediator.pub 'app-state-changed', true
        @updateButton.displayGrey "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
        @updateButton.spin 'small', '#ffffff'
        if @model.get('state') isnt 'broken'
            @stateLabel.html t 'updating'
        else
            @stateLabel.html t "installing"
        @model.updateApp
            success: =>
                if @model.get('state') is 'installed'
                    @updateButton.displayGreen t "updated"
                    @stateLabel.html t 'started'
                    Backbone.Mediator.pub 'app-state-changed', true
                if @model.get('state') is 'stopped'
                    @updateButton.displayGreen t "updated"
                    @stateLabel.html t 'stopped'
                    Backbone.Mediator.pub 'app-state-changed', true
            error: (jqXHR) =>
                alert t 'update error'
                @stateLabel.html t 'broken'
                @updateButton.displayRed t "update failed"
                Backbone.Mediator.pub 'app-state-changed', true
