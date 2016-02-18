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
        @$('.permission-changes').hide()
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


    # Display success message on modal.
    # Add information about application that requires a dedicated update
    # because of permission changes.
    onSuccess: (permissionChanges) ->
        @$('.step2').hide()
        @$('.success').show()
        @showPermissionsChanged permissionChanges
        @$('#ok').show()
        @$('#confirmbtn').hide()


    # Inform the user that an error occured during the update.
    # Add information about application that requires a dedicated update
    # because of permission changes.
    onError: (err, permissionChanges) ->
        @blocked = false
        @$('.step2').hide()
        @$('.error').show()
        @$('#ok').show()
        @$('#confirmbtn').hide()
        @showPermissionsChanged permissionChanges

        if err.data?.message? and err.data.message.length > 0
            infos = err.data.message
            if Object.keys(infos).length > 0
                @$(".stack-error").hide()
                html = "<ul>"
                for app of infos
                    html += """
                    <li class='app-broken'>#{app}</li>
                    """
                html += "</ul>"
                @body.append html
        else
            @$('.apps-error').hide()

        @endCallback false


    # Show the list of application that requires a dedicated update because
    # of application changes.
    showPermissionsChanged: (permissionChanges) ->
        if permissionChanges? and Object.keys(permissionChanges).length > 0
            html = "<ul>"
            for app of permissionChanges
                html += """
                <li class='app-changed'>#{app}</li>
                """
            html += "</ul>"
            @$('.permission-changes').append html
            @$('.permission-changes').show()


    # When the update is running, the modal cannot be closed. The user should
    # not be able to do anything until update is done.
    onClose: =>
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
        @$('#cancelbtn').addClass 'disabled'
        @confirmCallback()
        @blocked = true
        @$('.step1').hide()
        @$('.step2').show()
        @$('#confirmbtn').spin true

