BaseView = require 'lib/base_view'


# Line displayed in the notification list.
module.exports = class NotificationView extends BaseView

    tagName: 'li'
    className: 'notification clearfix'
    template: require 'templates/notification'
    events:
        "click .doaction": "onActionClicked"
        "click .dismiss" : "onDismissClicked"


    # Add action text related to action fired by action url given in the model.
    # Add a date field that aims to display the publication date.
    getRenderData: ->
        model: _.extend @model.attributes,
            actionText: @actionText or null
            date: moment(parseInt @model.get 'publishDate').fromNow()


    # On initialize, it:
    # * Add a listener to rerender on model change.
    # * Prepare the action text depending on the URL.
    initialize: ->
        @listenTo @model, 'change', @render
        action = @model.get 'resource'

        if action?

            if action.app? and action.app isnt 'home'
                @actionText = 'notification open application'

            else if action.url?

                if action.url.indexOf('update-stack') >= 0
                    @actionText = 'notification update stack'

                else if action.url.indexOf('update') >= 0
                    @actionText = 'notification update application'


    # Depending on given parameters for action, it builds the correct URL to
    # navigate on when the action button is clicked.
    onActionClicked: ->
        action = @model.get 'resource'

        unless action?
            action = app: home

        if typeof action is 'string'
            url = action

        else if action.app?
            # .replace is a quickfix
            url = if action.app is 'home' then "/" else "/apps/#{action.app}/"
            url += action.url or ''
            url = url.replace '//', '/'
            $('.right-menu').hide()

        else
            url = null

        window.app.routers.main.navigate url, true if url


    # Destroy current model.
    onDismissClicked: (event) ->
        event?.preventDefault()
        event?.stopPropagation()
        @model.destroy()
