BaseView = require 'lib/base_view'

module.exports = class exports.AccountView extends BaseView
    id: 'help-view'
    template: require 'templates/help'

    events:
        'click .wizard': 'displayWizard'


    afterRender: ->
        helpUrl = window.app.instance?.helpUrl
        if helpUrl?
            template = require 'templates/help_url'
            $(@$el.find('.line')[1]).prepend template helpUrl: helpUrl


    displayWizard: (event) ->
        event.preventDefault()
        dest = event.target.getAttribute('href')
        window.app.routers.main.navigate dest, trigger: true
