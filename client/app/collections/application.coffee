BaseCollection = require 'lib/base_collection'
Application = require 'models/application'


# List of installed applications.
module.exports = class ApplicationCollection extends BaseCollection

    model: Application
    url: 'api/applications/'


    get: (idorslug) ->
        out = super idorslug
        return out if out

        for app in @models
            return app if idorslug is app.get 'id'

    # Critera: alphabetical order (case insensitive)
    #comparator: (app1, app2) ->
        #app1 = app1.get('name').toLowerCase()
        #app2 = app2.get('name').toLowerCase()

        #if app1 < app2
            #return -1
        #else if app1 is app2
            #return 0
        #else
            #return 1

    # Specific to the MesInfos project, must be removed when it's done
    isUserFing: (callback) ->
        isUserFing = null
        $.ajax('api/instances/')
            .done((data) ->
                instance = data.rows?[0]
                helpUrl = instance?.helpUrl
                isUserFing = helpUrl is "http://www.enov.fr/mesinfos/"
            )
            .fail(-> isUserFing = false)
            .always(-> callback isUserFing)

    # fetch application list from the market
    # callback(err, apps)
    fetchFromMarket: (callback) =>
        @isUserFing (isUserFing) =>

            apps = [
                    icon:"img/agenda-icon.png"
                    name:"calendar"
                    slug:"calendar"
                    git:"https://github.com/mycozycloud/cozy-agenda.git"
                    comment:"official application"
                    description:"Set up reminders and let cozy be your assistant"
               ,
                    icon:"img/contacts-icon.png"
                    name:"contacts"
                    Slug:"contacts"
                    git:"https://github.com/mycozycloud/cozy-contacts.git"
                    comment:"official application"
                    description:"Manage your contacts with custom informations"
               ,
                    icon:"img/files-icon.png"
                    name:"files"
                    slug:"files"
                    git:"https://github.com/mycozycloud/cozy-files.git"
                    comment:"official application"
                    description:"Your online filesystem."
               ,
                    icon:"img/photos-icon.png"
                    name:"photos"
                    slug:"photos"
                    git:"https://github.com/mycozycloud/cozy-photos.git"
                    comment:"official application"
                    description:"Share photos with your friends."
               ,
                    icon:"img/notes-icon.png"
                    name:"notes"
                    slug:"notes"
                    git:"https://github.com/mycozycloud/cozy-notes.git"
                    comment:"official application"
                    description:"Organize and store your notes efficiently."
               ,
                    icon:"img/todos-icon.png"
                    name:"todos"
                    slug:"todos"
                    git:"https://github.com/mycozycloud/cozy-todos.git"
                    comment:"official application"
                    description:"Write your tasks, order them and execute them efficiently."
               ,
                    icon: "img/webdav.png"
                    name: "webdav"
                    slug: "webdav"
                    git: "https://github.com/aenario/cozy-webdav.git"
                    comment: "official application"
                    description: "Synchronize your contacts and your agenda with Cozy"
               ,
                    icon:"img/bookmarks-icon.png"
                    name:"bookmarks"
                    slug:"bookmarks"
                    git:"https://github.com/Piour/cozy-bookmarks.git"
                    comment: "community contribution"
                    description:"Manage your bookmarks easily"
               ,
                    icon: "img/cozy-music.png"
                    name: "cozic"
                    slug: "cozic"
                    git: "https://github.com/rdubigny/cozy-music.git"
                    comment: "community contribution"
                    description: "An audio player to always keep your music with you"
               ,
                    icon:"img/feeds-icon.png"
                    name:"feeds"
                    slug:"feeds"
                    git:"https://github.com/Piour/cozy-feeds.git"
                    comment:"community contribution"
                    description:"Aggregate your feeds and save your favorite links in bookmarks."
               ,
                    icon: "img/pfm.png"
                    name: "MesComptes"
                    slug: "pfm"
                    git: "https://github.com/seeker89/cozy-pfm.git"
                    comment: "community contribution"
                    description: "Browse your bank accounts records and get daily reports from them."
               ,
                    icon: "img/kyou.png"
                    name: "kyou"
                    slug: "kyou"
                    git: "https://github.com/frankrousseau/kyou.git"
                    comment: "community contribution"
                    description: "Quantify your for a better knowledge of yourself"
                    website: "http://frankrousseau.github.io/kyou"
               ,
                    icon: "img/konnectors-icon.png"
                    name: "konnectors"
                    slug: "konnectors"
                    git: "https://github.com/frankrousseau/konnectors.git"
                    comment: "community contribution"
                    description: "Import data from external services (Twitter, Jawbone...)"
               ,
                    icon:"img/nirc-icon.png"
                    name:"nirc"
                    slug:"nirc"
                    git:"https://github.com/frankrousseau/cozy-nirc.git"
                    comment:"community contribution"
                    description:"Access to your favorite IRC channel from your Cozy"
               ,
                    icon: "img/owm.png"
                    name: "OWM"
                    slug: "owm"
                    git: "https://github.com/Piour/piour-cozy-owm.git"
                    comment: "community contribution"
                    description: "What is the weather like in your city? Check it out within your Cozy!"
               ,
                    icon: "img/databrowser-icon.png"
                    name: "databrowser"
                    slug: "databrowser"
                    git: "https://github.com/n-a-n/cozy-databrowser.git"
                    comment: "community contribution"
                    description: "Browse and visualize all your data."
            ]

            if isUserFing? and isUserFing
                fingApps = [
                        icon:"img/collecteur-mesinfos-icon.png"
                        name:"Collecteur MesInfos"
                        slug:"collecteur-mesinfos"
                        git:"https://github.com/jsilvestre/cozy-data-integrator.git"
                        comment: "fing application"
                        description: "Le collecteur MesInfos récupère les données que les partenaires du projet ont sur vous."
                    ,
                        icon:"img/actuforum-icon.png"
                        name:"ActuForum"
                        slug:"actuforum"
                        git:"https://github.com/jsilvestre/cozy-actuforum.git"
                        comment: "fing application"
                        description: "Restez au courant de l'actualité MesInfos grâce à Eden."
                    ,
                        icon:"img/privowny-icon.png"
                        name:"Privowny"
                        slug:"privowny"
                        git:"https://github.com/jsilvestre/cozy-privowny.git"
                        comment: "fing application"
                        description: "Gérez votre compte Privowny depuis votre espace personnel."
                    ,
                        icon:"img/mesconsos-icon.png"
                        name:"MesConsos"
                        slug:"mesconsos"
                        git:"https://github.com/jacquarg/MesConso.git"
                        comment: "fing application"
                        description: "Visualisez simplement vos consommations Intermarché et Orange."
                ]
                apps = apps.concat fingApps

            @reset apps
            #@sort()
            callback null, apps  if callback?
