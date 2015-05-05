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
    #

    onMouseOver: ->
        @background.css 'background', '#FF9D3B'

    onMouseOut: ->
        @background.css 'background', @color

    constructor: (options) ->
        @id = "app-btn-#{options.model.id}"
        @enabled = true
        super

    afterRender: =>
        @icon = @$ 'img'
        @stateLabel = @$ '.state-label'
        @title = @$ '.app-title'
        @background = @$ '.application-inner'

        @listenTo @model, 'change', @onAppChanged
        @onAppChanged @model

        slug = @model.get 'slug'
        color = @model.get 'color'

        # Only set a background color for SVG icons
        if @model.isIconSvg()

            # if there is no set color, we use an auto-generated one
            unless color?
                color = ColorHash.getColor slug, 'cozy'

            @color = color
            @icon.addClass 'svg'
            @background.css 'background', color


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
                    slug = @model.get 'slug'
                    color = @model.get 'color'
                    unless color?
                        color = ColorHash.getColor slug, 'cozy'
                    extension = 'svg'
                    @icon.addClass 'svg'
                    @background.css 'background', color
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
                msg = 'This app is broken. Try install again.'
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


    showSpinner: =>
        @generateSpinner() if not @spinner
        @$('.vertical-aligner').prepend @spinner.canvas

    hideSpinner: ->
        @$('.vertical-aligner canvas').remove()


