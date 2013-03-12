BaseView = require 'lib/BaseView'
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
        "click .startStop-app": "onStartStopClicked"

    ### Constructor ####

    constructor: (@app) ->
        @id = "app-btn-#{@app.id}"

        super()

    afterRender: =>
        @el.id = @app.id

        @updateButton = new ColorButton @$ ".update-app"
        @removeButton = new ColorButton @$ ".remove-app"
        @startStopBtn = new ColorButton @$ ".startStop-app"
        
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
            @startStopBtn.displayRed 'Stop this app'
        else
            # todo do better
            @$('img').attr 'src', "http://placehold.it/128/&text=stopped"
            @startStopBtn.displayGreen 'Start this app'

    onAppClicked: (event) =>
        event.preventDefault()
        if @app.isRunning()
            @launchApp()
        else
            @app.start
                success:@launchApp

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
            error: =>
                @updateButton.displayRed "failed"