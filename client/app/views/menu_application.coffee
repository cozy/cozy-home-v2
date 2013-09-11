BaseView = require 'lib/base_view'

module.exports = class ApplicationView extends BaseView

    tagName: 'div'
    className: 'menu-application clearfix'
    template: require 'templates/menu_application_item'

    events:
        'click a': 'onLinkClick'

    onLinkClick: =>
        @menu.hideAppList()
