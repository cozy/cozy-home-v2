request = require 'lib/request'
BaseView = require 'lib/base_view'
ConfigApplicationList = require './config_application_list'

# View describing main screen for user once he is logged
module.exports = class exports.ConfigApplicationsView extends BaseView
    id: 'config-applications-view'
    template: require 'templates/config_applications'

    subscriptions:
        'app-state-changed': 'onAppStateChanged'

    constructor: (@apps) ->
        super()

    afterRender: ->
        @memoryFree = @$ '.memory-free'
        @diskSpace = @$ '.disk-space'
        @fetch()
        @applicationList = new ConfigApplicationList @apps
        @$el.find('.w66').append @applicationList.$el

    fetch: ->
        @$('.amount').spin 'small'
        @$('.total').spin 'small'
        request.get 'api/sys-data', (err, data) =>
            if err
                alert 'Server error occured, infos cannot be displayed.'
            else
                @$('.amount').spin()
                @$('.total').spin()
                @displayMemory data.freeMem, data.totalMem
                @displayDiskSpace data.usedDiskSpace, data.totalDiskSpace

    displayMemory: (amount, total) ->
        @memoryFree.find('.amount').html Math.floor(amount / 1000)
        @memoryFree.find('.total').html Math.floor(total / 1000)

    displayDiskSpace: (amount, total) ->
        @diskSpace.find('.amount').html amount
        @diskSpace.find('.total').html total

    onAppStateChanged: ->
        setTimeout @fetch, 2000
