Modal                = require '../views/modal'
template             = require '../templates/object-picker'
ObjectPickerPhotoURL = require './object-picker-photoURL'
ObjectPickerUpload   = require './object-picker-upload'
ObjectPickerImage    = require './object-picker-image'
tabControler         = require 'views/tab-controler'


module.exports = class PhotoPickerCroper extends Modal

################################################################################
## PUBLIC SECTION

# Class attributes


# Methods

    events: -> _.extend super,
        'click    a.next'       : 'displayMore'
        'click    a.prev'       : 'displayPrevPage'
        'click    .chooseAgain' : '_chooseAgain'


    initialize: (params, cb) ->
        ####
        # init config & state and super
        @id     = 'object-picker'
        @title  = t('pick from files')
        @config =
            cssSpaceName    : "object-picker"
            singleSelection : true # tells if user can select one or more photo
            numPerPage      : 50   # number of thumbs preloaded per request
            yes             : t 'modal ok'
            no              : t 'modal cancel'
            cb              : cb  # will be called by onYes
            target_h        : 100 # height of the img-preview div
            target_w        : 100 # width  of the img-preview div
        @state =
            currentStep : 'objectPicker' # 2 states : 'croper' & 'objectPicker'
            img_naturalW: 0  # natural width  (px) of the selected file
            img_naturalH: 0  # natural height (px) of the selected file
        super(@config)
        ####
        # get elements
        body              = @el.querySelector('.modalCY-body')
        body.innerHTML    = template()
        @body             = body
        @objectPickerCont = body.querySelector('.objectPickerCont')
        @tablist          = body.querySelector('[role=tablist]')
        @cropper$         = @el.querySelector('.croperCont')
        @imgToCrop        = @cropper$.querySelector('#img-to-crop')
        @imgPreview       = @cropper$.querySelector('#img-preview')
        ####
        # initialise tabs and panels
        @panelsControlers = {} # {tab1.name : tab1Controler, tab2... }
        # image panel
        @imagePanel = new ObjectPickerImage(this)
        tabControler.addTab @objectPickerCont, @tablist, @imagePanel
        @panelsControlers[@imagePanel.name] = @imagePanel
        # photoURL panel
        @photoURLpanel = new ObjectPickerPhotoURL()
        tabControler.addTab @objectPickerCont, @tablist, @photoURLpanel
        @panelsControlers[@photoURLpanel.name] = @photoURLpanel
        # upload panel
        @uploadPanel = new ObjectPickerUpload(this)
        tabControler.addTab @objectPickerCont, @tablist, @uploadPanel
        @panelsControlers[@uploadPanel.name] = @uploadPanel
        # init tabs
        tabControler.initializeTabs(body)
        @_listenTabsSelection()
        @_selectDefaultTab(@imagePanel.name)
        ####
        # init the cropper
        @imgToCrop.addEventListener('load', @_onImgToCropLoaded, false)
        @cropper$.style.display = 'none'

        return true


    onYes: ()->
    # overload the modal behavour : "ok" leads to the cropping step
        # console.log "onYes", @state.currentStep, @state.activePanel
        if @state.currentStep == 'objectPicker'
            url = @state.activePanel.getObject()
            if url
                @_showCropingTool(url)
        else
            s = @imgPreview.style
            r = @state.img_naturalW / @imgPreview.width
            d =
                sx      : Math.round(- parseInt(s.marginLeft)*r)
                sy      : Math.round(- parseInt(s.marginTop )*r)
                sWidth  : Math.round(@config.target_h*r)
                sHeight : Math.round(@config.target_w*r)
            # check the size of the cropped image is strictly into imgPreview
            if d.sx < 0 then d.sx = 0
            if d.sy < 0 then d.sy = 0
            if d.sx + d.sWidth > @imgPreview.naturalWidth
                d.sWidth = @imgPreview.naturalWidth - d.sx
            if d.sy + d.sHeight > @imgPreview.naturalHeight
                d.sHeight = @imgPreview.naturalHeight - d.sy
            # send result
            @cb(true,@_getResultDataURL(@imgPreview, d))
            @close()


################################################################################
## PRIVATE SECTION ##
#

    _getResultDataURL:(img, dimensions)->
        IMAGE_DIMENSION = 600
        # use canvas to resize the image and return the urldata
        canvas = document.createElement 'canvas'
        canvas.height = canvas.width = IMAGE_DIMENSION
        ctx = canvas.getContext '2d'
        d = dimensions
        ctx.drawImage( img, d.sx, d.sy, d.sWidth,
                       d.sHeight, 0, 0, IMAGE_DIMENSION, IMAGE_DIMENSION)
        return dataUrl =  canvas.toDataURL 'image/jpeg'


    onKeyStroke: (e)->
    # overloads the modal onKeyStroke
        # console.log 'onKeyStroke', e.which, @state.activePanel
        if e.which == 13 # return key => validate modal
            e.stopPropagation()
            @onYes()
            return
        if e.which is 27 # escape key => choose another photo
            e.stopPropagation()
            if @state.currentStep == 'croper'
                @_chooseAgain()
            else # @state.currentStep == 'objectPicker'
                @.onNo()
            return
        @state.activePanel.keyHandler(e)


    # returns a url wich can be a path or dataUrl
    _showCropingTool: (url)->
        @state.currentStep  = 'croper'
        @currentPhotoScroll = @body.scrollTop
        @objectPickerCont.style.display = 'none'
        @cropper$.style.display         = ''
        @imgToCrop.src  = url
        @imgPreview.src = url


    _onImgToCropLoaded: ()=>
        img_w  = @imgToCrop.width
        img_h  = @imgToCrop.height
        @img_w = img_w
        @img_h = img_h
        @state.img_naturalW = @imgToCrop.naturalWidth
        @state.img_naturalH = @imgToCrop.naturalHeight
        selection_w   = Math.round(Math.min(img_h,img_w)*1)
        x = Math.round( (img_w-selection_w)/2 )
        y = Math.round( (img_h-selection_w)/2 )
        options =
            onChange    : @_updateCropedPreview
            onSelect    : @_updateCropedPreview
            aspectRatio : 1
            setSelect   : [ x, y, x+selection_w, y+selection_w ]
        t = this
        $(@imgToCrop).Jcrop( options, ()->
            t.jcrop_api = this
        )
        t.jcrop_api.focus()


    _updateCropedPreview: (coords) =>
        prev_w = @img_w / coords.w * @config.target_w
        prev_h = @img_h / coords.h * @config.target_h
        prev_x = @config.target_w  / coords.w * coords.x
        prev_y = @config.target_h  / coords.h * coords.y
        s            = @imgPreview.style
        s.width      = Math.round(prev_w) + 'px'
        s.height     = Math.round(prev_h) + 'px'
        s.marginLeft = '-' + Math.round(prev_x) + 'px'
        s.marginTop  = '-' + Math.round(prev_y) + 'px'
        return true


    _chooseAgain : ()->
    # brings back from cropping step to the objectPicker step
        @state.currentStep = 'objectPicker'
        @jcrop_api.destroy()
        @imgToCrop.removeAttribute('style')
        @imgToCrop.src = ''
        @objectPickerCont.style.display = ''
        @cropper$.style.display = 'none'
        @body.scrollTop = @currentPhotoScroll
        # manage focus wich was on the jcrop element
        @_setFocus()

    _setFocus: ()->
        # console.log "HOME/objectPicker._setFocus", @state.activePanel
        if !@state.activePanel.setFocusIfExpected()
            @el.focus()

    _listenTabsSelection: ()->
        @objectPickerCont.addEventListener('panelSelect',(event)=>
            @_activatePanel(event.target.className)
        )


    _selectDefaultTab:(panelClassName)->
        @tablist.querySelector("[aria-controls=#{panelClassName}]").click()


    _activatePanel: (panelClassName)->
        # console.log 'panelClassName =', panelClassName
        @state.activePanel = @panelsControlers[panelClassName]
        @_setFocus()

