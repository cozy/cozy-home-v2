require('../test_helper.js').controller('applications', module.exports);

var sinon  = require('sinon');

function ValidAttributes () {
    return {
        name: '',
        state: '',
        index: '',
        date--coffee: ''
    };
}

exports['applications controller'] = {

    'GET new': function (test) {
        test.get('/applications/new', function () {
            test.success();
            test.render('new');
            test.render('form.' + app.set('view engine'));
            test.done();
        });
    },

    'GET index': function (test) {
        test.get('/applications', function () {
            test.success();
            test.render('index');
            test.done();
        });
    },

    'GET edit': function (test) {
        var find = Application.find;
        Application.find = sinon.spy(function (id, callback) {
            callback(null, new Application);
        });
        test.get('/applications/42/edit', function () {
            test.ok(Application.find.calledWith('42'));
            Application.find = find;
            test.success();
            test.render('edit');
            test.done();
        });
    },

    'GET show': function (test) {
        var find = Application.find;
        Application.find = sinon.spy(function (id, callback) {
            callback(null, new Application);
        });
        test.get('/applications/42', function (req, res) {
            test.ok(Application.find.calledWith('42'));
            Application.find = find;
            test.success();
            test.render('show');
            test.done();
        });
    },

    'POST create': function (test) {
        var application = new ValidAttributes;
        var create = Application.create;
        Application.create = sinon.spy(function (data, callback) {
            test.strictEqual(data, application);
            callback(null, application);
        });
        test.post('/applications', {Application: application}, function () {
            test.redirect('/applications');
            test.flash('info');
            test.done();
        });
    },

    'POST create fail': function (test) {
        var application = new ValidAttributes;
        var create = Application.create;
        Application.create = sinon.spy(function (data, callback) {
            test.strictEqual(data, application);
            callback(new Error, null);
        });
        test.post('/applications', {Application: application}, function () {
            test.success();
            test.render('new');
            test.flash('error');
            test.done();
        });
    },

    'PUT update': function (test) {
        Application.find = sinon.spy(function (id, callback) {
            test.equal(id, 1);
            callback(null, {id: 1, updateAttributes: function (data, cb) { cb(null); }});
        });
        test.put('/applications/1', new ValidAttributes, function () {
            test.redirect('/applications/1');
            test.flash('info');
            test.done();
        });
    },

    'PUT update fail': function (test) {
        Application.find = sinon.spy(function (id, callback) {
            test.equal(id, 1);
            callback(null, {id: 1, updateAttributes: function (data, cb) { cb(new Error); }});
        });
        test.put('/applications/1', new ValidAttributes, function () {
            test.success();
            test.render('edit');
            test.flash('error');
            test.done();
        });
    },

    'DELETE destroy': function (test) {
        test.done();
    },

    'DELETE destroy fail': function (test) {
        test.done();
    }
};

