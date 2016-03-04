BaseView = require 'lib/base_view'
ColorButton = require 'widgets/install_button'
Modal = require './error_modal'


# Row displaying application name and attributes
module.exports = class ApplicationRow extends BaseView
    className: "application w360-33 w640-25 full-20"
    tagName: "div"

    template: require 'templates/home_application'

    getRenderData: ->
        app: @model.attributes

    events:
        "mouseup .application-inner": "onAppClicked"


    constructor: (options) ->
        @id = "app-btn-#{options.model.id}"
        @enabled = true
        super
        @inMarket = options.market.findWhere slug: @model.get('slug')


    afterRender: =>
        @icon = @$ 'img.icon'
        @title = @$ '.app-title'
        @background = @$ 'img'

        @listenTo @model, 'change', @onAppChanged
        @listenTo @model, 'uninstall', @onUninstall
        @onAppChanged @model

        @setBackgroundColor()

        # Only set a background color for SVG icons
        if @model.isIconSvg()
            # if there is no set color, we use an auto-generated one
            @icon.addClass 'svg'


    ### Listener ###


    onAppChanged: =>
        switch @model.get 'state'
            when 'broken'
                @hideSpinner()
                @icon.attr 'src', "img/broken.svg"

            when 'installed'
                @hideSpinner()
                @setBackgroundColor()
                if @model.isIconSvg()
                    extension = 'svg'
                    @icon.addClass 'svg'
                else
                    extension = 'png'
                    @icon.removeClass 'svg'

                src = "api/applications/#{@model.id}.#{extension}"
                @icon.attr 'src', src
                @icon.show()
                @icon.removeClass 'stopped'
                $("##{@model.get 'slug'}-frame").remove()

            when 'installing'
                @showSpinner()
                @setBackgroundColor()

            when 'stopped'

                if @model.isIconSvg()
                    extension = 'svg'
                    @icon.addClass 'svg'
                else
                    extension = 'png'
                    @icon.removeClass 'svg'

                @icon.attr 'src', "api/applications/#{@model.id}.#{extension}"
                @icon.addClass 'stopped'
                @hideSpinner()


    onUninstall: =>
        @$el.addClass 'uninstalling'
        @showSpinner()
        $("##{@model.get 'slug'}-frame").remove()
        @enabled = false


    onAppClicked: (event) =>
        event.preventDefault()
        return null unless @enabled
        switch @model.get 'state'
            when 'broken'
                errortype = ''
                errorcode = @model.get 'errorcode'
                if errorcode?
                    switch errorcode[0]
                        when '1' then msg += '\n' + t('error user linux')
                        when '2'
                            errortype = t('error git')
                            switch errorcode[1]
                                when '0'
                                    errortype += '\n' + t('error github repo')
                                when '1'
                                    errortype += '\n' + t('error github')
                        when '3' then errortype = t('error npm')
                        when '4' then errortype = t('error start')
                errormsg = @model.get 'errormsg'
                modalOptions =
                    title: 'Broken application'
                    errortype: errortype
                    details: errormsg
                if errorcode[0] is '4'
                    modalOptions.confirm = t('start this app')
                    modalOptions.cancel = t('cancel')
                    modalOptions.onConfirm = @startApp
                modal = new Modal modalOptions
                $("##{@id}").append modal.$el
                modal.show()
            when 'installed'
                @launchApp(event)
            when 'installing'
                alert t 'state app installing'
            when 'stopped'
                @startApp()


    ### Functions ###

    startApp: =>
        @showSpinner()
        @model.start
            success: =>
                @launchApp(event)
                @hideSpinner()
            error: =>
                @hideSpinner()
                msg = t 'state app stopped error'
                errormsg = @model.get 'errormsg'
                msg += " : #{errormsg}" if errormsg
                alert msg

    launchApp: (e) =>
        # if ctrl or middle click or small device
        if e.which is 2 or e.ctrlKey or e.metaKey or $(window).width() <= 640
            window.open "apps/#{@model.id}/", "_blank"
        else if e.which is 1 # left click
            window.app.routers.main.navigate "apps/#{@model.id}/", true


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
        @icon.hide()
        @$('.spinner').show()


    hideSpinner: ->
        @$('.spinner').hide()
        @icon.show()
