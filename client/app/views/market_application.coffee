BaseView = require 'lib/base_view'
ColorButton = require 'widgets/install_button'

module.exports = class ApplicationRow extends BaseView
    tagName: "div"
    className: "cozy-app"
    template: require 'templates/market_application'

    events:
        "click .btn": "onInstallClicked"
        "click": "onInstallClicked"

    getRenderData: ->
        app: @app.attributes

    constructor: (@app, @marketView) ->
        super()
        @mouseOut = true

    afterRender: =>
        @installButton = new ColorButton(@$ "#add-#{@app.id}-install")
        if @app.get('comment') is 'official application'
            @$el.addClass 'official'
        else if @app.get('comment') is 'fing application'
            @$el.addClass 'fing'

    onInstallClicked: =>
        if @marketView.isInstalling()
            alert t "application is installing"
        else
            @marketView.showDescription this, @installButton
