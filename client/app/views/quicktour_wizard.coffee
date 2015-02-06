WizardView = require 'lib/wizard_view'

module.exports = class QuicktourWizardView extends WizardView

    context: 'quicktourwizard'


    initialize: () ->
        @steps = [
            slug: 'welcome'
        ,
            slug: 'dashboard'
        ,
            slug: 'apps'
        ,
            slug: 'help'
        ,
            slug: 'sync'
        ]
        super


    close: ->
        super
        window.app.routers.main.navigate 'home'
