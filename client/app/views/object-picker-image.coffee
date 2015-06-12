Photo    = require '../models/photo'
LongList = require 'views/long-list-images'
BaseView = require 'lib/base_view'


module.exports = class ObjectPickerImage extends BaseView

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
        @name     = 'thumbPicker'
        @tabLabel = 'image'
        ####
        # get elements (name ends with '$')
        @tab      = $("<div>#{@tabLabel}</div>")[0]
        @panel    = @el
        ####
        # construct the long list of images
        @longList = new LongList(@panel, @modal)


    getObject : () ->
        file = @longList.getSelectedFile()
        if file
            return id:file.id, docType: 'file', name:file.name
        return false


    setFocusIfExpected : () ->
        # the panel doesn't want the focus because otherwise the arrows keys
        # makes thumbs scroll
        return false

    setInitialDimensions : (width, heigth) ->
        @longList.setInitialDimensions(width, heigth)



    keyHandler : (e)->
        # console.log 'ObjectPickerImage.keyHandler', e.which
        @longList.keyHandler(e)
        return


    resizeHandler: () ->
        @longList.resizeHandler()

