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
        @isLoading = true
        super collection: apps

    initialize: =>
        @listenTo @collection, 'request', => @isLoading = true
        @listenTo @collection, 'reset', => @isLoading = false

        super
        # onWindowResize when the user is done resizing
        $(window).on 'resize', _.debounce @onWindowResize, 300

    afterRender: =>
        @appList = @$ "#app-list"

        @$("#no-app-message").hide()
        $(".menu-btn a").click (event) =>
            $(".menu-btn").removeClass 'active'
            $(event.target).closest('.menu-btn').addClass 'active'

        @initGridster()
        super
        if @state is 'view'
            @gridster.disable()
            @view.enable() for cid, view of @views

    checkIfEmpty: ->
        noapps = @apps.size() is 0 and not @isLoading
        @$("#no-app-message").toggle noapps
        if noapps
            window.app.routers.main.navigate 'home/install', trigger: true

    computeGridDims: () ->
        width = $(window).width()
        if width > 640 then width = width - 100
        else width = width - 65

        grid_margin = 8
        smallest_step = 150 + 2 * grid_margin

        colsNb = Math.floor width / smallest_step
        colsNb = 3 if colsNb < 3
        colsNb = 6 if 5 <= colsNb <= 7
        colsNb = colsNb - colsNb % 3
        # colsNb in [3, 6, 9, 12]
        grid_step = width / colsNb

        # limit the grid cell size
        max_grid_step = 150
        grid_step = max_grid_step if grid_step > max_grid_step

        grid_size = grid_step - 2 * grid_margin

        return {colsNb, grid_size, grid_margin, grid_step}

    setMode: (mode) ->
        @state = mode

        if @state is 'edit'
            @gridster?.enable()
            view.disable() for cid, view of @views
        else
            @gridster?.disable()
            view.enable() for cid, view of @views

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
            resize: enabled: false

        @gridster = @appList.data('gridster')
        @gridster.set_dom_grid_height()
        @appList.width @colsNb * @grid_step

        @gridster.generate_stylesheet cols: 16, rows: 16

    onWindowResize: =>
        oldNb = @colsNb
        {@colsNb, @grid_size, @grid_margin, @grid_step} = @computeGridDims()

        if oldNb is @colsNb
            @resizeGridster()
        else
            @onReset []
            @gridster.$widgets = $ []
            @resizeGridster()
            @onReset @collection

    resizeGridster: =>
        @gridster?.resize_widget_dimensions
            width: @colsNb * @grid_step
            colsNb: @colsNb
            styles_for: cols: 16, rows: 16
            widget_margins: [@grid_margin, @grid_margin]
            widget_base_dimensions: [@grid_size, @grid_size]


    appendView: (view) ->
        pos = view.model.getHomePosition @colsNb
        pos ?= col: 0, row: 0, sizex: 1, sizey: 1 # default

        @gridster.add_widget view.$el, pos.sizex, pos.sizey, pos.col, pos.row

        # Somehow make the widget work immediately
        @gridster.resize_widget view.$el, pos.sizex, pos.sizey

        if @state is 'view' then view.enable()
        else view.disable()

    removeView: (view) ->
        @gridster.remove_widget view.$el, true
        super

    saveChanges: () =>
        properties = ['col', 'row', 'sizex', 'sizey']

        items = @gridster.serialize()
        for newpos in items
            model = @apps.get newpos.slug
            delete newpos.slug
            view = @views[model.cid]
            oldpos = model.getHomePosition @colsNb
            continue if _.isEqual oldpos, newpos
            # this object have changed

            # don't forget the widget informatoin
            newpos.useWidget = oldpos?.useWidget or false
            view.model.saveHomePosition @colsNb, newpos
