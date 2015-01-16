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

        slug = @app.get 'slug'
        color = @app.get 'color'

        # Only set a background color for SVG icons
        if @app.get('icon').indexOf('.svg') isnt -1
            # if there is no set color, we use an auto-generated one
            unless color?
                color = ColorHash.getColor slug, 'cozy'

            iconNode = @$ '.app-img img'
            iconNode.addClass 'svg'
            iconNode.css 'background', color

    onInstallClicked: =>
        @marketView.showDescription this, @installButton
