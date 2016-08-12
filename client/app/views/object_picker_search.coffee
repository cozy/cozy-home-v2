proxyclient = require 'lib/proxyclient'
BaseView    = require 'lib/base_view'


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
        @blocContainer=@panel.querySelector('.search-tab-container')
        @query      = undefined
        @input    = @panel.querySelector('.modal-search-input')

    getObject : () ->
        if @query
            return queryToFetch: @query
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
