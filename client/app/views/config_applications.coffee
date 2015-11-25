request = require 'lib/request'
BaseView = require 'lib/base_view'
ColorButton = require 'widgets/install_button'
Application = require 'models/application'
StackApplication = require 'models/stack_application'
ConfigApplicationList = require './config_application_list'
ConfigDeviceList = require './config_device_list'
UpdateStackModal = require './update_stack_modal'
AppsCollection = require '../collections/application'


module.exports = class ConfigApplicationsView extends BaseView
    id: 'config-applications-view'
    template: require 'templates/config_applications'

    subscriptions:
        'app-state:changed': 'onAppStateChanged'

    events:
        "click .update-all"        : "onUpdateClicked"
        "click .reboot-stack"      : "onRebootStackClicked"


    constructor: (@apps, @devices, @stackApps, @market) ->
        @listenTo @devices, 'reset', @displayDevices
        @listenTo @stackApps, 'reset', @displayStackVersion
        super()


    afterRender: ->
        @spanRefresh = @$ '.refresh'
        @spanRefresh.hide()
        @memoryFree = @$ '.memory-free'
        @diskSpace = @$ '.disk-space'
        @updateBtn = new ColorButton  @$ '.update-all'
        @rebootStackBtn = new ColorButton  @$ '.reboot-stack'
        @fetch()
        @applicationList = new ConfigApplicationList @apps, @market
        @deviceList = new ConfigDeviceList @devices
        @$el.find('.title-app').after @applicationList.$el
        @applications = new Application()
        @stackApps.fetch reset: true
        @displayDevices()
        @stackApplications = new StackApplication
        @showOrHideUpdateBtn()


    # Display update button when there is an application that requires to be
    # updated or when a stack component needs to be updated.
    showOrHideUpdateBtn: ->
        appNeedUpdate = @apps.where(needsUpdate: true).length > 0

        if @toUpdate or appNeedUpdate
            @updateBtn.show()
        else
            @updateBtn.hide()


    openUpdatePopover: (slug) ->
        @applicationList.openUpdatePopover slug


    displayStackVersion: =>
        @toUpdate = false
        for app in @stackApps.models
            @$(".#{app.get 'name'}").html app.get 'version'
            currentVersion = app.get('version').split('.')
            lastVersion = app.get('lastVersion') or '0.0.0'
            newVersion = lastVersion.split('.')

            if parseInt(currentVersion[2]) < parseInt(newVersion[2])
                @$(".#{app.get 'name'}").css 'font-weight', "bold"
                @$(".#{app.get 'name'}").css 'color', "Orange"
                @toUpdate = true

            if parseInt(currentVersion[1]) < parseInt(newVersion[1])
                @$(".#{app.get 'name'}").css 'font-weight', "bold"
                @$(".#{app.get 'name'}").css 'color', "OrangeRed"
                @toUpdate = true

            if parseInt(currentVersion[0]) < parseInt(newVersion[0])
                @$(".#{app.get 'name'}").css 'font-weight', "bold"
                @$(".#{app.get 'name'}").css 'color', "Red"
                @toUpdate = true

        @showOrHideUpdateBtn()


    displayDevices: =>
        if not(@devices.length is 0)
            @$el.find('.title-device').after @deviceList.$el
        else
            @$el.find('.title-device').after "<div class='no-device'><p>#{t 'status no device'}</p><p>#{t 'mobile app promo'}</p><a role='button' href='https://files.cozycloud.cc/android/CozyMobile_lastest.apk'><i class='fa fa-android'></i><span>#{t 'download apk'}<span></a><a target='_blank' href='https://play.google.com/store/apps/details?id=io.cozy.files_client'><img src='https://developer.android.com/images/brand/en_app_rgb_wo_45.png'></a></div>"


    fetch: =>
        @$('.amount').html "--"
        @$('.total').html "--"
        request.get 'api/sys-data', (err, data) =>
            if err
                alert t 'Server error occured, infos cannot be displayed.'
            else
                diskUsed  = "#{data.usedDiskSpace}"
                diskTotal = "#{data.totalDiskSpace}"
                @displayMemory data.freeMem, data.totalMem
                @displayDiskSpace diskUsed, diskTotal


    displayMemory: (amount, total) ->
        @memoryFree.find('.amount').html Math.floor((total - amount) / 1000)
        @memoryFree.find('.total').html Math.floor(total / 1000)


    displayDiskSpace: (amount, total) ->
        @diskSpace.find('.amount').html amount
        @diskSpace.find('.total').html total


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
                        success: ->
                            if error
                                error err
                            else
                                success "ok"
                        error: (stack_err) ->
                            err.stack = stack_err
                            error err if error
        @popoverManagement action


    onRebootStackClicked: ->
        @rebootStackBtn.spin true
        @spanRefresh.show()
        @stackApplications.rebootStack ->
            location.reload()

