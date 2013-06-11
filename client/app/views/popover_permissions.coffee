BaseView = require 'lib/base_view'

REPOREGEX =  /// ^
    (https?://)?                   #protocol
    ([\da-z\.-]+\.[a-z\.]{2,6})    #domain
    ([/\w \.-]*)*                  #path to repo
    (?:\.git)?                     #.git extension
    (@[\da-z/-]+)?                 #branch
     $ ///

module.exports = class PopoverPermissionsView extends BaseView
    id: 'market-popover-view'
    className: 'modal'
    tagName: 'div'
    template: require 'templates/popover_permissions'

    events:
        'click #cancelbtn':'onCancelClicked'
        'click #confirmbtn':'onConfirmClicked'

    initialize: (options) ->
        super
        @confirmCallback = options.confirm
        @cancelCallback = options.cancel

    afterRender: () ->
        @body = @$ ".modal-body"
        @model.getPermissions
            success: (data) =>
                if not @model.hasChanged("permissions")
                    @confirmCallback(@model)
            error: () =>
                console.log "error have been called"
        @listenTo @model, "change:permissions", @renderPermissions 

    renderPermissions: () =>
        @body.html ""
        if Object.keys(@model.get("permissions")).length is 0
            permissionsDiv = $ "<div class='permissionsLine'> <h4> This application does not need specific permissions </h4> </div>" 
            @body.append permissionsDiv 
        else
            for docType, permission of @model.get("permissions")
                permissionsDiv = $ "<div class='permissionsLine'> <h4> #{docType} </h4> <p> #{permission.description} </p> </div>" 
                @body.append permissionsDiv

    onCancelClicked: () =>
        @cancelCallback(@model)

    onConfirmClicked: () =>
        @confirmCallback(@model)








