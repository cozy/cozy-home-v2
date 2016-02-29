BaseView = require 'lib/base_view'

module.exports = class ErrorModal extends BaseView
    id: 'market-popover-description-view'
    className: 'modal md-modal md-effect-1'
    tagName: 'div'
    template: require 'templates/error_modal'

    events:
        'click #more':'onMore'
        'click #ok':'onConfirm'
        'click #cancelbtn':'onClose'

    initialize: (options) ->
        @errortype = options.errortype
        @details = options.details
        @confirmCallback = options.onConfirm or ->
        @ok = options.confirm or t('ok')
        @cancel = options.cancel or false
        super
        $('body').keyup(@onKeyStroke)

    getRenderData: ->
        errortype: @errortype
        details: @details
        ok: @ok
        cancel: @cancel

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

    onConfirm: ->
        @hide()
        @confirmCallback()

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
