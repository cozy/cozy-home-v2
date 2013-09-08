BaseView = require 'lib/base_view'

REPOREGEX =  /// ^
    (https?://)?                   #protocol
    ([\da-z\.-]+\.[a-z\.]{2,6})    #domain
    ([/\w \.-]*)*                  #path to repo
    (?:\.git)?                     #.git extension
    (@[\da-z/-]+)?                 #branch
     $ ///

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
        @body = @$ ".modal-body"
        @header = @$ ".modal-header h3"
        @header.html @model.get 'name'
        @model.getMetaData
            success: (data) ->
                @model.getPermissions
                    success: (data) =>
                        if not @model.hasChanged("permissions")
                            @confirmCallback(@model)
                    error: () =>
                        console.log "error have been called"

            error: ->
                console.log "Error callback have been called"
        @overlay = $ '.md-overlay'
        @overlay.click =>
            @hide()

    renderDescription: =>
        @body.html ""

        description = @model.get "description"
        if description is null
            descriptionDiv = $ "<div class='descriptionLine'> <h4> This application has no description </h4> </div>"
        else
            descriptionDiv = $ "<div class='descriptionLine'> <h4> Description </h4> <p> #{description} </p> </div>"
        @body.append descriptionDiv

    show: =>
        @$el.addClass 'md-show'
        @overlay.addClass 'md-show'
        $('#home-content').addClass 'md-open'
        setTimeout =>
            @$('.md-content').addClass 'md-show'
        , 300

    hide: =>
        @$el.removeClass 'md-show'
        @overlay.removeClass 'md-show'
        $('#home-content').removeClass 'md-open'

    onCancelClicked: () =>
        @hide()
        @cancelCallback(@model)

    onConfirmClicked: () =>
        @confirmCallback(@model)
