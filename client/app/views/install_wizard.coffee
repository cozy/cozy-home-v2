WizardView = require 'lib/wizard_view'

module.exports = class InstallWizardView extends WizardView

    initialize: (options) ->
        @marketView = options.market if options.market?

        @steps = []
        @installedApps = []

        @steps.push slug: 'welcome'
        for slug in ['files', 'emails', 'contacts', 'calendar', 'photos']
            @steps.push
                slug: slug
                choices:
                    'no' : 'next'
                    'yes': _.partial @validStep, slug
        @steps.push
            slug: 'thanks'
            beforeShow: @resumeInstalls
            choices:
                'go-to-my-cozy': 'close'
                'show-me-a-quick-tour': 'quicktour'

        super


    close: ->
        super
        window.app.routers.main.navigate 'home'

    installApp: (app) ->
        application = @marketView.marketApps.findWhere slug: app
        return unless application?

        @marketView.runInstallation application, false
        @installedApps.push app

        if app in ['calendar', 'contacts'] and 'sync' not in @installedApps
            @installApp 'sync'


    validStep: (app) ->
        @installApp app
        @next()


    resumeInstalls: ->
        $appsList = $ '<ul/>'
        for app in @installedApps
            $('<li/>', text: app).appendTo $appsList
        @$("section:last footer").before $appsList
