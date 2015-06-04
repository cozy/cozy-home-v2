cozydb = require 'cozydb'
multiparty = require 'multiparty'
Background = require '../models/background'
fs = require 'fs'

baseController = new cozydb.SimpleController
    model: Background
    reqParamID: 'backgroundid'


# Controllers to manage CRUD operations on user backgrounds.
module.exports =

    fetch: baseController.fetch
    all: baseController.listAll
    delete: baseController.destroy
    picture: baseController.sendBinary filename: 'file'

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

                # Create background object and attach picture to it.
                Background.create {}, (err, background) ->
                    return next err if err
                    id = background.id
                    data = name: 'file'
                    Background.attachBinary id, file.path, data, (err) ->
                        fs.unlink file.path, ->
                            res.send background

            else
                next new Error 'Can\'t change background, no file is attached.'

