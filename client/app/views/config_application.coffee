BaseView = require 'lib/base_view'
ColorButton = require 'widgets/install_button'
PopoverDescriptionView = require 'views/popover_description'


# Row displaying application name and attributes
module.exports = class ApplicationRow extends BaseView
    className: "config-application"
    tagName: "div"
    template: require 'templates/config_application'

    getRenderData: ->
        gitName = @model.get('git')
        gitName = gitName[...-4] if gitName?
        app: _.extend {}, @model.attributes,
            website: @model.get('website') or gitName,
            branch: @model.get('branch') or 'master'

    events:
        "click .remove-app": "onRemoveClicked"
        "click .update-app": "onUpdateClicked"
        "click .start-stop-btn": "onStartStopClicked"
        "click .app-stoppable": "onStoppableClicked"
        "click .favorite": "onFavoriteClicked"

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
        @updateLabel = @$ ".to-update-label"

        @listenTo @model, 'change', @onAppChanged
        @onAppChanged @model

        @setIcon()


    # Build icon from model information (depending of icon format and model
    # name).
    setIcon: ->

        @setIconSrc()

        slug = @model.get 'slug'
        color = @model.get 'color'
        unless color?
            color = hashColor = ColorHash.getColor slug, 'cozy'
            # By default, look for the color in the market.
            # color = @inMarket?.get('color') or hashColor
        @color = color
        @$('.icon-container img').css 'background', color


    setIconSrc: ->
        @icon = @$ '.icon'
        if @model.isIconSvg()
            extension = 'svg'
            @icon.addClass 'svg'
        else
            extension = 'png'
            @icon.removeClass 'svg'

        if @model.get('state') is 'broken'
            @hideLoading()
            @icon.attr 'src', "img/broken.svg"
        else if @model.get('state') isnt 'installing'
            @hideLoading()
            src = "api/applications/#{@model.get 'slug'}.#{extension}"
            @icon.attr 'src', src
        else
            @showLoading()
            @icon.attr 'src', "img/broken.svg"


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

        @setIconSrc()

        @updateIcon.toggle @model.get 'needsUpdate'
        if (not @model.get("branch")? or @model.get 'branch' is 'master') and
            not(@model.get('needsUpdate'))
                @$(".update-app").hide()

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
        @removeButton.spin true
        @stateLabel.html t 'removing'

        @model.uninstall
            success: =>
                @remove()
                Backbone.Mediator.pub 'app-state:changed',
                    status: 'uninstalled'
                    updated: false
                    slug: @model.get 'slug'
            error: =>
                @removeButton.displayRed t "retry to install"
                Backbone.Mediator.pub 'app-state:changed',
                    status: 'uninstalled'
                    updated: false
                    slug: @model.get 'slug'


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
        @startStopBtn.spin true
        if(@model.isRunning())
            @model.stop
                success: =>
                    @startStopBtn.spin false
                    @stateLabel.html t 'stopped'
                    @render()
                    Backbone.Mediator.pub 'app-state:changed',
                        status: 'stopped'
                        updated: false
                        slug: @model.get 'slug'
                error: =>
                    @startStopBtn.spin false

        else
            @model.start
                success: =>
                    @startStopBtn.spin false
                    @stateLabel.html t 'started'
                    @render()
                    Backbone.Mediator.pub 'app-state:changed',
                        status: 'started'
                        updated: false
                        slug: @model.get 'slug'
                    window.location.href = "#apps/#{@model.get('slug')}"
                error: =>
                    @startStopBtn.spin false
                    @stateLabel.html t 'stopped'
                    Backbone.Mediator.pub 'app-state:changed',
                        status: 'stopped'
                        updated: false
                        slug: @model.get 'slug'
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
        @updateButton.spin true

        if @model.get('state') isnt 'broken'
            @stateLabel.html t 'updating'
            Backbone.Mediator.pub 'app-state:changed',
                status: 'updating'
                updated: true
                slug: @model.get 'slug'

        else
            @stateLabel.html t 'installing'
            Backbone.Mediator.pub 'app-state:changed',
                status: 'installing'
                updated: false
                slug: @model.get 'slug'

        @model.updateApp
            success: =>
                @updateButton.displayGreen t "updated"
                @updateButton.spin false
                if @model.get('state') is 'installed'
                    @stateLabel.html t 'started'
                if @model.get('state') is 'stopped'
                    @stateLabel.html t 'stopped'
                Backbone.Mediator.pub 'app-state:changed',
                        status: 'started'
                        updated: true
                        slug: @model.get 'slug'
                setTimeout =>
                    @updateButton.hide()
                    @updateLabel.hide()
                , 1000

            error: (jqXHR) =>
                @updateButton.spin false
                alert t 'update error'
                @stateLabel.html t 'broken'
                @updateButton.displayRed t "update failed"
                Backbone.Mediator.pub 'app-state:changed',
                    status: 'broken'
                    updated: false
                    slug: @model.get 'slug'


    # When favorite button is clicked, the favorite flag is toggled.
    # A event is published, that way the home view can refresh and display
    # the application as a favorite.
    onFavoriteClicked: =>
        @model.set 'favorite', not @model.get 'favorite'
        @model.save()
        Backbone.Mediator.pub 'app:changed:favorite', @model
        @render()


    showLoading: =>
        @icon.hide()
        @$('.spinner').show()


    hideLoading: ->
        @$('.spinner').hide()
        @icon.show()

