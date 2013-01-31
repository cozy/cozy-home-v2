# Small widget used to changed installatio button style easily
module.exports = class InstallButton

    constructor: (@button) ->

    displayOrange: (text) ->
        @button.html text
        @button.removeClass "btn-red"
        @button.removeClass "btn-green"
        @button.addClass "btn-orange"

    displayGreen: (text) ->
        @button.html text
        @button.addClass "btn-green"
        @button.removeClass "btn-red"
        @button.removeClass "btn-orange"

    displayRed: (text) ->
        @button.html text
        @button.removeClass "btn-green"
        @button.addClass  "btn-red"
        @button.removeClass "btn-orange"

    isGreen: ->
        @button.hasClass "btn-green"

    spin: ->
        @button.spin "small"

    hideParent: ->
        @button.parent().parent().hide()

    showParent: ->
        @button.parent().parent().show()

    isHidden: ->
        return not @button.is(":visible")


