BaseView = require 'lib/base_view'

module.exports = class exports.AccountView extends BaseView
    id: 'help-view'
    template: require 'templates/help'

    constructor: ->
        super()
