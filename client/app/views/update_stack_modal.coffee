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
        'click #ok':'onClose'


    initialize: (options) ->
        super
        @confirmCallback = options.confirm
        @cancelCallback = options.cancel
        @endCallback = options.end


    afterRender: ->
        @overlay = $ '.md-overlay'
        @overlay.click @onCancelClicked
        @$('.step2').hide()
        @$('.success').hide()
        @$('.error').hide()
        @$('#ok').hide()
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


    onSuccess: ->
        @$('.step2').hide()
        @$('.success').show()
        @$('#ok').show()
        @$('#confirmbtn').hide()


    onError: (err) ->
        @blocked = false
        @$('#cancelbtn').removeClass 'disabled'
        @$('.step2').hide()
        @$('.error').show()
        @$('#ok').show()
        @$('#confirmbtn').hide()
        @endCallback false
        err = JSON.parse err
        if Object.keys(err.message).length > 0
            appError = $ """
                <div class='app-broken'>
                    <h5> #{t('applications broken')}: </h5>
                </div>
            """
            @body.append appError
            for app in Object.keys(err.message)
                appError = $ """
                    <div class='app-broken'>
                        #{app}
                    </div>
                """
                @body.append appError


    # When the update is running, the modal cannot be closed. The user should
    # not be able to do anything until update is done.
    onClose: =>
        if @blocked
            alert t 'stack updating block message'
        else
            @hide()
            @endCallback true


    # When the update is running, the modal cannot be closed. The user should
    # not be able to do anything until update is done.
    onCancelClicked: =>
        if @blocked
            alert t 'stack updating block message'
        else
            @hide()
            @cancelCallback()


    onConfirmClicked: ->
        @confirmCallback()
        @blocked = true
        @$('.step1').hide()
        @$('.step2').show()
        @$('#confirmbtn').spin true
        @$('#cancelbtn').addClass 'disabled'

