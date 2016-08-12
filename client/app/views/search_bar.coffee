BaseView = require 'lib/base_view'

module.exports = class SearchBarView extends BaseView

    el:'.navbar'

    events:
        "keyup #search-bar": "handleSubmit"
        'click #search-bar': "onSearchClick"

    onSearchClick: (e) ->
        # select automatically the value when click on the search bar
        e.target.select()

    searchWebQwant: (e) ->
        # do the web search qwant
        if e.keyCode and e.keyCode is 13
            # get the query
            query = encodeURIComponent(e.target.value)
            # do the intent
            intent =
                action: 'goto'
                params: "qwant/search/web/#{query}"
            window.postMessage(intent, window.location.origin)

    handleSubmit: (e) ->
        @searchWebQwant e

    constructor: () ->

        super

    appendView: (view) ->
