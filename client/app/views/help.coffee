BaseView = require 'lib/base_view'

module.exports = class exports.AccountView extends BaseView
    id: 'help-view'
    template: require 'templates/help'

    constructor: ->
        super()

    afterRender: ->
        $.get "api/instances/", (data) =>
            instance = data.rows?[0]
            helpUrl = instance?.helpUrl

            if helpUrl?
                template = require 'templates/help_url'
                $(@$el.find('.line')[1]).prepend template helpUrl: helpUrl
