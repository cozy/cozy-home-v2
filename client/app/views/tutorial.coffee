BaseView = require 'lib/base_view'

module.exports = class Tutorial extends BaseView
    id: 'tutorial-view'
    template: require 'templates/tutorial'

    events:
        'click #files-yes': 'onYesClicked'
        'click #files-no': 'onNoClicked'
        'click #emails-yes': 'onYesClicked'
        'click #emails-no': 'onNoClicked'
        'click #contacts-yes': 'onYesClicked'
        'click #contacts-no': 'onNoClicked'
        'click #calendar-yes': 'onYesClicked'
        'click #calendar-no': 'onNoClicked'
        'click #photos-yes': 'onYesClicked'
        'click #photos-no': 'onNoClicked'

    appList: [
        'files'
        'emails'
        'contacts'
        'calendar'
        'photos'
    ]

    currentAppIndex: 0
    installedApps: []

    constructor: (options) ->
        super()
        @processInstall = options.processInstall
        @marketApps = options.marketApps

    reset: ->
        @currentAppIndex = 0
        @installedApps = []
        @render()

    afterRender: ->
        currentApp = @getCurrentApp()
        # displays the current step if it exists, final step otherwise
        if currentApp?
            @$("#tuto-#{currentApp}").addClass 'active'
        else
            @$('#end-screen').addClass 'active'

    onYesClicked: ->
        @installApp()
        @goToNextQuestion()

    onNoClicked: ->
        @goToNextQuestion()

    goToNextQuestion: ->
        currentApp = @getCurrentApp()
        @$("#tuto-#{currentApp}").removeClass 'active'
        @currentAppIndex++
        @afterRender()

    installApp: ->
        currentApp = @getCurrentApp()
        @installedApps.push currentApp

        application = @marketApps.findWhere slug: currentApp
        @processInstall application, false

        # Installs Sync if Calendar or Contacts is installed
        relatedToSync = currentApp in ['calendar', 'contacts']
        alreadyInList = 'sync' in @installedApps
        if relatedToSync and not alreadyInList
            @installedApps.push 'sync'

            application = @marketApps.findWhere slug: 'sync'
            @processInstall application, false

    getCurrentApp: -> return @appList[@currentAppIndex]
