{BaseModel} = require 'lib/base_model'

# Describes a background selectable in account section.
module.exports = class Background extends BaseModel
    urlRoot: '/api/backgrounds/'


    # Get path to the background image (handle predefined background and
    # background added by the user).
    getSrc: ->
        id = @get 'id'
        if id.indexOf('background') > -1
            id = id.replace '-', '_'
            return "/img/backgrounds/#{id}.jpg"
        else
            return "/api/backgrounds/#{id}/picture.jpg"


    # Get path to the background image thumbnail (handle predefined background
    # and background added by the user).
    getThumbSrc: ->
        id = @get 'id'
        if id.indexOf('background') > -1
            id = id.replace '-', '_'
            return "/img/backgrounds/#{id}_th.png"
        else
            return "/api/backgrounds/#{id}/picture.jpg"


