utils = require "../../lib/passport_utils"

exports.init = (withUser, callback) ->
    app = new Application
        name: "Notes"
        state: "installed"
        index: 0
        slug: "notes"
        icon: "notes_icon.png"
        description: """
        Organize your interests
        """

    hash = utils.cryptPassword "password"

    user = new User
        email: "test@mycozycloud.com"
        owner: true
        password: hash
        activated: true
        url: "http://localhost:3000/"

    exports.clearAll ->
        app.save ->
            if withUser
                user.save -> callback()
            else
                callback()

exports.clearAll = (callback) ->
    Application.destroyAll ->
        User.destroyAll ->
            callback()

exports.waits = (done, time) ->
    func = -> done()
    setTimeout(func, time)
