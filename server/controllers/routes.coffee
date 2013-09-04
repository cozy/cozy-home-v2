monitor = require './monitor'
account = require './account'
applications = require './applications'
notifications = require './notifications'

exports.module =
    '/api/applications/getPermissions': post: applications.getPermissions
    '/api/applications/getDescription': post: applications.getDescription
    '/api/applications/getMetaData': post: applications.getMetaData

    '/api/applications': get: applications.applications
    '/api/applications/byid/:id':
        get: applications.read
        put: applications.updatestoppable
    '/api/applications/install': post: applications.install
    '/api/applications/:slug.png': get: applications.icon
    '/api/applications/:slug/start': post: applications.start
    '/api/applications/:slug/stop': post: applications.stop
    '/api/applications/:slug/uninstall': del: applications.uninstall
    '/api/applications/:slug/update': put: applications.update

    '/api/sys-data': get: monitor.sysData

    '/api/users': get: account.users
    '/api/user': post: account.updateAccount
    '/api/instances': get: account.instances
    '/api/instance': post: account.updateInstance

    '/api/notifications': get: notifications.all
    '/api/notifications/:id': get: notifications.show
    '/api/notifications/:id': del: notifications.delete
    '/api/notifications': del: notifications.deleteAll

    '/notifications': post: notifications.create
    '/notifications/:app/:ref': put: notifications.updateOrCreate
    '/notifications/:app/:ref': del: notifications.destroy
