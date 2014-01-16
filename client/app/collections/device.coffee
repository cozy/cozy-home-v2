BaseCollection = require 'lib/base_collection'
Device = require 'models/device'


# List of installed devices.
module.exports = class DeviceCollection extends BaseCollection

    model: Device
    url: 'api/devices/'