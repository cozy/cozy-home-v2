module.exports = class ColorPickerHandler extends Backbone.View

    currentSelectedField: null

    constructor: (options) ->
        @targetFields = options.targetFields
        @colorPicker = options.colorPicker

        super()

    initialize: ->

        # prevent user from writing in the input
        @targetFields.focus -> @blur()

        @defaultColors =
            background: '#fcf9f5'
            button: '#f7f4f0'
            buttonHover: '#f1e2cf'
            invertedColor: '#000'

        @reset()

        # select an input
        @targetFields.click (event) =>

            event.stopPropagation() # prevent the picker from closing

            if @currentSelectedField is event.currentTarget
                @colorPicker.hide()
                # show the other custom elements again
                $('.application').removeClass 'ui-resizable-disabled'
                @currentSelectedField = null
            else
                farb = $.farbtastic @colorPicker

                # compute picker's default color to selected form's value
                currentColor = $(event.currentTarget).css 'background-color'
                rgb = currentColor.match /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/
                hexColor = farb.pack [rgb[1]/255, rgb[2]/255, rgb[3]/255]

                @colorPicker.show()
                # hide the other custom elements
                $('.application').addClass 'ui-resizable-disabled'

                @currentSelectedField = event.target
                offset = $(event.target).offset()
                offset.top = 5
                offset.left += 25
                @colorPicker.offset offset
                farb.setColor hexColor

        # when the user picks a color
        @colorPicker.farbtastic (color) =>
            inputName = $(@currentSelectedField).attr 'name'

            if inputName is "background-color"
                @currentColors.background = color
                @currentColors.invertedColor = @getInvertedColor color
            else if inputName is "button-color"
                @currentColors.button = color
            else if inputName is "button-hover-color"
                @currentColors.buttonHover = color
            else
                console.log "wrong field"

            @injectCss()

        # close the picker when the user clicks anywhere in the page
        #$()
        $(window).click (event) =>

            unless event.target is $('.h-marker.marker')[0] \
                   or event.target is $('.wheel')[0]
                @currentSelectedField = null
                $('.application').removeClass 'ui-resizable-disabled'
                @colorPicker.hide()

    getInvertedColor: (color) ->
        farb = $.farbtastic @colorPicker
        colors = farb.unpack color
        a = 1 - (0.299 * colors[0] + 0.587 * colors[1] + 0.114 * colors[2])
        invertedColor = if a < 0.5 then '#000' else '#fff'
        return invertedColor

    reset: ->
        @currentColors = _.clone @defaultColors
        @injectCss()

    setCurrentColors: (userPreference) ->
        backgroundColor = userPreference.get('backgroundColor') \
                          or @defaultColors.background
        @currentColors =
            background: backgroundColor
            button: userPreference.get('buttonColor') \
                    or @defaultColors.background
            buttonHover: userPreference.get('buttonHoverColor') \
                         or @defaultColors.background
            invertedColor: @getInvertedColor backgroundColor

    injectCss: ->
        css = """
            body, input[name="background-color"] {
                background-color: #{@currentColors.background};
            }

            .application, input[name="button-color"] {
                background-color: #{@currentColors.button}
            }
            .application:hover,
            #home-menu .menu-btn:hover,
            input[name="button-hover-color"] {
                background-color: #{@currentColors.buttonHover}
            }
            input[name="background-color"],
            input[name="button-color"],
            input[name="button-hover-color"] {
                border: 1px solid #{@currentColors.invertedColor} !important
            }
        """
        $('head style#cozy-custom-style').remove()
        $('head').append $ "<style id='cozy-custom-style'>#{css}</style>"
