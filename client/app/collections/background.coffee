BaseCollection = require 'lib/base_collection'
Background = require 'models/background'


# List of available backgrounds.
module.exports = class BackgroundCollection extends Backbone.Collection
    url: 'api/backgrounds'
    model: Background

    addPredefinedBackgrounds: ->
        @add [
                id: 'background-none'
                predefined: true
            ,
                id: 'background-01'
                predefined: true
            ,
                id: 'background-02'
                predefined: true
            ,
                id: 'background-03'
                predefined: true
            ,
                id: 'background-04'
                predefined: true
            ,
                id: 'background-05'
                predefined: true
            ,
                id: 'background-06'
                predefined: true
            ,
                id: 'background-07'
                predefined: true
            ,
                id: 'background-08'
                predefined: true
        ]

    init: ->
        @fetch
            success: (models) =>
                @addPredefinedBackgrounds()
                selected = @findWhere id: window.app.instance.background
                selected ?= @at 0
                selected.set 'selected': true if selected?
            error: ->

