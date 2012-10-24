os = require 'os'

# Return as JSON data about memory and hard disk consumption
action 'sysData', ->

    data =
        freeMem: os.freemem() / (1024)
        totalMem: os.totalmem() / (1024)

    require('child_process').exec 'df -h', (err, resp) ->
        if err
            railway.logger.write(err)
            send error: true, msg: "Server error occured.", 500
        else
            lines = resp.split('\n')
            for line in lines
                line = line.replace(/[\s]+/g, ' ')
                lineData = line.split(' ')

                if lineData.length > 5 and lineData[5] is '/'
                    freeSpace = lineData[2].substring(0, lineData[2].length-1)
                    totalSpace = lineData[1].substring(0, lineData[1].length-1)
                    usedSpace = lineData[4].substring(0, lineData[4].length-1)

                    data.totalDiskSpace = +totalSpace
                    data.freeDiskSpace = +freeSpace
                    data.usedDiskSpace = +usedSpace

            send data
