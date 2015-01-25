BaseView = require 'lib/base_view'
request = require 'lib/request'
ApplicationCollection = require '../collections/application'

module.exports = class UpdateStackModal extends BaseView
    id: 'market-popover-description-view'
    className: 'modal md-modal md-effect-1'
    tagName: 'div'
    template: require 'templates/update_stack_modal'


    events:
        'click #cancelbtn':'onCancelClicked'
        'click #confirmbtn':'onConfirmClicked'


    initialize: (options) ->
        super
        @confirmCallback = options.confirm
        @cancelCallback = options.cancel


    afterRender: ->
        @overlay = $ '.md-overlay'
        @overlay.click => @hide()
        @$('.step2').hide()


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


    onCancelClicked: ->
        @hide()
        @cancelCallback()


    onConfirmClicked: ->
        @confirmCallback()
        @$('.step1').hide()
        @$('.step2').show()
        @$('#confirmbtn').html "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
        @$('#confirmbtn').spin 'small', '#ffffff'
        @$('#cancelbtn').hide()
