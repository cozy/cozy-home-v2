exports.routes = (map) ->
    map.get '/', 'applications#index'

    map.post '/api/applications/getPermissions', 'applications#getPermissions'
    map.post '/api/applications/getDescription', 'applications#getDescription'
    map.post '/api/applications/getMetaData', 'applications#getMetaData'

    map.get  '/api/applications'                , 'applications#applications'
    map.get  '/api/applications/byid/:id'       , 'applications#read'
    map.put  '/api/applications/byid/:id'       , 'applications#updatestoppable'
    map.post '/api/applications/install'        , 'applications#install'
    map.get  '/api/applications/:slug.png'      , 'applications#icon'
    map.post '/api/applications/:slug/start'    , 'applications#start'
    map.post '/api/applications/:slug/stop'     , 'applications#stop'
    map.del  '/api/applications/:slug/uninstall', 'applications#uninstall'
    map.put  '/api/applications/:slug/update'   , 'applications#update'

    map.get  '/api/sys-data'                    , 'monitor#sysData'

    map.get  '/api/users'                       , 'account#users'
    map.post '/api/user'                        , 'account#updateAccount'

    map.get  '/api/instances'                   , 'account#instances'
    map.post '/api/instance'                    , 'account#updateInstance'

    # notification API (used by home's client)
    map.get  '/api/notifications'               , 'notifications#all'
    map.get  '/api/notifications/:id'           , 'notifications#show'
    map.del  '/api/notifications/:id'           , 'notifications#delete'
    map.del  '/api/notifications'               , 'notifications#deleteAll'

    # exernal notification API
    # (to be used by other apps)
    map.post '/notifications'                   , 'notifications#create'
    map.put  '/notifications/:app/:ref'         , 'notifications#updateOrCreate'
    map.del  '/notifications/:app/:ref'         , 'notifications#destroy'
