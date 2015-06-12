cozydb = require 'cozydb'
Jimp = require 'jimp'
fs = require 'fs'


# Model to handle background uploaded by the user.
module.exports = Background = cozydb.getModel 'Background',
    binary: cozydb.NoSchema


# Create background object and attach picture and thumb to it as binaries.
# expect image file path as argument
Background.createNew = (imagePath, callback) ->
    Background.create {}, (err, background) ->
        id = background.id

        # Resize background so it can suit with many resolutions.
        new Jimp imagePath, (err, image) ->

            image.resize 1920, 1200
            filePath = '/tmp/home-background.jpg'
            image.write filePath, (err) ->
                return callback err if err

                # Build thumbnail
                image.resize 300, 200
                thumbPath = '/tmp/home-thumb.jpg'
                image.write thumbPath, (err) ->
                    return callback err if err

                    # Attach images to background objects;
                    data = name: 'file'
                    Background.attachBinary id, filePath, data, (err) ->
                        return callback err if err

                        data = name: 'thumb'
                        Background.attachBinary id, thumbPath, data, (err) ->
                            return callback err if err

                            # Remove useless files
                            fs.unlink imagePath, ->
                                fs.unlink filePath, ->
                                    fs.unlink thumbPath, ->
                                        callback null, background

