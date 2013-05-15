BaseView = require 'lib/base_view'
ColorButton = require 'widgets/install_button'

# Row displaying application name and attributes
module.exports = class ApplicationRow extends BaseView
    className: "application"
    tagName: "div"

    template: require 'templates/home_application'

    getRenderData: ->
        app: @model.attributes

    events:
        "click .application-inner" : "onAppClicked"
        "click .remove-app"        : "onRemoveClicked"
        "click .update-app"        : "onUpdateClicked"
        "click .start-stop-btn"    : "onStartStopClicked"

    ### Constructor ####

    constructor: (options) ->
        @id = "app-btn-#{options.model.id}"
        super

    afterRender: =>
        @updateButton = new ColorButton @$ ".update-app"
        @removeButton = new ColorButton @$ ".remove-app"
        @startStopBtn = new ColorButton @$ ".start-stop-btn"

        @listenTo @model, 'change', @onAppChanged
        @onAppChanged @model

    ### Listener ###

    onAppChanged: (app) =>
        switch @model.get 'state'
            when 'broken'
                @$('img').spin(false).attr 'src', "img/broken.png"
                @startStopBtn.hide()
            when 'installed'
                icon = "apps/#{app.id}/icons/main_icon.png"
                @$('img').spin(false).attr 'src', icon
                @startStopBtn.displayGrey 'stop this app'
            when 'installing'
                @$('img').spin(true).attr 'src', "img/installing.png"
                @startStopBtn.hide()
            when 'stopped'
                @$('img').spin(false).attr 'src', "img/stopped.png"
                @startStopBtn.displayGrey 'start this app'

    onAppClicked: (event) =>
        event.preventDefault()
        switch @model.get 'state'
            when 'broken'
                alert 'this app is broken. Try install again.'
            when 'installed'
                @launchApp()
            when 'installing'
                alert 'this app is being installed. Wait a little'
            when 'stopped'
                @model.start success: @launchApp

    onRemoveClicked: (event) =>
        event.preventDefault()
        @removeButton.displayGrey "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
        @removeButton.spin "small"
        @model.uninstall
            success: => @removeView()
            error: => @removeButton.displayRed "failed"

    onUpdateClicked: (event) =>
        event.preventDefault()
        @updateApp()

    onStartStopClicked: (event) =>
        event.preventDefault()
        @startStopBtn.spin()
        if(@model.isRunning())
            @model.stop
                success: =>
                    @startStopBtn.spin()
                error: =>
                    @startStopBtn.spin()

        else
            @model.start
                success: =>
                    @startStopBtn.spin()
                error: =>
                    @startStopBtn.spin()

    ### Functions ###

    launchApp: =>
        window.app.routers.main.navigate "apps/#{@model.id}", true

    removeView: ->
        @removeButton.displayGreen "Removed"
        setTimeout =>
            @$el.fadeOut =>
                @remove()
        , 1000

    updateApp: ->
        @updateButton.displayGrey "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
        @updateButton.spin()
        @model.updateApp
            success: =>
                @updateButton.displayGreen "Updated"
            error: (jqXHR) =>
                error = JSON.parse(jqXHR.responseText)
                console.log error
                alert error.message
                @updateButton.displayRed "failed"
