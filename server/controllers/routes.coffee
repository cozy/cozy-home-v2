monitor           = require './monitor'
account           = require './account'
applications      = require './applications'
stackApplications = require './stack_application'
index             = require './index'
devices           = require './devices'
notifications     = require './notifications'
file              = require './file'
proxy             = require './proxy'
album             = require './album'
photo             = require './photo'
logs              = require './logs'
backgrounds       = require './backgrounds'
help              = require './help'


module.exports =
    '': get: index.index

    # Fetch on params
    'albumid': param: album.fetch
    'photoid': param: photo.fetch
    'fileid': param: file.fetch
    'backgroundid': param: backgrounds.fetch
    'slug': param: applications.loadApplication
    'id': param: applications.loadApplicationById

    # Application routes
    'api/applications/getPermissions' : post: applications.getPermissions
    'api/applications/getDescription' : post: applications.getDescription
    'api/applications/getMetaData'    : post: applications.getMetaData

    'api/applications'                : get: applications.applications
    'api/applications/byid/:id'       :
        get: applications.read
        put: applications.updateData
    'api/applications/install'        : post: applications.install
    'api/applications/:slug.png'      : get: applications.icon
    'api/applications/:slug.svg'      : get: applications.icon
    'api/applications/:slug/start'    : post: applications.start
    'api/applications/:slug/stop'     : post: applications.stop
    'api/applications/:slug/uninstall': delete: applications.uninstall
    'api/applications/:slug/update'   : put: applications.update
    'api/applications/update/all'     : put: applications.updateAll

    'api/applications/market'         : get: applications.fetchMarket

    'api/applications/stack'          : get: stackApplications.get
    'api/applications/update/stack'   : put: stackApplications.update
    'api/applications/reboot/stack'   : put: stackApplications.reboot


    # Devices routes
    'api/devices'    : get: devices.devices
    'api/devices/:id': delete: devices.remove

    # Devices routes
    'api/sys-data': get: monitor.sysData

    # Users routes
    'api/users' : get: account.users
    'api/user'  : post: account.updateAccount

    # Instances routes
    'api/instances' : get: account.instances
    'api/instance'  : post: account.updateInstance

    # Notifications routes
    'api/notifications':
        get: notifications.all
        delete: notifications.deleteAll
    'api/notifications/:notifid':
        get: notifications.show
        delete: notifications.delete
    'notifications':
        post: notifications.create
    'notifications/:app/:ref':
        put: notifications.updateOrCreate
        delete: notifications.destroy

    # Proxy routes
    'api/proxy/':
        get: proxy.get

    # Logs
    'logs/:moduleslug':
        get: logs.logs

    # Help
    'help/message':
        post: help.message

    # Backgrounds
    'api/backgrounds':
        get: backgrounds.all
        post: backgrounds.create
    'api/backgrounds/:backgroundid':
        delete: backgrounds.delete
    'api/backgrounds/:backgroundid/picture.jpg':
        get: backgrounds.picture
    'api/backgrounds/:backgroundid/thumb.jpg':
        get: backgrounds.thumb

    # Photo routes
    'files/photo/range/:skip/:limit'  : get: file.photoRange
    'files/photo/thumbs/:fileid'      : get: file.photoThumb
    'files/photo/thumbs/fast/:file_id': get: file.photoThumbFast
    'files/photo/screens/:fileid'     : get: file.photoScreen
    'files/photo/monthdistribution'   : get: file.photoMonthDistribution
    'files/photo/:fileid'             : get: file.photo

    'albums/?':
        get  : album.list

    'albums/:albumid/?':
        get    : album.read

    'photos/thumbs/:photoid.jpg' : get : photo.thumb
    'photos/raws/:photoid.jpg'   :
        get : photo.raw

