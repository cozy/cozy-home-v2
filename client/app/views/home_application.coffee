BaseView = require 'lib/base_view'
ColorButton = require 'widgets/install_button'

# Row displaying application name and attributes
module.exports = class ApplicationRow extends BaseView
    className: "application w20 mod left"
    tagName: "div"

    template: require 'templates/home_application'

    getRenderData: ->
        app: @model.attributes

    events:
        "mouseup .application-inner": "onAppClicked"
        "mouseover .application-inner": "onMouseOver"
        "mouseout .application-inner": "onMouseOut"

    ### Constructor ####

    onMouseOver: ->
        @background.css 'background-color', '#FF9D3B'

    onMouseOut: ->
        @background.css 'background-color', @color or 'transparent'

    constructor: (options) ->
        @id = "app-btn-#{options.model.id}"
        @enabled = true
        super
        @inMarket = options.market.findWhere slug: @model.get('slug')

    afterRender: =>
        @icon = @$ 'img.icon'
        @stateLabel = @$ '.state-label'
        @title = @$ '.app-title'
        @background = @$ 'img'

        @listenTo @model, 'change', @onAppChanged
        @onAppChanged @model

        # Only set a background color for SVG icons
        if @model.isIconSvg()

            # if there is no set color, we use an auto-generated one
            @setBackgroundColor()
            @icon.addClass 'svg'


    ### Listener ###

    onAppChanged: (app) =>
        switch @model.get 'state'
            when 'broken'
                @hideSpinner()
                @icon.show()
                @icon.attr 'src', "img/broken.png"
                @stateLabel.show().text t 'broken'

            when 'installed'
                @hideSpinner()
                if @model.isIconSvg()
                    @setBackgroundColor()
                    extension = 'svg'
                    @icon.addClass 'svg'
                else
                    extension = 'png'
                    @icon.removeClass 'svg'

                @icon.attr 'src', "api/applications/#{app.id}.#{extension}"
                @icon.hide()
                @icon.show()
                @icon.removeClass 'stopped'
                @stateLabel.hide()

            when 'installing'
                @icon.hide()
                @showSpinner()
                @stateLabel.show().text 'installing'
                @setBackgroundColor()

            when 'stopped'

                if @model.isIconSvg()
                    extension = 'svg'
                    @icon.addClass 'svg'
                else
                    extension = 'png'
                    @icon.removeClass 'svg'

                @icon.attr 'src', "api/applications/#{app.id}.#{extension}"
                @icon.addClass 'stopped'
                @hideSpinner()
                @icon.show()
                @stateLabel.hide()

    onAppClicked: (event) =>
        event.preventDefault()
        return null unless @enabled
        switch @model.get 'state'
            when 'broken'
                msg = t('application broken')
                errormsg = @model.get 'errormsg'
                msg += " Error was : #{errormsg}" if errormsg
                alert msg
            when 'installed'
                @launchApp(event)
            when 'installing'
                alert t 'this app is being installed. Wait a little'
            when 'stopped'
                @icon.hide()
                @showSpinner()
                @model.start
                    success: =>
                        @launchApp(event)
                        @hideSpinner()
                        @icon.show()
                    error: =>
                        @hideSpinner()
                        @icon.show()
                        msg = 'This app cannot start.'
                        errormsg = @model.get 'errormsg'
                        msg += " Error was : #{errormsg}" if errormsg
                        alert msg


    ### Functions ###

    launchApp: (e) =>
        # if ctrl or middle click or small device
        if e.which is 2 or e.ctrlKey or e.metaKey or $(window).width() <= 640
            window.open "apps/#{@model.id}/", "_blank"
        else if e.which is 1 # left click
            window.app.routers.main.navigate "apps/#{@model.id}/", true

    # Spinner stuff
    generateSpinner: =>
        @spinner = new Sonic
            width: 40
            height: 40
            padding: 20

            strokeColor: '#363a46'

            pointDistance: .002
            stepsPerFrame: 15
            trailLength: .7

            step: 'fader'

            setup: ->
                this._.lineWidth = 5
            path: [
                ['arc', 20, 20, 20, 0, 360]
            ]
        @spinner.play()


    setBackgroundColor: ->
        slug = @model.get 'slug'
        color = @model.get 'color'
        unless color?
            hashColor = ColorHash.getColor slug, 'cozy'

            # By default, look for the color in the market.
            color = @inMarket?.get('color') or hashColor
        @color = color
        @background.css 'background-color', color


    showSpinner: =>
        @$('.spinner').show()

    hideSpinner: ->
        @$('.spinner').hide()

