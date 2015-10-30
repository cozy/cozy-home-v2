# async = require 'async'
# fs = require 'fs'
# qs = require 'qs'
# multiparty = require 'multiparty'
# path = require 'path'
# os = require 'os'
Photo               = require '../models/photo'
# thumbHelpers      = require '../helpers/thumb'
# photoHelpers      = require '../helpers/photo'
# sharing           = require './sharing'
downloader          = require '../helpers/downloader'
# {NotFound, NotAllowed} = require '../helpers/errors'


app = null

module.exports.setApp = (ref) -> app = ref

# Get given photo, returns 404 if photo is not found.
module.exports.fetch = (req, res, next, id) ->
    id = id.substring 0, id.length - 4 if id.indexOf('.jpg') > 0
    Photo.find id, (err, photo) ->
        if err
            next err
        else if not photo
            next NotFound "Photo #{id}"

        else
            req.photo = photo
            next()

# # Create a photo and save file, thumb and scree image as attachments of the
# # photo document.
# module.exports.create = (req, res, next) =>
#     cid = null
#     lastPercent = 0
#     files = {}
#     isAllowed = not req.public


#     # unlink all files in req.files
#     cleanup = ->
#         async.each req.files, (file, cb) ->
#             fs.unlink file.path, (err) ->
#                 console.log 'Could not delete %s', file.path if err
#                 cb null # loop anyway
#         , -> # do nothing

#     # Parse given form to extract image blobs.
#     form = new multiparty.Form
#         uploadDir: path.join os.tmpdir(), 'uploads'
#         defer: true # don't wait for full form. Needed for progress events
#         keepExtensions: true
#         maxFieldsSize: 10 * 1024 * 1024
#     form.parse req

#     # Get fields from form.
#     form.on 'field', (name, value) ->
#         req.body[name] = value
#         if name is 'cid' then cid = value
#         else if name is 'albumid' and req.public
#             albumid = value
#             sharing.checkPermissionsPhoto {albumid}, 'w', req, (err, ok) ->
#                 isAllowed = ok

#     # Get files from form.
#     form.on 'file', (name, val) ->
#         val.name = val.originalFilename
#         val.type = val.headers['content-type'] or null
#         files[name] = val

#     # Get progress to display it to the user. Data are sent via websocket.
#     form.on 'progress', (bytesReceived, bytesExpected) ->
#         return unless cid?
#         percent = bytesReceived/bytesExpected
#         return unless percent - lastPercent > 0.05

#         lastPercent = percent
#         app.io.sockets.emit 'uploadprogress', cid: cid, p: percent

#     form.on 'error', (err) ->
#         return next err if err.message isnt "Request aborted"

#     # When form is fully parsed, data are saved into CouchDB.
#     form.on 'close', ->
#         req.files = qs.parse files
#         raw = req.files['raw']

#         # cleanup & 401
#         unless isAllowed
#             cleanup()
#             return next NotAllowed()


#         thumbHelpers.readMetadata raw.path, (err, metadata) ->
#             if err?
#                 console.log "[Create photo - Exif metadata extraction]"
#                 console.log "Are you sure imagemagick is installed ?"
#                 next err
#             else
#                 # Add date and orientation from EXIF data.
#                 req.body.orientation = 1
#                 if metadata?.exif?.orientation?
#                     orientation = metadata.exif.orientation
#                     req.body.orientation = \
#                         photoHelpers.getOrientation orientation

#                 if metadata?.exif?.dateTime?
#                     req.body.date = metadata.exif.dateTime

#             photo = new Photo req.body

#             Photo.create photo, (err, photo) ->
#                 return next err if err

#                 async.series [
#                     (cb) ->
#                         raw = req.files['raw']
#                         data = name: 'raw', type: raw.type
#                         photo.attachBinary raw.path, data, cb
#                     (cb) ->
#                         screen = req.files['screen']
#                         data = name: 'screen', type: screen.type
#                         photo.attachBinary screen.path, data, cb
#                     (cb) ->
#                         thumb = req.files['thumb']
#                         data = name: 'thumb', type: thumb.type
#                         photo.attachBinary thumb.path, data, cb
#                 ], (err) ->
#                     cleanup()

#                     if err
#                         return next err
#                     else
#                         res.status(201).send photo


doPipe = (req, which, download, res, next) ->

    # sharing.checkPermissionsPhoto req.photo, 'r', req, (err, isAllowed) ->

        # if err or not isAllowed
        #     return next NotAllowed()

    if download
        disposition = 'attachment; filename=' + req.photo.title
        res.setHeader 'Content-disposition', disposition


    # support both old style _attachment photo and new style binary photo
    onError = (err) -> next err if err

    if req.photo._attachments?[which]
        binaryPath = "/data/#{req.photo.id}/attachments/#{which}"
        request = downloader.download binaryPath, (stream) ->
            if stream.statusCode is 200
                res.on 'close', -> request.abort()
                stream.pipe res
            else
                return res.sendfile './server/img/error.gif'

    else if req.photo.binary?[which]
        binaryPath = "/data/#{req.photo.id}/binaries/#{which}"
        request = downloader.download binaryPath, (stream) ->
            if stream.statusCode is 200
                res.on 'close', -> request.abort()
                stream.pipe res
            else
                return res.sendfile './server/img/error.gif'

    else
        return res.sendfile './server/img/error.gif'

        # This is a temporary hack to allow caching
        # ideally, we would do as follow :
        # stream.headers['If-None-Match'] = req.headers['if-none-match']
        # but couchdb goes 500 (COUCHDB-1697 ?)
        # stream.pipefilter = (couchres, myres) ->
        #     if couchres.headers.etag is req.headers['if-none-match']
        #         myres.send 304



# # Get mid-size version of the picture
# module.exports.screen = (req, res, next) ->
#     # very old photo might not have a screen-size version
#     which = if req.photo._attachments?.screen then 'screen'
#     else if req.photo.binary?.screen then 'screen'
#     else 'raw'
#     doPipe req, which, false, res, next

# Get a small size of the picture.
module.exports.thumb = (req, res, next) ->
    doPipe req, 'thumb', false, res, next

# Get raw version of the picture (file orginally sent).
module.exports.raw = (req, res, next) ->
    which = if req.photo._attachments?.raw then 'raw'
    else if req.photo.binary?.raw then 'raw'
    else if req.photo.binary?.file then 'file'
    else 'file'
    doPipe req, which, true, res, next

# module.exports.update = (req, res, next) ->
#     req.photo.updateAttributes req.body, (err) ->
#         return next err if err
#         res.send req.photo

# module.exports.delete = (req, res, next) ->
#     req.photo.destroyWithBinary (err) ->
#         return next err if err
#         res.send success: "Deletion succeded."


# # Thumbs can change a lot depending on UI. If a change occurs, previously
# # built thumbnails doesn't fit anymore with the new style. So this route
# # allows to update the thumbnail for a given picture.
# module.exports.updateThumb = (req, res, next) ->
#     files = {}
#     form = new multiparty.Form
#         uploadDir: __dirname + '../../uploads'
#         defer: true # don't wait for full form. Needed for progress events
#         keepExtensions: true
#         maxFieldsSize: 10 * 1024 * 1024

#     form.parse req

#     # Get file from form.
#     form.on 'file', (name, val) ->
#         val.name = val.originalFilename
#         val.type = val.headers['content-type'] or null
#         files[name] = val

#     form.on 'error', (err) ->
#         next err

#     # When form is fully parsed, save the sent thumbnailS as attachment.
#     form.on 'close', ->
#         req.files = qs.parse files
#         thumb = req.files['thumb']
#         data = name: 'thumb', type: thumb.type

#         req.photo.attachFile thumb.path, data, (err) ->
#             return next err if err

#             fs.unlink thumb.path, (err) ->
#                 return next err if err
#                 res.send success: true
