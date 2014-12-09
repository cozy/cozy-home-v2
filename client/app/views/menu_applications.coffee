ViewCollection = require 'lib/view_collection'

module.exports = class AppsMenu extends ViewCollection

    el:'#menu-applications-container'
    itemView: require 'views/menu_application'
    template: require 'templates/menu_applications'

    events:
        "click #menu-applications-toggle": "showAppList"
        "click .clickcatcher": "hideAppList"
        "click #home-btn": "hideAppList"

    constructor: (@collection) ->
        super

    appendView: (view) ->
        @appList.append view.$el
        view.menu = @

    afterRender: =>
        @clickcatcher = @$ '.clickcatcher'
        @clickcatcher.hide()
        @appList  = @$ '#menu-applications'
        super

        @initializing = true

        $(window).on 'click', @windowClicked

    remove: =>
        $(window).off 'click', @hideAppList
        super

    windowClicked: =>
        if event? and @$el.has($(event.target)).length is 0
            @hideAppList()

    showAppList: =>
        if @appList.is ':visible'
            @appList.hide()
            @clickcatcher.hide()
            @$el.removeClass 'active'
        else
            if @collection.size() > 0
                @$('#no-app-message').hide()
            else
                @$('#no-app-message').show()
            @$el.addClass 'active'
            @appList.slideDown 100
            @clickcatcher.show()

    dismissAll: ->
        @collection.removeAll()

    hideAppList: (event) =>
        @appList.slideUp 100
        @clickcatcher.hide()
        @$el.removeClass 'active'
