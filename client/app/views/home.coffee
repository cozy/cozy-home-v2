ViewCollection = require 'lib/view_collection'

grid_size = 130
grid_margin = 12
grid_step = grid_margin + grid_size + grid_margin

# View describing main screen for user once he is logged
module.exports = class ApplicationsListView extends ViewCollection
    id: 'applications-view'
    template: require 'templates/home'
    itemView: require 'views/home_application'

    ### Constructor ###

    events: ->
        'mouseenter .ui-resizable-handle': => @gridster.disable()
        'mouseleave .ui-resizable-handle': => @gridster.enable()

    constructor: (apps) ->
        @apps = apps
        @state = 'layout'
        super collection: apps

    afterRender: =>
        @appList = @$ "#app-list"
        @appList.gridster
            min_cols: @computeColNumber()
            max_cols: @computeColNumber()
            widget_selector: 'div.application'
            widget_margins: [grid_margin, grid_margin]
            widget_base_dimensions: [grid_size, grid_size]
            draggable: stop: =>
                console.log "DRAG STOP", arguments
                setTimeout @saveChanges, 300
                return true
            serialize_params: (el, wgd) ->
                slug: el.attr('id').replace 'app-btn-', ''
                col: wgd.col
                row: wgd.row
                sizex: wgd.size_x
                sizey: wgd.size_y

        @gridster = @appList.data('gridster')

        # @machineInfos = @$(".machine-infos").hide()
        @$("#no-app-message").hide()
        $(".menu-btn a").click (event) =>
            $(".menu-btn").removeClass 'active'
            target = $(event.target).closest '.menu-btn'
            target.addClass 'active'

    displayNoAppMessage: ->
        @$("#no-app-message").toggle @apps.size() is 0
        # and app.mainView.marketView.installedApps is 0

    computeColNumber: ->
        nbcol = parseInt $('body').width()  / 160
        if      nbcol < 5 then 3
        else if nbcol < 8 then 5
        else 8

    appendView: (view) ->

        pos = view.model.getHomePosition @computeColNumber()
        pos ?= col: 1, row: 1, sizex: 1, sizey: 1 # default

        view.$el.resizable
            grid: [grid_step + grid_margin, grid_step + grid_margin]
            animate: false
            containment: @$el
            stop: (event, ui) =>
                setTimeout ( => @doResize view.$el ), 300

        @gridster.add_widget view.$el, pos.sizex, pos.sizey, pos.col, pos.row
        view.$el.hide().fadeIn()


    doResize: ($el) ->
        grid_w = Math.ceil $el.width() / grid_step
        grid_h = Math.ceil $el.height() / grid_step

        @gridster.resize_widget $el, grid_w, grid_h
        @gridster.set_dom_grid_height()

        # cleanup resizable element.style leftovers
        $el.height ''
        $el.width ''
        $el.css 'top', ''
        $el.css 'left', ''

        setTimeout @saveChanges, 300


    saveChanges: () =>

        console.log "SAVE CHANGES"
        properties = ['col', 'row', 'sizex', 'sizey']

        items = @gridster.serialize()
        for newpos in items
            model = @apps.get newpos.slug
            delete newpos.slug
            view = @views[model.cid]
            oldpos = model.getHomePosition @computeColNumber()
            console.log view.model.id, oldpos, newpos
            continue if _.isEqual oldpos, newpos

            # this object have changed
            console.log "SAVING !"
            view.model.saveHomePosition @computeColNumber(), newpos