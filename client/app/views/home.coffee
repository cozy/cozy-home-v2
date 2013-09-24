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

    afterRender: =>
        @appList = @$ "#app-list"

        # @machineInfos = @$(".machine-infos").hide()
        @$("#no-app-message").hide()
        $(".menu-btn a").click (event) =>
            $(".menu-btn").removeClass 'active'
            target = $(event.target).closest '.menu-btn'
            target.addClass 'active'

        @initGridster()

    displayNoAppMessage: ->
        @$("#no-app-message").toggle @apps.size() is 0
        # and app.mainView.marketView.installedApps is 0

    computeColNumber: ->
        nbcol = parseInt $(document.body).width()  / 160
        return if nbcol < 6 then 2 else 6
        # @TODO : change me a l'usage

    computeGridDims: (cols) ->
        step = $('#home-content').width() / cols
        grid_size = step - 24
        grid_margin = 12
        grid_step = grid_margin + grid_size + grid_margin
        return {grid_size, grid_margin, grid_step}

    setMode: (mode) ->
        @state = mode
        if @state is 'edit'
            @gridster?.enable()
            @$('.application').resizable('enable')
            @$('.widget-mask').show()
            @$('#home-edit-close').show()
        else
            @gridster?.disable()
            @$('.application').resizable('disable')
            @$('.widget-mask').hide()
            @$('#home-edit-close').hide()

    initGridster: ->
        @colsNb = @computeColNumber()
        {@grid_size, @grid_margin, @grid_step} = @computeGridDims @colsNb

        @appList.gridster
            min_cols: @colsNb
            max_cols: @colsNb
            max_size_x: @colsNb
            widget_selector: 'div.application'
            widget_margins: [@grid_margin, @grid_margin]
            widget_base_dimensions: [@grid_size, @grid_size]
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

        # width = @colsNb * @grid_step
        # @appList.width width

        @gridster = @appList.data('gridster')

        if @state is 'view'
            @gridster.disable()
            @$('#home-edit-close').hide()

        $(window).on 'resize', _.debounce @onWindowResize

    onWindowResize: =>
        oldNb = @colsNb
        # @colsNb = @computeColNumber()
        {@grid_size, @grid_margin, @grid_step} = @computeGridDims @colsNb

        # if oldNb isnt @colsNb
        #     for cid, view of @views
        #         @gridster.remove_widget view.$el, true,

        @gridster.resize_widget_dimensions
            widget_margins: [@grid_margin, @grid_margin]
            widget_base_dimensions: [@grid_size, @grid_size]

        # if oldNb is @colsNb
        #     @appendView view for cid, view of @views


        # width = @colsNb * @grid_step
        # @appList.width width

    appendView: (view) ->

        pos = view.model.getHomePosition @computeColNumber()
        pos ?= col: 1, row: 1, sizex: 1, sizey: 1 # default

        view.$el.resizable
            grid: [@grid_step, @grid_step]
            animate: false
            containment: @appList
            stop: (event, ui) =>
                setTimeout ( => @doResize view.$el ), 300

        @gridster.add_widget view.$el, pos.sizex, pos.sizey, pos.col, pos.row
        view.$el.show()
        # view.$el.hide().fadeIn()

        if @state is 'view'
            view.$el.find('.widget-mask').hide()

    removeItem: (model) ->
        @gridster.remove_widget @views[model.cid]
        super

    doResize: ($el) ->
        grid_w = Math.ceil $el.width() / @grid_step
        grid_h = Math.ceil $el.height() / @grid_step

        console.log "doResize", $el, grid_h, grid_w

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