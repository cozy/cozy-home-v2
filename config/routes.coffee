exports.routes = (map) ->
    map.get('/', 'applications#index')
    map.get('/api/applications', 'applications#applications')

    map.get('/authenticated', 'passport#isAuthenticated')
    map.post('/register', 'passport#register')
    map.post('/login', 'passport#login')
    map.get('/logout', 'passport#logout')

    map.get('/api/users', 'users#users')
    map.post('/api/user', 'passport#changePassword')
