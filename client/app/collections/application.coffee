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
                icon:"img/calendar-icon.png"
                name:"calendar"
                displayName:"Calendar"
                slug:"calendar"
                git:"https://github.com/cozy/cozy-calendar.git"
                comment:"official application"
                description:"Set up reminders and let cozy be your assistant"
           ,
                icon:"img/contacts-icon.png"
                name:"contacts"
                displayName:"Contacts"
                slug:"contacts"
                git:"https://github.com/cozy/cozy-contacts.git"
                comment:"official application"
                description:"Manage your contacts with custom informations"
           ,
                icon:"img/files-icon.png"
                name:"files"
                displayName:"Files"
                slug:"files"
                git:"https://github.com/cozy/cozy-files.git"
                comment:"official application"
                description:"Your online filesystem."
           ,
                icon:"img/photos-icon.png"
                name:"photos"
                displayName:"Photos"
                slug:"photos"
                git:"https://github.com/cozy/cozy-photos.git"
                comment:"official application"
                description:"Share photos with your friends."
           ,
                icon: "img/sync-icon.png"
                name: "sync"
                displayName:"Sync"
                slug: "sync"
                git: "https://github.com/cozy/cozy-sync.git"
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
                icon: "img/databrowser-icon.png"
                name: "databrowser"
                displayName:"Data Browser"
                slug: "databrowser"
                git: "https://github.com/n-a-n/cozy-databrowser.git"
                comment: "community contribution"
                description: "Browse and visualize all your data."
           ,
                icon:"img/feeds-icon.png"
                name:"feeds"
                displayName:"Feeds"
                slug:"feeds"
                git:"https://github.com/Piour/cozy-feeds.git"
                comment:"community contribution"
                description:"Aggregate your feeds and save your favorite links in bookmarks."
           ,
                icon: "img/kyou.png"
                name: "kyou"
                displayName:"KYou"
                slug: "kyou"
                git: "https://github.com/frankrousseau/kyou.git"
                comment: "community contribution"
                description: "Improve your hapiness and your health by quantifying you."
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
                icon: "img/pfm.png"
                name: "mes comptes"
                displayName:"Mes Comptes"
                slug: "pfm"
                git: "https://github.com/seeker89/cozy-pfm.git"
                comment: "community contribution"
                description: "Suivez vos comptes banquaires sans avoir à vous relogger à chaque fois."
           ,
                icon:"img/nirc-icon.png"
                name:"nirc"
                displayName:"nIRC"
                slug:"nirc"
                git:"https://github.com/frankrousseau/cozy-nirc.git"
                comment:"community contribution"
                description:"Access to your favorite IRC channel from your Cozy"
           ,
                icon:"img/notes-icon.png"
                name:"notes"
                displayName:"Note"
                slug:"notes"
                git:"https://github.com/cozy/notes.git"
                comment:"community contribution"
                description:"Organize and write smart notes."
           ,
                icon: "img/owm.png"
                name: "owm"
                displayName:"OWM"
                slug: "owm"
                git: "https://github.com/Piour/piour-cozy-owm.git"
                comment: "community contribution"
                description: "What is the weather like in your city? Check it out within your Cozy!"
           ,
                icon:"img/remotestorage-icon.png"
                name:"remotestorage"
                displayName:"Remote Storage"
                slug:"remotestorage"
                git:"https://github.com/aenario/cozy-remotestorage.git"
                comment:"community contribution"
                description:"A Remote Storage appliance to store data from your Unhosted applications."
           ,
                icon:"img/todos-icon.png"
                name:"todos"
                displayName:"Todos"
                slug:"todos"
                git:"https://github.com/cozy/todos.git"
                comment:"community contribution"
                description:"Write your tasks, order them and execute them efficiently."
           ,
                icon:"img/tasky-icon.png"
                name:"tasky"
                displayName:"Tasky"
                slug:"tasky"
                git:"https://github.com/jsilvestre/tasky.git"
                comment:"community contribution"
                description:"Super fast and simple tag-based task manager."
        ]

        @reset apps
