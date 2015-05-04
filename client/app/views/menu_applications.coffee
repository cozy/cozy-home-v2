ViewCollection = require 'lib/view_collection'

module.exports = class AppsMenu extends ViewCollection

    el:'#menu-applications-container'
    itemView: require 'views/menu_application'
    template: require 'templates/menu_applications'


    constructor: (@collection) ->
        super

    appendView: (view) ->

