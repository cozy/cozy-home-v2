cozydb = require 'cozydb'
im = require 'imagemagick'
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
        filePath = '/tmp/home-background.jpg'
        fileOptions =
            with: 1920
            height: 1200
            srcPath: imagePath
            dstPath: filePath
            progressive: true
        im.resize fileOptions, (err, stdout, stderr) ->
            return callback err if err

            # Build thumbnail
            thumbPath = '/tmp/home-thumb.jpg'
            thumbOptions =
                with: 300
                height: 200
                srcPath: imagePath
                dstPath: thumbPath
            im.resize thumbOptions, (err, stdout, stderr) ->
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

