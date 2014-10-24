request = require 'lib/request'
BaseView = require 'lib/base_view'
ColorButton = require 'widgets/install_button'
Application = require 'models/application'
ConfigApplicationList = require './config_application_list'
ConfigDeviceList = require './config_device_list'


module.exports = class exports.ConfigApplicationsView extends BaseView
    id: 'config-applications-view'
    template: require 'templates/config_applications'

    subscriptions:
        'app-state-changed': 'onAppStateChanged'

    events:
        "click .update-all"        : "onUpdateClicked"
        "click .update-stack"      : "onUpdateStackClicked"
        "click .reboot-stack"      : "onRebootStackClicked"

    constructor: (@apps, @devices, @stackApps) ->
        @listenTo @devices, 'reset', @displayDevices
        @listenTo @stackApps, 'reset', @displayStackVersion
        super()

    afterRender: ->
        @spanRefresh = @$ '.refresh'
        @spanRefresh.hide()
        @memoryFree = @$ '.memory-free'
        @diskSpace = @$ '.disk-space'
        @updateBtn = new ColorButton  @$ '.update-all'
        @updateStackBtn = new ColorButton  @$ '.update-stack'
        @rebootStackBtn = new ColorButton  @$ '.reboot-stack'
        @fetch()
        @applicationList = new ConfigApplicationList @apps
        @deviceList = new ConfigDeviceList @devices
        @$el.find('.title-app').append @applicationList.$el
        @applications = new Application()

    displayStackVersion: =>
        for app in @stackApps.models
            @$(".#{app.get 'name'}").html app.get 'version'
            if app.get('version')? and app.get('lastVersion') and
                app.get('version') isnt app.get('lastVersion')
                    @$(".#{app.get 'name'}").css 'font-weight', "bold"
                    currentVersion = app.get('version').split('.')
                    newVersion = app.get('lastVersion').split('.')
                    if currentVersion[0] isnt newVersion[0]
                        @$(".#{app.get 'name'}").css 'color', "Red"
                    else if currentVersion[1] isnt newVersion[1]
                        @$(".#{app.get 'name'}").css 'color', "OrangeRed"
                    else if currentVersion[2] isnt newVersion[2]
                        @$(".#{app.get 'name'}").css 'color', "Orange"

    displayDevices: =>
        if not(@devices.length is 0)
            @$el.find('.title-device').show()
            @$el.find('.title-device').append @deviceList.$el


    fetch: =>
        @$('.amount').html "--"
        @$('.total').html "--"
        request.get 'api/sys-data', (err, data) =>
            if err
                alert t 'Server error occured, infos cannot be displayed.'
            else
                @displayMemory data.freeMem, data.totalMem
                @displayDiskSpace data.usedDiskSpace, data.totalDiskSpace

    displayMemory: (amount, total) ->
        @memoryFree.find('.amount').html Math.floor((total - amount) / 1000)
        @memoryFree.find('.total').html Math.floor(total / 1000)

    displayDiskSpace: (amount, total) ->
        @diskSpace.find('.amount').html amount
        @diskSpace.find('.total').html total

    onAppStateChanged: ->
        setTimeout @fetch, 10000

    onUpdateClicked: ->
        @updateBtn.displayGrey "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
        Backbone.Mediator.pub 'app-state-changed', true
        @updateBtn.spin true, '#ffffff'
        @applications.updateAll
            success: =>
                @updateBtn.displayGreen t "update all"
                Backbone.Mediator.pub 'app-state-changed', true
            error: =>
                @updateBtn.displayGreen t "error during updating"
                Backbone.Mediator.pub 'app-state-changed', true

    onUpdateStackClicked: ->
        @updateStackBtn.displayGrey "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
        @updateStackBtn.spin true, '#ffffff'
        @applications.updateStack
            success: =>
                @spanRefresh.show()
                @updateStackBtn.displayGreen t "update stack"
            error: =>
                @spanRefresh.show()
                @updateStackBtn.displayGreen t "update stack"

    onRebootStackClicked: ->
        @rebootStackBtn.displayGrey "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
        @rebootStackBtn.spin true, '#ffffff'
        @applications.rebootStack
            success: =>
                @spanRefresh.show()
                @rebootStackBtn.displayGreen t "update stack"
            error: =>
                @spanRefresh.show()
                @rebootStackBtn.displayGreen t "update stack"