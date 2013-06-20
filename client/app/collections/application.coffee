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
    # callback(err, apps)
    fetchFromMarket: (callback) =>
        apps = [
                icon:"img/bookmarks-icon.png"
                name:"bookmarks"
                slug:"bookmarks"
                git:"https://github.com/Piour/cozy-bookmarks.git"
                comment: "community contribution"
                description:"Manage your bookmarks easily"
            ,
                icon:"img/feeds-icon.png"
                name:"feeds"
                slug:"feeds"
                git:"https://github.com/Piour/cozy-feeds.git"
                comment:"community contribution"
                description:"Aggregate your feeds and save your favorite links in bookmarks."
            ,
                icon:"img/notes-icon.png"
                name:"notes"
                slug:"notes"
                git:"https://github.com/mycozycloud/cozy-notes.git"
                comment:"official application"
                description:"Store all your notes and files."
            ,
                icon:"img/todos-icon.png"
                name:"todos"
                slug:"todos"
                git:"https://github.com/mycozycloud/cozy-todos.git"
                comment:"official application"
                description:"Write your tasks, order them and execute them efficiently."
            ,
                icon:"img/mails-icon.png"
                name:"mails"
                slug:"mails"
                git:"https://github.com/mycozycloud/cozy-mails.git"
                comment:"official application"
                description:"Backup your inboxes and browse them from your cozy."
            ,
                icon:"img/photos-icon.png"
                name:"photos"
                slug:"photos"
                git:"https://github.com/mycozycloud/cozy-photos.git"
                comment:"official application"
                description:"Share photos with your friends."
            ,
                icon:"img/agenda-icon.png"
                name:"agenda"
                slug:"agenda"
                git:"https://github.com/mycozycloud/cozy-agenda.git"
                comment:"official application"
                description:"Set up reminders and let cozy be your assistant"
             ,
                icon:"img/contacts-icon.png"
                name:"contacts"
                slug:"contacts"
                git:"https://github.com/mycozycloud/cozy-contacts.git"
                comment:"official application"
                description:"Manage your contacts with custom informations"
            ,
                icon:"img/nirc-icon.png"
                name:"nirc"
                slug:"nirc"
                git:"https://github.com/frankrousseau/cozy-nirc.git"
                comment:"community contribution"
                description:"Access to your favorite IRC channel from your Cozy"
            ,
                icon:"img/main_icon.png"
                name:"IRC BotManager"
                slug:"irc-botmanager"
                git:"https://github.com/jsilvestre/cozy-irc-botmanager.git"
                comment:"community contribution"
                description:"A friendly bot to help you manage an IRC channel"
        ]
        @reset apps
        callback null, apps  if callback?
