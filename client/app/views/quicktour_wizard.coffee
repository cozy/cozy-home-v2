WizardView = require 'lib/wizard_view'

module.exports = class QuicktourWizardView extends WizardView

    context: 'quicktourwizard'


    initialize: () ->
        @steps = [
            slug: 'welcome'
        ,
            slug: 'apps'
        ,
            slug: 'sync'
        ,
            slug: 'import'
        ,
            slug: 'help'
        ]
        super


    close: ->
        super
        window.app.routers.main.navigate 'home'
