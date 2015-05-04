BaseCollection = require 'lib/base_collection'
Application = require 'models/background'


# List of available background. Currently the list is hardcoded.
module.exports = class BackgroundCollection extends BaseCollection

    model: Application

    init: ->
        @add [
                id: 'background-none'
                src: '/img/backgrounds/background_none_th.png'
                imgSrc: '/img/backgrounds/background_none.png'
                selected: true
            ,
                id: 'background-01'
                src: '/img/backgrounds/background_01_th.png'
                imgSrc: '/img/backgrounds/background_01.png'
            ,
                id: 'background-02'
                src: '/img/backgrounds/background_02_th.png'
                imgSrc: '/img/backgrounds/background_02.png'
        ]
