proxyclient = require 'lib/proxyclient'
BaseView    = require 'lib/base_view'
client   = require '../lib/request'

module.exports = class ObjectPickerSearch extends BaseView

    template : require '../templates/object_picker_search'
    tagName  : 'section'

####################
## PUBLIC SECTION ##
#
    initialize: () ->
        @render()
        @name     = 'imagesSearch'
        @tabLabel = 'search'
        @tab      = $("<div class='fa fa-search'>#{@tabLabel}</div>")[0]
        @panel    = @el
        @blocContainer = @panel.querySelector('.search-tab-container')
        @input    = @panel.querySelector('.modal-search-input')
        @selectedUrl      = @selectedUrl

        # A dictionnary to store the selected image
        @selectedImage = {}

        ####
        # listeners
        @input.addEventListener 'change', @_inputListener

        ####
        # input helpers and properties
        @input.getImages = @_getQwantImages
        @input.container = @blocContainer

    getObject : () ->
        if @selectedUrl
            return urlToFetch: @selectedUrl
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

    # input listener
    _inputListener: (e) ->
        # here, @ is the input object running this listener
        newQuery = @value
        if newQuery.trim() isnt ''
            @query = newQuery
            @getImages()

    _getQwantImages: () ->
        # here, @ is the input object running the previous listener
        client.get "apps/qwant/imagesSearch?q=#{@query}&count=30", (err, res) =>
            # if error
            if err
                console.error err
                return
            # if no results
            container = $('.search-tab-container')
            if res?.data?.result?.items.length == 0
                # remove last results
                container.children('.results').remove()
                # display a not found message
                container.append($("<div class='notFound'>#{t 'qwant results not found'}</div>"))
                return
            # if results
            if res?.data?.result?.items
                # remove last results
                container.children('.results').remove()
                # remove potential not found message
                container.children('.notFound').remove()
                # variables
                results$ = $("<div class='results'></div>")[0]
                imagesArray = res.data.result.items
                # display the gallery
                for index of imagesArray
                    item$ = $("<div class='searchItem'></div>")[0]
                    currentImage = imagesArray[index]
                    # create image with properties
                    thumb$ = new Image()
                    thumb$.src = currentImage.media_fullsize
                    thumb$.style.height = currentImage.thumb_height + 'px'
                    thumb$.style.width = currentImage.thumb_width + 'px'
                    # hide if broken url
                    thumb$.onerror = () ->
                        $(@).parent().hide();
                    # append to parents
                    item$.append(thumb$)
                    results$.append(item$)

                container.append(results$)
