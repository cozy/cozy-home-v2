cozydb = require 'cozydb'
multiparty = require 'multiparty'

Background = require '../models/background'

baseController = new cozydb.SimpleController
    model: Background
    reqParamID: 'backgroundid'


# Controllers to manage CRUD operations on user backgrounds.
module.exports =

    fetch: baseController.fetch
    all: baseController.listAll
    delete: baseController.destroy
    picture: baseController.sendBinary filename: 'file'
    thumb: baseController.sendBinary filename: 'thumb'

    # Creation is a little bit special. It requires to uplaod a picture to
    # create the background.
    create: (req, res, next) ->
        res.on 'close', -> req.abort()

        # Extract picture from upload form.
        form = new multiparty.Form()
        form.parse req, (err, fields, files) ->

            if err
                next err

            else if files? and files.picture? and files.picture.length > 0
                file = files.picture[0]

                # Create a background and persist its files (thumb and
                # picture).
                Background.createNew file.path, (err, background) ->
                    return next err if err
                    res.send background

            else
                next new Error 'Can\'t change background, no file is attached.'

