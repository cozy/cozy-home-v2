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
            ,
                id: 'background-03'
                src: '/img/backgrounds/background_03_th.png'
                imgSrc: '/img/backgrounds/background_03.png'
            ,
                id: 'background-04'
                src: '/img/backgrounds/background_04_th.png'
                imgSrc: '/img/backgrounds/background_04.png'
            ,
                id: 'background-05'
                src: '/img/backgrounds/background_05_th.png'
                imgSrc: '/img/backgrounds/background_05.png'
            ,
                id: 'background-06'
                src: '/img/backgrounds/background_06_th.png'
                imgSrc: '/img/backgrounds/background_06.png'
            ,
                id: 'background-07'
                src: '/img/backgrounds/background_07_th.png'
                imgSrc: '/img/backgrounds/background_07.png'
            ,
                id: 'background-08'
                src: '/img/backgrounds/background_08_th.png'
                imgSrc: '/img/backgrounds/background_08.png'
        ]
