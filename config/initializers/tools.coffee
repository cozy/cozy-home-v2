# Tools
railway.tools.database = ->
    if args != undefined
        switch (args.shift())
            when 'clean' then console.log "clean"
            when 'initialize' then console.log "initialize"
            else
                console.log 'Usage: railway database [clean|backup|restore]'

railway.tools.database.help =
    shortcut: 'db',
    usage: 'database [initialize|clean]',
    description: 'Some database features'

