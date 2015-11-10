{MemoryManager}     = require('../lib/memory')

module.exports =
    # Return as JSON data about memory and hard disk consumption
    sysData: (req, res, next) ->
        memoryManager = new MemoryManager()
        memoryManager.getDiskInfos (err, diskInfos) ->

            if err then next err
            else memoryManager.getMemoryInfos (err, memoryInfos) ->

                if err then next err
                else
                    data = diskInfos
                    data[prop] = value for prop, value of memoryInfos
                    res.send data
