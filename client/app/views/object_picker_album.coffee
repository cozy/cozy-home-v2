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
        @tab      = $("<div class='fa fa-book'>#{@tabLabel}</div>")[0]
        @panel    = @el
        @albums$  = $('<div class="albums"></div>')[0]
        @thumbs$  = $("""
            <div class="thumbs">
                <div class="thumb"><img/></div>
            </div>
        """)[0]
        @panel.appendChild @albums$
        @panel.appendChild @thumbs$
        ####
        # construct the list of albums
        @_getAlbums()
        ####
        # A dictionnary to store the selected photos
        # selected.photoID = thumb = {rank, id,name,thumbEl}
        @selectedThumbs = {}

        ####
        # listeners
        @thumbs$.addEventListener 'click', @_clickHandler
        @thumbs$.addEventListener 'dblclick', @_dblclickHandler


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
        return


    resizeHandler: () ->
        thumbStyle = window.getComputedStyle(@thumbs$.children[0])
        colWidth   =   parseInt(thumbStyle.width)       \
                     + parseInt(thumbStyle.marginLeft)  \
                     + parseInt(thumbStyle.marginRight) \
                     + 2
        width = @thumbs$.clientWidth
        margin = Math.floor((width % colWidth)/2)


    #####################
    ## PRIVATE SECTION ##
    #

    _dblclickHandler: (e) =>
        thumb$ = e.target
        if !@_toggleOnThumb$(thumb$)
            return
        @modal.onYes()


    _clickHandler: (e) =>
        th = e.target
        while (not th.classList.contains('thumb'))
            th = th.parentElement
            return if th.classList.contains('thumbs')

        if !@_toggleOnThumb$(th) then return null
        th.setAttribute('aria-selected', true)


    _toggleOnThumb$: (thumb$)=>
        if thumb$.getAttribute('aria-selected') is 'true'
            return true
        @_unselectAll()
        thumb$.setAttribute('aria-selected', true)
        @selectedThumbs[thumb$.dataset.id] = thumb$
        return true


    _unselectAll: () =>
        for id, thumb$ of @selectedThumbs
            if typeof(thumb$) == 'object'
                thumb$.setAttribute('aria-selected', false)
                @selectedThumbs[id] = false


    _getAlbums: () ->
        client.get "albums/?", (err, res) =>
            if err
                console.error err
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
                    albumLabel$.setAttribute('aria-selected', true)
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
            @previousSelectedAlbum$.setAttribute('aria-selected', false)
            el.setAttribute('aria-selected', true)
            @previousSelectedAlbum$ = el
            @_getAlbumPhotos(album.id)
        return el


    _getAlbumPhotos: (albumId) =>
        client.get "albums/#{albumId}", (err, res) =>
            if err then return
            @_updateThumbs(res)
            @_toggleOnThumb$(@thumbs$.children[0])


    _updateThumbs: (res)=>
        photos = res.photos
        nPhoto = photos.length
        photoRank = 0
        for thumb in @thumbs$.children
            if photoRank >= nPhoto
                thumb.setAttribute('aria-hidden', true)
                thumb.firstElementChild.src = ''
                thumb.dataset.id            = ''
                thumb.photo                 = null
            else
                thumb.setAttribute('aria-hidden', false)
                thumb.dataset.id            = photoId = photos[photoRank].id
                thumb.firstElementChild.src = "photos/thumbs/#{photoId}.jpg"
                thumb.photo                 = photos[photoRank]
            photoRank += 1

        for photoRank in [photoRank..nPhoto-1] by 1
            thumbImg     = document.createElement 'img'
            thumbImg.src = "photos/thumbs/#{photos[photoRank].id}.jpg"
            thumb        = document.createElement 'div'
            thumb.appendChild thumbImg
            thumb.classList.add 'thumb'
            thumb.photo      = photos[photoRank]
            thumb.dataset.id = photos[photoRank].id
            @thumbs$.appendChild thumb

