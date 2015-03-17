BaseView = require 'lib/base_view'
request = require 'lib/request'

module.exports = class PopoverDescriptionView extends BaseView
    id: 'market-popover-description-view'
    className: 'modal md-modal md-effect-1'
    tagName: 'div'
    template: require 'templates/popover_description'

    events:
        'click #cancelbtn':'onCancelClicked'
        'click #confirmbtn':'onConfirmClicked'

    initialize: (options) ->
        super
        @confirmCallback = options.confirm
        @cancelCallback = options.cancel
        @label = if options.label? then options.label else t 'install'
        @$("#confirmbtn").html @label


    afterRender: ->
        @model.set "description", ""
        @body = @$ ".md-body"
        @header = @$ ".md-header h3"
        @header.html @model.get 'name'

        @body.addClass 'loading'
        @body.html t('please wait data retrieval') + '<div class="spinner-container" />'
        @body.find('.spinner-container').spin 'small'
        @model.getMetaData
            success: =>
                @body.removeClass 'loading'
                @renderDescription()
            error: (error) =>
                @body.removeClass 'loading'
                @body.addClass 'error'
                if error.responseText.indexOf('Not Found') isnt -1
                    @body.html t 'package.json not found'
                else
                    @body.html t 'error connectivity issue'

        @overlay = $ '.md-overlay'
        @overlay.click =>
            @hide()

    renderDescription: =>

        @body.html ""

        @$('.repo-stars').html @model.get('stars')

        description = @model.get "description"
        @header.parent().append "<p class=\"line left\"> #{description} </p>"

        if Object.keys(@model.get("permissions")).length is 0
            permissionsDiv = $ """
                <div class='permissionsLine'>
                    <h4>#{t('no specific permissions needed')} </h4>
                </div>
            """
            @body.append permissionsDiv
        else
            @body.append "<h4>#{t('required permissions')}</h4>"
            for docType, permission of @model.get("permissions")
                permissionsDiv = $ "<div class='permissionsLine'> <strong> #{docType} </strong> <p> #{permission.description} </p> </div>"
                @body.append permissionsDiv

        @handleContentHeight()
        @body.slideDown()
        @body.niceScroll() # must be done in the end to avoid weird render

    handleContentHeight: ->
        @body.css 'max-height', "#{$(window).height() / 2}px"
        $(window).on 'resize', =>
            @body.css 'max-height', "#{$(window).height() / 2}px"


    show: =>
        @$el.addClass 'md-show'
        @overlay.addClass 'md-show'
        $('#home-content').addClass 'md-open'
        setTimeout =>
            @$('.md-content').addClass 'md-show'
        , 300
        document.addEventListener 'keydown', @onCancelClicked

    hide: =>
        @body.getNiceScroll().hide()
        $('.md-content').fadeOut =>
            @overlay.removeClass 'md-show'
            @$el.removeClass 'md-show'
            @remove()
        $('#home-content').removeClass 'md-open'
        document.removeEventListener 'keydown', @onCancelClicked

    onCancelClicked: (event) =>
        return if event.keyCode? and event.keyCode isnt 27
        @hide()
        @cancelCallback(@model)

    onConfirmClicked: () =>
        @confirmCallback(@model)
