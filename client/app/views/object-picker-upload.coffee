BaseView    = require 'lib/base_view'


module.exports = class ObjectPickerUpload extends BaseView

    template : require '../templates/object-picker-upload'
    tagName  : "section"


####################
## PUBLIC SECTION ##
#
    constructor: (objectPicker) ->
        super()
        @objectPicker = objectPicker

    initialize: () ->
        @render()
        # get elements

        @name     = 'photoUpload'
        @tabLabel = 'upload'
        @tab      = @_createTab()
        @panel    = @el
        # bind events
        @_bindFileDropZone()
        btn = @panel.querySelector('.photoUpload-btn')
        btn.addEventListener('click', @_changePhotoFromUpload)
        @btn = btn
        @uploader = @panel.querySelector('.uploader')
        @uploader.addEventListener('change', @_handleUploaderChange)


    getObject : () ->
        return dataUrl: @dataUrl

    setFocusIfExpected : () ->
        @btn.focus()
        return true

    keyHandler : (e)=>
        return false


#####################
## PRIVATE SECTION ##
#
    _createTab : () ->
        return $("<div>#{@tabLabel}</div>")[0]


    _bindFileDropZone: ()->

        dropbox = @panel.querySelector(".modal-file-drop-zone>div")
        hasEnteredText = false

        dropbox.addEventListener("dragenter", (e)->
            # console.log 'dragenter'
            e.stopPropagation()
            e.preventDefault()
            dropbox.classList.add('dragging')
        ,false)

        dropbox.addEventListener("dragleave", (e)->
            # console.log 'dragleave'
            e.stopPropagation()
            e.preventDefault()
            dropbox.classList.remove('dragging')
        , false)

        dragenter = (e)->
            e.stopPropagation()
            e.preventDefault()

        drop = (e) =>
            e.stopPropagation()
            e.preventDefault()
            dt = e.dataTransfer
            files = dt.files
            @_handleFile(files[0])

        dragover = dragenter
        dropbox.addEventListener("dragover", dragover, false);
        dropbox.addEventListener("drop", drop, false);


    _changePhotoFromUpload: () =>
        # console.log "_changePhotoFromUpload"
        @uploadPopupOpened = true
        # pb : is not set to false if the user close the popup by clicking on
        # the close button => will close the modal too...
        @uploader.click()


    _handleUploaderChange: () =>
        file = @uploader.files[0]
        @_handleFile(file)


    _handleFile: (file) =>
        # console.log "_handleFile"
        unless file.type.match /image\/.*/
            return alert t 'This is not an image'
        reader = new FileReader()
        img = new Image()
        reader.readAsDataURL file
        reader.onloadend = =>
            @dataUrl = reader.result
            @objectPicker.onYes()
