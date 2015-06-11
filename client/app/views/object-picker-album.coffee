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
        @thumbs$  = $('<div class="thumbs"><img></img></div>')[0]
        @panel.appendChild(@albums$)
        @panel.appendChild(@thumbs$)
        ####
        # construct the list of albums
        @_getAlbums()
        ####
        # A dictionnary to store the selected photos
        # selected.photoID = thumb = {rank, id,name,thumbEl}
        @selectedThumbs = {}

        ####
        # listeners
        @thumbs$.addEventListener( 'click'    , @_clickHandler    )
        @thumbs$.addEventListener( 'dblclick' , @_dblclickHandler )


    getObject : () ->
        for id, thumb$ of @selectedThumbs
            if thumb$
                break
        photo = thumb$.photo
        res =
            id         : photo.id
            docType    : 'photo'
            name       : photo.title
            urlToFetch : "photos/raws/#{photo.id}.jpg"
        return res


    setFocusIfExpected : () ->
        # the panel doesn't want the focus because otherwise the arrows keys
        # makes thumbs scroll
        return false


    keyHandler : (e)->
        # console.log 'ObjectPickerAlbum.keyHandler', e.which
        # @longList.keyHandler(e)
        return


    resizeHandler: () ->
        thumbStyle = window.getComputedStyle(@thumbs$.children[0])
        colWidth   =   parseInt(thumbStyle.width)       \
                     + parseInt(thumbStyle.marginLeft)  \
                     + parseInt(thumbStyle.marginRight) \
                     + 2
        width = @thumbs$.clientWidth
        margin = Math.floor((width % colWidth)/2)
        @thumbs$.style.paddingLeft = margin + 'px'



#####################
## PRIVATE SECTION ##
#

    _dblclickHandler: (e) =>
        console.log 'dblClick', e.target
        thumb$ = e.target
        if !@_toggleOnThumb$(thumb$)
            return
        @modal.onYes()


    _clickHandler: (e) =>
        console.log 'click', e.target
        th = e.target
        if th.nodeName != 'IMG'
            return
        if !@_toggleOnThumb$(th) then return null
        th.classList.add('selected')


    _toggleOnThumb$: (thumb$)=>
        if thumb$.classList.contains('selected')
            return true
        if thumb$.nodeName != 'IMG'
            return false
        @_unselectAll()
        thumb$.classList.add('selected')
        @selectedThumbs[thumb$.dataset.id] = thumb$
        return true


    _unselectAll: () =>
        for id, thumb$ of @selectedThumbs
            if typeof(thumb$) == 'object'
                thumb$.classList.remove('selected')
                @selectedThumbs[id] = false


    _getAlbums: () ->
        client.get "albums/?", (err, res) =>
            if err
                console.log err
                return
            # if true
            if res.length == 0
                @panel.removeChild(@albums$)
                @panel.removeChild(@thumbs$)
                @panel.classList.add('noAlbum')
                $(@panel).append("""
                    <div></div>
                    <div class='noAlbumDisclaimer'>
                        #{t('you have no album')}
                    </div>
                    <div></div>
                """)
                return
            n = 0
            for album in res
                albumLabel$ = @_initAlbum(album)
                if n == 0
                    @previousSelectedAlbum$ = albumLabel$
                    albumLabel$.classList.add('selectedAlbum')
                    @_getAlbumPhotos(album.id)
                n += 1
            @resizeHandler()


    _initAlbum: (album)=>
        el = $( require('../templates/album_thumb')() )[0]
        cover = el.querySelector('.cover')
        label = el.querySelector('.label')
        cover.src = "photos/thumbs/#{album.coverPicture}.jpg"
        label.textContent = album.title
        @albums$.appendChild(el)
        el.addEventListener 'click', (event) =>
            @previousSelectedAlbum$.classList.remove('selectedAlbum')
            el.classList.add('selectedAlbum')
            @previousSelectedAlbum$ = el
            @_getAlbumPhotos(album.id)
        return el


    _getAlbumPhotos: (albumId) =>
        client.get "albums/#{albumId}", (err, res) =>
            if err then return
            @_updateThumbs(res)
            @_toggleOnThumb$(@thumbs$.children[0])


    _updateThumbs: (res)=>
        # console.log res
        photos = res.photos
        nPhoto = photos.length
        photoRank = 0
        for thumb in @thumbs$.children
            if photoRank >= nPhoto
                thumb.classList.add("hide")
                thumb.src        = ''
                thumb.dataset.id = ''
                thumb.photo      = null
            else
                thumb.classList.remove("hide")
                thumb.dataset.id = photoId = photos[photoRank].id
                thumb.src        = "photos/thumbs/#{photoId}.jpg"
                thumb.photo      = photos[photoRank]
            photoRank += 1
        for photoRank in [photoRank..nPhoto-1] by 1
            thumb       = document.createElement('img')
            thumb.src   = "photos/thumbs/#{photos[photoRank].id}.jpg"
            thumb.photo = photos[photoRank]
            @thumbs$.appendChild(thumb)
