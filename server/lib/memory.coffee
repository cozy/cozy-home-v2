os = require 'os'
exec = require('child_process').exec

freeMemCmd = "free | grep cache: | cut -d':' -f2 | sed -e 's/^ *[0-9]* *//'"

class exports.MemoryManager

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

    getDiskInfos: (callback) ->
        exec 'df -h', (err, resp) =>
            if err then callback err
            else callback null, @_extractDataFromDfResult(resp)

    isEnoughMemory: (callback) ->
        @getMemoryInfos (err, data) =>
            if err then callback err
            else callback null, data.freeMem > (60 * 1024)
