request = require('../lib/request')

# A photo
# maintains attributes src / thumbsrc depending of the state of the model
module.exports = class Photo extends Backbone.Model

    defaults: ()->
        thumbsrc: 'img/loading.gif'
        src: ''
        orientation: 1


    url: ()->
        super + app.urlKey


    # build img src attributes from id.
    parse: (attrs) ->
        if not attrs.id then attrs
        else _.extend attrs,
            thumbsrc: "photos/thumbs/#{attrs.id}.jpg" + app.urlKey
            src: "photos/#{attrs.id}.jpg" + app.urlKey
            orientation: attrs.orientation


    # Return screen size photo src built from id.
    getPrevSrc: ()->
        "photos/#{@get 'id'}.jpg"


Photo.getMonthdistribution = (callback)->
    request.get "files/photo/monthdistribution", callback


Photo.listFromFiles = (skip, limit, callback)->
    request.get "files/photo/range/#{skip}/#{limit}", callback


Photo.makeFromFile = (fileid, attr, callback) ->
    request.post "files/#{fileid}/toPhoto", attr, callback

