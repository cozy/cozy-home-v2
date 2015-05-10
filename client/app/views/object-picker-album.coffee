Photo    = require '../models/photo'
BaseView = require 'lib/base_view'
client   = require('../lib/client')


module.exports = class ObjectPickerAlbum extends BaseView

    tagName   : "section"

####################
## PUBLIC SECTION ##
#

    constructor: (modal) ->
        @modal = modal
        super()


    initialize : () ->
        ####
        # init state
        @name     = 'albumPicker'
        @tabLabel = 'album'
        ####
        # get elements (name ends with '$')
        @tab      = $("<div>#{@tabLabel}</div>")[0]
        @panel    = @el
        @albums$  = $('<div class="albums"></div>')[0]
        @thumbs$  = $('<div class="thumbs"></div>')[0]
        @panel.appendChild(@albums$)
        @panel.appendChild(@thumbs$)
        ####
        # construct the list of albums
        @_getAlbums()


    getObject : () ->
        # file = @longList.getSelectedFile()
        # if file
        #     return id:file.id, docType: 'file', name:file.name
        # return false


    setFocusIfExpected : () ->
        # the panel doesn't want the focus because otherwise the arrows keys
        # makes thumbs scroll
        return false


    keyHandler : (e)->
        # console.log 'ObjectPickerAlbum.keyHandler', e.which
        @longList.keyHandler(e)
        return


#####################
## PRIVATE SECTION ##
#

    _getAlbums: () ->
        client.get "albums/?", (err, res) =>
            if err
                console.log err
                return
            for album in res
                console.log album
                @_initAlbum(album)

    _initAlbum: (album)->
        el = $( require('../templates/album_thumb')() )[0]
        cover = el.querySelector('.cover')
        label = el.querySelector('.label')
        cover.src = "files/photo/thumbs/#{album.coverPicture}.jpg"
        label.textContent = album.title
        @albums$.appendChild(el)



        # Album.list

