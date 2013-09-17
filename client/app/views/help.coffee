BaseView = require 'lib/base_view'

module.exports = class exports.AccountView extends BaseView
    id: 'help-view'
    template: require 'templates/help'

    constructor: ->
        super()

    afterRender: ->
        $.get "api/instances/", (data) =>
            console.log data
            instance = data.rows?[0]
            helpUrl = instance?.helpUrl

            if helpUrl?
                $(@$el.find('.line')[1]).prepend(
                    '<p class="help-text">' + helpUrl + '</p>'
                )
