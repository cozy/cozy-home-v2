// Generated by CoffeeScript 1.9.0
var account, album, applications, backgrounds, devices, file, help, index, logs, monitor, notifications, photo, proxy, stackApplications;

monitor = require('./monitor');

account = require('./account');

applications = require('./applications');

stackApplications = require('./stack_application');

index = require('./index');

devices = require('./devices');

notifications = require('./notifications');

file = require('./file');

proxy = require('./proxy');

album = require('./album');

photo = require('./photo');

logs = require('./logs');

backgrounds = require('./backgrounds');

help = require('./help');

module.exports = {
  '': {
    get: index.index
  },
  'albumid': {
    param: album.fetch
  },
  'photoid': {
    param: photo.fetch
  },
  'fileid': {
    param: file.fetch
  },
  'backgroundid': {
    param: backgrounds.fetch
  },
  'slug': {
    param: applications.loadApplication
  },
  'id': {
    param: applications.loadApplicationById
  },
  'api/applications/getPermissions': {
    post: applications.getPermissions
  },
  'api/applications/getDescription': {
    post: applications.getDescription
  },
  'api/applications/getMetaData': {
    post: applications.getMetaData
  },
  'api/applications': {
    get: applications.applications
  },
  'api/applications/byid/:id': {
    get: applications.read,
    put: applications.updateData
  },
  'api/applications/install': {
    post: applications.install
  },
  'api/applications/:slug.png': {
    get: applications.icon
  },
  'api/applications/:slug.svg': {
    get: applications.icon
  },
  'api/applications/:slug/start': {
    post: applications.start
  },
  'api/applications/:slug/stop': {
    post: applications.stop
  },
  'api/applications/:slug/uninstall': {
    "delete": applications.uninstall
  },
  'api/applications/:slug/update': {
    put: applications.update
  },
  'api/applications/update/all': {
    put: applications.updateAll
  },
  'api/applications/market': {
    get: applications.fetchMarket
  },
  'api/applications/stack': {
    get: stackApplications.get
  },
  'api/applications/update/stack': {
    put: stackApplications.update
  },
  'api/applications/reboot/stack': {
    put: stackApplications.reboot
  },
  'api/devices': {
    get: devices.devices
  },
  'api/devices/:deviceid': {
    "delete": devices.remove
  },
  'api/sys-data': {
    get: monitor.sysData
  },
  'api/users': {
    get: account.users
  },
  'api/user': {
    post: account.updateAccount
  },
  'api/instances': {
    get: account.instances
  },
  'api/instance': {
    post: account.updateInstance
  },
  'api/notifications': {
    get: notifications.all,
    "delete": notifications.deleteAll
  },
  'api/notifications/:notifid': {
    get: notifications.show,
    "delete": notifications["delete"]
  },
  'notifications': {
    post: notifications.create
  },
  'notifications/:app/:ref': {
    put: notifications.updateOrCreate,
    "delete": notifications.destroy
  },
  'api/proxy/': {
    get: proxy.get
  },
  'logs/:moduleslug': {
    get: logs.logs
  },
  'help/message': {
    post: help.message
  },
  'api/backgrounds': {
    get: backgrounds.all,
    post: backgrounds.create
  },
  'api/backgrounds/:backgroundid': {
    "delete": backgrounds["delete"]
  },
  'api/backgrounds/:backgroundid/picture.jpg': {
    get: backgrounds.picture
  },
  'api/backgrounds/:backgroundid/thumb.jpg': {
    get: backgrounds.thumb
  },
  'files/photo/range/:skip/:limit': {
    get: file.photoRange
  },
  'files/photo/thumbs/:fileid': {
    get: file.photoThumb
  },
  'files/photo/thumbs/fast/:file_id': {
    get: file.photoThumbFast
  },
  'files/photo/screens/:fileid': {
    get: file.photoScreen
  },
  'files/photo/monthdistribution': {
    get: file.photoMonthDistribution
  },
  'files/photo/:fileid': {
    get: file.photo
  },
  'albums/?': {
    get: album.list
  },
  'albums/:albumid/?': {
    get: album.read
  },
  'photos/thumbs/:photoid.jpg': {
    get: photo.thumb
  },
  'photos/raws/:photoid.jpg': {
    get: photo.raw
  }
};
