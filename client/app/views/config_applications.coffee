request = require 'lib/request'
BaseView = require 'lib/base_view'
ColorButton = require 'widgets/install_button'
Application = require 'models/application'
StackApplication = require 'models/stack_application'
ConfigApplicationList = require './config_application_list'
ConfigDeviceList = require './config_device_list'
UpdateStackModal = require './update_stack_modal'
AppsCollection = require '../collections/application'

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
        @market = new AppsCollection()
        @applicationList = new ConfigApplicationList @apps, @market
        @deviceList = new ConfigDeviceList @devices
        @$el.find('.title-app').append @applicationList.$el
        @applications = new Application()
        @stackApplications = new StackApplication()
        @market.fetchFromMarket ->

    openUpdatePopover: (slug) ->
        @applicationList.openUpdatePopover slug

    displayStackVersion: =>
        for app in @stackApps.models
            @$(".#{app.get 'name'}").html app.get 'version'
            currentVersion = app.get('version').split('.')
            lastVersion = app.get('lastVersion') or '0.0.0'
            newVersion = lastVersion.split('.')
            if parseInt(currentVersion[2]) < parseInt(newVersion[2])
                @$(".#{app.get 'name'}").css 'font-weight', "bold"
                @$(".#{app.get 'name'}").css 'color', "Orange"
            if parseInt(currentVersion[1]) < parseInt(newVersion[1])
                @$(".#{app.get 'name'}").css 'font-weight', "bold"
                @$(".#{app.get 'name'}").css 'color', "OrangeRed"
            if parseInt(currentVersion[0]) < parseInt(newVersion[0])
                @$(".#{app.get 'name'}").css 'font-weight', "bold"
                @$(".#{app.get 'name'}").css 'color', "Red"

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
                @displayDiskSpace data.usedDiskSpace, data.totalDiskSpace, data.unit

    displayMemory: (amount, total) ->
        @memoryFree.find('.amount').html Math.floor((total - amount) / 1000)
        @memoryFree.find('.total').html Math.floor(total / 1000)

    displayDiskSpace: (amount, total, unit) ->
        @diskSpace.find('.amount').html amount
        @diskSpace.find('.total').html "#{total} #{unit or 'G'}"

    onAppStateChanged: ->
        setTimeout @fetch, 10000

    popoverManagement: (action) ->
        @popover.hide() if @popover?
        @popover = new UpdateStackModal
            confirm: (application) =>
                action
                    success: =>
                        @popover.onSuccess()
                    error: (err) =>
                        @popover.onError(err.responseText)
            cancel: (application) =>
                @popover.hide()
                @popover.remove()
            end: (success) ->
                if success
                    location.reload()

        $("#config-applications-view").append @popover.$el
        @popover.show()

    onUpdateClicked: ->
        action = (cb) =>
            {success, error} = cb or {}
            @applications.updateAll
                success: =>
                    @stackApplications.updateStack cb
                error: (err) =>
                    @stackApplications.updateStack
                        success: =>
                            if error
                                error err
                            else
                                success "ok"
                        error: (stack_err) =>
                            err.stack = stack_err
                            error err if error
        @popoverManagement action

    onUpdateStackClicked: ->
        action = (cb) =>
            @stackApplications.updateStack cb
        @popoverManagement action

    onRebootStackClicked: ->
        @rebootStackBtn.displayGrey "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
        @rebootStackBtn.spin true, '#ffffff'
        @spanRefresh.show()
        @stackApplications.rebootStack ->
            location.reload()
