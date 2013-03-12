exports.routes = (map) ->
    map.get '/', 'applications#index'
    map.get '/api/applications', 'applications#applications'
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
