exports.routes = (map) ->
    map.get '/', 'applications#index'
    map.get '/api/applications', 'applications#applications'
    map.post '/api/applications/getPermissions', 'applications#getPermissions'
    map.post '/api/applications/getDescription', 'applications#getDescription'
    map.get '/api/applications/byid/:id', 'applications#read'
    map.post '/api/applications/install', 'applications#install'
    map.post '/api/applications/:slug/start', 'applications#start'
    map.post '/api/applications/:slug/stop', 'applications#stop'
    map.del '/api/applications/:slug/uninstall', 'applications#uninstall'
    map.put '/api/applications/:slug/update', 'applications#update'
    map.get '/api/sys-data', 'monitor#sysData'

    map.get '/api/users', 'account#users'
    map.post '/api/user', 'account#updateAccount'

    map.get '/api/instances', 'account#instances'
    map.post '/api/instance', 'account#updateInstance'

    map.get '/notifications', 'notification#all'
    map.get '/notifications/:id', 'notification#getOne'
    map.post '/notifications', 'notification#create'
    map.put '/notifications/:id', 'notification#update'
