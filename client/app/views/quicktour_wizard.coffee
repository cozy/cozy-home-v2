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
        ]
        super


    close: ->
        super
        window.app.routers.main.navigate 'home'
