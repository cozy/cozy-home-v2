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
        @input.addEventListener 'keyup', @_inputOnChange

        ####
        # input helpers and properties
        @input.getImages = @_getQwantImages
        @input.container = @blocContainer

    getObject : () ->
        # get selected image source if it exists
        @selectedUrl = $('div.selected img')[0]?.data
        if @selectedUrl
            @selectedUrl = "api/proxy/?url=#{@selectedUrl}"
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
    _inputOnChange: _.debounce( (e) ->
        # here, @ is the input object running this listener
        newQuery = @value
        # if not empty and not equal to the last query
        if newQuery.trim() isnt '' and newQuery isnt @query
            @query = newQuery
            @getImages()
    , 500)

    _getQwantImages: () ->
        # here, @ is the input object running the previous listener
        container = $('.search-tab-container')
        # remove last results
        container.children('.results').remove()
        # remove potential error message
        container.children('.error').remove()
        # add the loading spinner if not exist
        if !$('.search-tab-container .spinner').length
            container.append($("<img src='/img/spinner.svg' class='spinner'/>"))
        # request
        client.get "apps/qwant/imagesSearch?q=#{@query}&count=50", (err, res) =>
            # remove loading spinner
            container.children('.spinner').remove()
            # if error
            if err
                # display a not found message
                container.append($("<div class='error'>#{t 'a server error occured'}</div>"))
                console.error err
                return
            # if no results
            if res?.data?.result?.items.length == 0
                # display a not found message
                container.append($("<div class='error notFound'>#{t 'qwant results not found'}</div>"))
                return
            # if results
            if res?.data?.result?.items
                # variables
                results$ = $("<div class='results'></div>")
                imagesArray = res.data.result.items
                # display the gallery
                for index of imagesArray
                    item$ = $("<div class='searchItem'></div>")
                    currentImage = imagesArray[index]

                    # create image with properties
                    thumb$ = new Image()
                    thumb$.src = currentImage.thumbnail
                    thumb$.data = currentImage.media
                    thumb$.style.height = currentImage.thumb_height + 'px'
                    thumb$.style.width = currentImage.thumb_width + 'px'

                    # hide if broken url
                    thumb$.onerror = () ->
                        $(@).parent().hide();

                    # selection listener
                    thumb$.onclick = () ->
                        # unselect all
                        $('.searchItem').removeClass('selected')
                        # select this item
                        $(@).parent().addClass('selected')

                    # append to parents
                    item$.append(thumb$)
                    results$.append(item$)

                container.append(results$)
