// TODO use helper fonctions to define routes
// TODO Move this file to coffeescript
exports.routes = function (map) {
    //map.resources('applications');
    map.get('/', 'applications#index');
    map.get('/clean', 'applications#clean');
    map.get('/init', 'applications#init');
    map.get('/api/applications', 'applications#applications');
    map.get('/api/users', 'applications#users');
    map.get('/login', 'passport#login');
    map.post('/login', 'passport#userLogin');

    //map.all(':controller/:action');
    //map.all(':controller/:action/:id');
};
