# Base class generated by Brunch
class exports.BrunchApplication
    constructor: ->
        $ =>
            @initialize this

    initializeJQueryExtensions: ->
        $.fn.spin = (opts, color) ->
            presets =
                tiny:
                    lines: 8
                    length: 2
                    width: 2
                    radius: 3

                small:
                    lines: 8
                    length: 1
                    width: 2
                    radius: 4

                medium:
                    lines: 10
                    length: 4
                    width: 3
                    radius: 6

                large:
                    lines: 10
                    length: 8
                    width: 4
                    radius: 8

                extralarge:
                    lines: 8
                    length: 3
                    width: 10
                    radius: 20
                    top: 30
                    left: 50

            if Spinner?
                @each ->
                    $this = $(this)
                    spinner = $this.data("spinner")
                    if spinner?
                        spinner.stop()
                        $this.data "spinner", null
                    else if opts isnt false
                        if typeof opts is "string"
                            if opts of presets
                                opts = presets[opts]
                            else
                                opts = {}
                            opts.color = color    if color

                        spinner = new Spinner opts
                        spinner.spin(this)
                        $this.data "spinner", spinner

            else
                throw "Spinner class not available."
                null

        # Patch Gridster to allow resizing of the grid while running

        oldAST = $.Gridster.add_style_tag
        $.Gridster.add_style_tag = (css) ->
            tag.parentNode?.removeChild tag for tag in @$style_tags
            @$style_tags = $ []
            oldAST.apply this, arguments

        oldGST = $.Gridster.generate_stylesheets
        $.Gridster.generate_stylesheets = () ->
            $.Gridster.generated_stylesheets = []
            oldGST.apply this, arguments


        $.Gridster.resize_widget_dimensions = (options) ->

            if options.width
                @drag_api.$container.width options.width
                @container_width = options.width
                @options.container_width = options.width

            if options.colsNb
                @options.min_cols = options.colsNb
                @options.max_cols = options.colsNb

            @options.widget_margins = options.widget_margins if options.widget_margins
            @options.widget_base_dimensions = options.widget_base_dimensions if options.widget_base_dimensions

            @min_widget_width  = (@options.widget_margins[0] * 2) + @options.widget_base_dimensions[0]
            @min_widget_height = (@options.widget_margins[1] * 2) + @options.widget_base_dimensions[1]

            serializedGrid = @serialize()
            @$widgets.each $.proxy (i, widget) =>
                data = serializedGrid[i]
                @resize_widget $(widget), data.sizex, data.sizey

            @generate_grid_and_stylesheet()
            @get_widgets_from_DOM()

            @generate_stylesheet options.styles_for

            return false

    initialize: ->

# Select all content of an input field.
exports.selectAll = (input) ->
    input.setSelection(0, input.val().length)

# Change a string into its slug shape (only alphanumeric char and hyphens
# instead of spaces.
exports.slugify = (string) ->
    _slugify_strip_re = /[^\w\s-]/g
    _slugify_hyphenate_re = /[-\s]+/g
    string = string.replace(_slugify_strip_re, '').trim().toLowerCase()
    string = string.replace _slugify_hyphenate_re, '-'
    string

# Transform a todolist path into its regular expression shape.
exports.getPathRegExp = (path) ->
    slashReg = new RegExp "/", "g"
    "^#{path.replace(slashReg, "\/")}"