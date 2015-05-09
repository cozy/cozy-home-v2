Photo  = require '../models/photo'

###*
 * preloads n thumbs so that the modal inits faster
###

NUMBER_OF_PRELOAD  = 200 # number of photo to preload
TIME_BEFORE_START  = 500 # ms
TIME_BETWEEN_LOADS = 80 # ms

module.exports =  class

    images   : []
    imagesId : {}
    tries    : 0

    start: () ->
        console.log 'start of preload !'
        setTimeout(@getPhotoList,TIME_BEFORE_START)

    getPhotoList: () =>
        Photo.listFromFiles 0, NUMBER_OF_PRELOAD , (error, res) =>
            if error
                console.log error
            @filesList = res.files
            @nextFileRkToLoad = 0
            window.setTimeout(@lazyDownload,1000)

    lazyDownload: () =>
        if @nextFileRkToLoad >= @filesList.length
            return
        @lastFile = @filesList[@nextFileRkToLoad]
        fileId = @lastFile.id
        @imagesId[fileId]= true
        img = new Image()
        img.onload = @imgLoaded
        img.src = "files/photo/thumbs/#{fileId}.jpg"
        @t0 = performance.now()
        @images.push(img)
        @nextFileRkToLoad += 1

    imgLoaded: () =>
        s = @lastFile.size
        d = performance.now() - @t0
        bandwidth = s/d # kbps
        if bandwidth > 100
            # if the bandwidth is good enough (wifi or lan), continue preloading
            @tries = 0
            window.setTimeout(@lazyDownload, TIME_BETWEEN_LOADS)
        else
            if @tries < 10
                @tries += 1
                window.setTimeout(@lazyDownload,1000)
            else
                # retry in 5*60 = 300.000s
                window.setTimeout(@lazyDownload,300000)
                @tries = 0



