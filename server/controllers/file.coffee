File            = require '../models/file'
#onThumbCreation = require('../../init').onThumbCreation
fs              = require('fs')

###*
 * Get given file, returns 404 if photo is not found.
###
module.exports.fetch = (req, res, next, id) ->
    id = id.substring 0, id.length - 4 if id.indexOf('.jpg') > 0
    File.find id, (err, file) ->
        if err
            return res.error 500, 'An error occured', err
        if not file
            console.log 'not file in fetch id'
            console.log id
            # console.log req
            return res.error 404, localizationManager.t 'File not found'

        req.file = file
        next()

###*
 * Returns a list of n photo (from newest to oldest )
 * skip : the number of the first photo of the view not to be returned
 * limit : the max number of photo to return
###
module.exports.photoRange = (req, res, next) ->
    if req.params.skip?
        skip = parseInt(req.params.skip)
    else
        skip = 0
    if req.params.limit?
        limit = parseInt(req.params.limit)
    else
        limit = 100

    #[onCreation, percent] = onThumbCreation()

    #if onCreation
        #res.send "percent": percent

    #else

    dates = {}
    options =
        limit      : limit
        skip       : skip
        descending : true
    File.imageByDate options, (err, photos) ->
        if err
            return res.error 500, 'An error occured', err
        else
            if photos.length == limit
                hasNext = true
            else
                hasNext = false
            res.send {files: photos, firstRank: skip}, 200

###*
 * Gets an array that gives the number of photo for each month, from the most
 * recent month to the oldest
 * [{nPhotos:`number`, month:'YYYYMM'}, ...]
###
module.exports.photoMonthDistribution = (req, res, next) ->
    File.imageByMonth {group : true , group_level : 2 , reduce: true }, \
     (error, distribution_raw) ->
        distribution = []
        for k in [distribution_raw?.length-1..0]
            month = distribution_raw[k]
            if month?
                yearStr   = month.key[0] + ''
                monthStr  = month.key[1] + ''
                if monthStr.length == 1
                    monthStr = '0' + monthStr
                distribution.push(nPhotos:month.value, month:yearStr+monthStr)
        res.send(distribution, 200)

###*
 * Returns thumb for given file.
 * there is a bug : when the browser cancels many downloads, some are not
 * cancelled, what leads to saturate the stack of threads and blocks the
 * download of thumbs.
 * Cf comments bellow to reproduce easily
###
module.exports.photoThumb = (req, res, next) ->
    which = if req.file.binary.thumb then 'thumb' else 'file'
    stream = req.file.getBinary which, (err) ->
        if err
            console.log err
            next(err)
            stream.on 'data', () ->
            stream.on 'end', () ->
            stream.resume()
            return

    req.on 'close', () ->
        stream.abort()

    res.on 'close', () ->
        stream.abort()

    stream.pipe res
    ##
    # there is a bug : when the browser cancels many downloads, some are not
    # cancelled, what leads to saturate the stack of threads and blocks the
    # download of thumbs.
    # The code bellow makes it easy to reproduce the problem : just by delaying
    # the response, if you move the scrollbar in the browser, it will cancel
    # many photos...
    #
    # setTimeout(() ->
    #     stream = req.file.getBinary which, (err) ->
    #         if err
    #             console.log err
    #             next(err)
    #             stream.on 'data', () ->
    #             stream.on 'end', () ->
    #             stream.resume()
    #             return

    #     req.on 'close', () ->
    #         console.log "reQ.on close"
    #         stream.destroy()
    #         stream.abort()

    #     req.connection.on 'close', () ->
    #         console.log 'reQ.connection.on close'
    #         stream.destroy()
    #         stream.abort()

    #     req.on 'end', () ->
    #         console.log 'reQ.on end'
    #         stream.destroy()
    #         stream.abort()

    #     res.on 'close', () ->
    #         console.log "reS.on close"
    #         stream.abort()
    #         stream.destroy()
    #         stream.abort()

    #     res.connection.on 'close', () ->
    #         console.log 'reS.connection.on close'
    #         stream.destroy()
    #         stream.abort()

    #     res.on 'end', () ->
    #         console.log 'reS.on end'
    #         stream.destroy()
    #         stream.abort()

    #     stream.on 'close', () ->
    #         console.log 'stream.on close'
    #         stream.destroy()
    #         stream.abort()

    #     stream.pipe res
    # , 5000
    # )
    #


###*
 * Returns thumb (binary) for given file.
 * TO BE TESTED AND THEN REPLACE photoThumb
###
module.exports.photoThumbFast = (req, res, next) ->
    stream = new File(id:req.param.id).getBinary 'thumb', (err) ->
        return next err if err
    req.on 'close', () ->
        stream.abort()
    stream.pipe res


###*
 * Returns screen (binary) for given file.
###
module.exports.photoScreen = (req, res, next) ->
    which = if req.file.binary.screen then 'screen' else 'file'
    stream = req.file.getBinary which, (err) ->
        return next err if err
    stream.pipe res

###*
 * Returns binary of the photo
###
module.exports.photo = (req, res, next) ->
    console.log 'get raw photo reached'
    stream = req.file.getBinary 'file', (err) ->
        return next err if err
    stream.pipe res
