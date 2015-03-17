proxyclient = require 'lib/proxyclient'
BaseView    = require 'lib/base_view'


module.exports = class ObjectPickerPhotoURL extends BaseView

    template : require '../templates/object-picker-photoURL'
    tagName  : 'section'

####################
## PUBLIC SECTION ##
#
    initialize: () ->
        @render()
        @name     = 'urlPhotoUpload'
        @tabLabel = 'url'
        @tab      = $("<div>#{@tabLabel}</div>")[0]
        @panel    = @el
        @img      = @panel.querySelector('.url-preview')
        @blocContainer=@panel.querySelector('.bloc-container')
        @url      = undefined
        @input    = @panel.querySelector('.modal-url-input')
        @_setupInput()

    getObject : () ->
        if @url
            return @url
        else
            return false

    setFocusIfExpected : () ->
        @input.focus()
        @input.select()
        return true

    keyHandler : (e)->
        return false

#####################
## PRIVATE SECTION ##
#
    ###*
     * manages the url typed in the input and update image
    ###
    _setupInput: ()->
        img = @img
        urlRegexp = /\b(https?|ftp|file):\/\/[\-A-Z0-9+&@#\/%?=~_|$!:,.;]*[A-Z0-9+&@#\/%=~_|$]/i
        imgTmp = new Image()

        imgTmp.onerror =  () ->
            img.style.backgroundImage = ""
            @url = undefined

        imgTmp.onload =  () =>
            img.style.maxWidth  = imgTmp.naturalWidth  + 'px'
            img.style.maxHeight = imgTmp.naturalHeight + 'px'
            img.parentElement.style.display = 'flex'
            img.style.backgroundImage = 'url(' + imgTmp.src + ')'
            @url = imgTmp.src
            @blocContainer.style.height = (imgTmp.naturalHeight+40) + 'px'

        preloadImage = (src) ->
            imgTmp.src = src

        @input.addEventListener('input',(e)->
            newurl = e.target.value
            if urlRegexp.test(newurl)
                url = 'api/proxy/?url=' + encodeURIComponent(newurl)
                preloadImage(url)
            else
                img.style.backgroundImage = ""
                @url = undefined
        ,false)