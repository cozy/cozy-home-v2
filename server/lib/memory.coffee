os = require 'os'
fs = require 'fs'
exec = require('child_process').exec

ControllerClient = require("cozy-clients").ControllerClient

freeMemCmd = "free | grep cache: | cut -d':' -f2 | sed -e 's/^ *[0-9]* *//'"


# Utilities to get memory consumption and disk usage.
class exports.MemoryManager

    constructor: ->
        @controllerClient = new ControllerClient
            token: @_getAuthController()

    # Get token from token file if in production mode.
    # TODO: this method should be integrated to the controller client.
    _getAuthController: ->
        if process.env.NODE_ENV is 'production'
            try
                token = process.env.TOKEN
                return token
            catch err
                console.log err.message
                console.log err.stack
                return null
        else
            return ""


    # Crappy method to extract result from a df command, should be rewritter
    # with the one located in the controller.
    _extractDataFromDfResult: (resp) ->
        data = {}
        lines = resp.split('\n')
        for line in lines
            line = line.replace(/[\s]+/g, ' ')
            lineData = line.split(' ')

            if lineData.length > 5 and lineData[5] is '/'
                freeSpace = lineData[3].substring(0, lineData[3].length - 1)
                totalSpace = lineData[1].substring(0, lineData[1].length - 1)
                usedSpace = lineData[2].substring(0, lineData[2].length - 1)

                data.totalDiskSpace = totalSpace
                data.freeDiskSpace = freeSpace
                data.usedDiskSpace = usedSpace
        data

    # Return memory information from a complex free command (remove useless
    # information)
    getMemoryInfos: (callback) ->
        data = totalMem: os.totalmem() / (1024)
        exec freeMemCmd, (err, resp) ->
            if err
                callback err
            else
                lines = resp.split('\n')
                line = lines[0]
                data.freeMem = line
                callback null, data

    # Try to get disk infos from the Cozy controller (it can access to the
    # couch configuration file and guess on which fs it is located). If it
    # fails it tries to make a 'df -h' itself and guess that couch is located
    # in the / fs
    getDiskInfos: (callback) ->
        @controllerClient.client.get 'diskinfo', (err, res, body) =>
            if err or res.statusCode isnt 200
                exec 'df -h', (err, resp) =>
                    if err then callback err
                    else callback null, @_extractDataFromDfResult(resp)
            else
                callback null, body

    # Return true if there is at least 60MB of memory free.
    isEnoughMemory: (callback) ->
        @getMemoryInfos (err, data) =>
            if err then callback err
            else callback null, data.freeMem > (60 * 1024)
