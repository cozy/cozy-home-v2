
exports.init = (callback) ->
    app = new Application
        name: "Notes"
        state: "installed"
        index: 0
        slug: "notes"
        icon: "notes_icon.png"
        description: """
        Organize your interests
        """

    exports.clearAll ->
        app.save ->
            callback()

exports.clearAll = (callback) ->
    Application.destroyAll ->
        User.destroyAll ->
            callback()

exports.waits = (done, time) ->
    func = -> done()
    setTimeout(func, time)
