BaseView = require 'lib/base_view'
ColorButton = require 'widgets/install_button'

REGEXP_SPRITED_SVG = ///img/apps/(.*)\.svg///

module.exports = class ApplicationRow extends BaseView
    tagName: "div"
    className: "cozy-app"
    template: require 'templates/market_application'

    events:
        "click .btn": "onInstallClicked"
        "click": "onInstallClicked"

    getRenderData: ->
        app = @app.toJSON()
        if match = app.icon.match(REGEXP_SPRITED_SVG)
            [all, slug] = match
            app = _.extend {}, app, svgSpriteSlug: 'svg-' + slug

        return {app}

    constructor: (@app, @marketView) ->
        super()
        @mouseOut = true
        @installInProgress = false

    afterRender: =>
        @$el.attr 'id', "market-app-#{@app.get 'slug'}"
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
            iconNode.css 'background-color', color

    onInstallClicked: =>
        return if @installInProgress
        @marketView.showDescription this, @installButton
