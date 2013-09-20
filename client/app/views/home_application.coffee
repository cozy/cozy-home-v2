BaseView = require 'lib/base_view'
ColorButton = require 'widgets/install_button'
PopoverPermissionsView = require 'views/popover_permissions'

# Row displaying application name and attributes
module.exports = class ApplicationRow extends BaseView
    className: "application"
    tagName: "div"

    template: require 'templates/home_application'

    getRenderData: ->
        app: @model.attributes

    events:
        "click .application-inner" : "onAppClicked"

    ### Constructor ####

    constructor: (options) ->
        @id = "app-btn-#{options.model.id}"
        super

    afterRender: =>
        @icon = @$ 'img'
        @stateLabel = @$ '.state-label'

        @listenTo @model, 'change', @onAppChanged
        @onAppChanged @model

    ### Listener ###

    onAppChanged: (app) =>
        switch @model.get 'state'
            when 'broken'
                @icon.attr 'src', "img/broken.png"
                @stateLabel.show().text t 'broken'
            when 'installed'
                @icon.attr 'src', "api/applications/#{app.id}.png"
                @icon.removeClass 'stopped'
                @stateLabel.hide()
            when 'installing'
                @icon.attr 'src', "img/installing.gif"
                @icon.removeClass 'stopped'
                @stateLabel.show().text 'installing'
            when 'stopped'
                @icon.attr 'src', "api/applications/#{app.id}.png"
                @icon.addClass 'stopped'
                @stateLabel.hide()

    onAppClicked: (event) =>
        event.preventDefault()
        switch @model.get 'state'
            when 'broken'
                msg = 'This app is broken. Try install again.'
                errormsg = @model.get 'errormsg'
                msg += " Error was : #{errormsg}" if errormsg
                alert msg
            when 'installed'
                @launchApp()
            when 'installing'
                alert t 'this app is being installed. Wait a little'
            when 'stopped'
                @model.start success: @launchApp

    ### Functions ###

    launchApp: =>
        window.app.routers.main.navigate "apps/#{@model.id}/", true
