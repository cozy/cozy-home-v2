BaseView = require 'lib/base_view'
appButtonTemplate = require "templates/navbar_app_btn"

module.exports = class NavbarView extends BaseView

    el:'#header'
    template: require 'templates/navbar'

    constructor: (apps) ->
        @apps = apps
        super()

    afterRender: =>
        @buttons = @$('#buttons')
        @$('#help-button').tooltip
             placement: 'bottom'
             title: 'Questions and help forum'
            
        @$('#logout-button').tooltip
             placement: 'bottom'
             title: 'Sign out'

        if @apps.length > 0
            onApplicationListReady(@apps)

        @apps.bind 'reset', @onApplicationListReady
        @apps.bind 'change', @onApplicationChanged
        @apps.bind 'add', @addApplication
        @apps.bind 'remove', @onAppRemoved

    onApplicationListReady: (apps) =>
        # @$(".app-button a").unbind()
        @$(".app-button").remove()

        apps.forEach @onApplicationChanged

    onApplicationChanged: (app) =>
        if app.isRunning()
            if not @buttons.find("#" + app.id).length
                @addApplication(app)
        else @onAppRemoved(app)


    # Add an app button to cozy apps menu
    addApplication: (app) =>
        @buttons.find(".nav:last").prepend appButtonTemplate(app: app.attributes)
        button = @buttons.find("#" + app.id)
        button.tooltip
             placement: 'bottom'
             title: '<a target="' + app.id + '" href="/apps/' + \
                    app.id + '/">open in a new tab</a>'
             delay: show: 500, hide: 1000

    # Remove an app button from the navbar
    onAppRemoved: (app) =>
        @buttons.find("##{app.id}").remove()

    # Desactivate all buttons and activate given button (visual activation).
    selectButton: (button) ->
        button = @$("##{button}")
        @buttons.find("li").removeClass "active"
        button.parent().addClass "active"

    

