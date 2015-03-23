# Small widget used to changed installatio button style easily
module.exports = class ColorButton

    constructor: (@button) ->
        @label = @button.find '.label' or @button

    displayGrey: (text) ->
        @button.show()
        @label.html text
        @button.removeClass "btn-red"
        @button.removeClass "btn-green"
        @button.removeClass "btn-orange"


    displayOrange: (text) ->
        @button.show()
        @label.html text
        @button.removeClass "btn-red"
        @button.removeClass "btn-green"
        @button.addClass "btn-orange"

    displayGreen: (text) ->
        @button.show()
        @label.html text
        @button.addClass "btn-green"
        @button.removeClass "btn-red"
        @button.removeClass "btn-orange"

    displayRed: (text) ->
        @button.show()
        @label.html text
        @button.removeClass "btn-green"
        @button.addClass  "btn-red"
        @button.removeClass "btn-orange"

    hide: ->
        @button.hide()

    show: ->
        @button.show()

    isGreen: ->
        @button.hasClass "btn-green"

    spin: (toggle, color) ->
        if toggle then @button.spin "small", color
        else @button.spin false

    isHidden: ->
        return not @button.is(":visible")


