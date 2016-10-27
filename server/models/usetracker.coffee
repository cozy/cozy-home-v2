cozydb = require 'cozydb'
request = require 'request'
async = require 'async'

module.exports = UseTracker = cozydb.getModel 'UseTracker',
    app: String
    dateStart: Date
    dateEnd: Date
    duration: Number
    sent: { type: Boolean, default: false }
