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
        @model.set "permissions", ""
        @body = @$ ".md-body"
        @body.spin 'small'
        @model.getPermissions
            success: (data) =>
                if not @model.hasChanged("permissions")
                    @confirmCallback(@model)
            error: () =>
        @listenTo @model, "change:permissions", @renderPermissions

    renderPermissions: () =>
        @body.hide()
        @body.html ''
        if Object.keys(@model.get("permissions")).length is 0
            permissionsDiv = $ "<div class='permissionsLine'> <strong>#{t('no specific permissions needed')} </strong> </div>"
            @body.append permissionsDiv
        else
            for docType, permission of @model.get("permissions")
                permissionsDiv = $ "<div class='permissionsLine'> <strong> #{docType} </strong> <p> #{permission.description} </p> </div>"
                @body.append permissionsDiv
        @body.slideDown()

    onCancelClicked: () =>
        @$el.slideUp =>
            @cancelCallback(@model)

    onConfirmClicked: () =>
        @$el.slideUp =>
            @confirmCallback(@model)
