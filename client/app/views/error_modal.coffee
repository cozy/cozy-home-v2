BaseView = require 'lib/base_view'

module.exports = class UpdateStackModal extends BaseView
    id: 'market-popover-description-view'
    className: 'modal md-modal md-effect-1'
    tagName: 'div'
    template: require 'templates/error_modal'

    events:
        'click #more':'onMore'
        'click #ok':'onClose'

    initialize: (options) ->
        @errortype = options.errortype
        @details = options.details
        super
        $('body').keyup(@onKeyStroke)

    getRenderData: ->
        errortype: @errortype
        details: @details

    afterRender: ->
        @overlay = $ '.md-overlay'
        @overlay.click => @hide()
        @$('.details').hide()
        @body = @$ ".md-body"

    handleContentHeight: ->
        @body.css 'max-height', "#{$(window).height() / 2}px"
        $(window).on 'resize', =>
            @body.css 'max-height', "#{$(window).height() / 2}px"

    show: ->
        @$el.addClass 'md-show'
        @overlay.addClass 'md-show'
        $('#home-content').addClass 'md-open'
        setTimeout =>
            @$('.md-content').addClass 'md-show'
        , 300

    hide: ->
        $('.md-content').fadeOut =>
            @overlay.removeClass 'md-show'
            @$el.removeClass 'md-show'
            @remove()
        $('#home-content').removeClass 'md-open'

    onClose: ->
        @hide()

    onKeyStroke: (e) =>
        e.stopPropagation()
        if e.which in [13, 27]
            @onClose()

    onMore: ->
        if @$('.details').css('display') is 'none'
            @$('.details').show()
        else
            @$('.details').hide()