MemoryManager = require('./lib/memory').MemoryManager

# Return as JSON data about memory and hard disk consumption
action 'sysData', ->
    memoryManager = new MemoryManager()
    memoryManager.getDiskInfos (err, diskInfos) ->
        console.log err
        if err then send error: true, msg: "Server error occured.", 500
        else memoryManager.getMemoryInfos (err, memoryInfos) ->
            if err
                send error: true, msg: "Server error occured.", 500
            else
                data = diskInfos
                data[prop] = value for prop, value of memoryInfos
                send data
