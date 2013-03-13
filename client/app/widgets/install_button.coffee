# Small widget used to changed installatio button style easily
module.exports = class ColorButton

    constructor: (@button) ->

    displayGrey: (text) ->
        @button.show()
        @button.html text
        @button.removeClass "btn-red"
        @button.removeClass "btn-green"
        @button.removeClass "btn-orange"


    displayOrange: (text) ->
        @button.show()
        @button.html text
        @button.removeClass "btn-red"
        @button.removeClass "btn-green"
        @button.addClass "btn-orange"

    displayGreen: (text) ->
        @button.show()
        @button.html text
        @button.addClass "btn-green"
        @button.removeClass "btn-red"
        @button.removeClass "btn-orange"

    displayRed: (text) ->
        @button.show()
        @button.html text
        @button.removeClass "btn-green"
        @button.addClass  "btn-red"
        @button.removeClass "btn-orange"

    hide: ->
        @button.hide()

    isGreen: ->
        @button.hasClass "btn-green"

    spin: ->
        @button.spin "small"

#    hideParent: ->
#        @button.parent().parent().hide()

#    showParent: ->
#        @button.parent().parent().show()

    isHidden: ->
        return not @button.is(":visible")


