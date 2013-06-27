BaseView = require 'lib/base_view'
appButtonTemplate = require "templates/navbar_app_btn"
NotificationsView = require './notifications_view'

module.exports = class NavbarView extends BaseView

    el:'#header'
    template: require 'templates/navbar'

    constructor: (apps) ->
        @apps = apps
        super()

    afterRender: =>

        @notifications = new NotificationsView()

        @buttons = @$('#buttons')
        @$('#help-button').tooltip
             placement: 'bottom'
             title: t('Questions and help forum')

        if window.app.instance?.helpUrl
            @$('#help-button').attr 'href', window.app.instance.helpUrl


        @$('#logout-button').tooltip
             placement: 'bottom'
             title: t('Sign out')

        if @apps.length > 0
            onApplicationListReady(@apps)

        @apps.bind 'reset', @onApplicationListReady
        @apps.bind 'change', @onApplicationChanged
        @apps.bind 'add', @addApplication
        @apps.bind 'remove', @onAppRemoved

    onApplicationListReady: (apps) =>
        @$(".app-button").remove()

        apps.forEach @onApplicationChanged

    onApplicationChanged: (app) =>
        if app.isRunning()
            if not @buttons.find("#" + app.id).length
                @addApplication(app)
        else @onAppRemoved(app)


    # Add an app button to cozy apps menu
    addApplication: (app) =>
        return unless app.isRunning()
        @buttons.find(".nav:last").prepend appButtonTemplate(app: app.attributes)
        button = @buttons.find("#" + app.id)
        button.tooltip
             placement: 'bottom'
             title: '<a target="' + app.id + '" href="/apps/' + \
                    app.id + '/">' + t('open in a new tab') + '</a>'
             delay: show: 500, hide: 1000

    # Remove an app button from the navbar
    onAppRemoved: (app) =>
        if app.id?
            @buttons.find("##{app.id}").remove()

    # Desactivate all buttons and activate given button (visual activation).
    selectButton: (button) ->
        button = @$("##{button}")
        @buttons.find("li").removeClass "active"
        button.parent().addClass "active"
