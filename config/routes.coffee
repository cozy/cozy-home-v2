exports.routes = (map) ->
    map.get '/', 'applications#index'
    map.get '/api/applications', 'applications#applications'
    map.post '/api/applications/install', 'applications#install'
    map.del '/api/applications/:slug/uninstall', 'applications#uninstall'
    map.get '/api/sys-data', 'monitor#sysData'

    map.get '/api/users', 'users#users'
    map.post '/api/user', 'account#updateAccount'
