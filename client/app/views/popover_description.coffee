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
    className: 'modal'
    tagName: 'div'
    template: require 'templates/popover_description'

    events:
        'click #cancelbtn':'onCancelClicked'
        'click #confirmbtn':'onConfirmClicked'

    initialize: (options) ->
        super
        @confirmCallback = options.confirm
        @cancelCallback = options.cancel

    afterRender: () ->
        @model.set "description", ""
        @body = @$ ".modal-body"
        @model.getMetaData
            success: (data) ->
            error: () ->
                console.log "Error callback have been called"
        @listenTo @model, "change", @renderDescription

    renderDescription: () =>
        @body.html ""
        description = @model.get("description")
        console.debug @model
        if description is null
            descriptionDiv = $ "<div class='descriptionLine'> <h4> This application has no description </h4> </div>"
        else
            descriptionDiv = $ "<div class='descriptionLine'> <h4> Description </h4> <p> #{description} </p> </div>"
        @body.append descriptionDiv

    onCancelClicked: () =>
        @cancelCallback(@model)

    onConfirmClicked: () =>
        @confirmCallback(@model)








