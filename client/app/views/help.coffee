BaseView = require 'lib/base_view'

# View describing main screen for user once he is logged
module.exports = class exports.AccountView extends BaseView
    id: 'help-view'
    template: require 'templates/help'

    constructor: ->
        super()
