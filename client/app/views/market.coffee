BaseView = require 'lib/BaseView'
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
        'click #add-app-submit':'onInstallClicked'


    ### Constructor ###

    constructor: (installedApps) ->
        @isInstalling = false
        @marketApps = new AppCollection()
        @displayApps = new AppCollection()
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

        @installedApps.bind 'reset', @onAppListsChanged
        @installedApps.bind 'add', @onAppListsChanged
        @installedApps.bind 'remove', @onAppListsChanged
        @marketApps.bind 'reset', @onAppListsChanged
        @marketApps.fetchFromMarket()        

    onAppListsChanged: () =>
        @appList.html null
        noApp = true
        @marketApps.each (marketApp) =>
            if @installedApps.pluck('slug').indexOf(marketApp.get('slug')) is -1
                noApp = false
                @addApplication(marketApp)
        @noAppMessage.toggle(not noApp)

    # Add an application row to the app list.
    addApplication: (application) =>
        row = new ApplicationRow(application, @)
        @noAppMessage.hide()
        @appList.append row.el
        appButton = @$(row.el)
        appButton.hide().fadeIn()

    ############

    onEnterPressed: (event) =>
        @onInstallClicked() if event.which == 13

    onInstallClicked: (event) =>
        data =
            git: @$("#app-git-field").val()

        @runInstallation data, @installAppButton
        event.preventDefault()
        false

    runInstallation: (appDescriptor, button) =>
        return true if @isInstalling
        return true if button.isGreen()
        @isInstalling = true
        @hideError()
        button.displayOrange "install"
        parsed = @parseGitUrl appDescriptor.git
        if not parsed.error
            
            @errorAlert.hide()
            button.button.html "&nbsp;&nbsp;&nbsp;&nbsp;"
            button.spin()

            toInstall = new Application parsed
            toInstall.install
                success: (data) =>
                    if (data.state? == "broken") or not data.success
                        @installedApps.add toInstall
                        button.spin()
                        button.displayRed "Install failed"
                        @isInstalling = false
                    else
                        @installedApps.add toInstall
                        button.spin()
                        button.displayGreen "Install succeeded!"
                        @isInstalling = false
                        @resetForm()
                        app?.routers.main.navigate 'home', true

                error: (data) =>
                    @isInstalling = false
                    button.displayRed "Install failed"
                    button.spin()
        else
            @isInstalling = false
            @displayError parsed.msg

    parseGitUrl: (url) ->
        url = url.replace 'git@github.com:', 'https://github.com/'
        url = url.replace 'git://', 'https://'
        parsed = REPOREGEX.exec url
        unless parsed?
            return error: true, msg:"Git url should be of form https://.../my-repo.git" 

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
        @installAppButton.displayOrange "install"
        @appGitField.val ''