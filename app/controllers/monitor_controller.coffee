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
                    data.freeDiskSpace = lineData[2]
                    data.totalDiskSpace = lineData[1]
                    data.usedDiskSpace = lineData[4]

            send data
