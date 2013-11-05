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

    afterRender: ->
        @model.set "description", ""
        @body = @$ ".md-body"
        @header = @$ ".md-header h3"
        @header.html @model.get 'name'

        @body.spin 'small'
        renderDesc = =>
            @body.spin()
            @renderDescription()
        @model.getMetaData
            success: renderDesc
            error: renderDesc
        @overlay = $ '.md-overlay'
        @overlay.click =>
            @hide()

    renderDescription: =>
        @body.hide()
        @body.html ""

        @$('.repo-stars').html @model.get('stars')

        description = @model.get "description"
        @header.parent().append "<p class=\"line left\"> #{description} </p>"

        if Object.keys(@model.get("permissions")).length is 0
            permissionsDiv = $ "<div class='permissionsLine'> <h4>#{t('no specific permissions needed')} </h4> </div>"
            @body.append permissionsDiv
        else
            @body.append "<h4>#{t('required permissions')}</h4>"
            for docType, permission of @model.get("permissions")
                permissionsDiv = $ "<div class='permissionsLine'> <strong> #{docType} </strong> <p> #{permission.description} </p> </div>"
                @body.append permissionsDiv
        @body.slideDown()


    show: =>
        @$el.addClass 'md-show'
        @overlay.addClass 'md-show'
        $('#home-content').addClass 'md-open'
        setTimeout =>
            @$('.md-content').addClass 'md-show'
        , 300

    hide: =>
        $('.md-content').fadeOut =>
            @overlay.removeClass 'md-show'
            @$el.removeClass 'md-show'
            @remove()
        $('#home-content').removeClass 'md-open'

    onCancelClicked: () =>
        @hide()
        @cancelCallback(@model)

    onConfirmClicked: () =>
        @confirmCallback(@model)
