BaseView = require 'lib/base_view'
ApplicationRow = require 'views/market_application'
ColorButton = require 'widgets/install_button'
AppCollection = require 'collections/application'
Application = require 'models/application'
slugify = require('helpers').slugify

REPOREGEX =  /// ^
    (https?://)?                   #protocol
    ([\da-z\.-]+\.[a-z\.]{2,6})    #domain
    ([/\w \.-]*)*                  #path to repo
    (?:\.git)?                     #.git extension
    (@[\da-z/-]+)?                 #branch
     $ ///

module.exports = class MarketView extends BaseView
    id: 'market-view'
    template: require 'templates/market'

    events:
        'keyup #app-git-field':'onEnterPressed'
        "mouseover #your-app .app-install-button": "onMouseoverInstallButton"
        "mouseout #your-app .app-install-button": "onMouseoutInstallButton"
        "click #your-app .app-install-button": "onInstallClicked"


    ### Constructor ###

    constructor: (installedApps) ->
        @marketApps = new AppCollection()
        @installedApps = installedApps
        super()


    afterRender: =>
        @appList = @$ '#app-market-list'
        @appGitField = @$ "#app-git-field"
        @installInfo = @$ "#add-app-modal .loading-indicator"
        @infoAlert = @$ "#your-app .info"
        @infoAlert.hide()
        @errorAlert = @$ "#your-app .error"
        @errorAlert.hide()
        @noAppMessage = @$ '#no-app-message'
        @installAppButton = new ColorButton @$ "#add-app-submit"

        @listenTo @installedApps, 'reset',  @onAppListsChanged
        #@listenTo @installedApps, 'add',    @onAppListsChanged
        @listenTo @installedApps, 'remove', @onAppListsChanged
        @listenTo @marketApps,    'reset',  @onAppListsChanged
        @marketApps.fetchFromMarket()

    onMouseoverInstallButton: =>
        @isSliding = true
        @$("#your-app .app-install-text").show 'slide', {direction: 'right'}, 300, =>
            @isSliding = false

    onAppListsChanged: () =>
        @$(".cozy-app").remove()
        @noAppMessage.show()
        installeds = @installedApps.pluck('slug')
        @marketApps.each (app) =>
            slug = app.get 'slug'
            if installeds.indexOf(slug) is -1
                @addApplication app

    # Add an application row to the app list.
    addApplication: (application) =>
        row = new ApplicationRow(application, @)
        @noAppMessage.hide()
        @appList.append row.el
        appButton = @$(row.el)
        appButton.hide().fadeIn()


    onEnterPressed: (event) =>
        @onInstallClicked() if event.which == 13

    onInstallClicked: (event) =>
        if @isInstalling()
            msg = 'An application is already installing. Wait it '
            msg += 'finishes, then run your installation again'
            alert msg
        else
            data = git: @$("#app-git-field").val()

            @runInstallation data, @installAppButton
            event.preventDefault()
            false

    isInstalling: ->
        for app in @installedApps.toArray()
            if 'installing' is app.get 'state'
                return true
        return false

    runInstallation: (appDescriptor, button) =>
        @hideError()
        parsed = @parseGitUrl appDescriptor.git
        if parsed.error
            @displayError parsed.msg
        else
            @hideError()
            toInstall = new Application parsed
            toInstall.install
                ignoreMySocketNotification: true
                success: (data) =>
                    if (data?.state is "broken") or not data.success
                        alert data.message
                    else
                        @resetForm()

                    @installedApps.add toInstall
                    app?.routers.main.navigate 'home', true

                error: (jqXHR) =>
                    alert JSON.stringify(jqXHR.responseText).message
                    button.displayRed "Install failed"
                    button.spin()


    parseGitUrl: (url) ->
        url = url.replace 'git@github.com:', 'https://github.com/'
        url = url.replace 'git://', 'https://'
        parsed = REPOREGEX.exec url
        unless parsed?
            error =
                error: true
                msg:"Git url should be of form https://.../my-repo.git"
            return error

        [git, proto, domain, path, branch] = parsed
        path = path.replace('.git', '')
        parts = path.split("/")
        name = parts[parts.length - 1]
        name = name.replace /-|_/g, " "
        name = name.replace 'cozy ', ''

        slug = slugify(name)

        git = proto + domain + path + '.git'
        branch = branch.substring(1) if branch?

        out = git:git, name:name, slug:slug
        out.branch = branch if branch?
        return out

    # Display message inside info box.
    displayInfo: (msg) =>
        @errorAlert.hide()
        @infoAlert.html msg
        @infoAlert.show()

    # Display message inside error box.
    displayError: (msg) =>
        @infoAlert.hide()
        @errorAlert.html msg
        @errorAlert.show()

    hideError: =>
        @errorAlert.hide()

    resetForm: =>
        @installAppButton.displayOrange 'install'
        @appGitField.val ''
