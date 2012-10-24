exports.routes = (map) ->
    map.get '/', 'applications#index'
    map.get '/api/applications', 'applications#applications'
    map.post '/api/applications/install', 'applications#install'
    map.del '/api/applications/:slug/uninstall', 'applications#uninstall'
    map.get '/api/sys-data', 'monitor#sysData'

    map.get '/authenticated', 'passport#isAuthenticated'
    map.post '/register', 'passport#register'
    map.post '/login', 'passport#login'
    map.post "/login/forgot", "passport#forgotPassword"
    map.get "/password/reset/:key", "passport#resetForm"
    map.post "/password/reset/:key", "passport#resetPassword"
    map.get '/logout', 'passport#logout'

    map.get '/api/users', 'users#users'
    map.post '/api/user', 'passport#changePassword'
