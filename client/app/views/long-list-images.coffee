Photo  = require '../models/photo'

################################################################################
# -- USAGE --
#
#   # creation :
#       longList = new LongList(viewPortElement)
#       doActions() ...
#
#   # if the the viewPortElement is not initialy attached in the DOM, then call
#   resizeHandler when the viewPortElement is attached :
#       longList.resizeHandler()
#
#   # if we want to anticipate the loading of the thumbs before we attach the
#   list inf the dom, we can give the size that will be available for list with:
#       longList.setInitialDimensions(pan.clientWidth, pan.clientHeight)
#
#   # when the geometry of the parent :
#       longList.resizeHandler()
#
# -- SEMANTIC / CONVENTIONS --
#
#
# 1/ syntax
#   . a variable name ending with a '$' is a reference to a node in the DOM
#   . in a variable name, "Rk" means "rank"
#   . in a variable name, Pt means "Pointer". The safe zone is define by a
#     start pointer and an end pointer, themselves defined
#     by a rank, y monthRk and inMonthRk
#
#
# 2/ @months
#   [ {nPhotos:45, month:"201503"}, ... ]
# array of all the months having a photo.
# months.length = number of months having a photo
# months[n] = {
#   nPhotos : number of photo of this month
#   month   : string, the month, format : "201503"
#   label$  : element in the DOM in the header of the month
#   nRows   : number of rows in the month
#   height  : in px
#   y       : y from the top of the thumbs container (@thumbs$), in px
#   yBottom : in px
#   firstRk : integer, rank of the first photo of the month
#   lastRk  : integer, rank of the last  photo of the month
# }
#
#
# 3/ @nPhotos
#   Total number of images in the long list.
#
#
# 4/ "rank"
#   all images are indexed by their rank being their position in the ordered
#   list of images.
#   The most recent image rank is 0, the oldest rank is nPhoto - 1
#
#
# 5/ inMonthRank
#   The rank of the image in the chronological list of images of the same month
#
#
# 6/ buffer :
#
#   The buffer lists all the created thumbs, keep a reference on the first (top
#   most) and the last (bottom most) cells.
#   The data structure of the buffer is a closed double linked chain.
#   Each element of the chain is a "thumb" with a previous (prev) and next
#   (next) element.
#   "closed" means that buffer.last.prev == buffer.first
#
#   data structure :
#      first   : {thumb}   # top most thumb
#      firstRk : {integer} # rank of the first image of the buffer
#      last    : {thumb}   # bottom most thumb
#      lastRk  : {integer} # rank of the last image of the buffer
#      nThumbs : {integer} # number of thumbs in the buffer
#      # the following data are the coordonates of the thumb that would be just
#      # after the last of the buffer.
#      nextLastRk      : {integer}
#      nextLastCol     : {integer}
#      nextLastY       : {integer}
#      nextLastMonthRk : {integer}
#      # the following data are the coordonates of the thumb that would be just
#      # before the last of the buffer.
#      nextFirstCol     : {integer}
#      nextFirstMonthRk : {integer}
#      nextFirstRk      : {integer}
#      nextFirstY       : {integer}
#
#
# 7/ thumb
#      prev    : {thumb}   # previous thumb in the buffer    : older, lower in the list
#      next    : {thumb}   # next thumb in the buffer    : more recent, higher in the list
#      el      : {thumb$}  # element in the DOM of the thumb
#      rank    : {integer} # rank of the corresponding image
#      monthRk : monthRk
#      id      : {integer} # id of the corresponding image
#   Element of the buffer, keeps a reference (el) to the thumb element inserted
#   in the DOM.
#
#
# 8/ safeZone
#      firstCol             : {integer}
#      firstInMonthRow      : {integer}
#      firstMonthRk         : {integer}
#      firstRk              : {integer}
#      firstThumbRkToUpdate : {integer}
#      firstThumbToUpdate   : {thumb}
#      firstVisibleRk       : {integer}
#      firstY               : {integer}
#      lastRk               : {integer}
#      endCol               : {integer}
#      endMonthRk           : {integer}
#      endY                 : {integer}
#
#
################################################################################


################################################################################
## CONSTANTS ##
#
# minimum duration between two refresh (_adaptBuffer)
THROTTLE            = 450
# n = max number of viewport height by seconds
MAX_SPEED           = 1.5 * THROTTLE / 1000
# number of "screens" before and after the viewport
# (ex : 1.5 => 1+2*1.5=4 screens always ready)
COEF_SECURITY       = 3
# unit used for the dimensions (px,em or rem)
THUMB_DIM_UNIT      = 'em'
# space between 2 months
MONTH_HEADER_HEIGHT = 2.5
# padding in pixels between thumbs
CELL_PADDING        = 0.6
THUMB_HEIGHT        = 10
# height from top of the month to the top of the month label
MONTH_LABEL_TOP     = 0.8




module.exports = class LongList

################################################################################
## PUBLIC SECTION ##
#
    constructor: (@externalViewPort$, @modal) ->
        ####
        # init state
        @state =
            selected : {} # selected.photoID = thumb = {rank, id,name,thumbEl}
            # todo BJA supprimer le @state
        ####
        # get elements (name ends with '$')
        @viewPort$ = document.createElement('div')
        @viewPort$.classList.add('viewport')
        @externalViewPort$.appendChild(@viewPort$)
        @thumbs$   = document.createElement('div')
        @thumbs$.classList.add('thumbs')
        @viewPort$.appendChild(@thumbs$)
        @index$    = document.createElement('div')
        @index$.classList.add('long-list-index')
        @externalViewPort$.appendChild(@index$)
        ####
        # set position
        @viewPort$.style.position = 'relative'
        @index$.style.position    = 'absolute'
        @index$.style.top         = 0
        @index$.style.bottom      = 0
        @index$.style.right       = @getScrollBarWidth()+'px'
        ####
        # keep track of the last selected column during navigation with keyboard
        @_lastSelectedCol = null
        ####
        # adapt buffer to the initial geometry when we receive the array of
        # photos
        @isInited = @isPhotoArrayLoaded = false
        Photo.getMonthdistribution (error, res) =>
            @isPhotoArrayLoaded = true
            @months  = res
            @_DOM_controlerInit()
            return true


    setInitialDimensions : (width, heigth)->
        @initialWidth  = width
        @initialHeight = heigth
        @_resizeHandler()


    # ###*
    #  * must be called when the long list is inserted in the DOM of that the list
    #  * was hiddend (display:none) and is now displayed.
    # ###
    # init : () =>
    #     # means that init has been called when the long list is inserted or
    #     # showed lately
    #     if @isInited and @isPhotoArrayLoaded
    #         @_resizeHandler()
    #         return
    #     # otherwise : means that the init process has never been done completly
    #     @isInited = true
    #     if @isInited and @isPhotoArrayLoaded
    #         ####
    #         # create DOM_controler
    #         @_DOM_controlerInit()
    #     return true


    getSelectedFile : () =>
        for k, thumb$ of @state.selected
            if thumb$
                return thumb$.file
        return null


    keyHandler : (e)->
        console.log 'LongList.keyHandler', e.which
        switch e.which
            when 39 # right key
                e.stopPropagation()
                e.preventDefault()
                @_selectNextThumb()
            when 37 # left key
                e.stopPropagation()
                e.preventDefault()
                @_selectPreviousThumb()
            when 38 # up key
                e.stopPropagation()
                e.preventDefault()
                @_selectThumbUp()
            when 40 # down key
                e.stopPropagation()
                e.preventDefault()
                @_selectThumbDown()
            when 36 # start line key
                e.stopPropagation()
                e.preventDefault()
                @_selectStartLineThumb()
            when 35 # end line key
                e.stopPropagation()
                e.preventDefault()
                @_selectEndLineThumb()
            when 34 # page down key
                e.stopPropagation()
                e.preventDefault()
                @_selectPageDownThumb()
            when 33 # page up key
                e.stopPropagation()
                e.preventDefault()
                @_selectPageUpThumb()
            else
                return false
        return

    ###*
     * Must be called when the goemetry of the parent of the long list changes.
    ###
    resizeHandler: () ->
        # will be defined during _DOM_controlerInit, when we get the distribution
        # array of photos.
        # If it is called too early, don't do anything, a resizeHandler call
        # will occur when the distribution array will arrive.



################################################################################
## PRIVATE SECTION ##


    ###*
     * This is the main procedure. Its scope contains all the functions used to
     * update the buffer and the shared variables between those functions. This
     * approach has been chosen for performance reasons (acces to scope
     * variables faster than to nested properties of objects). It's not an
     * obvious choice.
     * Called only when both LongList.init() has been called and that we also
     * got from the server the month distribution (Photo.getMonthdistribution)
    ###
    _DOM_controlerInit: () ->

        #######################
        # global variables
        months                 = @months
        buffer                 = null
        previousWidth          = null
        bufferAlreadyAdapted   = false
        cellPadding            = null
        monthHeaderHeight      = null
        monthTopPadding        = null
        marginLeft             = null
        thumbWidth             = null
        thumbHeight            = null
        colWidth               = null
        rowHeight              = null
        nThumbsPerRow          = null
        nRowsInSafeZoneMargin  = null
        nThumbsInSafeZone      = null
        viewPortHeight         = null
        indexHeight            = null
        indexVisible           = null
        currentIndexRkSelected = 0
        thumbs$Height          = null
        monthLabelTop          = null
        lastOnScroll_Y         = null
        current_scrollTop      = null
        safeZone =
            firstRk              : null
            firstMonthRk         : null
            firstInMonthRow      : null
            firstCol             : null
            firstVisibleRk       : null
            firstY               : null
            lastRk               : null
            endCol               : null
            endMonthRk           : null
            endY                 : null
            firstThumbToUpdate   : null
            firstThumbRkToUpdate : null

        isDefaultToSelect = true


        _scrollHandler = (e) =>
            if @noScrollScheduled
                lastOnScroll_Y = @viewPort$.scrollTop
                setTimeout(_adaptBuffer,THROTTLE)
                @noScrollScheduled = false
            if @noIndexScrollScheduled
                setTimeout(_adaptIndex,250)
                @noIndexScrollScheduled = false
            if !indexVisible
                @index$.classList.add('visible')
                indexVisible = true


        @_scrollHandler = _scrollHandler

        ###*
         * returns the font-size in px of a given element (context) or of the
         * root element of the document if no context is provided.
         * @param  {element} context Optionnal: an elemment to get the font-size
         * @return {integer}         the font-size
        ###
        getElementFontSize=( context )->
            # Returns a number
            return parseFloat(
                # of the computed font-size, so in px
                    # for the given context
                    # or the root <html> element
                getComputedStyle( context or document.documentElement ).fontSize
            )


        remToPixels=(value)->
            return emToPixels(value)


        emToPixels=(value, context)->
            return Math.round(value * getElementFontSize(context))


        _getDimInPixels = (value)=>
            switch THUMB_DIM_UNIT
                when 'px'
                    return value
                when 'em'
                    return emToPixels(value, @viewPort$)
                when 'rem'
                    return remToPixels(value)


        ###*
         * called once for all during _DOM_controlerInit
         * computes the static parameters of the geometry
        ###
        _getStaticDimensions = () =>
            thumbHeight       = _getDimInPixels(THUMB_HEIGHT)
            cellPadding       = _getDimInPixels(CELL_PADDING)
            @thumbHeight      = thumbHeight
            thumbWidth        = thumbHeight
            colWidth          = thumbWidth  + cellPadding
            rowHeight         = thumbHeight + cellPadding
            monthHeaderHeight = _getDimInPixels(MONTH_HEADER_HEIGHT)
            monthTopPadding   = monthHeaderHeight + cellPadding
            monthLabelTop     = _getDimInPixels(MONTH_LABEL_TOP)
            @monthLabelTop    = monthLabelTop



        ###*
         * Compute all the geometry after a resize or when the list in inserted
         * in the DOM.
         * _adaptBuffer will be executed at the end except if
         *     1- the distribution array of photo has not been received.
         *     2- the geometry could not be computed (for instance if the widht
         *     of the list is null when the list is not visible)
        ###
        _resizeHandler= ()=>
            if !@isPhotoArrayLoaded
                return
            ##
            # 1/ GET DIMENSIONS.
            # It is possible only when the longList is inserted into the DOM, that's
            # why we had to wait for _init() which occurs after both the reception
            # of the array of photo and after the parent view has launched init().
            viewPortHeight = @viewPort$.clientHeight
            VP_width       = @viewPort$.clientWidth
            # the list has no width or height : geometry can not be computed
            # except if some initial width and height has been given
            if VP_width <= 0 || viewPortHeight <= 0
                if @initialWidth and @initialHeight
                    VP_width       = @initialWidth
                    viewPortHeight = @initialHeight
                else
                    return false
            # if the width of viewport has not change, we can directly adapt
            # buffer
            if VP_width == previousWidth
                _adaptBuffer()
                return
            previousWidth  = VP_width
            nThumbsPerRow  = Math.floor((VP_width-cellPadding)/colWidth)
            @nThumbsPerRow = nThumbsPerRow
            marginLeft = cellPadding +                                         \
                         Math.round(                                           \
                           (VP_width - nThumbsPerRow*colWidth - cellPadding)/2 \
                         )
            # compute the safe zone margin
            nRowsInViewPort       = Math.ceil(viewPortHeight/rowHeight)
            nRowsInSafeZoneMargin = Math.round(COEF_SECURITY * nRowsInViewPort)
            nThumbsInSZ_Margin    = nRowsInSafeZoneMargin * nThumbsPerRow
            nThumbsInViewPort     = nRowsInViewPort * nThumbsPerRow
            nThumbsInSafeZone     = nThumbsInSZ_Margin*2 + nThumbsInViewPort
            ##
            # 2/ COMPUTE THE PROPERTIES OF EACH MONTH
            nextY   = 0
            nPhotos = 0
            minMonthHeight  = Infinity
            minMonthNphotos = Infinity
            for month in @months
                nPhotosInMonth     = month.nPhotos
                month.nRows        = Math.ceil(nPhotosInMonth / nThumbsPerRow)
                month.height       = monthTopPadding + month.nRows*rowHeight
                month.y            = nextY
                month.yBottom      = nextY + month.height
                month.firstRk      = nPhotos
                month.lastRk       = nPhotos + nPhotosInMonth - 1
                month.lastThumbCol = (nPhotosInMonth-1) % nThumbsPerRow
                month.date         = moment(month.month,'YYYYMM')
                nextY   += month.height
                nPhotos += nPhotosInMonth
                minMonthHeight = Math.min(minMonthHeight,month.height)
                minMonthNphotos = Math.min(minMonthNphotos,month.nPhotos)
            @nPhotos = nPhotos
            thumbs$Height = nextY
            @thumbs$.style.setProperty('height', thumbs$Height + 'px')
            ##
            # 3/ POSITION INDEX
            MONTH_LABEL_HEIGHT = 27
            minimumIndexHeight = @months.length * MONTH_LABEL_HEIGHT
            if minimumIndexHeight*1.3 <= viewPortHeight
                indexHeight = viewPortHeight
            else
                indexHeight = 1.5*minimumIndexHeight
            y = 0
            c = indexHeight - @months.length * MONTH_LABEL_HEIGHT
            d = nPhotos - minMonthNphotos * @months.length
            for month, rk in @months
                txt = month.date.format('MMM YYYY')
                h = c * (month.nPhotos - minMonthNphotos)
                h = h / d
                h += MONTH_LABEL_HEIGHT
                y += h
                label$ = $("<div style='height:#{h}px; right:0px'>#{txt}</div>")[0]
                label$.dataset.monthRk = rk
                @index$.appendChild(label$)
            ##
            # the first call of _resizeHandler it is not necessary to
            # positionnate the thumbs. After the first call, the thumbs are
            # always repositionated
            if bufferAlreadyAdapted
                _rePositionThumbs()
            bufferAlreadyAdapted = true
            _adaptBuffer()

        @resizeHandler = _resizeHandler


        ###*
         * Initialize the buffer.
         * The buffer lists all the created thumbs, keep a reference on the
         * first (top most) and the last (bottom most) thumb.
         * The buffer is a closed double linked chain.
         * Each element of the chain is a "thumb" with a previous (prev) and
         * next (next) element.
         * "closed" means that buffer.last.prev == buffer.first
         * data structure : see the beginning of this file.
        ###
        _initBuffer = ()=>

            thumb$ = document.createElement('img')
            thumb$.setAttribute('class', 'long-list-thumb')
            thumb$.style.height = thumbHeight + 'px'
            thumb$.style.width  = thumbHeight + 'px'
            @thumbs$.appendChild(thumb$)
            thumb =
                prev : thumb
                next : thumb
                el   : thumb$
                rank : null
                id   : null

            buffer =
                    first   : thumb  # top most thumb
                    firstRk : -1     # rank of the first image of the buffer
                    last    : thumb  # bottom most thumb
                    lastRk  : -1     # rank of the last image of the buffer
                    nThumbs :  1     # number of thumbs in the buffer
                    # the following data are the coordonates of the thumb that
                    # would be just after the last of the buffer.
                    nextLastRk      : null
                    nextLastCol     : null
                    nextLastY       : null
                    nextLastMonthRk : null
                    # the following data are the coordonates of the thumb that
                    # would be just before the last of the buffer.
                    nextFirstCol     : null
                    nextFirstMonthRk : null
                    nextFirstRk      : null
                    nextFirstY       : null
            @buffer = buffer


        ###*
         * called by onscroll (throttled), adapt the position of the index (top)
         * according to the new scroll position
        ###
        _adaptIndex = () =>
            y = @viewPort$.scrollTop
            H = thumbs$Height
            vph = viewPortHeight
            C =  (H - vph) / (indexHeight - vph)
            td_a = Math.round( (vph*C-vph) / 2)
            td_b = H - td_a - vph
            C_bis = (indexHeight - vph) / (td_b - td_a)
            if td_b < td_a
                td_a = Math.round((H-vph)/2)
                td_b = td_a
            if td_a < y and y < td_b
                @index$.style.top = - Math.round(C_bis*(y-td_a)) + 'px'
                return
            if y < td_a
                @index$.style.top = 0
            if td_b < y
                @index$.style.top = - (indexHeight - vph) + 'px'

        ###*
         * modify the apperence of the index label corresponding of the first
         * month displayed in the viewPort
        ###
        _selectCurrentIndex = (monthRk) =>
            @index$.children[currentIndexRkSelected].classList.remove('current')
            @index$.children[monthRk].classList.add('current')
            currentIndexRkSelected = monthRk

        ###*
         * will hide the index 2s after its last call
        ###
        lazyHideIndex =  _.debounce () =>
                @index$.classList.remove('visible')
                indexVisible = false
            , 2000

        ###*
         * Adapt the buffer when the viewport has moved.
         * Launched at init and by _scrollHandler
         * Steps :
        ###
        _adaptBuffer = () =>
            @noScrollScheduled      = true
            @noIndexScrollScheduled = true
            lazyHideIndex()

            # test speed, if too high, relaunch a _scrollHandler
            current_scrollTop = @viewPort$.scrollTop
            speed = Math.abs(current_scrollTop - lastOnScroll_Y) / viewPortHeight
            if speed > MAX_SPEED
                _scrollHandler()
                return

            bufr = buffer
            # re init safeZone but keep a reference on the
            # previous firstThumbToUpdate and firstThumbRkToUpdate
            safeZone.firstRk              = null
            safeZone.firstMonthRk         = null
            safeZone.firstInMonthRow      = null
            safeZone.firstCol             = null
            safeZone.firstVisibleRk       = null
            safeZone.firstY               = null
            safeZone.lastRk               = null
            safeZone.endCol               = null
            safeZone.endMonthRk           = null
            safeZone.endY                 = null
            previous_firstThumbToUpdate   = safeZone.firstThumbToUpdate
            safeZone.firstThumbToUpdate   = null
            safeZone.firstThumbRkToUpdate = null

            _computeSafeZone()

            # console.log '\n======_adaptBuffer==beginning======='
            # console.log 'safeZone', JSON.stringify(safeZone,2)
            # console.log 'bufr', bufr
            if safeZone.lastRk > bufr.lastRk
                # 1/ the safeZone is going down and the bottom of the safeZone
                # is bellow the bottom of the buffer
                #
                # nToFind = number of thumbs to find (by reusing thumbs from the
                # buffer or by creation new ones) in order to fill the bottom of
                # the safeZone
                nToFind = \
                    Math.min(safeZone.lastRk - bufr.lastRk, nThumbsInSafeZone)
                # the  available thumbs are the ones in the buffer and above
                # the safeZone
                # (rank greater than buffer.firstRk but lower
                # than safeZone.firstRk)
                nAvailable = safeZone.firstRk - bufr.firstRk
                if nAvailable < 0
                    nAvailable = 0
                if nAvailable > bufr.nThumbs
                    nAvailable = bufr.nThumbs

                nToCreate = Math.max(nToFind - nAvailable, 0)
                nToMove   = nToFind - nToCreate

                if safeZone.firstRk <= bufr.lastRk
                    # part of the buffer is in the safe zone : add thumbs after
                    # the last thumb of the buffer
                    _getBufferNextLast()
                    targetRk      = bufr.nextLastRk
                    targetMonthRk = bufr.nextLastMonthRk
                    targetCol     = bufr.nextLastCol
                    targetY       = bufr.nextLastY

                else
                    # the safeZone is completely bellow the buffer : add thumbs
                    # bellow the top of the safeZone.
                    targetRk      = safeZone.firstRk
                    targetMonthRk = safeZone.firstMonthRk
                    targetCol     = safeZone.firstCol
                    targetY       = safeZone.firstY

                # console.log 'direction: DOWN',         \
                #             'nToFind:'   + nToFind,    \
                #             'nAvailable:'+ nAvailable, \
                #             'nToCreate:' + nToCreate,  \
                #             'nToMove:'   + nToMove,    \
                #             'targetRk:'  + targetRk,   \
                #             'targetCol'  + targetCol,  \
                #             'targetY'    + targetY

                if nToFind > 0
                    Photo.listFromFiles targetRk, nToFind, (error, res) ->
                        if error
                            console.log error
                        _updateThumb(res.files, res.firstRank)

                if nToCreate > 0
                    [targetY, targetCol, targetMonthRk] =
                        _createThumbsBottom( nToCreate     ,
                                              targetRk     ,
                                              targetCol    ,
                                              targetY      ,
                                              targetMonthRk  )
                    targetRk += nToCreate

                if nToMove > 0
                    # console.log "nToMove",nToMove
                    # console.log "targetRk",targetRk
                    # Photo.listFromFiles targetRk, nToMove, (error, res) ->
                    #     _updateThumb(res.files, res.firstRank)
                    _moveBufferToBottom( nToMove        ,
                                          targetRk      ,
                                          targetCol     ,
                                          targetY       ,
                                          targetMonthRk  )

            else if safeZone.firstRk < bufr.firstRk
                # 2/ the safeZone is going up and the top of the safeZone is
                # above the buffer
                #
                # nToFind = number of thumbs to find (by reusing thumbs from the
                # buffer or by creation new ones) in order to fill the top of
                # the safeZone
                nToFind = Math.min(bufr.firstRk - safeZone.firstRk, nThumbsInSafeZone)
                # the  available thumbs are the ones in the buffer and under
                # the safeZone
                # (rank smaller than buffer.lastRk but higher
                # than safeZone.lastRk)
                nAvailable = bufr.lastRk - safeZone.lastRk
                if nAvailable < 0
                    nAvailable = 0
                if nAvailable > bufr.nThumbs
                    nAvailable = bufr.nThumbs

                nToCreate = Math.max(nToFind - nAvailable, 0)
                nToMove   = nToFind - nToCreate

                if safeZone.lastRk >= bufr.firstRk
                    # part of the buffer is in the safe zone : add thumbs above
                    # the first thumb of the buffer
                    _getBufferNextFirst()
                    targetRk      = bufr.nextFirstRk
                    targetMonthRk = bufr.nextFirstMonthRk
                    targetCol     = bufr.nextFirstCol
                    targetY       = bufr.nextFirstY

                else
                    # the safeZone is completely above the buffer : add thumbs
                    # above the bottom of the safeZone.
                    targetRk      = safeZone.lastRk
                    targetCol     = safeZone.endCol
                    targetMonthRk = safeZone.endMonthRk
                    targetY       = safeZone.endY

                # console.log 'direction: UP',           \
                #             'nToFind:'   + nToFind,    \
                #             'nAvailable:'+ nAvailable, \
                #             'nToCreate:' + nToCreate,  \
                #             'nToMove:'   + nToMove,    \
                #             'targetRk:'  + targetRk,   \
                #             'targetCol'  + targetCol,  \
                #             'targetY'    + targetY

                if nToFind > 0
                    Photo.listFromFiles targetRk - nToFind + 1 , nToFind, (error, res) ->
                        if error
                            console.log error
                        _updateThumb(res.files, res.firstRank)

                if nToCreate > 0
                    throw new Error('It should not be used in the
                        current implementation')
                    [targetY, targetCol, targetMonthRk] =
                        _createThumbsTop(  nToCreate    ,
                                           targetRk     ,
                                           targetCol    ,
                                           targetY      ,
                                           targetMonthRk  )
                    targetRk += nToCreate

                if nToMove > 0
                    _moveBufferToTop( nToMove       ,
                                      targetRk      ,
                                      targetCol     ,
                                      targetY       ,
                                      targetMonthRk  )
            if !nToFind?
                # The buffer was inside the safe zone, there was no modification
                # of the buffer
                safeZone.firstThumbToUpdate   = previous_firstThumbToUpdate

            # console.log '======_adaptBuffer==ending='
            # console.log 'bufr', bufr
            # console.log '======_adaptBuffer==ended======='


        _rePositionThumbs = () =>
            console.log "== _rePositionThumbs"
            bufr      = buffer
            thumb     = bufr.first
            thumb$    = thumb.el
            monthRk   = thumb.monthRk
            scrollTop = @viewPort$.scrollTop

            month   = months[monthRk]
            startRk = thumb.rank
            localRk = startRk - monthRk
            row     = Math.floor(localRk / nThumbsPerRow)
            rowY    = month.y + monthTopPadding + row * rowHeight
            col      = localRk % nThumbsPerRow

            firstVisibleThumb = null
            lastLast          = bufr.last
            for rk in [0..buffer.nThumbs-1] by 1
                if localRk == 0 then _insertMonthLabel(month)
                if !firstVisibleThumb and parseInt(thumb.el.style.top)>scrollTop
                    # keep info on the first visible thumb in order to adjust
                    # viewport.scrollTop in order to keep this thum on the same
                    # line
                    firstVisibleThumb=
                        top : parseInt(thumb.el.style.top)
                        el  : thumb.el
                style        = thumb.el.style
                style.top    = rowY + 'px'
                style.left   = (marginLeft + col*colWidth) + 'px'
                localRk += 1
                if localRk == month.nPhotos
                    # jump to a new month
                    monthRk += 1
                    month    = months[monthRk]
                    localRk  = 0
                    col      = 0
                    rowY    += rowHeight + monthTopPadding
                else
                    # go to next column or to a new row if we are at last column
                    col  += 1
                    if col is nThumbsPerRow
                        rowY += rowHeight
                        col   = 0
                thumb = thumb.prev
            if firstVisibleThumb
                # move viewPort in order to keep the same area visible after
                # having moved the thumbs
                deltaTop =   firstVisibleThumb.top   \
                           - parseInt(firstVisibleThumb.el.style.top)
                @viewPort$.scrollTop -= deltaTop


        ###*
         * Called when we get from the server the ids of the thumbs that have
         * been created or moved
         * @param  {Array} files     [{id},..,{id}] in chronological order
         * @param  {Integer} fstFileRk The rank of the first file of files
        ###
        _updateThumb = (files, fstFileRk)=>
            # console.log '\n======_updateThumb started ================='
            lstFileRk = fstFileRk + files.length - 1
            bufr      = buffer
            thumb     = bufr.first
            firstThumbToUpdate   = safeZone.firstThumbToUpdate
            firstThumbRkToUpdate = firstThumbToUpdate.rank
            last  = bufr.last
            first = bufr.first
            ##
            # 1/ if firstThumbRkToUpdate is not in the files range (can happen
            # if the safeZone has been updated while waiting for the list of
            # files from the server), then move firstThumbRkToUpdate to the
            # thumb corresponding to first or last file of files.
            if firstThumbRkToUpdate < fstFileRk
                th = firstThumbToUpdate.prev
                while true
                    if th == bufr.first
                        return
                    if th.rank == fstFileRk
                        firstThumbToUpdate   = th
                        firstThumbRkToUpdate = th.rank
                        break
                    th = th.prev
            if lstFileRk < firstThumbRkToUpdate
                th = firstThumbToUpdate.next
                while true
                    if th == bufr.last
                        return
                    if th.rank == lstFileRk
                        firstThumbToUpdate   = th
                        firstThumbRkToUpdate = th.rank
                        break
                    th = th.next
            ##
            # 2/ update src of thumbs that are after the firstThumbRkToUpdate
            # if firstThumbRkToUpdate <= lstFileRk
            #     console.log " update forward: #{firstThumbRkToUpdate}->
            #         #{lstFileRk}"
            #     console.log '   firstThumbRkToUpdate', firstThumbRkToUpdate,   \
            #                    'nFiles', files.length,                         \
            #                    'fstFileRk', fstFileRk,                         \
            #                    'lstFileRk',lstFileRk
            # else
            #     console.log ' update forward: none'
            thumb = firstThumbToUpdate
            for file_i in [firstThumbRkToUpdate-fstFileRk..files.length-1] by 1
                file    = files[file_i]
                fileId = file.id
                thumb$            = thumb.el
                thumb$.file       = file
                thumb$.src        = "files/photo/thumbs/#{fileId}.jpg"
                # thumb$.src        = 'files/photo/thumbs/fast/#{fileId}'
                thumb$.dataset.id = fileId
                thumb.id          = fileId
                thumb             = thumb.prev
                if @state.selected[fileId]
                    thumb$.classList.add('selectedThumb')
                    @state.selected[fileId] = thumb$
                else
                    thumb$.classList.remove('selectedThumb')
            ##
            # 3/ update src of thumbs that are before the firstThumbRkToUpdate
            # if firstThumbRkToUpdate > fstFileRk
            #     console.log " update backward #{firstThumbRkToUpdate-1}->
            #         #{fstFileRk}"
            #     console.log '   firstThumbRkToUpdate', firstThumbRkToUpdate,
            #                    'nFiles', files.length,
            #                    'fstFileRk', fstFileRk,
            #                    'lstFileRk',lstFileRk
            # else
            #     console.log ' update backward: none'
            thumb = firstThumbToUpdate.next
            for file_i in [firstThumbRkToUpdate-fstFileRk-1..0] by -1
                file   = files[file_i]
                fileId = file.id
                thumb$            = thumb.el
                thumb$.file       = file
                thumb$.src        = "files/photo/thumbs/#{fileId}.jpg"
                # thumb$.src        = "files/photo/thumbs/fast/#{fileId}"
                thumb$.dataset.id = fileId
                thumb.id          = fileId
                thumb             = thumb.next
                if @state.selected[fileId]
                    thumb$.classList.add('selectedThumb')
                    @state.selected[fileId] = thumb$
                else
                    thumb$.classList.remove('selectedThumb')
            ##
            # 3/ default selection management : can not be done befor the id of
            # the first thumb is given by the server, that's why it is done here
            if isDefaultToSelect
                @_toggleOnThumb$(bufr.first.el)
                isDefaultToSelect = false

            # console.log '======_updateThumb finished ================='


        _getBufferNextFirst = ()=>
            bufr = buffer
            nextFirstRk     = bufr.firstRk - 1
            if nextFirstRk == -1
                return
            bufr.nextFirstRk     = nextFirstRk

            initMonthRk = safeZone.endMonthRk
            for monthRk in [initMonthRk..0] by -1
                month = months[monthRk]
                if month.firstRk <= nextFirstRk
                    break
            bufr.nextFirstMonthRk = monthRk
            localRk               = nextFirstRk - month.firstRk
            inMonthRow            = Math.floor(localRk/nThumbsPerRow)
            bufr.nextFirstY       = month.y + monthTopPadding + inMonthRow*rowHeight
            bufr.nextFirstCol     = localRk % nThumbsPerRow


        _getBufferNextLast = ()=>
            bufr = buffer
            nextLastRk     = bufr.lastRk + 1
            if nextLastRk == @nPhotos
                return
            bufr.nextLastRk = nextLastRk

            initMonthRk = safeZone.firstMonthRk
            for monthRk in [initMonthRk..months.length-1] by 1
                month = months[monthRk]
                if nextLastRk <= month.lastRk
                    break
            bufr.nextLastMonthRk = monthRk
            localRk              = nextLastRk - month.firstRk
            inMonthRow           = Math.floor(localRk/nThumbsPerRow)
            bufr.nextLastY       = month.y + monthTopPadding + inMonthRow*rowHeight
            bufr.nextLastCol     = localRk % nThumbsPerRow

        ###*
         * after a scroll throttle, will compute the safe zone
        ###
        _computeSafeZone = () =>
            # 1/ init the start of the safe zone at the start of the viewport
            _SZ_initStartPoint()
            # 2/ move the start of the safe zone in order to have a margin
            _SZ_setMarginAtStart()
            # 3/ init the end of the safe zone: start of SZ + nb of thumbs in SZ
            hasReachedLastPhoto = _SZ_initEndPoint()
            # 4/ if the end of SZ is at the last photo, move up the start of the
            # SZ in order to have if possible nThumbsInSafeZone
            if hasReachedLastPhoto
                _SZ_bottomCase()


        _SZ_initStartPoint = ()=>
            SZ = safeZone
            Y = current_scrollTop
            for month, monthRk in @months
                if month.yBottom > Y
                    break
            inMonthRow = Math.floor((Y-month.y-monthTopPadding)/rowHeight)
            if inMonthRow < 0
                # happens if the viewport is in the header of a month
                inMonthRow = 0
            SZ.firstRk            = month.firstRk + inMonthRow * nThumbsPerRow
            SZ.firstY             = month.y + monthTopPadding + inMonthRow * rowHeight
            SZ.firstMonthRk       = monthRk
            SZ.firstCol           = 0
            SZ.firstThumbToUpdate = null
            SZ.firstInMonthRow    = inMonthRow
            SZ.firstVisibleRk     = SZ.firstRk # true because it is the init of SZ
            _selectCurrentIndex(monthRk)


        _SZ_setMarginAtStart= () =>
            SZ = safeZone
            inMonthRow = SZ.firstInMonthRow - nRowsInSafeZoneMargin

            if inMonthRow >= 0
                # the row that we are looking for is in the current month
                # (monthRk and col are not changed then)
                month = @months[SZ.firstMonthRk]
                SZ.firstRk = month.firstRk + inMonthRow * nThumbsPerRow
                SZ.firstY  = month.y + monthTopPadding + inMonthRow*rowHeight
                SZ.firstInMonthRow = inMonthRow
                return

            else
                # the row that we are looking for is before the current month
                # (col remains 0)
                rowsSeen = SZ.firstInMonthRow
                for j in [SZ.firstMonthRk-1..0] by -1
                    month = @months[j]
                    if rowsSeen + month.nRows >= nRowsInSafeZoneMargin
                        inMonthRow         = month.nRows - nRowsInSafeZoneMargin + rowsSeen
                        SZ.firstRk         = month.firstRk + inMonthRow * nThumbsPerRow
                        SZ.firstY          = month.y + monthTopPadding + inMonthRow*rowHeight
                        SZ.firstInMonthRow = inMonthRow
                        SZ.firstMonthRk    = j
                        return

                    else
                        rowsSeen += month.nRows

            SZ.firstRk         = 0
            SZ.firstMonthRk    = 0
            SZ.firstInMonthRow = 0
            SZ.firstCol        = 0
            SZ.firstY          = monthTopPadding


        ###*
         * Finds the end point of the safeZone.
         * Returns true if the safeZone end pointer should be after the last
         * thumb
        ###
        _SZ_initEndPoint = () =>
            SZ = safeZone
            lastRk = SZ.firstRk + nThumbsInSafeZone - 1
            # 1/ check if end of safeZone should be after the last thumb
            if lastRk >= @nPhotos
                lastRk = @nPhotos - 1
                safeZone.lastRk = lastRk
                # other safeZone end info are useless (safeZone is going down)
                return true
            # 2/ otherwise find the month containing the last thumb of the SZ
            for monthRk in [SZ.firstMonthRk..months.length-1]
                month = months[monthRk]
                if lastRk <= month.lastRk
                    break
            # 3/ update safeZoone data
            inMonthRk  = lastRk - month.firstRk
            inMonthRow = Math.floor(inMonthRk/nThumbsPerRow)
            safeZone.lastRk     = lastRk
            safeZone.endMonthRk = monthRk
            safeZone.endCol     = inMonthRk % nThumbsPerRow
            safeZone.endY       = month.y         +
                                  monthTopPadding +
                                  inMonthRow*rowHeight
            return false


        _SZ_bottomCase = ()=>
            SZ = safeZone
            months       = @months
            monthRk      = months.length - 1
            thumbsSeen   = 0
            thumbsTarget = nThumbsInSafeZone
            for monthRk in [monthRk..0] by -1
                month = months[monthRk]
                thumbsSeen += month.nPhotos
                if thumbsSeen >= thumbsTarget
                    break
            if thumbsSeen < thumbsTarget
                # happens if the number of photo is smaller than the number
                # in safezone (nThumbsInSafeZone), it means that safe zone
                # begins at the first photo
                SZ.firstMonthRk    = 0
                SZ.firstInMonthRow = 0
                SZ.firstRk         = 0
                SZ.firstY          = month.y + cellPadding + monthHeaderHeight
            else
                rk         = @nPhotos - thumbsTarget
                inMonthRk  = rk - month.firstRk
                inMonthRow = Math.floor(inMonthRk / nThumbsPerRow)

                SZ.firstMonthRk    = monthRk
                SZ.firstInMonthRow = inMonthRow
                SZ.firstCol        = inMonthRk % nThumbsPerRow
                SZ.firstRk         = rk
                SZ.firstY          = month.y           +
                                     cellPadding       +
                                     monthHeaderHeight +
                                     inMonthRow * rowHeight


        _createThumbsBottom = (nToCreate, startRk, startCol, startY, monthRk) =>
            bufr     = buffer
            rowY     = startY
            col      = startCol
            month    = @months[monthRk]
            localRk  = startRk - month.firstRk
            lastLast = bufr.last
            for rk in [startRk..startRk+nToCreate-1] by 1
                if localRk == 0 then _insertMonthLabel(month)
                thumb$ = document.createElement('img')
                thumb$.dataset.rank = rk
                thumb$.setAttribute('class', 'long-list-thumb')
                thumb =
                    next    : bufr.last
                    prev    : bufr.first
                    el      : thumb$
                    rank    : rk
                    monthRk : monthRk
                    id      : null
                if rk == safeZone.firstVisibleRk
                    safeZone.firstThumbToUpdate = thumb
                bufr.first.next = thumb
                bufr.last.prev  = thumb
                bufr.last       = thumb
                style        = thumb$.style
                style.top    = rowY + 'px'
                style.left   = (marginLeft + col*colWidth) + 'px'
                style.height = thumbHeight + 'px'
                style.width  = thumbHeight + 'px'

                @thumbs$.appendChild(thumb$)
                localRk += 1
                if localRk == month.nPhotos
                    # jump to a new month
                    monthRk += 1
                    month    = @months[monthRk]
                    localRk  = 0
                    col      = 0
                    rowY    += rowHeight + monthTopPadding
                else
                    # go to next column or to a new row if we are at last column
                    col  += 1
                    if col is nThumbsPerRow
                        rowY += rowHeight
                        col   = 0
            bufr.lastRk   = rk - 1
            bufr.nThumbs += nToCreate
            # if the first visible thumb has not bee created, then the first
            # thumb to update will be the first created thumb (lastLast.prev :-)
            if safeZone.firstThumbToUpdate == null
                safeZone.firstThumbToUpdate = lastLast.prev
            # store the parameters of the thumb that is just after the last one
            bufr.nextLastRk      = rk
            bufr.nextLastCol     = col
            bufr.nextLastY       = rowY
            bufr.nextLastMonthRk = monthRk

            return [rowY, col, monthRk]


        _moveBufferToBottom= (nToMove, startRk, startCol, startY, monthRk)=>
            monthRk_initial = monthRk
            rowY    = startY
            col     = startCol
            month   = @months[monthRk]
            localRk = startRk - month.firstRk

            # by default the firstThumbToUpdate will be the first moved down
            # (ie buffer.first :-)
            if safeZone.firstThumbToUpdate == null
                safeZone.firstThumbToUpdate = buffer.first

            for rk in [startRk..startRk+nToMove-1] by 1
                if localRk == 0
                    _insertMonthLabel(month)
                thumb = buffer.first
                thumb$              = thumb.el
                thumb$.dataset.rank = rk
                thumb.rank          = rk
                thumb.monthRk       = monthRk
                thumb$.src          = ''
                thumb$.dataset.id   = ''
                style      = thumb$.style
                style.top  = rowY + 'px'
                style.left = (marginLeft + col*colWidth) + 'px'
                # if during the move of the thumbs we meet the thumb with the
                # firstVisibleRk, then this thumb is the firstThumbToUpdate
                if rk == safeZone.firstVisibleRk
                    safeZone.firstThumbToUpdate = thumb
                buffer.last      = buffer.first
                buffer.first     = buffer.first.prev
                buffer.firstRk   = buffer.first.rank
                buffer.last.rank = rk
                localRk += 1
                if localRk == month.nPhotos
                    # jump to a new month
                    monthRk += 1
                    month    = @months[monthRk]
                    localRk  = 0
                    col      = 0
                    rowY    += rowHeight + monthTopPadding
                else
                    # go to next column or to a new row if we are at last column
                    col  += 1
                    if col is nThumbsPerRow
                        rowY += rowHeight
                        col   = 0

            # console.log 'firstThumbToUpdate (_moveBufferToBottom)', safeZone.firstThumbToUpdate.el
            buffer.lastRk  = rk - 1
            buffer.firstRk = buffer.first.rank
            # store the parameters of the thumb that is just after the last one
            buffer.nextLastRk      = rk
            buffer.nextLastCol     = col
            buffer.nextLastY       = rowY
            buffer.nextLastMonthRk = monthRk


        _moveBufferToTop= (nToMove, startRk, startCol, startY, monthRk)=>
            rowY    = startY
            col     = startCol
            month   = @months[monthRk]
            localRk = startRk - month.firstRk

            # by default the firstThumbToUpdate will be the first moved down
            # (ie buffer.first :-)
            if safeZone.firstThumbToUpdate == null
                safeZone.firstThumbToUpdate = buffer.last

            for rk in [startRk..startRk-nToMove+1] by -1
                thumb               = buffer.last
                thumb$              = thumb.el
                thumb$.dataset.rank = rk
                thumb.rank          = rk
                thumb.monthRk       = monthRk
                thumb$.src          = ''
                thumb$.dataset.id   = ''
                style               = thumb$.style
                style.top           = rowY + 'px'
                style.left          = (marginLeft + col*colWidth) + 'px'
                # if during the move of the thumbs we meet the thumb with the
                # firstVisibleRk, then this thumb is the firstThumbToUpdate
                if rk == safeZone.firstVisibleRk
                    safeZone.firstThumbToUpdate = thumb
                buffer.first      = buffer.last
                buffer.last       = buffer.last.next
                buffer.lastRk     = buffer.last.rank
                buffer.first.rank = rk
                localRk          -= 1
                if localRk == -1
                    if rk == 0
                        rk = -1
                        break
                    # jump to a new month
                    _insertMonthLabel(month)
                    monthRk -= 1
                    month    = @months[monthRk]
                    localRk  = month.nPhotos - 1
                    col      = month.lastThumbCol
                    rowY    -= cellPadding + monthHeaderHeight + rowHeight
                else
                    # go to next column or to a new row if we are at last column
                    col  -= 1
                    if col is -1
                        rowY -= rowHeight
                        col   = nThumbsPerRow - 1

            # console.log 'firstThumbToUpdate (_moveBufferToTop)',
            #             safeZone.firstThumbToUpdate.el
            buffer.firstRk = rk + 1
            buffer.lastRk  = buffer.last.rank


        _insertMonthLabel = (month)=>
            if month.label$
                label$ = month.label$
            else
                label$ = document.createElement('div')
                label$.classList.add('long-list-month-label')
                @thumbs$.appendChild(label$)
                month.label$ = label$
            label$.textContent = month.date.format('MMMM YYYY')
            label$.style.top   = (month.y + monthLabelTop) + 'px'
            label$.style.left  = Math.round(marginLeft/2) + 'px'


        _indexClickHandler = (e) =>
            monthRk = e.target.dataset.monthRk
            if monthRk
                @viewPort$.scrollTop = @months[monthRk].y
                _adaptIndex()


        _indexMouseEnter = () =>
            @index$.classList.add('hardVisible')
            indexVisible = false


        _indexMouseLeave = () =>
            @index$.classList.add('visible')
            @index$.classList.remove('hardVisible')
            lazyHideIndex()

        ####
        # Get the geometry
        _getStaticDimensions()
        _initBuffer()
        _resizeHandler()
        isDefaultToSelect = true

        ####
        # bind events
        @thumbs$.addEventListener(   'click'      , @_clickHandler    )
        @thumbs$.addEventListener(   'dblclick'   , @_dblclickHandler )
        @viewPort$.addEventListener( 'scroll'     , _scrollHandler    )
        @index$.addEventListener(    'click'      , _indexClickHandler)
        @index$.addEventListener(    'mouseenter' , _indexMouseEnter  )
        @index$.addEventListener(    'mouseleave' , _indexMouseLeave  )



    _clickHandler: (e) =>
        th = e.target
        if not th.classList.contains('long-list-thumb')
            return
        if !@_toggleOnThumb$(th) then return null
        @_lastSelectedCol = @_coordonate.left(th)
        viewPortTopY    = @viewPort$.scrollTop
        viewPortBottomY = viewPortTopY + @viewPort$.clientHeight
        thTopY    = @_coordonate.top(th)
        thBottomY = thTopY + @thumbHeight
        if viewPortBottomY < thBottomY
            th.scrollIntoView(false)
        if thTopY < viewPortTopY
            th.scrollIntoView(true)


    _dblclickHandler: (e) =>
        th = e.target
        if not th.classList.contains('long-list-thumb')
            return null
        @_toggleOnThumb$(th)
        @_lastSelectedCol = @_coordonate.left(th)
        @modal.onYes()


    ###*
     * toogles on a thumb.
     * Returns null if the thumb is already selected or if there is no image id
     * associated yet
    ###
    _toggleOnThumb$: (thumb$)->
        # the thumb is empty (no image yet)=> we can't select it
        if thumb$.dataset.id == ''
            return null
        # the thums is already selected => we can't select it again
        if @state.selected[thumb$.dataset.id]
            return null
        # otherwise we can toggle
        @_unselectAll()
        thumb$.classList.add('selectedThumb')
        @state.selected[thumb$.dataset.id] = thumb$


    _unselectAll: () =>
        for id, thumb$ of @state.selected
            if typeof(thumb$) == 'object'
                thumb$.classList.remove('selectedThumb')
                @state.selected[id] = false


    _getSelectedThumb$: ()->
        for id, thumb$ of @state.selected
            if typeof(thumb$) == 'object'
                return thumb$
        return null


    _selectNextThumb: ()->
        # 1/ look for the selected thumb element
        for id, thumb$ of @state.selected
            if typeof(thumb$) == 'object'
                break
        # 2/ get next thumb$ and toggle
        nextThumb$ = @_getNextThumb$(thumb$)
        if nextThumb$ == null then return null
        @_lastSelectedCol = @_coordonate.left(nextThumb$)
        if !@_toggleOnThumb$(nextThumb$) then return null
        @_moveViewportToBottomOfThumb$(nextThumb$)


    _selectPreviousThumb: ()->
        # 1/ look for the selected thumb element
        thumb$ = @_getSelectedThumb$()
        # 2/ get previous thumb$ and toggle
        prevThumb$ = @_getPreviousThumb$(thumb$)
        if prevThumb$ == null then return null
        @_lastSelectedCol = @_coordonate.left(prevThumb$)
        if !@_toggleOnThumb$(prevThumb$) then return null
        @_moveViewportToTopOfThumb$(prevThumb$)


    _selectThumbUp: ()->
        thumb$ = @_getSelectedThumb$()
        if thumb$ == null
            return null
        if thumb$.dataset.rank == '0'
            return null
        if @_lastSelectedCol == null
            left = @_coordonate.left(thumb$)
        else
            left = @_lastSelectedCol
        top  = thumb$.style.top
        th   = @_getPreviousThumb$(thumb$)
        if th == null then return null
        while th.style.left != left
            if th.dataset.rank == '0'
                @_lastSelectedCol = @_coordonate.left(th)
                if !@_toggleOnThumb$(th) then return null
                @_moveViewportToTopOfThumb$(th)
                return th
            if th.style.top != top
                # we changed of row, continue only if there are thumbs on the
                # right
                if @_coordonate.left(th) <= left
                    if !@_toggleOnThumb$(th) then return null
                    @_moveViewportToTopOfThumb$(th)
                    return th
            th = @_getPreviousThumb$(th)
            if th == null then return null
        if !@_toggleOnThumb$(th) then return null
        @_moveViewportToTopOfThumb$(th)
        return th


    _selectThumbDown: ()->
        thumb$ = @_getSelectedThumb$()
        if thumb$ == null
            return null
        if @_coordonate.rank(thumb$) == @nPhotos - 1
            return null
        if @_lastSelectedCol == null
            left = @_coordonate.left(thumb$)
        else
            left = @_lastSelectedCol
        top  = thumb$.style.top
        th   = @_getNextThumb$(thumb$)
        if th == null then return null
        hasAlreadyChangedOfRow = false
        while @_coordonate.left(th) != left
            if @_coordonate.rank(th) == @nPhotos - 1
                @_lastSelectedCol = @_coordonate.left(th)
                if !@_toggleOnThumb$(th) then return null
                @_moveViewportToBottomOfThumb$(th)
                return th
            if th.style.top != top
                # we changed of row, continue only if there are thumbs on the
                # right
                if hasAlreadyChangedOfRow
                    th = @_getPreviousThumb$(th)
                    if th == null then return null
                    if !@_toggleOnThumb$(th) then return null
                    @_moveViewportToBottomOfThumb$(th)
                    return th
                hasAlreadyChangedOfRow = true
                top = th.style.top
                if @_coordonate.left(th) >= left
                    if !@_toggleOnThumb$(th) then return null
                    @_moveViewportToBottomOfThumb$(th)
                    return th
            th = @_getNextThumb$(th)
            if th == null then return null
        if !@_toggleOnThumb$(th) then return null
        @_moveViewportToBottomOfThumb$(th)
        return th


    _selectEndLineThumb: ()->
        thumb$ = @_getSelectedThumb$()
        if thumb$ == null
            return
        if @_coordonate.rank(thumb$) == @nPhotos - 1
            return
        if @_lastSelectedCol == null
            left = @_coordonate.left(thumb$)
        else
            left = @_lastSelectedCol
        top  = thumb$.style.top
        th   = @_getNextThumb$(thumb$)
        if th == null then return null
        while th.style.top == top
            if @_coordonate.rank(th) == @nPhotos - 1
                @_lastSelectedCol = @_coordonate.left(th)
                if !@_toggleOnThumb$(th) then return null
                @_moveViewportToBottomOfThumb$(th)
                return
            th = @_getNextThumb$(th)
            if th == null then return null
        th = @_getPreviousThumb$(th)
        if th == null then return null
        @_lastSelectedCol = @_coordonate.left(th)
        if !@_toggleOnThumb$(th) then return null
        @_moveViewportToBottomOfThumb$(th)
        return


    _selectStartLineThumb: ()->
        thumb$ = @_getSelectedThumb$()
        if thumb$ == null
            return
        if Number(thumb$.dataset.rank) == 0
            return
        if @_lastSelectedCol == null
            left = @_coordonate.left(thumb$)
        else
            left = @_lastSelectedCol
        top = thumb$.style.top
        th  = @_getPreviousThumb$(thumb$)
        if th == null then return null
        while th.style.top == top
            if @_coordonate.rank(th) == 0
                @_lastSelectedCol = @_coordonate.left(th)
                if !@_toggleOnThumb$(th) then return null
                @_moveViewportToBottomOfThumb$(th)
                return
            th = @_getPreviousThumb$(th)
        th = @_getNextThumb$(th)
        if th == null then return null
        @_lastSelectedCol = @_coordonate.left(th)
        if !@_toggleOnThumb$(th) then return null
        @_moveViewportToBottomOfThumb$(th)
        return


    _coordonate:
        top: (thumb$)->
            return Number(thumb$.style.top.slice(0,-2))
        left: (thumb$)->
            return Number(thumb$.style.left.slice(0,-2))
        rank: (thumb$)->
            return Number(thumb$.dataset.rank)


    _selectPageDownThumb: () ->
        viewPortBottomY = @viewPort$.scrollTop + @viewPort$.clientHeight
        thumb$    = @_getSelectedThumb$()
        if thumb$ == null then return
        th        = thumb$
        thTopY    = @_coordonate.top(th)
        thBottomY = thTopY + @thumbHeight
        while thBottomY <= viewPortBottomY
            th = @_selectThumbDown()
            if th == null then return
            thTopY    = @_coordonate.top(th)
            thBottomY = thTopY + @thumbHeight
        th.scrollIntoView(true)
        @_moveViewportToTopOfThumb$(th)


    _selectPageUpThumb: () ->
        viewPortTopY = @viewPort$.scrollTop
        thumb$ = @_getSelectedThumb$()
        th     = thumb$
        thTopY = @_coordonate.top(th)
        while thTopY >= viewPortTopY
            th = @_selectThumbUp()
            if th == null
                return
            thTopY    = @_coordonate.top(th)
        th.scrollIntoView(false)


    _moveViewportToBottomOfThumb$: (thumb$)=>
        thumb$Top       = @_coordonate.top(thumb$)
        thumb$Bottom    = thumb$Top + @thumbHeight
        viewPortBottomY = @viewPort$.scrollTop + @viewPort$.clientHeight
        if viewPortBottomY < thumb$Bottom
            thumb$.scrollIntoView(false)
            @_scrollHandler()

    ###*
     * will move the viewport so that the top of the given thumb is at the top
     * of the viewport, but only if the top of the thumb is above the viewport
     * @param  {element} thumb$ # the thumb
    ###
    _moveViewportToTopOfThumb$: (thumb$)->
        thumb$Top   = @_coordonate.top(thumb$)
        viewPortTop = @viewPort$.scrollTop
        # find the in month row
        thumbRk = parseInt(thumb$.dataset.rank)
        for month, monthRk in @months
            if thumbRk <= month.lastRk
                break
        inMonthRow = Math.floor((thumbRk - month.firstRk) / @nThumbsPerRow)

        if inMonthRow == 0
            if month.y + @monthLabelTop < @viewPort$.scrollTop
                @viewPort$.scrollTop = month.y + @monthLabelTop
                @_scrollHandler()
        else
            if thumb$Top < viewPortTop
                thumb$.scrollIntoView(true)
                @_scrollHandler()
                return


            # thumb$.scrollIntoView(true)
            # @_scrollHandler()
            # @_scrollHandler()


    ###*
     * @param  {Element} thumb$ # the element corresponding to the thumb
     * @return {null}        # return null if on first thumb
     * @return {Element}     # the previous element thumb or null if on first
     *                         thumb of first of the buffer
    ###
    _getPreviousThumb$: (thumb$) ->
        # 1/ check we are not on the first thumb
        if thumb$.dataset.rank == '0'
            return null
        # 2/ check we are not on the first displayed by the buffer
        if thumb$ == @buffer.first.el
            return null
        # 3/ get the previous thumb
        th = thumb$.previousElementSibling
        if th == null
            # case if thumb$ is the first element => jump to the last one
            # (what does not means it is the first displayed)
            th = thumb$.parentNode.lastElementChild
            if th == thumb$
                # case there is only one photo
                return null
        while th.nodeName == 'DIV'
            # case of a month label
            th = th.previousElementSibling
            if th == null
                # case if thumb$ is the first element => jump to the last one
                # (what does not means it is the first displayed)
                th = thumb$.parentNode.lastElementChild
                if th == thumb$
                    # case there is only one photo
                    return null
        return th

    ###*
     *
     * @param  {Element} thumb$ # the start thumb element
     * @return {Element|null}   # returns an element or null if on the last
     *                            thumb or the last of the buffer
    ###
    _getNextThumb$: (thumb$) ->
        # 1/ check we are not on the last thumb
        if @_coordonate.rank(thumb$) == @nPhotos - 1
            return null
        # 2/ check we are not on the last displayed by the buffer
        if thumb$ == @buffer.last.el
            return null
        # 3/ get the next thumb
        th = thumb$.nextElementSibling
        if th == null
            # case if thumb$ is the last element => jump to the first one
            # (what does not means it is the oldest displayed)
            th = thumb$.parentNode.firstElementChild
            if th == thumb$
                # case there is only one photo
                return null
        while th.nodeName == 'DIV'
            # case of a month label
            th = th.nextElementSibling
            if th == null
                # case if thumb$ is the last element => jump to the first one
                # (what does not means it is the oldest displayed)
                th = thumb$.parentNode.firstElementChild
                if th == thumb$
                    # case there is only one photo
                    return null
        return th

    getScrollBarWidth : ()->
      inner = document.createElement('p')
      inner.style.width  = "100%"
      inner.style.height = "200px"

      outer = document.createElement('div')
      outer.style.position   = "absolute"
      outer.style.top        = "0px"
      outer.style.left       = "0px"
      outer.style.visibility = "hidden"
      outer.style.width      = "200px"
      outer.style.height     = "150px"
      outer.style.overflow   = "hidden"
      outer.appendChild (inner)

      document.body.appendChild (outer)
      w1 = inner.offsetWidth
      outer.style.overflow = 'scroll'
      w2 = inner.offsetWidth
      if (w1 == w2)
        w2 = outer.clientWidth

      document.body.removeChild (outer)

      return (w1 - w2)

