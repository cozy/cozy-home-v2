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
        @body = @$ ".modal-body"
        @model.getDescription
            success: (data) =>
            error: () =>
                console.log "error have been called"
        @listenTo @model, "change:description", @renderDescription

    renderDescription: () =>
        @body.html ""
        description = @model.get("description")
        descriptionDiv = $ "<div class='descriptionLine'> <h4> Description </h4> <p> #{description} </p> </div>" 
        @body.append descriptionDiv

    onCancelClicked: () =>
        @cancelCallback(@model)

    onConfirmClicked: () =>
        @confirmCallback(@model)








