BaseView = require 'lib/base_view'
ColorButton = require 'widgets/install_button'

module.exports = class ApplicationRow extends BaseView
    tagName: "div"
    className: "cozy-app"
    template: require 'templates/market_application'

    events:
        "mouseover .app-install-button": "onMouseoverInstallButton"
        "mouseout .app-install-button": "onMouseoutInstallButton"
        "click .app-install-button": "onInstallClicked"

    getRenderData: ->
        app: @app.attributes

    constructor: (@app, @marketView) ->
        super()
        @mouseOut = true

    afterRender: =>
        @installButton = new ColorButton(@$ "#add-#{@app.id}-install")

    onMouseoverInstallButton: =>
        @mouseOut = false
        if $(window).width() > 800
            unless @isDisplayed
                direction = direction: 'right'
                @$(".app-install-text").show 'slide', direction, 300, =>
                    @isDisplayed = true

    onMouseoutInstallButton: =>
        @mouseOut = true
        if $(window).width() > 800
            setTimeout =>
                if @isDisplayed and @mouseOut
                    direction = direction: 'right'
                    @$(".app-install-text").hide 'slide', direction, 300, =>
                        @isDisplayed = false
            , 500

    onInstallClicked: =>
        if @marketView.isInstalling()
            alert t "application-is-installing"
        else
            @marketView.showDescription this, @installButton
