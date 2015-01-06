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

    # fetch application list from the market
    fetchFromMarket: ->
        apps = [
                icon: "img/apps/calendar.svg"
                name: "calendar"
                displayName: "Calendar"
                slug: "calendar"
                git: "https://github.com/cozy/cozy-calendar.git"
                comment: "official application"
                description: "calendars description"
           ,
                icon: "img/apps/contacts.svg"
                name: "contacts"
                displayName: "Contacts"
                slug: "contacts"
                git: "https://github.com/cozy/cozy-contacts.git"
                comment: "official application"
                description: "contacts description"
           ,
                icon: "img/apps/emails.svg"
                name: "emails"
                displayName: "Emails"
                slug: "emails"
                git: "https://github.com/cozy/cozy-emails.git"
                comment: "official application"
                description: "emails description"
           ,
                icon: "img/apps/files.svg"
                name: "files"
                displayName: "Files"
                slug: "files"
                git: "https://github.com/cozy/cozy-files.git"
                comment: "official application"
                description: "files description"
           ,
                icon: "img/apps/photos.svg"
                name: "photos"
                displayName: "Photos"
                slug: "photos"
                git: "https://github.com/cozy/cozy-photos.git"
                comment: "official application"
                description: "photos description"
           ,
                icon: "img/sync-icon.png"
                name: "sync"
                displayName: "Sync"
                slug: "sync"
                git: "https://github.com/cozy/cozy-sync.git"
                comment: "official application"
                description: "sync description"
           ,
                icon: "img/apps/bookmarks.svg"
                name: "bookmarks"
                displayName: "Bookmarks"
                slug: "bookmarks"
                git: "https://github.com/Piour/cozy-bookmarks.git"
                comment: "community contribution"
                description: "bookmark description"
           ,
                icon: "img/apps/cozic.svg"
                name: "cozic"
                displayName: "Cozic"
                slug: "cozic"
                git: "https://github.com/rdubigny/cozy-music.git"
                comment: "community contribution"
                description: "cozic description"
           ,
                icon: "img/apps/databrowser.svg"
                name: "databrowser"
                displayName:"Data Browser"
                slug: "databrowser"
                git: "https://github.com/n-a-n/cozy-databrowser.git"
                comment: "community contribution"
                description: "databrowser description"
           ,
                icon:"img/apps/feeds.svg"
                name:"feeds"
                displayName:"Feeds"
                slug:"feeds"
                git:"https://github.com/Piour/cozy-feeds.git"
                comment:"community contribution"
                description:"feeds description"
           ,
                icon: "img/apps/kyou.svg"
                name: "kyou"
                displayName:"KYou"
                slug: "kyou"
                git: "https://github.com/frankrousseau/kyou.git"
                comment: "community contribution"
                description: "kyou description"
                website: "http://frankrousseau.github.io/kyou"
           ,
                icon: "img/apps/konnectors.svg"
                name: "konnectors"
                displayName:"Konnectors"
                slug: "konnectors"
                git: "https://github.com/frankrousseau/konnectors.git"
                comment: "community contribution"
                description: "konnectors description"
           ,
                icon:"img/kresus-icon.png"
                name:"kresus"
                displayName:"Kresus"
                slug:"kresus"
                git:"https://github.com/bnjbvr/kresus.git"
                comment:"community contribution"
                description:"kresus description"
           ,
                icon:"img/apps/nirc.svg"
                name:"nirc"
                displayName:"nIRC"
                slug:"nirc"
                git:"https://github.com/frankrousseau/cozy-nirc.git"
                comment:"community contribution"
                description:"nirc description"
           ,
                icon:"img/apps/notes.svg"
                name:"notes"
                displayName:"Note"
                slug:"notes"
                git:"https://github.com/cozy/notes.git"
                comment:"community contribution"
                description:"notes description"
           ,
                icon: "img/apps/owm.svg"
                name: "owm"
                displayName:"OWM"
                slug: "owm"
                git: "https://github.com/Piour/piour-cozy-owm.git"
                comment: "community contribution"
                description: "owm description"
           ,
                icon: "img/apps/pfm.svg"
                name: "mes comptes"
                displayName:"Mes Comptes"
                slug: "pfm"
                git: "https://github.com/seeker89/cozy-pfm.git"
                comment: "community contribution"
                description: "pfm description"
           ,
                icon:"img/remotestorage-icon.png"
                name:"remotestorage"
                displayName:"Remote Storage"
                slug:"remotestorage"
                git:"https://github.com/aenario/cozy-remotestorage.git"
                comment:"community contribution"
                description:"remote storage description"
           ,
                icon:"img/apps/tasky.svg"
                name:"tasky"
                displayName:"Tasky"
                slug:"tasky"
                git:"https://github.com/jsilvestre/tasky.git"
                comment:"community contribution"
                description:"tasky description"
                color: '#1bda4c'
           ,
                icon:"img/apps/todos.svg"
                name:"todos"
                displayName:"Todos"
                slug:"todos"
                git:"https://github.com/cozy/todos.git"
                comment:"community contribution"
                description:"todos description"
           ,
                icon:"img/term-icon.png"
                name:"term"
                displayName:"Term"
                slug:"term"
                git:"https://github.com/alpha14/cozy-term.git"
                comment:"community contribution"
                description:"term description"
        ]

        @reset apps
