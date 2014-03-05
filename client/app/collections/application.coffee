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
            isUserFing = true
            apps = [
                    icon:"img/agenda-icon.png"
                    name:"calendar"
                    displayName:"Calendar"
                    slug:"calendar"
                    git:"https://github.com/mycozycloud/cozy-agenda.git"
                    comment:"official application"
                    description:"Set up reminders and let cozy be your assistant"
               ,
                    icon:"img/contacts-icon.png"
                    name:"contacts"
                    displayName:"Contacts"
                    slug:"contacts"
                    git:"https://github.com/mycozycloud/cozy-contacts.git"
                    comment:"official application"
                    description:"Manage your contacts with custom informations"
               ,
                    icon:"img/files-icon.png"
                    name:"files"
                    displayName:"Files"
                    slug:"files"
                    git:"https://github.com/mycozycloud/cozy-files.git"
                    comment:"official application"
                    description:"Your online filesystem."
               ,
                    icon:"img/photos-icon.png"
                    name:"photos"
                    displayName:"Photos"
                    slug:"photos"
                    git:"https://github.com/mycozycloud/cozy-photos.git"
                    comment:"official application"
                    description:"Share photos with your friends."
               ,
                    icon:"img/notes-icon.png"
                    name:"notes"
                    displayName:"Note"
                    slug:"notes"
                    git:"https://github.com/mycozycloud/cozy-notes.git"
                    comment:"official application"
                    description:"Organize and store your notes efficiently."
               ,
                    icon:"img/todos-icon.png"
                    name:"todos"
                    displayName:"Todos"
                    slug:"todos"
                    git:"https://github.com/mycozycloud/cozy-todos.git"
                    comment:"official application"
                    description:"Write your tasks, order them and execute them efficiently."
               ,
                    icon: "img/webdav.png"
                    name: "webdav"
                    displayName:"Webdav"
                    slug: "webdav"
                    git: "https://github.com/aenario/cozy-webdav.git"
                    comment: "official application"
                    description: "Synchronize your contacts and your agenda with Cozy"
               ,
                    icon:"img/bookmarks-icon.png"
                    name:"bookmarks"
                    displayName:"Bookmarks"
                    slug:"bookmarks"
                    git:"https://github.com/Piour/cozy-bookmarks.git"
                    comment: "community contribution"
                    description:"Manage your bookmarks easily"
               ,
                    icon: "img/cozy-music.png"
                    name: "cozic"
                    displayName:"Cozic"
                    slug: "cozic"
                    git: "https://github.com/rdubigny/cozy-music.git"
                    comment: "community contribution"
                    description: "An audio player to always keep your music with you"
               ,
                    icon:"img/feeds-icon.png"
                    name:"feeds"
                    displayName:"Feeds"
                    slug:"feeds"
                    git:"https://github.com/Piour/cozy-feeds.git"
                    comment:"community contribution"
                    description:"Aggregate your feeds and save your favorite links in bookmarks."
               ,
                    icon: "img/pfm.png"
                    name: "mes comptes"
                    displayName:"Mes Comptes"
                    slug: "pfm"
                    git: "https://github.com/seeker89/cozy-pfm.git"
                    comment: "community contribution"
                    description: "Browse your bank accounts records and get daily reports from them."
               ,
                    icon: "img/kyou.png"
                    name: "kyou"
                    displayName:"KYou"
                    slug: "kyou"
                    git: "https://github.com/frankrousseau/kyou.git"
                    comment: "community contribution"
                    description: "Quantify your for a better knowledge of yourself"
                    website: "http://frankrousseau.github.io/kyou"
               ,
                    icon: "img/konnectors-icon.png"
                    name: "konnectors"
                    displayName:"Konnectors"
                    slug: "konnectors"
                    git: "https://github.com/frankrousseau/konnectors.git"
                    comment: "community contribution"
                    description: "Import data from external services (Twitter, Jawbone...)"
               ,
                    icon:"img/nirc-icon.png"
                    name:"nirc"
                    displayName:"nIRC"
                    slug:"nirc"
                    git:"https://github.com/frankrousseau/cozy-nirc.git"
                    comment:"community contribution"
                    description:"Access to your favorite IRC channel from your Cozy"
               ,
                    icon: "img/owm.png"
                    name: "owm"
                    displayName:"OWM"
                    slug: "owm"
                    git: "https://github.com/Piour/piour-cozy-owm.git"
                    comment: "community contribution"
                    description: "What is the weather like in your city? Check it out within your Cozy!"
               ,
                    icon: "img/databrowser-icon.png"
                    name: "databrowser"
                    displayName:"Toutes mes données"
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
                    ,
                        icon:"img/mappingmylife-icon.png"
                        name:"Mapping My Life"
                        slug:"mappingmylife"
                        git:"https://gitlab.cozycloud.cc:8586/gjacquart/mappingmylife.git"
                        comment: "fing application"
                        description: "Mapping my life permet de visualiser vos déplacements grâce à la géolocalisation de votre téléphone Orange. L’application permet également de visualiser les lieux desquels vous avez passé des appels ou envoyé des SMS depuis votre mobile Orange."
                    ,
                        icon:"img/mesinfosnutritionnelles-icon.png"
                        name:"Mes Infos Nutritionnelles"
                        slug:"mes-infos-nutritionnelles"
                        git:"https://github.com/pdelorme/mes-infos-nutritionnelles.git"
                        comment: "fing application"
                        description: "Application MesInfos de suivi nutritionnel, basé sur les tickets de caisse."
                    ,
                        icon:"img/mesinfosgeographiques-icon.png"
                        name:"Mes Infos Géographiques"
                        slug:"mes-infos-geographiques"
                        git:"https://github.com/pdelorme/mes-infos-geographiques.git"
                        comment: "fing application"
                        description: "Application MesInfos de suivi des déplacements, basé sur les données du mobile."
                ]
                apps = apps.concat fingApps

            @reset apps
            #@sort()
            callback null, apps  if callback?
