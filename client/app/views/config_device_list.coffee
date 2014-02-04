ViewCollection = require 'lib/view_collection'
DeviceRow = require 'views/config_device'


module.exports = class DevicesListView extends ViewCollection
    id: 'config-device-list'
    tagName: 'div'
    template: require 'templates/config_device_list'
    itemView: require 'views/config_device'

    constructor: (devices) ->
        @devices = devices
        super collection: devices


    afterRender: =>
        @deviceList = @$ "#device-list"

