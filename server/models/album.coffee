cozydb = require 'cozydb'
async = require 'async'
Photo = require './photo'

sanitize = (data) ->
    if data.title?
        data.title = data.title
                        .replace /<br>/g, ""
                        .replace /<div>/g, ""
                        .replace /<\/div>/g, ""

    # Set default date if not set.
    data.date ?= new Date()

module.exports = class Album extends cozydb.CozyModel
    @schema:
        id            : String
        title         : String
        description   : String
        date          : Date
        orientation   : Number
        coverPicture  : String
        clearance     : cozydb.NoSchema
        folderid      : String

    updateAttributes: (data) ->
        sanitize data
        super

    @create: (data) ->
        sanitize data
        super

    @listWithThumbs: (callback) ->
        async.parallel [
            (cb) -> Album.request 'byTitle', cb
            (cb) -> Photo.albumsThumbs cb
        ], (err, results) ->
            return callback err if err
            [albums, defaultCovers] = results
            for album in albums
                defaultCover = defaultCovers[album.id]
                if defaultCover and not album.coverPicture
                    [album.coverPicture, album.orientation] = defaultCover

            callback null, albums

    getPublicURL: (callback) ->
        cozydb.api.getCozyDomain (err, domain) =>
            return callback err if err
            url = "#{domain}public/photos/#albums/#{@id}"
            callback null, url
