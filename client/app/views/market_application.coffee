BaseView = require 'lib/BaseView'
ColorButton = require 'widgets/install_button'

module.exports = class ApplicationRow extends BaseView
    tagName: "div"
    className: "cozy-app"
    template: ->
        require('templates/market_application')({app:@app.attributes})

    constructor: (@app, @marketView) ->

        @events = {}
        @events["click #add-#{@app.id}-install"] = 'onInstallClicked'

        super()

    afterRender: =>
        @installButton = new ColorButton(@$ "#add-#{@app.id}-install")

    onInstallClicked: =>
        @marketView.runInstallation(@app.attributes, @installButton)