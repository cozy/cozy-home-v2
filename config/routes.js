exports.routes = function (map) {
    //map.resources('applications');
    map.get('/', 'applications#index');
    map.get('/clean', 'applications#clean');
    map.get('/init', 'applications#init');
    map.get('/api/applications/', 'applications#applications');

    //map.all(':controller/:action');
    //map.all(':controller/:action/:id');
};
