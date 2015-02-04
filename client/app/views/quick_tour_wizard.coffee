WizardView = require 'lib/wizard_view'

module.exports = class QuickTourWizardView extends WizardView

    initialize: () ->
        @steps = [
            slug: 'welcome'
        ,
            slug: 'dashboard'
        ,
            slug: 'sync'
        ]
        super


    close: ->
        super
        window.app.routers.main.navigate 'home'
