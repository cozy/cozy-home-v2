ViewCollection = require 'lib/view_collection'

# View describing main screen for user once he is logged
module.exports = class ApplicationsListView extends ViewCollection
    id: 'applications-view'
    template: require 'templates/home'
    itemView: require 'views/home_application'

    ### Constructor ###

    events: ->
        'mouseenter .ui-resizable-handle': =>
            @gridster.disable()
        'mouseleave .ui-resizable-handle': =>
            @gridster.enable() if @state is 'edit'

    constructor: (apps) ->
        @apps = apps
        @state = 'view'
        super collection: apps

    initialize: =>
        super
        # onWindowResize when the user is done resizing
        $(window).on 'resize', _.debounce @onWindowResize, 300

    afterRender: =>
        @appList = @$ "#app-list"
        @closeEditBtn = @$ '#home-edit-close'

        @$("#no-app-message").hide()
        $(".menu-btn a").click (event) =>
            $(".menu-btn").removeClass 'active'
            $(event.target).closest('.menu-btn').addClass 'active'

        @initGridster()
        super
        @$('#home-edit-close').hide() if @state is 'view'

    checkIfEmpty: ->
        @$("#no-app-message").toggle @apps.size() is 0
        # and app.mainView.marketView.installedApps is 0

    computeGridDims: () ->
        # = $('#home-content').width()
        width = $(window).width()
        if width > 640 then width = width - 100
        else width = width - 65

        grid_margin = 12
        smallest_step = 130 + 2*grid_margin

        nbcol = Math.floor width / smallest_step
        nbcol = nbcol - nbcol % 2 if nbcol > 3 # 1,2,3,4,6,8,...
        grid_step = width / nbcol
        grid_size = grid_step - 2 * grid_margin
        return {nbcol, grid_size, grid_margin, grid_step}

    setMode: (mode) ->
        @state = mode
        if @state is 'edit'
            @gridster?.enable()
            @view.enable false for cid, view of @views
            @closeEditBtn.show()
        else
            @gridster?.disable()
            @view.enable true for cid, view of @views
            @closeEditBtn.hide()

    initGridster: ->
        {@colsNb, @grid_size, @grid_margin, @grid_step} = @computeGridDims()

        @appList.gridster
            min_cols: @colsNb
            max_cols: @colsNb
            max_size_x: @colsNb
            widget_selector: 'div.application'
            widget_margins: [@grid_margin, @grid_margin]
            widget_base_dimensions: [@grid_size, @grid_size]
            autogenerate_stylesheet: false
            draggable: stop: => setTimeout @saveChanges, 300
            serialize_params: (el, wgd) ->
                slug:  el.attr('id').replace 'app-btn-', ''
                col:   wgd.col
                row:   wgd.row
                sizex: wgd.size_x
                sizey: wgd.size_y

        @gridster = @appList.data('gridster')
        # @gridster.set_dom_grid_height()

        @gridster.generate_stylesheet cols: 16, rows: 16
        @gridster.disable() if @state is 'view'


    onWindowResize: =>
        oldNb = @colsNb
        {@colsNb, @grid_size, @grid_margin, @grid_step} = @computeGridDims()

        @gridster?.resize_widget_dimensions
            width: @colsNb * @grid_step
            styles_for: cols: 16, rows: 16
            widget_margins: [@grid_margin, @grid_margin]
            widget_base_dimensions: [@grid_size, @grid_size]

        # force redraw - change layout
        @onReset @collection if oldNb isnt @colsNb


    appendView: (view) ->

        pos = view.model.getHomePosition @colsNb
        pos ?= col: 1, row: 1, sizex: 1, sizey: 1 # default

        view.$el.resizable
            grid: [@grid_step, @grid_step]
            animate: false
            containment: @appList
            stop: (event, ui) => _.delay @doResize, 300,  view.$el

        @gridster.add_widget view.$el, pos.sizex, pos.sizey, pos.col, pos.row

        if @state is 'view'
            view.$el.resizable 'disable'
            view.enable false

    removeView: (view) ->
        @gridster.remove_widget view.$el, true
        super

    doResize: ($el) ->
        grid_w = Math.ceil $el.width() / @grid_step
        grid_h = Math.ceil $el.height() / @grid_step

        @gridster.resize_widget $el, grid_w, grid_h
        @gridster.set_dom_grid_height()

        # cleanup resizable element.style leftovers
        $el.height ''
        $el.width ''
        $el.css 'top', ''
        $el.css 'left', ''

        @saveChanges()

    saveChanges: () =>

        console.log "SAVE CHANGES"
        properties = ['col', 'row', 'sizex', 'sizey']

        items = @gridster.serialize()
        for newpos in items
            model = @apps.get newpos.slug
            delete newpos.slug
            view = @views[model.cid]
            oldpos = model.getHomePosition @colsNb
            console.log view.model.id, oldpos, newpos
            continue if _.isEqual oldpos, newpos

            # this object have changed
            console.log "SAVING !"
            view.model.saveHomePosition @colsNb, newpos