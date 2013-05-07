BaseView = require 'lib/base_view'
ColorButton = require 'widgets/install_button'

# Row displaying application name and attributes
module.exports = class ApplicationRow extends BaseView
    className: "application"
    tagName: "div"

    template: ->
        require('templates/home_application')({'app':@app.attributes})

    events:
        "click .application-inner" : "onAppClicked"
        "click .remove-app": "onRemoveClicked"
        "click .update-app": "onUpdateClicked"
        "click .start-stop-btn": "onStartStopClicked"

    ### Constructor ####

    constructor: (@app) ->
        @id = "app-btn-#{@app.id}"

        super()

    afterRender: =>
        @el.id = @app.id

        @updateButton = new ColorButton @$ ".update-app"
        @removeButton = new ColorButton @$ ".remove-app"
        @startStopBtn = new ColorButton @$ ".start-stop-btn"

        @app.on('change', @onAppChanged)
        @onAppChanged(@app)

    remove: =>
        @app.unbind('change')
        super()

    ### Listener ###

    onAppChanged: (app) =>
        if app.isBroken()
            @$el.addClass "broken"
            @startStopBtn.hide()
        else if app.isRunning()
            @$('img').attr 'src', "apps/#{app.id}/icons/main_icon.png"
            @startStopBtn.displayGrey 'stop this app'
        else
            # todo do better
            @$('img').attr 'src', "img/stopped.png"
            @startStopBtn.displayGrey 'start this app'

    onAppClicked: (event) =>
        event.preventDefault()
        if @app.isBroken()
            alert 'this app is broken. Try install again.'
        else if @app.isRunning()
            @launchApp()
        else # stoppped
            @app.start
                success: @launchApp

    onRemoveClicked: (event) =>
        event.preventDefault()
        @removeApp()

    onUpdateClicked: (event) =>
        event.preventDefault()
        @updateApp()

    onStartStopClicked: (event) =>
        event.preventDefault()
        @startStopBtn.spin()
        if(@app.isRunning())
            @app.stop
                success: =>
                    @startStopBtn.spin()
                error: =>
                    @startStopBtn.spin()

        else
            @app.start
                success: =>
                    @startStopBtn.spin()
                error: =>
                    @startStopBtn.spin()

    ### Functions ###

    launchApp: =>
        window.app.routers.main.navigate "apps/#{@app.id}", true


    removeApp: ->
        @removeButton.displayGrey "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
        @removeButton.spin "small"
        @app.uninstall
            success: =>
                @removeButton.displayGreen "Removed"
                setTimeout =>
                    @$el.fadeOut =>
                        @remove()
                , 1000
            error: =>
                @removeButton.displayRed "failed"

    updateApp: ->
        @updateButton.displayGrey "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
        @updateButton.spin()
        @app.updateApp
            success: =>
                @updateButton.displayGreen "Updated"
            error: (jqXHR) =>
                alert JSON.parse(jqXHR.responseText).message
                @updateButton.displayRed "failed"
