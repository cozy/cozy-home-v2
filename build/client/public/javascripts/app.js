(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = ({}).hasOwnProperty;

  var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };

  var _cmp = 'components/';
  var unalias = function(alias, loaderPath) {
    var start = 0;
    if (loaderPath) {
      if (loaderPath.indexOf(_cmp) === 0) {
        start = _cmp.length;
      }
      if (loaderPath.indexOf('/', start) > 0) {
        loaderPath = loaderPath.substring(start, loaderPath.indexOf('/', start));
      }
    }
    var result = aliases[alias + '/index.js'] || aliases[loaderPath + '/deps/' + alias + '/index.js'];
    if (result) {
      return _cmp + result.substring(0, result.length - '.js'.length);
    }
    return alias;
  };

  var _reg = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (_reg.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';
    path = unalias(name, loaderPath);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has.call(cache, dirIndex)) return cache[dirIndex].exports;
    if (has.call(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  require.list = function() {
    var result = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  require.brunch = true;
  require._cache = cache;
  globals.require = require;
})();
require.register("collections/application", function(exports, require, module) {
var Application, ApplicationCollection, BaseCollection, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseCollection = require('lib/base_collection');

Application = require('models/application');

module.exports = ApplicationCollection = (function(_super) {
  __extends(ApplicationCollection, _super);

  function ApplicationCollection() {
    _ref = ApplicationCollection.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ApplicationCollection.prototype.model = Application;

  ApplicationCollection.prototype.url = 'api/applications/';

  ApplicationCollection.prototype.apps = [];

  ApplicationCollection.prototype.get = function(idorslug) {
    var app, out, _i, _len, _ref1;
    out = ApplicationCollection.__super__.get.call(this, idorslug);
    if (out) {
      return out;
    }
    _ref1 = this.models;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      app = _ref1[_i];
      if (idorslug === app.get('id')) {
        return app;
      }
    }
  };

  ApplicationCollection.prototype.comparator = function(modelLeft, modelRight) {
    var left, leftIsOfficial, right, rightIsOfficial;
    leftIsOfficial = modelLeft.isOfficial();
    rightIsOfficial = modelRight.isOfficial();
    if (leftIsOfficial && !rightIsOfficial) {
      return -1;
    } else if (rightIsOfficial && !leftIsOfficial) {
      return 1;
    } else {
      left = modelLeft.get('displayName') || modelLeft.get('name');
      right = modelRight.get('displayName') || modelRight.get('name');
      return left.localeCompare(right);
    }
  };

  return ApplicationCollection;

})(BaseCollection);
});

;require.register("collections/background", function(exports, require, module) {
var Background, BackgroundCollection, BaseCollection, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseCollection = require('lib/base_collection');

Background = require('models/background');

module.exports = BackgroundCollection = (function(_super) {
  __extends(BackgroundCollection, _super);

  function BackgroundCollection() {
    _ref = BackgroundCollection.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  BackgroundCollection.prototype.url = 'api/backgrounds';

  BackgroundCollection.prototype.model = Background;

  BackgroundCollection.prototype.addPredefinedBackgrounds = function() {
    return this.add([
      {
        id: 'background-none',
        predefined: true
      }, {
        id: 'background-01',
        predefined: true
      }, {
        id: 'background-02',
        predefined: true
      }, {
        id: 'background-03',
        predefined: true
      }, {
        id: 'background-04',
        predefined: true
      }, {
        id: 'background-05',
        predefined: true
      }, {
        id: 'background-06',
        predefined: true
      }, {
        id: 'background-07',
        predefined: true
      }, {
        id: 'background-08',
        predefined: true
      }
    ]);
  };

  BackgroundCollection.prototype.init = function() {
    var _this = this;
    return this.fetch({
      success: function(models) {
        var selected;
        _this.addPredefinedBackgrounds();
        selected = _this.findWhere({
          id: window.app.instance.background
        });
        if (selected == null) {
          selected = _this.at(0);
        }
        if (selected != null) {
          return selected.set({
            'selected': true
          });
        }
      },
      error: function() {}
    });
  };

  return BackgroundCollection;

})(Backbone.Collection);
});

;require.register("collections/device", function(exports, require, module) {
var BaseCollection, Device, DeviceCollection, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseCollection = require('lib/base_collection');

Device = require('models/device');

module.exports = DeviceCollection = (function(_super) {
  __extends(DeviceCollection, _super);

  function DeviceCollection() {
    _ref = DeviceCollection.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  DeviceCollection.prototype.model = Device;

  DeviceCollection.prototype.url = 'api/devices/';

  return DeviceCollection;

})(BaseCollection);
});

;require.register("collections/notifications", function(exports, require, module) {
var BaseCollection, Notification, NotificationCollection, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseCollection = require('lib/base_collection');

Notification = require('models/notification');

module.exports = NotificationCollection = (function(_super) {
  __extends(NotificationCollection, _super);

  function NotificationCollection() {
    _ref = NotificationCollection.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  NotificationCollection.prototype.model = Notification;

  NotificationCollection.prototype.url = 'api/notifications';

  NotificationCollection.prototype.removeAll = function(options) {
    var success,
      _this = this;
    if (options == null) {
      options = {};
    }
    success = options.success;
    options.success = function() {
      _this.reset([]);
      return success != null ? success.apply(_this, arguments) : void 0;
    };
    return this.sync('delete', this, options);
  };

  return NotificationCollection;

})(Backbone.Collection);
});

;require.register("collections/stackApplication", function(exports, require, module) {
var ApplicationCollection, BaseCollection, StackApplication, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseCollection = require('lib/base_collection');

StackApplication = require('models/stack_application');

module.exports = ApplicationCollection = (function(_super) {
  __extends(ApplicationCollection, _super);

  function ApplicationCollection() {
    _ref = ApplicationCollection.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ApplicationCollection.prototype.model = StackApplication;

  ApplicationCollection.prototype.url = 'api/applications/stack';

  return ApplicationCollection;

})(BaseCollection);
});

;require.register("helpers/client", function(exports, require, module) {
exports.request = function(type, url, data, callbacks) {
  return $.ajax({
    type: type,
    url: url,
    data: data,
    dataType: 'json',
    success: callbacks.success,
    error: callbacks.error
  });
};

exports.get = function(url, callbacks) {
  return exports.request("GET", url, null, callbacks);
};

exports.post = function(url, data, callbacks) {
  return exports.request("POST", url, data, callbacks);
};

exports.put = function(url, data, callbacks) {
  return exports.request("PUT", url, data, callbacks);
};

exports.del = function(url, callbacks) {
  return exports.request("DELETE", url, null, callbacks);
};

exports.head = function(url, callbacks) {
  return exports.request("HEAD", url, null, callbacks);
};
});

;require.register("helpers/color-set", function(exports, require, module) {
module.exports = ['ead1ad', 'fbf0c2', '3cd7c3', '8FBAff', 'B4AED9', '78dc9a', '8DED2A', '8eecB9', 'bbcaA9', 'cdb19b', 'ec7e63', '8cec56', 'ffb1be', 'DD99CE', 'E26987', '8CB1FF', 'f5dd16', 'f1fab8', 'ffbe56', '6EE1C8', 'C4BEE9', '59C1ef', 'EC7E63', '8BEE8C'];
});

;require.register("helpers/locales", function(exports, require, module) {
exports.locales = {
  'en': 'English',
  'fr': 'Français'
};
});

;require.register("helpers/slugify", function(exports, require, module) {
var slugify;

module.exports = slugify = function(string) {
  var _slugify_hyphenate_re, _slugify_strip_re;
  _slugify_strip_re = /[^\w\s-]/g;
  _slugify_hyphenate_re = /[-\s]+/g;
  string = string.replace(_slugify_strip_re, '').trim().toLowerCase();
  string = string.replace(_slugify_hyphenate_re, '-');
  return string;
};
});

;require.register("helpers/timezone", function(exports, require, module) {
exports.timezones = ["Africa/Abidjan", "Africa/Accra", "Africa/Addis_Ababa", "Africa/Algiers", "Africa/Asmara", "Africa/Bamako", "Africa/Bangui", "Africa/Banjul", "Africa/Bissau", "Africa/Blantyre", "Africa/Brazzaville", "Africa/Bujumbura", "Africa/Cairo", "Africa/Casablanca", "Africa/Ceuta", "Africa/Conakry", "Africa/Dakar", "Africa/Dar_es_Salaam", "Africa/Djibouti", "Africa/Douala", "Africa/El_Aaiun", "Africa/Freetown", "Africa/Gaborone", "Africa/Harare", "Africa/Johannesburg", "Africa/Kampala", "Africa/Khartoum", "Africa/Kigali", "Africa/Kinshasa", "Africa/Lagos", "Africa/Libreville", "Africa/Lome", "Africa/Luanda", "Africa/Lubumbashi", "Africa/Lusaka", "Africa/Malabo", "Africa/Maputo", "Africa/Maseru", "Africa/Mbabane", "Africa/Mogadishu", "Africa/Monrovia", "Africa/Nairobi", "Africa/Ndjamena", "Africa/Niamey", "Africa/Nouakchott", "Africa/Ouagadougou", "Africa/Porto-Novo", "Africa/Sao_Tome", "Africa/Tripoli", "Africa/Tunis", "Africa/Windhoek", "America/Adak", "America/Anchorage", "America/Anguilla", "America/Antigua", "America/Araguaina", "America/Argentina/Buenos_Aires", "America/Argentina/Catamarca", "America/Argentina/Cordoba", "America/Argentina/Jujuy", "America/Argentina/La_Rioja", "America/Argentina/Mendoza", "America/Argentina/Rio_Gallegos", "America/Argentina/Salta", "America/Argentina/San_Juan", "America/Argentina/San_Luis", "America/Argentina/Tucuman", "America/Argentina/Ushuaia", "America/Aruba", "America/Asuncion", "America/Atikokan", "America/Bahia", "America/Barbados", "America/Belem", "America/Belize", "America/Blanc-Sablon", "America/Boa_Vista", "America/Bogota", "America/Boise", "America/Cambridge_Bay", "America/Campo_Grande", "America/Cancun", "America/Caracas", "America/Cayenne", "America/Cayman", "America/Chicago", "America/Chihuahua", "America/Costa_Rica", "America/Cuiaba", "America/Curacao", "America/Danmarkshavn", "America/Dawson", "America/Dawson_Creek", "America/Denver", "America/Detroit", "America/Dominica", "America/Edmonton", "America/Eirunepe", "America/El_Salvador", "America/Fortaleza", "America/Glace_Bay", "America/Godthab", "America/Goose_Bay", "America/Grand_Turk", "America/Grenada", "America/Guadeloupe", "America/Guatemala", "America/Guayaquil", "America/Guyana", "America/Halifax", "America/Havana", "America/Hermosillo", "America/Indiana/Indianapolis", "America/Indiana/Knox", "America/Indiana/Marengo", "America/Indiana/Petersburg", "America/Indiana/Tell_City", "America/Indiana/Vevay", "America/Indiana/Vincennes", "America/Indiana/Winamac", "America/Inuvik", "America/Iqaluit", "America/Jamaica", "America/Juneau", "America/Kentucky/Louisville", "America/Kentucky/Monticello", "America/La_Paz", "America/Lima", "America/Los_Angeles", "America/Maceio", "America/Managua", "America/Manaus", "America/Martinique", "America/Matamoros", "America/Mazatlan", "America/Menominee", "America/Merida", "America/Mexico_City", "America/Miquelon", "America/Moncton", "America/Monterrey", "America/Montevideo", "America/Montreal", "America/Montserrat", "America/Nassau", "America/New_York", "America/Nipigon", "America/Nome", "America/Noronha", "America/North_Dakota/Center", "America/North_Dakota/New_Salem", "America/Ojinaga", "America/Panama", "America/Pangnirtung", "America/Paramaribo", "America/Phoenix", "America/Port-au-Prince", "America/Port_of_Spain", "America/Porto_Velho", "America/Puerto_Rico", "America/Rainy_River", "America/Rankin_Inlet", "America/Recife", "America/Regina", "America/Resolute", "America/Rio_Branco", "America/Santa_Isabel", "America/Santarem", "America/Santiago", "America/Santo_Domingo", "America/Sao_Paulo", "America/Scoresbysund", "America/St_Johns", "America/St_Kitts", "America/St_Lucia", "America/St_Thomas", "America/St_Vincent", "America/Swift_Current", "America/Tegucigalpa", "America/Thule", "America/Thunder_Bay", "America/Tijuana", "America/Toronto", "America/Tortola", "America/Vancouver", "America/Whitehorse", "America/Winnipeg", "America/Yakutat", "America/Yellowknife", "Antarctica/Casey", "Antarctica/Davis", "Antarctica/DumontDUrville", "Antarctica/Mawson", "Antarctica/McMurdo", "Antarctica/Palmer", "Antarctica/Rothera", "Antarctica/Syowa", "Antarctica/Vostok", "Asia/Aden", "Asia/Almaty", "Asia/Amman", "Asia/Anadyr", "Asia/Aqtau", "Asia/Aqtobe", "Asia/Ashgabat", "Asia/Baghdad", "Asia/Bahrain", "Asia/Baku", "Asia/Bangkok", "Asia/Beirut", "Asia/Bishkek", "Asia/Brunei", "Asia/Choibalsan", "Asia/Chongqing", "Asia/Colombo", "Asia/Damascus", "Asia/Dhaka", "Asia/Dili", "Asia/Dubai", "Asia/Dushanbe", "Asia/Gaza", "Asia/Harbin", "Asia/Ho_Chi_Minh", "Asia/Hong_Kong", "Asia/Hovd", "Asia/Irkutsk", "Asia/Jakarta", "Asia/Jayapura", "Asia/Jerusalem", "Asia/Kabul", "Asia/Kamchatka", "Asia/Karachi", "Asia/Kashgar", "Asia/Kathmandu", "Asia/Kolkata", "Asia/Krasnoyarsk", "Asia/Kuala_Lumpur", "Asia/Kuching", "Asia/Kuwait", "Asia/Macau", "Asia/Magadan", "Asia/Makassar", "Asia/Manila", "Asia/Muscat", "Asia/Nicosia", "Asia/Novokuznetsk", "Asia/Novosibirsk", "Asia/Omsk", "Asia/Oral", "Asia/Phnom_Penh", "Asia/Pontianak", "Asia/Pyongyang", "Asia/Qatar", "Asia/Qyzylorda", "Asia/Rangoon", "Asia/Riyadh", "Asia/Sakhalin", "Asia/Samarkand", "Asia/Seoul", "Asia/Shanghai", "Asia/Singapore", "Asia/Taipei", "Asia/Tashkent", "Asia/Tbilisi", "Asia/Tehran", "Asia/Thimphu", "Asia/Tokyo", "Asia/Ulaanbaatar", "Asia/Urumqi", "Asia/Vientiane", "Asia/Vladivostok", "Asia/Yakutsk", "Asia/Yekaterinburg", "Asia/Yerevan", "Atlantic/Azores", "Atlantic/Bermuda", "Atlantic/Canary", "Atlantic/Cape_Verde", "Atlantic/Faroe", "Atlantic/Madeira", "Atlantic/Reykjavik", "Atlantic/South_Georgia", "Atlantic/St_Helena", "Atlantic/Stanley", "Australia/Adelaide", "Australia/Brisbane", "Australia/Broken_Hill", "Australia/Currie", "Australia/Darwin", "Australia/Eucla", "Australia/Hobart", "Australia/Lindeman", "Australia/Lord_Howe", "Australia/Melbourne", "Australia/Perth", "Australia/Sydney", "Canada/Atlantic", "Canada/Central", "Canada/Eastern", "Canada/Mountain", "Canada/Newfoundland", "Canada/Pacific", "Europe/Amsterdam", "Europe/Andorra", "Europe/Athens", "Europe/Belgrade", "Europe/Berlin", "Europe/Brussels", "Europe/Bucharest", "Europe/Budapest", "Europe/Chisinau", "Europe/Copenhagen", "Europe/Dublin", "Europe/Gibraltar", "Europe/Helsinki", "Europe/Istanbul", "Europe/Kaliningrad", "Europe/Kiev", "Europe/Lisbon", "Europe/London", "Europe/Luxembourg", "Europe/Madrid", "Europe/Malta", "Europe/Minsk", "Europe/Monaco", "Europe/Moscow", "Europe/Oslo", "Europe/Paris", "Europe/Prague", "Europe/Riga", "Europe/Rome", "Europe/Samara", "Europe/Simferopol", "Europe/Sofia", "Europe/Stockholm", "Europe/Tallinn", "Europe/Tirane", "Europe/Uzhgorod", "Europe/Vaduz", "Europe/Vienna", "Europe/Vilnius", "Europe/Volgograd", "Europe/Warsaw", "Europe/Zaporozhye", "Europe/Zurich", "GMT", "Indian/Antananarivo", "Indian/Chagos", "Indian/Christmas", "Indian/Cocos", "Indian/Comoro", "Indian/Kerguelen", "Indian/Mahe", "Indian/Maldives", "Indian/Mauritius", "Indian/Mayotte", "Indian/Reunion", "Pacific/Apia", "Pacific/Auckland", "Pacific/Chatham", "Pacific/Easter", "Pacific/Efate", "Pacific/Enderbury", "Pacific/Fakaofo", "Pacific/Fiji", "Pacific/Funafuti", "Pacific/Galapagos", "Pacific/Gambier", "Pacific/Guadalcanal", "Pacific/Guam", "Pacific/Honolulu", "Pacific/Johnston", "Pacific/Kiritimati", "Pacific/Kosrae", "Pacific/Kwajalein", "Pacific/Majuro", "Pacific/Marquesas", "Pacific/Midway", "Pacific/Nauru", "Pacific/Niue", "Pacific/Norfolk", "Pacific/Noumea", "Pacific/Pago_Pago", "Pacific/Palau", "Pacific/Pitcairn", "Pacific/Ponape", "Pacific/Port_Moresby", "Pacific/Rarotonga", "Pacific/Saipan", "Pacific/Tahiti", "Pacific/Tarawa", "Pacific/Tongatapu", "Pacific/Truk", "Pacific/Wake", "Pacific/Wallis", "US/Alaska", "US/Arizona", "US/Central", "US/Eastern", "US/Hawaii", "US/Mountain", "US/Pacific", "UTC"];
});

;require.register("initialize", function(exports, require, module) {
var Instance, MainRouter, MainView, colorSet;

MainRouter = require('routers/main_router');

MainView = require('views/main');

Instance = require('models/instance');

colorSet = require('../helpers/color-set');

window.onerror = function(msg, url, line, col, error) {
  var data, exception, xhr;
  console.error(msg, url, line, col, error, error != null ? error.stack : void 0);
  exception = (error != null ? error.toString() : void 0) || msg;
  if (exception !== window.lastError) {
    data = {
      data: {
        type: 'error',
        error: {
          msg: msg,
          name: error != null ? error.name : void 0,
          full: exception,
          stack: error != null ? error.stack : void 0
        },
        url: url,
        line: line,
        col: col,
        href: window.location.href
      }
    };
    xhr = new XMLHttpRequest();
    xhr.open('POST', 'log', true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(data));
    return window.lastError = exception;
  }
};

document.addEventListener('DOMContentLoaded', function() {
  var SocketListener, data, defaultLocales, e, err, exception, locales, xhr, _ref,
    _this = this;
  try {
    this.instance = window.cozy_instance || {};
    this.locale = ((_ref = this.instance) != null ? _ref.locale : void 0) || 'en';
    defaultLocales = require('locales/en');
    try {
      locales = require('locales/' + this.locale);
    } catch (_error) {
      err = _error;
      locales = defaultLocales;
    }
    window.app = this;
    this.polyglot = new Polyglot();
    this.polyglot.extend(locales);
    this.defaultPolyglot = new Polyglot({
      locale: 'en',
      phrases: defaultLocales
    });
    window.t = function(key, params) {
      var _ref1, _ref2;
      if (params == null) {
        params = {};
      }
      if (params._ == null) {
        params._ = (_ref1 = _this.defaultPolyglot) != null ? _ref1.t(key, params) : void 0;
      }
      return (_ref2 = _this.polyglot) != null ? _ref2.t(key, params) : void 0;
    };
    moment.locale(this.locale);
    ColorHash.addScheme('cozy', colorSet);
    this.routers = {};
    this.mainView = new MainView();
    this.routers.main = new MainRouter();
    Backbone.history.start();
    SocketListener = require('lib/socket_listener');
    return SocketListener.socket.on('installerror', function(err) {
      console.log("An error occured while attempting to install app");
      return console.log(err);
    });
  } catch (_error) {
    e = _error;
    console.error(e, e != null ? e.stack : void 0);
    exception = e.toString();
    if (exception !== window.lastError) {
      data = {
        data: {
          type: 'error',
          error: {
            msg: e.message,
            name: e != null ? e.name : void 0,
            full: exception,
            stack: e != null ? e.stack : void 0
          },
          file: e != null ? e.fileName : void 0,
          line: e != null ? e.lineNumber : void 0,
          col: e != null ? e.columnNumber : void 0,
          href: window.location.href
        }
      };
      xhr = new XMLHttpRequest();
      xhr.open('POST', 'log', true);
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhr.send(JSON.stringify(data));
      return window.lastError = exception;
    }
  }
});
});

;require.register("lib/base_collection", function(exports, require, module) {
var BaseCollection, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = BaseCollection = (function(_super) {
  __extends(BaseCollection, _super);

  function BaseCollection() {
    _ref = BaseCollection.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  BaseCollection.prototype.parse = function(response) {
    return response.rows;
  };

  return BaseCollection;

})(Backbone.Collection);
});

;require.register("lib/base_model", function(exports, require, module) {
var _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

exports.BaseModel = (function(_super) {
  __extends(BaseModel, _super);

  function BaseModel() {
    _ref = BaseModel.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  BaseModel.prototype.isNew = function() {
    return this.id === void 0;
  };

  return BaseModel;

})(Backbone.Model);
});

;require.register("lib/base_view", function(exports, require, module) {
var BaseView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = BaseView = (function(_super) {
  __extends(BaseView, _super);

  function BaseView() {
    _ref = BaseView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  BaseView.prototype.tagName = 'section';

  BaseView.prototype.template = function() {};

  BaseView.prototype.initialize = function() {
    this.render();
    return BaseView.__super__.initialize.call(this);
  };

  BaseView.prototype.getRenderData = function() {
    if ((this.model != null) && (this.model.toJSON != null)) {
      return {
        model: this.model.toJSON()
      };
    }
  };

  BaseView.prototype.render = function() {
    this.beforeRender();
    this.$el.html(this.template(this.getRenderData()));
    this.afterRender();
    return this;
  };

  BaseView.prototype.beforeRender = function() {};

  BaseView.prototype.afterRender = function() {};

  BaseView.prototype.destroy = function() {
    this.undelegateEvents();
    this.$el.removeData().unbind();
    this.remove();
    return Backbone.View.prototype.remove.call(this);
  };

  return BaseView;

})(Backbone.View);
});

;require.register("lib/intent_manager", function(exports, require, module) {
var IntentManager, ObjectPicker;

ObjectPicker = require('views/object_picker');

module.exports = IntentManager = (function() {
  function IntentManager() {}

  IntentManager.prototype.registerIframe = function(iframe, remoteOrigin) {
    var talker;
    talker = new Talker(iframe.contentWindow, remoteOrigin);
    return talker.onMessage = this.handleIntent;
  };

  IntentManager.prototype.handleIntent = function(message) {
    var intent;
    intent = message.data;
    switch (intent.type) {
      case 'goto':
        return window.app.routers.main.navigate("apps/" + intent.params, true);
      case 'pickObject':
        switch (intent.params.objectType) {
          case 'singlePhoto':
            if (intent.params.isCropped) {
              return new ObjectPicker(intent.params, function(newPhotoChosen, dataUrl) {
                return message.respond({
                  newPhotoChosen: newPhotoChosen,
                  dataUrl: dataUrl
                });
              });
            } else {
              return new ObjectPicker(intent.params, function(newPhotoChosen, dataUrl) {
                return message.respond({
                  newPhotoChosen: newPhotoChosen,
                  dataUrl: dataUrl
                });
              });
            }
        }
        break;
      case 'ping':
        return message.respond('pong');
    }
  };

  return IntentManager;

})();
});

;require.register("lib/proxyclient", function(exports, require, module) {
var request;

request = require('lib/request');

exports.get = function(url, callback) {
  return request.request('get', 'api/proxy', url, callback);
};
});

;require.register("lib/request", function(exports, require, module) {
exports.request = function(type, url, data, callback) {
  var body, fired, req;
  body = data != null ? JSON.stringify(data) : null;
  fired = false;
  req = $.ajax({
    type: type,
    url: url,
    data: body,
    contentType: "application/json",
    dataType: "json",
    success: function(data) {
      fired = true;
      return typeof callback === "function" ? callback(null, data) : void 0;
    },
    error: function(data) {
      var err, msg;
      fired = true;
      if (data != null ? data.getResponseHeader("X-Cozy-Login-Page") : void 0) {
        return window.location.replace('/login');
      } else if ((callback != null) && (data != null)) {
        try {
          data = JSON.parse(data.responseText);
        } catch (_error) {
          err = _error;
          data = data.responseText;
        }
        msg = data.msg || data.error || "Server error occured";
        err = new Error(msg);
        err.data = data;
        return callback(err);
      } else {
        return typeof callback === "function" ? callback() : void 0;
      }
    }
  });
  return req.always(function() {
    if (!fired) {
      return callback(new Error("Server error occured", data));
    }
  });
};

exports.get = function(url, callback) {
  return exports.request("GET", url, null, callback);
};

exports.post = function(url, data, callback) {
  return exports.request("POST", url, data, callback);
};

exports.put = function(url, data, callback) {
  return exports.request("PUT", url, data, callback);
};

exports.del = function(url, callback) {
  return exports.request("DELETE", url, null, callback);
};

exports.head = function(url, callback) {
  return exports.request("HEAD", url, null, callback);
};

$(document).ajaxError(function(event, xhr) {
  if (xhr != null ? xhr.getResponseHeader("X-Cozy-Login-Page") : void 0) {
    return window.location.replace('/login');
  }
});
});

;require.register("lib/socket_listener", function(exports, require, module) {
var Application, Device, Notification, SocketListener, application_idx, device_idx, notification_idx, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Application = require('models/application');

Notification = require('models/notification');

Device = require('models/device');

application_idx = 0;

notification_idx = 1;

device_idx = 2;

SocketListener = (function(_super) {
  __extends(SocketListener, _super);

  function SocketListener() {
    _ref = SocketListener.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  SocketListener.prototype.models = {
    'notification': Notification,
    'device': Device,
    'application': Application
  };

  SocketListener.prototype.events = ['notification.create', 'notification.update', 'notification.delete', 'device.create', 'device.update', 'device.delete', 'application.create', 'application.update', 'application.delete'];

  SocketListener.prototype.onRemoteCreate = function(model) {
    if (model instanceof Application) {
      return this.collections[application_idx].add(model);
    } else if (model instanceof Notification) {
      return this.collections[notification_idx].add(model);
    } else if (model instanceof Device) {
      return this.collections[device_idx].add(model);
    }
  };

  SocketListener.prototype.onRemoteDelete = function(model) {
    if (model instanceof Application) {
      return this.collections[application_idx].remove(model);
    } else if (model instanceof Notification) {
      return this.collections[notification_idx].remove(model);
    } else if (model instanceof Device) {
      return this.collections[device_idx].remove(model);
    }
  };

  return SocketListener;

})(CozySocketListener);

module.exports = new SocketListener();
});

;require.register("lib/view_collection", function(exports, require, module) {
var BaseView, ViewCollection, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

module.exports = ViewCollection = (function(_super) {
  __extends(ViewCollection, _super);

  function ViewCollection() {
    this.removeItem = __bind(this.removeItem, this);
    this.addItem = __bind(this.addItem, this);
    _ref = ViewCollection.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ViewCollection.prototype.views = {};

  ViewCollection.prototype.itemView = null;

  ViewCollection.prototype.itemViewOptions = function() {};

  ViewCollection.prototype.checkIfEmpty = function() {
    return this.$el.toggleClass('empty', _.size(this.views) === 0);
  };

  ViewCollection.prototype.appendView = function(view) {
    return this.$el.append(view.el);
  };

  ViewCollection.prototype.removeView = function(view) {
    return view.remove();
  };

  ViewCollection.prototype.initialize = function() {
    ViewCollection.__super__.initialize.apply(this, arguments);
    this.views = {};
    this.listenTo(this.collection, "reset", this.onReset);
    this.listenTo(this.collection, "add", this.addItem);
    this.listenTo(this.collection, "remove", this.removeItem);
    return this.onReset(this.collection);
  };

  ViewCollection.prototype.render = function() {
    var id, view, _ref1;
    _ref1 = this.views;
    for (id in _ref1) {
      view = _ref1[id];
      view.$el.detach();
    }
    return ViewCollection.__super__.render.apply(this, arguments);
  };

  ViewCollection.prototype.afterRender = function() {
    var id, view, _ref1;
    _ref1 = this.views;
    for (id in _ref1) {
      view = _ref1[id];
      this.appendView(view);
    }
    return this.checkIfEmpty(this.views);
  };

  ViewCollection.prototype.remove = function() {
    this.onReset([]);
    return ViewCollection.__super__.remove.apply(this, arguments);
  };

  ViewCollection.prototype.onReset = function(newcollection) {
    var id, view, _ref1;
    _ref1 = this.views;
    for (id in _ref1) {
      view = _ref1[id];
      this.removeView(view);
    }
    this.views = [];
    this.checkIfEmpty(this.views);
    return newcollection.forEach(this.addItem);
  };

  ViewCollection.prototype.addItem = function(model) {
    var options, view;
    options = _.extend({}, {
      model: model
    }, this.itemViewOptions(model));
    view = new this.itemView(options);
    this.views[model.cid] = view.render();
    this.appendView(view);
    return this.checkIfEmpty(this.views);
  };

  ViewCollection.prototype.removeItem = function(model) {
    this.removeView(this.views[model.cid]);
    delete this.views[model.cid];
    return this.checkIfEmpty(this.views);
  };

  return ViewCollection;

})(BaseView);
});

;require.register("locales/en", function(exports, require, module) {
module.exports = {
  "home": "Home",
  "apps": "Apps",
  "account": "Account",
  "email": "Email",
  "timezone": "Time zone",
  "domain": "Domain",
  "no domain set": "no.domain.set",
  "locale": "Locale",
  "change password": "Change password",
  "input your current password": "Enter your current password:",
  "enter a new password": "Enter your new password:",
  "confirm new password": "Confirm your new password:",
  "send changes": "Save",
  "manage": "Manage",
  "total": "Total",
  "memory consumption": "Memory usage",
  "disk consumption": "Disk usage",
  "you have no notifications": "<span>Hello %{name}</span><br>You have currently no notification.",
  "dismiss all": "Dismiss all",
  "add application": "Add app?",
  "install": "Install",
  "github": "Github",
  "website": "Website",
  "your app": "Your app!",
  "community contribution": "Community contribution",
  "official application": "Developed by Cozy",
  "application description": "App Description",
  "downloading description": "Downloading description…",
  "downloading permissions": "Downloading permissions…",
  "Cancel": "Cancel",
  "ok": "Ok",
  "applications permissions": "App permissions",
  "confirm": "Confirm",
  "installing": "Installing",
  "remove": "Remove",
  "update": "Update",
  "config application unmark favorite": "Remove from Favorites (remove from top of the home screen)",
  "config application mark favorite": "Add to Favorites (added to the top of the home screen)",
  "started": "started",
  "notifications": "Notifications",
  "questions and help forum": "Questions and help forum",
  "sign out": "Sign out",
  "open in a new tab": "Open in a new tab",
  "always on": "always on",
  "keep always on": "keep always on",
  "stop this app": "Stop this app",
  "update required": "Update available",
  "navbar faq": "Frequently Asked Questions",
  "application is installing": "An app is already installing.\nWait for it to finish, then try again.",
  "no app message": "You currently have no app installed on your Cozy.\nGo to the <a href=\"#applications\">Cozy store</a> and install new apps!",
  "welcome to app store": "Welcome to your Cozy store, install your own app from here\nor add one from the list of available ones.",
  "installed everything": "You have already installed everything!",
  "already similarly named app": "You already have an app with a similar name.",
  "your app list": "Access your apps",
  "customize your cozy": "Customize your layout",
  "manage your apps": "Applications",
  "choose your apps": "Choose your apps",
  "configure your cozy": "Configure your cozy",
  "ask for assistance": "Ask for help",
  "logout": "Sign out",
  "navbar logout": "Sign out",
  "welcome to your cozy": "Welcome to your Cozy!",
  "you have no apps": "You have no apps.",
  "app management": "App management",
  "app store": "Add App",
  "configuration": "Configuration",
  "assistance": "Assistance",
  "hardware consumption": "Hardware",
  "gigabytes": "GB",
  "megabytes": "MB",
  "terabyte": "MB",
  "G": "GB",
  "M": "MB",
  "T": "MB",
  "disk unit": "GB",
  "memory unit": "MB",
  "status hard drive label": "Storage",
  "status memory label": "Memory",
  "manage your applications": "Applications",
  "manage your devices": "Connected devices",
  "synchronized": "synchronized",
  "revoke device access": "Revoke device",
  "no application installed": "There is no app installed.",
  "your parameters": "Your settings",
  "alerts and password recovery email": "Your email is used for notifications or password recovery.",
  "public name description": "Your username will be displayed when you share files with people or invite them to events.",
  "domain name for urls and email": "The domain name is used to connect to your Cozy from any devices and build sharing URLs.",
  "account timezone field description": "Your time zone helps to properly display your calendar.",
  "save": "Save",
  "saved": "Saved",
  "error": "Error",
  "error proper email": "Given email is not correct",
  "error email empty": "Given email is empty",
  "account language field description": "Choose the language you want to see:",
  "account background selection": "Select your background for your Cozy Home:",
  "account localization": "Localization",
  "account identifiers": "Account",
  "account personalization": "Customization",
  "account password": "Password",
  "french": "French",
  "english": "English",
  "german": "German",
  "spanish": "Spanish",
  "korean": "Korean",
  "japanese": "Japanese",
  "portuguese": "Portuguese",
  "change password procedure": "Steps to change your password",
  "current password": "current password",
  "new password": "new password",
  "confirm your new password": "confirm your new password",
  "save your new password": "Save new password",
  "do you want assistance": "Do you need any help?",
  "help email title": "Email",
  "help twitter title": "Twitter",
  "help forum title": "Forum",
  "help IRC title": "IRC",
  "help github title": "Github",
  "Visit the project website and learn to build your app:": "Visit the project website:",
  "your own application": "your own app",
  "installed": "installed",
  "updated": "updated",
  "updating": "updating",
  "update all": "Update Stack and applications",
  "show home logs": "Show Home Logs",
  "show data system logs": "Show Data System Logs",
  "show proxy logs": "Show Proxy Logs",
  "show logs": "Show Logs",
  "update stack": "Update the platform",
  "reboot stack waiting message": "Please wait, rebooting your Cozy takes several minutes.",
  "update stack waiting message": "Please wait, updating your Cozy takes several minutes.",
  "status no device": "There is no device connected to your Cozy.",
  "download apk": "Download .APK",
  "mobile app promo": "Backup you photos and synchronize your contacts and calendars with your mobile via the dedicated mobile app:",
  "update stack modal title": "Updating your Cozy",
  "update stack modal content": "You are about to update the platform. Your Cozy will be unavailable a few minutes. Is that OK?",
  "update stack modal confirm": "Update",
  "update stack success": "Your applications are updated. To finalize the update, it requires that you click on the OK button. It will refresh the current window.",
  "update stack error": "An error occurred during the update. Your Cozy may become unstable. If you notice any troubles, you should contact your hosting provider. When you will click on the OK button, the current window will be refreshed.",
  "applications broken": "Applications broken",
  "cozy platform": "Platform",
  "navbar back button title": "Back Home",
  "navbar notifications": "Notifications",
  "or:": "or:",
  "reboot stack": "Reboot",
  "update error": "An error occurred while updating the app",
  "update failed": "Update failed",
  "error update uninstalled app": "You can't update an app that is not installed.",
  "notification open application": "Open application",
  "notification update stack": "Update the platform",
  "notification update application": "Update now",
  "broken": "broken",
  "start this app": "Start this app",
  "stopped": "stopped",
  "retry to install": "Retry installation",
  "cozy account title": "Cozy - Settings",
  "cozy app store title": "Cozy - Store",
  "cozy home title": "Cozy - Home",
  "cozy applications title": "Cozy - Status",
  "running": "running",
  "cozy help title": "Cozy - Help",
  "help support title": "Official Support",
  "help community title": "Community Support",
  "help direct title": "Direct Message",
  "help documentation title": "Documentation",
  "changing locale requires reload": "Changing the locale requires to reload the page.",
  "cancel": "cancel",
  "abort": "abort",
  "Once updated, this application will require the following permissions:": "Once updated, this app will require the following permissions:",
  "confirm update": "confirm update",
  "confirm install": "confirm install",
  "no specific permissions needed": "This app doesn't require any permission",
  "removed": "removed",
  "removing": "removing",
  "required permissions": "Required permissions",
  "finish layout edition": "Save",
  "reset customization": "Reset",
  "use icon": "Use icon",
  "home section favorites": "Favorites",
  "home section leave": "Import",
  "home section main": "Daily",
  "home section productivity": "Productivity",
  "home section data management": "Data",
  "home section personal watch": "Watch",
  "home section misc": "Misc",
  "home section platform": "Platform",
  "app status": "My Apps",
  "app store": "Store",
  "settings": "Settings",
  "help": "Help",
  "change layout": "Change the layout",
  "market app install": "Installing...",
  "install your app": "Install an app from its Git Repository",
  "market install your app": "Just copy/paste its Git URL in the field below:",
  "market install your app tutorial": "To know more about how to build your own app, feel free to read our ",
  "market app tutorial": " tutorial",
  "help send message title": "Write directly to the Cozy Team",
  "help send message action": "Send",
  "help send logs": "Send server logs to ease debug",
  "send message success": "Message successfully sent!",
  "send message error": "An error occurred while sending your support message. Try to send it via an email client to support@cozycloud.cc",
  "account change password success": "The password was changed successfully.",
  "account change password short": "The new password is too short.",
  "account change password difference": "The password confirmation doesn't match the new password.",
  "account change password error": "There was something wrong while changing your password. Ensure that your previous password is correct.",
  "account background add": "Add background",
  "introduction market": "Welcome to the Cozy store!\nHere, you can install\napps provided by Cozy Cloud, apps from the community or apps built by yourself!",
  "error connectivity issue": "An error occurred while retrieving the data.<br />Please try again later.",
  "package.json not found": "Unable to fetch package.json. Check your repo url.",
  "unknown provider": "For now, applications can only be installed from Github or CozyCloud Market",
  "please wait data retrieval": "Please wait while the data is being retrieved…",
  "revoke device confirmation message": "This will prevent the device from accessing your Cozy. Are you sure?",
  "dashboard": "Dashboard",
  "calendars description": "Manage your events and sync them with your smartphone.",
  "contacts description": "Manage your contacts and sync them with your smartphone.",
  "emails description": "Read, send and back up your emails.",
  "files description": "Your online file-system, synced with your devices.",
  "photos description": "Organize your photos and share them with friends.",
  "sync description": "The tool required to sync your contacts and calendar with your smartphone.",
  "quickmarks description": "Save and manage your bookmarks.",
  "cozic description": "An audio player to listen to your music from your browser.",
  "databrowser description": "Browse and visualize all your data (raw format).",
  "zero-feeds description": "Aggregate your feeds and save your favorite links as bookmarks.",
  "kyou description": "Improve your health and happiness by quantifying yourself.",
  "konnectors description": "Import data from external services (Twitter, Jawbone…).",
  "kresus description": "Additional tools for your personal finance manager.",
  "nirc description": "Access to your favorite IRC channels from your Cozy.",
  "shout description": "Access to your favorite IRC channels from your Cozy with the Shout Web application",
  "notes description": "Organize and write smart notes.",
  "owm description": "Know the weather anywhere in the world.",
  "remote storage description": "A Remote Storage appliance to store data from your Unhosted applications.",
  "tasky description": "Super fast and simple tag-based task manager.",
  "todos description": "Write your tasks, order them and complete them efficiently.",
  "term description": "A terminal app for your Cozy.",
  "ghost description": "Share your stories with the world with this app based on the Ghost Blogging Platform.",
  "leave google description": "An app to import your current data from your Google account.",
  "mstsc.js description": "Manage your Windows Desktop remotely through the RDP protocol.",
  "hastebin description": "A simple pastebin, a tool to easily share texts.",
  "polybios description": "Manage your PGP keys from your browser.",
  "frost description": "Build your internet memories by archiving web pages into your Cozy.",
  "tiddlywiki description": "A non-linear personal web notebook.",
  "hari description": "Encrypted personal diary.",
  "warning unofficial app": "This app is a community app and isn't maintained by the Cozy team.\nTo report a bug, please file an issue in <a href='https://forum.cozy.io'>our forum</a>.",
  "update available notification": "A new version of %{appName} is available.",
  "stack update available notification": "A new version of the platform is available.",
  "app broken title": "Broken application",
  "app broken": "This application is broken. Can you try to install it again: ",
  "reinstall broken app": "reinstall it.",
  "error git": "We can't retrieve the source code.",
  "error github repo": "Application repository seems unavailable.",
  "error github": "Github seems unavailable. You can check its status on https://status.github.com/.",
  "error npm": "We can't install the application dependencies.",
  "error user linux": "We can't create a specific Linux user for this application.",
  "error start": "Application can't start. You can find more details in log application.",
  "app msg": "If error persists, you can contact us at contact@cozycloud.cc or on IRC #cozycloud on irc.freenode.net.",
  "more details": "More details",
  "noapps": {
    "customize your cozy": "You can also <a href=\"%{account}\">go to your settings</a> and customize your Cozy,\nor <a href=\"%{appstore}\">take a look at the App Store</a> to install your first app."
  },
  "pick from files": "Pick a photo",
  "Crop the photo": "Crop image",
  "chooseAgain": "choose another photo",
  "modal ok": "OK",
  "modal cancel": "Cancel",
  "no image": "There is no image on your Cozy",
  "ObjPicker upload btn": "Upload a local file",
  "or": "or",
  "drop a file": "Drag & drop a file or",
  "url of an image": "Paste URL of an image from the web",
  "you have no album": "<p>You haven't got any photo album<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:-(</p><p>Create one from the <a href='/#applications' target='_blank'>the Photo app</a><br>and use photos taken from your smartphone with the <a href='https://play.google.com/store/apps/details?id=io.cozy.files_client&hl=en' target='_blank'>mobile app!</a><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:-)</p>",
  "config application mark favorite": "mark as favorite",
  "config application unmark favorite": "unmark as favorite",
  "state app installing": "This app is being installed. Wait a little",
  "state app stopped error": "This app cannot start",
  "stack updating block message": "Your Cozy is currently updating, you cannot use it until the update is finished.",
  "update apps error title": "An error occurred while updating apps",
  "update apps error": "One or several applications failed. Concerned applications are marked as broken. You will probably have to uninstall and reinstall these applications.",
  "update apps error list title": "Broken applications",
  "update stack error title": "An error occurred while updating your Cozy",
  "update stack permission changes": "Applications listed below were not updated due to permission changes. Please, update them individually to choose whether or not you accept the new permissions.",
  "update stack warning": "Warning",
  "reboot stack error": "An error occurred while rebooting your Cozy. The Cozy may become unstable. Contact your hosting provider if your Cozy doesn't work anymore."
}
;
});

require.register("models/application", function(exports, require, module) {
var Application, client, request, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

client = require("../helpers/client");

request = require("../lib/request");

module.exports = Application = (function(_super) {
  __extends(Application, _super);

  function Application() {
    this.uninstall = __bind(this.uninstall, this);
    _ref = Application.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Application.prototype.idAttribute = 'slug';

  Application.prototype.url = function() {
    var base;
    base = "/api/applications/";
    if (this.get('id')) {
      return "" + base + "byid/" + (this.get('id'));
    }
    return base;
  };

  Application.prototype.isIconSvg = function() {
    var iconType;
    iconType = this.get('iconType' || this.get('icon' || this.get('iconPath')));
    if (iconType) {
      return iconType === 'svg';
    } else {
      return true;
    }
  };

  Application.prototype.isInstalling = function() {
    return this.get('state') === 'installing';
  };

  Application.prototype.isRunning = function() {
    return this.get('state') === 'installed';
  };

  Application.prototype.isBroken = function() {
    return this.get('state') === 'broken';
  };

  Application.prototype.prepareCallbacks = function(callbacks, presuccess, preerror) {
    var error, success, _ref1,
      _this = this;
    _ref1 = callbacks || {}, success = _ref1.success, error = _ref1.error;
    if (presuccess == null) {
      presuccess = function(data) {
        var _ref2;
        if (((_ref2 = data.app) != null ? _ref2.description : void 0) != null) {
          data.app.remoteDescription = data.app.description;
          delete data.app.description;
        }
        if (data.app != null) {
          return _this.set(data.app);
        }
      };
    }
    this.trigger('request', this, null, callbacks);
    callbacks.success = function(data) {
      if (presuccess) {
        presuccess(data);
      }
      _this.trigger('sync', _this, null, callbacks);
      if (success) {
        return success(data);
      }
    };
    return callbacks.error = function(jqXHR) {
      if (preerror) {
        preerror(jqXHR);
      }
      _this.trigger('error', _this, jqXHR, {});
      if (error) {
        return error(jqXHR);
      }
    };
  };

  Application.prototype.install = function(callbacks) {
    var params;
    this.prepareCallbacks(callbacks);
    params = this.attributes;
    delete params.id;
    this.set({
      state: 'installing'
    });
    return client.post('/api/applications/install', params, callbacks);
  };

  Application.prototype.uninstall = function(callbacks) {
    var _this = this;
    this.trigger('uninstall', this, this.collection, {});
    this.prepareCallbacks(callbacks, function() {
      return _this.trigger('destroy', _this, _this.collection, {});
    });
    return client.del("/api/applications/" + this.id + "/uninstall", callbacks);
  };

  Application.prototype.updateApp = function(callbacks) {
    var _this = this;
    if (this.get('state') !== 'broken') {
      this.prepareCallbacks(callbacks);
      return client.put("/api/applications/" + this.id + "/update", {}, callbacks);
    } else {
      return client.del("/api/applications/" + this.id + "/uninstall", {
        success: function() {
          return _this.install(callbacks);
        },
        error: callbacks.error
      });
    }
  };

  Application.prototype.start = function(callbacks) {
    if (this.isRunning()) {
      return null;
    }
    this.prepareCallbacks(callbacks);
    return client.post("/api/applications/" + this.id + "/start", {}, callbacks);
  };

  Application.prototype.stop = function(callbacks) {
    if (!this.isRunning()) {
      return null;
    }
    this.prepareCallbacks(callbacks);
    return client.post("/api/applications/" + this.id + "/stop", {}, callbacks);
  };

  Application.prototype.getPermissions = function(callbacks) {
    this.prepareCallbacks(callbacks);
    return client.post("/api/applications/getPermissions", this.toJSON(), callbacks);
  };

  Application.prototype.getDescription = function(callbacks) {
    this.prepareCallbacks(callbacks);
    return client.post("/api/applications/getDescription", this.toJSON(), callbacks);
  };

  Application.prototype.getMetaData = function(callbacks) {
    this.prepareCallbacks(callbacks);
    return client.post("/api/applications/getMetaData", this.toJSON(), callbacks);
  };

  Application.prototype.getSection = function() {
    var favorite, name, section;
    section = 'misc';
    name = this.get('slug');
    favorite = this.get('favorite');
    if (favorite) {
      section = 'favorite';
    } else if (name === 'calendar' || name === 'contacts' || name === 'emails' || name === 'files' || name === 'photos') {
      section = 'main';
    } else if (name === 'blog' || name === 'feeds' || name === 'bookmarks' || name === 'quickmarks' || name === 'zero-feeds') {
      section = 'watch';
    } else if (name === 'kresus' || name === 'konnectors' || name === 'kyou' || name === 'databrowser' || name === 'import-from-google') {
      section = 'data';
    } else if (name === 'todos' || name === 'notes' || name === 'tasky' || name === 'tiddlywiki') {
      section = 'productivity';
    } else if (name === 'sync') {
      section = 'platform';
    }
    return section;
  };

  Application.prototype.updateAll = function(callback) {
    return request.put("/api/applications/update/all", {}, function(err, data) {
      return callback(err, data != null ? data.permissionChanges : void 0);
    });
  };

  Application.prototype.isOfficial = function() {
    return this.get('comment') === 'official application';
  };

  return Application;

})(Backbone.Model);
});

;require.register("models/background", function(exports, require, module) {
var Background, BaseModel, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseModel = require('lib/base_model').BaseModel;

module.exports = Background = (function(_super) {
  __extends(Background, _super);

  function Background() {
    _ref = Background.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Background.prototype.urlRoot = '/api/backgrounds/';

  Background.prototype.getSrc = function() {
    var id;
    id = this.get('id');
    if (id.indexOf('background') > -1) {
      id = id.replace('-', '_');
      return "/img/backgrounds/" + id + ".jpg";
    } else {
      return "/api/backgrounds/" + id + "/picture.jpg";
    }
  };

  Background.prototype.getThumbSrc = function() {
    var id;
    id = this.get('id');
    if (id.indexOf('background') > -1) {
      id = id.replace('-', '_');
      return "/img/backgrounds/" + id + "_th.png";
    } else {
      return "/api/backgrounds/" + id + "/thumb.jpg";
    }
  };

  return Background;

})(BaseModel);
});

;require.register("models/device", function(exports, require, module) {
var BaseModel, Device, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseModel = require('lib/base_model').BaseModel;

module.exports = Device = (function(_super) {
  __extends(Device, _super);

  function Device() {
    _ref = Device.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Device.prototype.urlRoot = 'api/devices/';

  return Device;

})(Backbone.Model);
});

;require.register("models/instance", function(exports, require, module) {
var Instance, request, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

request = require('lib/request');

module.exports = Instance = (function(_super) {
  __extends(Instance, _super);

  function Instance() {
    _ref = Instance.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Instance.prototype.saveData = function(data, callback) {
    this.set(data);
    return request.post("api/instance", data, callback);
  };

  return Instance;

})(Backbone.Model);
});

;require.register("models/notification", function(exports, require, module) {
var BaseModel, Notification, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseModel = require('lib/base_model').BaseModel;

module.exports = Notification = (function(_super) {
  __extends(Notification, _super);

  function Notification() {
    _ref = Notification.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Notification.prototype.urlRoot = 'api/notifications';

  return Notification;

})(BaseModel);
});

;require.register("models/photo", function(exports, require, module) {
var Photo, request, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

request = require('../lib/request');

module.exports = Photo = (function(_super) {
  __extends(Photo, _super);

  function Photo() {
    _ref = Photo.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Photo.prototype.defaults = function() {
    return {
      thumbsrc: 'img/loading.gif',
      src: '',
      orientation: 1
    };
  };

  Photo.prototype.url = function() {
    return Photo.__super__.url.apply(this, arguments) + app.urlKey;
  };

  Photo.prototype.parse = function(attrs) {
    if (!attrs.id) {
      return attrs;
    } else {
      return _.extend(attrs, {
        thumbsrc: ("photos/thumbs/" + attrs.id + ".jpg") + app.urlKey,
        src: ("photos/" + attrs.id + ".jpg") + app.urlKey,
        orientation: attrs.orientation
      });
    }
  };

  Photo.prototype.getPrevSrc = function() {
    return "photos/" + (this.get('id')) + ".jpg";
  };

  return Photo;

})(Backbone.Model);

Photo.getMonthdistribution = function(callback) {
  return request.get("files/photo/monthdistribution", callback);
};

Photo.listFromFiles = function(skip, limit, callback) {
  return request.get("files/photo/range/" + skip + "/" + limit, callback);
};

Photo.makeFromFile = function(fileid, attr, callback) {
  return request.post("files/" + fileid + "/toPhoto", attr, callback);
};
});

;require.register("models/stack_application", function(exports, require, module) {
var StackApplication, request, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

request = require("../lib/request");

module.exports = StackApplication = (function(_super) {
  __extends(StackApplication, _super);

  function StackApplication() {
    _ref = StackApplication.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  StackApplication.prototype.idAttribute = 'name';

  StackApplication.prototype.url = function() {
    var base;
    base = "/api/applications/stack";
    if (this.get('id')) {
      return "" + base + "byid/" + (this.get('id'));
    }
    return base;
  };

  StackApplication.prototype.waitServerIsUp = function(remainingSteps, callback) {
    var _this = this;
    return request.head("api/applications/stack", function(err) {
      if (err) {
        console.log('Server looks down...');
      } else {
        console.log('Server looks up...');
        remainingSteps--;
      }
      if (remainingSteps === 0) {
        console.log('Server is up!');
        return callback();
      } else {
        return setTimeout(function() {
          return _this.waitServerIsUp(remainingSteps, callback);
        }, 1000);
      }
    });
  };

  StackApplication.prototype.updateStack = function(callback) {
    var _this = this;
    return request.put("/api/applications/update/stack", {}, function(err) {
      console.log('Waiting for reboot...');
      return _this.waitServerIsUp(3, callback);
    });
  };

  StackApplication.prototype.rebootStack = function(callback) {
    var _this = this;
    return request.put("/api/applications/reboot/stack", {}, function(err) {
      console.log('Waiting for reboot...');
      return _this.waitServerIsUp(3, callback);
    });
  };

  return StackApplication;

})(Backbone.Model);
});

;require.register("models/token", function(exports, require, module) {
var Token, client;

client = require('helpers/client');

module.exports = Token = (function() {
  function Token(name) {
    this.name = name;
  }

  Token.prototype.getToken = function(callbacks) {
    return client.get("api/getToken/" + this.name, callbacks);
  };

  return Token;

})();
});

;require.register("models/user", function(exports, require, module) {
var BaseModel, User, client,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseModel = require('lib/base_model').BaseModel;

client = require('lib/request');

module.exports = User = (function(_super) {
  __extends(User, _super);

  function User(email, password) {
    this.email = email;
    this.password = password;
    User.__super__.constructor.call(this);
  }

  User.prototype.logout = function(callback) {
    return client.get("logout/", callback);
  };

  return User;

})(BaseModel);
});

;require.register("routers/main_router", function(exports, require, module) {
var MainRouter, ObjectPickerCroper, Token, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ObjectPickerCroper = require('../views/object_picker');

Token = require("../models/token");

module.exports = MainRouter = (function(_super) {
  __extends(MainRouter, _super);

  function MainRouter() {
    _ref = MainRouter.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  MainRouter.prototype.routes = {
    "home": "applicationList",
    "customize": "applicationListEdit",
    "applications": "market",
    "config-applications": "configApplications",
    "account": "account",
    "logout": "logout",
    "update/:slug": "updateApp",
    "update-stack": "updateStack",
    "apps/:slug": "application",
    "apps/:slug/*hash": "application",
    "*path": "applicationList",
    '*notFound': 'applicationList'
  };

  MainRouter.prototype.initialize = function() {
    var _this = this;
    return window.addEventListener('message', function(event) {
      var e, intent, intentType, path, slug, token;
      if (event.origin !== window.location.origin) {
        return false;
      }
      intent = event.data;
      switch (intent.action) {
        case 'getToken':
          path = event.source.location.pathname;
          slug = path.replace('/apps/', '');
          if (slug.slice(-1 === '/')) {
            slug = slug.replace('/', '');
          }
          token = new Token(slug);
          return token.getToken({
            success: function(data) {
              return app.mainView.displayToken(data.token, slug);
            },
            error: function(message) {
              return alert('Server error occured, get token failed.');
            }
          });
        case 'goto':
          return _this.navigate("apps/" + intent.params, true);
        case void 0:
          intentType = 'application/x-talkerjs-v1+json';
          try {
            if (JSON.parse(intent).type !== intentType) {
              return console.log("Weird intent, cannot handle it", intent);
            }
          } catch (_error) {
            e = _error;
            console.log("Weird intent, cannot handle it", intent);
            return window.onerror("Error handling intent: " + intent, "MainRouter.initialize", null, null, new Error());
          }
          break;
        default:
          return console.log("Weird intent, cannot handle it.", intent);
      }
    });
  };

  MainRouter.prototype.applicationList = function() {
    return app.mainView.displayApplicationsList();
  };

  MainRouter.prototype.configApplications = function() {
    return app.mainView.displayConfigApplications();
  };

  MainRouter.prototype.updateApp = function(slug) {
    return app.mainView.displayUpdateApplication(slug);
  };

  MainRouter.prototype.updateStack = function() {
    return app.mainView.displayUpdateStack();
  };

  MainRouter.prototype.market = function() {
    return app.mainView.displayMarket();
  };

  MainRouter.prototype.account = function() {
    return app.mainView.displayAccount();
  };

  MainRouter.prototype.application = function(slug, hash) {
    return app.mainView.displayApplication(slug, hash);
  };

  MainRouter.prototype.logout = function() {
    return app.mainView.logout();
  };

  return MainRouter;

})(Backbone.Router);
});

;require.register("templates/account", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div id="account-form" class="lightgrey pa2"><div class="line"><div class="mod left w50 pa2 personalisation"><h4>');
var __val__ = t('account personalization')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h4><p><p>');
var __val__ = t('account background selection')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><div class="background-list line mb1"></div><button id="background-add-button" class="btn w100">');
var __val__ = t('account background add')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></p></div><div class="mod left w50 pa2"><h4>');
var __val__ = t('account identifiers')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h4><div class="input"><p>');
var __val__ = t('alerts and password recovery email')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><div class="account-field fied-with-btn"><input id="account-email-field"/><button class="btn">');
var __val__ = t('save')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></div><p class="error email hide"></p></div><div class="input"><p>');
var __val__ = t('public name description')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><div class="account-field fied-with-btn"><input id="account-public-name-field"/><button class="btn">');
var __val__ = t('save')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></div><p class="error public-name hide"></p></div><div class="input"><p>');
var __val__ = t('domain name for urls and email')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><div class="account-field fied-with-btn"><input id="account-domain-field"/><button class="btn">');
var __val__ = t('save')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></div><p class="error domain hide"></p></div><h4>');
var __val__ = t('account localization')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h4><div class="input"><p>');
var __val__ = t('account timezone field description')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><div class="account-field"><select id="account-timezone-field"></select></div></div><div class="input"><p>');
var __val__ = t('account language field description')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><div class="account-field"><select id="account-locale-field"><option value="fr">');
var __val__ = t('french')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</option><option value="en">');
var __val__ = t('english')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</option><option value="de">');
var __val__ = t('german')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</option><option value="es">');
var __val__ = t('spanish')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</option><option value="ko">');
var __val__ = t('korean')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</option><option value="ja">');
var __val__ = t('japanese')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</option></select></div></div><h4>');
var __val__ = t('account password')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h4><div id="change-password-form"><div class="account-field"><p><label>');
var __val__ = t('input your current password')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</label></p><input');
buf.push(attrs({ 'id':('account-password0-field'), 'type':("password"), 'placeholder':("" + (t('current password')) + "") }, {"type":true,"placeholder":true}));
buf.push('/></div><div class="account-field"><p><label>');
var __val__ = t('enter a new password')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</label></p><input');
buf.push(attrs({ 'id':('account-password1-field'), 'type':("password"), 'placeholder':("" + (t('new password')) + "") }, {"type":true,"placeholder":true}));
buf.push('/></div><div class="account-field"><p><label>');
var __val__ = t('confirm new password')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</label></p><input');
buf.push(attrs({ 'id':('account-password2-field'), 'type':("password"), 'placeholder':("" + (t('new password')) + "") }, {"type":true,"placeholder":true}));
buf.push('/></div><p><div class="account-field"><button id="account-form-button" class="full-width">');
var __val__ = t('save your new password')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></div><p class="loading-indicator">&nbsp;</p><div id="account-info" class="alert main-alert alert-success hide"><div id="account-info-text">');
var __val__ = t('account change password success')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div></div><div id="account-error" class="alert alert-error main-alert hide"><div id="account-form-error-text">');
var __val__ = t('account change password error')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div></div></p></div></div></div></div>');
}
return buf.join("");
};
});

require.register("templates/album_thumb", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="albumLabel"><img class="cover"/><div class="label"></div></div>');
}
return buf.join("");
};
});

require.register("templates/application_iframe", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<iframe');
buf.push(attrs({ 'src':("apps/" + (id) + "/" + (hash) + ""), 'id':("" + (id) + "-frame") }, {"src":true,"id":true}));
buf.push('></iframe>');
}
return buf.join("");
};
});

require.register("templates/background_list", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
}
return buf.join("");
};
});

require.register("templates/background_list_item", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<button class="delete-background-button btn right ma1"><i class="fa fa-trash"></i></button><img');
buf.push(attrs({ 'src':("" + (model.src) + ""), "class": ('w100') + ' ' + ('left') }, {"src":true}));
buf.push('/>');
}
return buf.join("");
};
});

require.register("templates/config_application", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="icon-container"><img src="/img/spinner-white-thin.svg" class="spinner"/><img src="" class="icon"/></div><div class="infos"><div class="line"><strong><a');
buf.push(attrs({ 'href':("#apps/" + (app.slug) + ""), "class": ('app') }, {"href":true}));
buf.push('>');
var __val__ = app.displayName
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a></strong><button');
buf.push(attrs({ 'title':("" + (t('update')) + ""), "class": ('update-app') + ' ' + ('outline-blue') }, {"title":true}));
buf.push('><i class="fa fa-refresh"></i><span>');
var __val__ = t('update')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></button></div><div class="line">');
if ( app.version)
{
buf.push('<span>' + escape((interp = app.version) == null ? '' : interp) + '</span>');
}
buf.push('<span>&nbsp;-&nbsp;</span>');
if ( app.state === 'installed')
{
buf.push('<span class="state-label">');
var __val__ = t('running')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span>');
}
else
{
buf.push('<span class="state-label">' + escape((interp = app.state) == null ? '' : interp) + '</span>');
}
buf.push('</div><div class="line"><div class="comments"><a');
buf.push(attrs({ 'href':("" + (app.websiteUrl) + ""), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('>');
var __val__ = app.website
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a><span>(' + escape((interp = app.branch) == null ? '' : interp) + ')</span></div></div></div><div class="buttons">');
if ( app.favorite)
{
buf.push('<button');
buf.push(attrs({ 'title':("" + (t('config application unmark favorite')) + ""), "class": ('transparent-grey') + ' ' + ('favorite') }, {"title":true}));
buf.push('><i class="fa fa-star">   </i></button>');
}
else
{
buf.push('<button');
buf.push(attrs({ 'title':("" + (t('config application mark favorite')) + ""), "class": ('transparent-grey') + ' ' + ('favorite') }, {"title":true}));
buf.push('><i class="fa fa-star-o">   </i></button>');
}
buf.push('<a');
buf.push(attrs({ 'href':("/logs/" + (app.slug) + ""), 'target':("_blank"), 'title':("" + (t('show logs')) + ""), 'role':("button"), "class": ('transparent-grey') + ' ' + ('logs') }, {"href":true,"target":true,"title":true,"role":true}));
buf.push('><i class="fa fa-code"></i></a>');
if ( app.state === "stopped")
{
buf.push('<button');
buf.push(attrs({ 'title':("" + (t('start this app')) + ""), "class": ('transparent-grey') + ' ' + ('stopped') + ' ' + ('start-stop-btn') }, {"title":true}));
buf.push('><i class="fa fa-power-off"></i></button>');
}
else
{
buf.push('<button');
buf.push(attrs({ 'title':("" + (t('stop this app')) + ""), "class": ('transparent-grey') + ' ' + ('start-stop-btn') }, {"title":true}));
buf.push('><i class="fa fa-power-off"></i></button>');
}
buf.push('<button');
buf.push(attrs({ 'title':("" + (t('remove')) + ""), "class": ('transparent-grey') + ' ' + ('remove-app') }, {"title":true}));
buf.push('><i class="fa fa-trash"></i></button></div>');
}
return buf.join("");
};
});

require.register("templates/config_application_list", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
}
return buf.join("");
};
});

require.register("templates/config_applications", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="md-overlay"></div><div class="line platform-section"><div class="status-section"><div class="mod left w70"><div class="platform"><h4>');
var __val__ = t('cozy platform')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h4><div class="stack-app mt2 line"><div class="version"><div class="line"><span class="app">Data System: </span><span class="version-number data-system">--</span><a href="/logs/data-system" target="_blank" class="small">');
var __val__ = t('show logs')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a></div><div class="line"><span class="app">Proxy: </span><span class="version-number proxy">--</span><a href="/logs/proxy" target="_blank" class="small">');
var __val__ = t('show logs')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a></div><div class="line"><span class="app">Home: </span><span class="version-number home">--</span><a href="/logs/home" target="_blank" class="small">');
var __val__ = t('show logs')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a></div><div class="line"><span class="app">Controller: </span><span class="version-number controller">--</span></div></div><div class="mod buttons"><button class="update-all small"><i class="fa fa-refresh mr1"></i><span>');
var __val__ = t('update all')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></button><button class="reboot-stack small outline-blue"><i class="fa fa-power-off mr1"></i><span>');
var __val__ = t('reboot stack')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></button></div></div></div><h4 class="title-app h4">');
var __val__ = t('manage your applications')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h4></div><div class="mod left w30"><section><h4>');
var __val__ = t('hardware consumption')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h4><div class="block-container"><div class="info-block disk-space"><div class="icon-hard-drive"></div><div><span class="title">');
var __val__ = t('status hard drive label')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span><div class="line"><span class="amount">0</span><div class="lowlight"> / <span class="total">0</span> ' + escape((interp = t('gigabytes')) == null ? '' : interp) + '</div></div></div></div><div class="info-block memory-free"><div class="icon-speed-counter"></div><div><span class="title">');
var __val__ = t('status memory label')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span><div class="line"><span class="amount">0</span><div class="lowlight"> / <span class="total">0</span> ' + escape((interp = t('megabytes')) == null ? '' : interp) + '</div></div></div></div></div></section><section><h4 class="title-device h4">');
var __val__ = t('manage your devices')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h4><div class="no-device"><p>');
var __val__ = t('mobile app promo')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><a role="button" href="https://files.cozycloud.cc/android/CozyMobile_lastest.apk"><i class="fa fa-android"></i><span>');
var __val__ = t('download apk')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></a><a target="_blank" href="https://play.google.com/store/apps/details?id=io.cozy.files_client"><img src="img/en-play-badge.png"/></a></div></section></div></div></div>');
}
return buf.join("");
};
});

require.register("templates/config_device", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="mod"><strong>' + escape((interp = device.login) == null ? '' : interp) + '</strong></div><div class="buttons"><button class="remove-device transparent-grey"><i class="fa fa-trash mr1"></i> <span class="label">');
var __val__ = t('revoke device access')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></button></div>');
}
return buf.join("");
};
});

require.register("templates/config_device_list", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
}
return buf.join("");
};
});

require.register("templates/error_modal", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="md-content"><div class="md-header clearfix"><div class="line"><h3 class="left">');
var __val__ = t('app broken title')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h3></div></div><div class="md-body"><strong>' + escape((interp = t('app broken')) == null ? '' : interp) + '</strong><a href="#config-applications">' + escape((interp =  t('reinstall broken app')) == null ? '' : interp) + '</a><br/><span>' + escape((interp = t('app msg')) == null ? '' : interp) + '</span><br/><br/><span>' + escape((interp = errortype) == null ? '' : interp) + '</span><br/><br/><button id="more" class="btn">');
var __val__ = t('more details')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button><br/><br/><p class="details">');
var __val__ = details
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p></div><div class="md-footer clearfix">');
if ( cancel)
{
buf.push('<button id="cancelbtn" class="transparent-grey">');
var __val__ = cancel
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button>');
}
buf.push('<button id="ok" class="btn right">');
var __val__ = ok
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></div></div>');
}
return buf.join("");
};
});

require.register("templates/help", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="mod pa2 help-section"><h2>');
var __val__ = t('help community title')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h2><div class="line"><a href="https://forum.cozy.io" target="_blank"><i class="icon-small forum"></i><span>');
var __val__ = t('help forum title')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></a><a href="https://webchat.freenode.net/?channels=cozycloud" target="_blank"><i class="icon-small irc"></i><span>');
var __val__ = t('help IRC title')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></a><a href="https://github.com/cozy" target="_blank"><i class="icon-small github"></i><span>');
var __val__ = t('help github title')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></a></div></div><div class="mod pa2 help-section"><h2>');
var __val__ = t('help support title')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h2><div class="line"><a href="mailto:support@cozycloud.cc"><i class="icon-small contact"></i><span>');
var __val__ = t('help email title')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></a><a href="https://twitter.com/intent/tweet?text=@mycozycloud%20" target="_blank"><i class="icon-small twitter"></i><span>');
var __val__ = t('help twitter title')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></a><a href="https://cozy.io" target="_blank"><i class="icon-small doc"></i><span>');
var __val__ = t('help documentation title')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></a></div></div><div class="mod pa2 help-section"><h2>');
var __val__ = t('help direct title')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h2><textarea id="send-message-textarea" class="mt2 w100"></textarea><p class="help-logs"><input id="send-message-logs" type="checkbox" checked="checked"/><label for="send-message-logs">');
var __val__ = t('help send logs')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</label></p><button id="send-message-button" class="btn send-message-btn"><div class="fa fa-paper-plane"></div><span>');
var __val__ = t('help send message action')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></button><div id="send-message-error" class="alert main-alert alert-error w100">');
var __val__ = t('send message error')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div><div id="send-message-success" class="alert main-alert alert-success w100">');
var __val__ = t('send message success')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div></div>');
}
return buf.join("");
};
});

require.register("templates/help_url", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="line"><p class="help-text mt2">');
var __val__ = t('The first place to find help is:')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><p class="help-text"><a');
buf.push(attrs({ 'href':("" + (helpUrl) + "") }, {"href":true}));
buf.push('>' + escape((interp = helpUrl) == null ? '' : interp) + '</a></p></div>');
}
return buf.join("");
};
});

require.register("templates/home", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div id="no-app-message" class="w600"><div id="start-title" class="darkbg clearfix"><a href="https://cozy.io"><img src="img/happycloud.png" class="logo"/></a><p class="biggest">');
var __val__ = t('welcome to your cozy')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p></div><p class="bigger">');
var __val__ = t('you have no apps')
buf.push(null == __val__ ? "" : __val__);
buf.push('</p><p class="bigger">');
var __val__ = t('noapps.customize your cozy', {account: '#account', appstore: '#applications'})
buf.push(null == __val__ ? "" : __val__);
buf.push('</p></div><div id="app-list"><section id="apps-favorite" class="line"><h2>');
var __val__ = t('home section favorites')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h2><div class="application-container"></div></section><section id="apps-leave" class="line"><h2>');
var __val__ = t('home section leave')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h2><div class="application-container"></div></section><section id="apps-main" class="line"><h2>');
var __val__ = t('home section main')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h2><div class="application-container"></div></section><section id="apps-productivity" class="line"><h2>');
var __val__ = t('home section productivity')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h2><div class="application-container"></div></section><section id="apps-data" class="line"><h2>');
var __val__ = t('home section data management')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h2><div class="application-container"></div></section><section id="apps-watch" class="line"><h2>');
var __val__ = t('home section personal watch')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h2><div class="application-container"></div></section><section id="apps-misc" class="line"><h2>');
var __val__ = t('home section misc')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h2><div class="application-container"></div></section><section id="apps-platform" class="line show"><h2>');
var __val__ = t('home section platform')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h2><div class="application-container"><div class="application mod w360-33 w640-25 full-20 left platform-app"><div class="application-inner"><a href="#applications"><img src="img/apps/store.svg" class="icon"/><p class="app-title">');
var __val__ = t('app store')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p></a></div></div><div class="application mod w360-33 w640-25 full-20 left platform-app"><div class="application-inner"><a href="#config-applications"><img src="img/apps/my-apps.svg" class="icon svg"/><p class="app-title">');
var __val__ = t('app status')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p></a></div></div><div class="application mod w360-33 w640-25 full-20 left platform-app"><div href="#account" class="application-inner"><a href="#account"><img src="img/apps/settings.svg" class="icon svg"/><p class="app-title">');
var __val__ = t('settings')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p></a></div></div></div></section></div>');
}
return buf.join("");
};
});

require.register("templates/home_application", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="application-inner"><div class="vertical-aligner"><img src="" class="icon"/><img src="/img/spinner-white-thin.svg" class="spinner"/><p class="app-title">' + escape((interp = app.displayName) == null ? '' : interp) + '</p></div></div>');
}
return buf.join("");
};
});

require.register("templates/layout", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<header id="header" class="navbar"></header><div id="notifications-menu" class="right-menu"><div class="top-title"><h2>');
var __val__ = t('notifications')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h2><button id="dismiss-all" class="btn outline-darkgrey small"><span>');
var __val__ = t('dismiss all')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></button></div><div id="notifications"><ul id="notifications-list"><li id="no-notif-msg"></li></ul></div></div><div id="help-menu" class="right-menu"></div><div class="home-body"><div id="app-frames"></div><div id="content"><!-- Preload spinners and hover icons--><img src="/img/spinner.svg" class="hidden"/><img src="/img/spinner-white.svg" class="hidden"/><div id="home-content"></div></div></div>');
}
return buf.join("");
};
});

require.register("templates/long_list_image", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="viewPort"><div class="thumbs"></div></div><div class="index"></div>');
}
return buf.join("");
};
});

require.register("templates/market", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="platform-section"><div id="app-market-list"><div id="market-applications-list"><div id="no-app-message">');
var __val__ = t('installed everything')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div></div></div><div id="your-app" class="clearfix"><h2>');
var __val__ = t('install your app')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h2><div class="text"><p>');
var __val__ = t('market install your app')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><p class="add-app-field fied-with-btn"><input type="text" id="app-git-field" placeholder="https://github.com/username/repository.git@branch" class="span3"/><button class="btn app-install-button">');
var __val__ = t('install')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></p><div class="error alert-error"></div><div class="info alert"></div><p class="more">');
var __val__ = t('market install your app tutorial')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('<a href="https://docs.cozy.io/en/hack/getting-started/" target="_blank">');
var __val__ = t('market app tutorial')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a>.</p></div></div></div><div class="md-overlay"></div>');
}
return buf.join("");
};
});

require.register("templates/market_application", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="app-img">');
if ( app.svgSpriteSlug)
{
buf.push('<img');
buf.push(attrs({ "class": (app.svgSpriteSlug) }, {"class":true}));
buf.push('/>');
}
else
{
buf.push('<img');
buf.push(attrs({ 'src':("" + (app.icon) + "") }, {"src":true}));
buf.push('/>');
}
buf.push('<span class="installing-label">');
var __val__ = t("market app install")
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></div><div class="app-text"><h3>' + escape((interp = app.displayName) == null ? '' : interp) + '');
if ( app.beta)
{
buf.push('<span class="beta">Beta</span>');
}
buf.push('</h3><span class="comment">');
var __val__ = t(app.comment)
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span><p>');
var __val__ = t(app.description)
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><div class="btn-group"><button class="outline-blue small">');
var __val__ = t("install")
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button><a');
buf.push(attrs({ 'href':("" + (app.git) + ""), 'target':("_blank"), 'role':("button"), "class": ('transparent-grey') + ' ' + ('small') + ' ' + ('website') }, {"href":true,"target":true,"role":true}));
buf.push('><div class="fa fa-github"></div><span>');
var __val__ = t("github")
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></a>');
if ( app.website !== undefined)
{
buf.push('<a');
buf.push(attrs({ 'href':("" + (app.website) + ""), 'target':("_blank"), 'role':("button"), "class": ('transparent-grey') + ' ' + ('small') + ' ' + ('website') }, {"href":true,"target":true,"role":true}));
buf.push('><div class="fa fa-link"></div><span>');
var __val__ = t("website")
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></a>');
}
buf.push('</div></div>');
}
return buf.join("");
};
});

require.register("templates/menu_application", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<a');
buf.push(attrs({ 'href':("#apps/" + (model.slug) + "/") }, {"href":true}));
buf.push('>' + escape((interp = model.displayName) == null ? '' : interp) + '</a>');
}
return buf.join("");
};
});

require.register("templates/menu_applications", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div id="menu-applications-toggle"><span id="current-application"></span></div>');
}
return buf.join("");
};
});

require.register("templates/navbar", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="navbar clearfix"><a');
buf.push(attrs({ 'id':('logout-button'), 'href':("#logout"), 'title':("" + (t('logout')) + ""), "class": ('btn-navbar') + ' ' + ('sign-out') + ' ' + ('right') }, {"href":true,"title":true}));
buf.push('><i class="fa fa-sign-out"></i></a><a');
buf.push(attrs({ 'id':('help-toggle'), 'href':("#help"), 'title':("" + (t('help')) + ""), "class": ('btn-navbar') + ' ' + ('right') }, {"href":true,"title":true}));
buf.push('><i class="fa fa-question-circle"></i></a><div id="notifications-container" class="right"></div><a');
buf.push(attrs({ 'href':("#home"), 'title':("" + (t('navbar back button title')) + ""), "class": ('back-button') + ' ' + ('left') }, {"href":true,"title":true}));
buf.push('><div class="fa fa-chevron-left"></div><span>');
var __val__ = t("navbar back button title")
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></a><div id="menu-applications-container"></div></div>');
}
return buf.join("");
};
});

require.register("templates/navbar_app_btn", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<li class="app-button"><a');
buf.push(attrs({ 'id':("" + (app.slug) + ""), 'href':("#apps/" + (app.slug) + "") }, {"id":true,"href":true}));
buf.push('><img');
buf.push(attrs({ 'src':("/apps/" + (app.slug) + "/favicon.ico") }, {"src":true}));
buf.push('/></a></li>');
}
return buf.join("");
};
});

require.register("templates/notification", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<a class="dismiss">&times;</a><div class="notification-text">' + escape((interp = model.text) == null ? '' : interp) + '</div><div class="notification-date">' + escape((interp = model.date) == null ? '' : interp) + '</div>');
if ( model.actionText !== undefined && model.actionText !== null)
{
if ( model.update)
{
buf.push('<a class="doaction btn outline-blue"><i class="fa fa-refresh"></i>');
var __val__ = t(model.actionText)
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a>');
}
else
{
buf.push('<a class="doaction btn grey">');
var __val__ = t(model.actionText)
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a>');
}
}
}
return buf.join("");
};
});

require.register("templates/notifications", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<a');
buf.push(attrs({ 'id':('notifications-toggle'), 'title':("" + (t('navbar notifications')) + ""), "class": ('btn-navbar') }, {"title":true}));
buf.push('><i class="fa fa-bell"></i><span id="notifications-counter"></span></a><div id="clickcatcher"></div>');
}
return buf.join("");
};
});

require.register("templates/object_picker", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<!-- never displayed, just for downloading.--><img id="img-result"/><div class="objectPickerCont"><nav role="tablist" aria-controls="objectPickerCont" class="fp-nav-tabs"></nav></div><div class="croperCont"><div class="frame-to-crop"><div id="img-to-crop"></div></div><div id="frame-preview"><img id="img-preview"/></div></div>');
}
return buf.join("");
};
});

require.register("templates/object_picker_photourl", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="bloc-container"><div class="img-container"><div class="url-preview"></div></div><input');
buf.push(attrs({ 'placeholder':("" + (t('url of an image')) + ""), 'value':(""), "class": ('modal-url-input') }, {"placeholder":true,"value":true}));
buf.push('/></div>');
}
return buf.join("");
};
});

require.register("templates/object_picker_upload", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="modal-file-drop-zone"><p>' + escape((interp = t('drop a file')) == null ? '' : interp) + '</p><div class="drop-zone"></div><div class="photoUpload-btn"><button class="btn">' + escape((interp = t('ObjPicker upload btn')) == null ? '' : interp) + '</button></div></div><input type="file" style="display:none" class="uploader"/>');
}
return buf.join("");
};
});

require.register("templates/popover_description", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="md-content"><div class="md-header clearfix"><div class="line"><h3 class="left">' + escape((interp = model.displayName) == null ? '' : interp) + '</h3></div>');
if ( (model.comment !== 'official application'))
{
buf.push('<div class="line noncozy-warning"><i class="fa fa-info-circle"></i><span>');
var __val__ = t('warning unofficial app')
buf.push(null == __val__ ? "" : __val__);
buf.push('</span></div>');
}
buf.push('</div><div class="md-body"></div><div class="md-footer"><button id="cancelbtn" class="btn transparent-grey">');
var __val__ = t('cancel')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button><button id="confirmbtn" class="btn">');
var __val__ = t('install')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></div></div>');
}
return buf.join("");
};
});

require.register("templates/popover_permissions", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="md-header mt2">');
var __val__ = t('Once updated, this application will require the following permissions:')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div><div class="md-body"><div>&nbsp;</div></div><div class="md-footer mt2"><a id="cancelbtn" class="btn transparent-grey">');
var __val__ = t('cancel')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a>');
if ( model.state === 'broken')
{
buf.push('<a id="confirmbtn" class="btn">');
var __val__ = t('confirm install')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a>');
}
else
{
buf.push('<a id="confirmbtn" class="btn">');
var __val__ = t('confirm update')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a>');
}
buf.push('</div>');
}
return buf.join("");
};
});

require.register("templates/tutorial", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<!--.section-title.darkbg.bigger help--><line class="w800 lightgrey"><h4 class="help-text darkbg pa2">');
var __val__ = t('tutorial title')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h4><div id="tuto-files" class="line pa2 question"><p class="help-text mt2">');
var __val__ = t('tutorial question files')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><p class="center"><button id="files-no" class="btn">');
var __val__ = t('tutorial no')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button><button id="files-yes" class="btn">');
var __val__ = t('tutorial yes')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></p></div><div id="tuto-emails" class="line pa2 question"><p class="help-text mt2">');
var __val__ = t('tutorial question emails')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><p class="center"><button id="emails-no" class="btn">');
var __val__ = t('tutorial no')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button><button id="emails-yes" class="btn">');
var __val__ = t('tutorial yes')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></p></div><div id="tuto-calendar" class="line pa2 question"><p class="help-text mt2">');
var __val__ = t('tutorial question calendar')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><p class="center"><button id="calendar-no" class="btn">');
var __val__ = t('tutorial no')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button><button id="calendar-yes" class="btn">');
var __val__ = t('tutorial yes')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></p></div><div id="tuto-contacts" class="line pa2 question"><p class="help-text mt2">');
var __val__ = t('tutorial question contacts')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><p class="center"><button id="contacts-no" class="btn">');
var __val__ = t('tutorial no')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button><button id="contacts-yes" class="btn">');
var __val__ = t('tutorial yes')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></p></div><div id="tuto-photos" class="line pa2 question"><p class="help-text mt2">');
var __val__ = t('tutorial question photos')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><p class="center"><button id="photos-no" class="btn">');
var __val__ = t('tutorial no')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button><button id="photos-yes" class="btn">');
var __val__ = t('tutorial yes')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></p></div><div id="end-screen" class="line pa2 question"><p class="help-text mt2">');
var __val__ = t('tutorial final headline')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><ul><li><a href="https://docs.cozy.io/en/mobile/files.html">');
var __val__ = t('tutorial doc files link')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a></li><li><a href="https://docs.cozy.io/en/mobile/contacts.html">');
var __val__ = t('tutorial doc contacts link')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a></li><li><a href="https://docs.cozy.io/en/mobile/calendar.html">');
var __val__ = t('tutorial doc calendar link')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a></li></ul><p class="center"><a href="#home" class="btn">');
var __val__ = t('tutorial final button')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a></p></div></line>');
}
return buf.join("");
};
});

require.register("templates/update_stack_modal", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="md-content"><div class="md-header clearfix"><div class="line"><h3 class="left">');
var __val__ = t('update stack modal title')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h3></div></div><div class="md-body"><p class="step1">');
var __val__ = t('update stack modal content')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><p class="step2">');
var __val__ = t('update stack waiting message')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><p class="success">');
var __val__ = t('update stack success')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><div class="permission-changes"><h5>');
var __val__ = t('update stack warning')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h5><p>');
var __val__ = t('update stack permission changes')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p></div><p class="error stack-error title">');
var __val__ = t('update stack error title')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><p class="error stack-error">');
var __val__ = t('update stack error')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><p class="error apps-error title">');
var __val__ = t('update apps error title')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><p class="error apps-error">');
var __val__ = t('update apps error')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><h5 class="error apps-error">');
var __val__ = t('update apps error list title')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h5></div><div class="md-footer clearfix"><button id="cancelbtn" class="transparent-grey">');
var __val__ = t('cancel')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button><button id="confirmbtn" class="btn">');
var __val__ = t('update stack modal confirm')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button><button id="ok">');
var __val__ = t('ok')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></div></div>');
}
return buf.join("");
};
});

require.register("views/account", function(exports, require, module) {
var Background, BackgroundList, BaseView, Instance, ObjectPicker, locales, request, timezones, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

Background = require('../models/background');

timezones = require('helpers/timezone').timezones;

locales = require('helpers/locales').locales;

request = require('lib/request');

BackgroundList = require('views/background_list');

Instance = require('models/instance');

ObjectPicker = require('./object_picker');

module.exports = exports.AccountView = (function(_super) {
  __extends(AccountView, _super);

  function AccountView() {
    this.onBackgroundChanged = __bind(this.onBackgroundChanged, this);
    this.onNewPasswordSubmit = __bind(this.onNewPasswordSubmit, this);
    _ref = AccountView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  AccountView.prototype.id = 'account-view';

  AccountView.prototype.template = require('templates/account');

  AccountView.prototype.events = {
    'click #background-add-button': 'onAddBackgroundClicked'
  };

  AccountView.prototype.afterRender = function() {
    var timezone, _i, _len,
      _this = this;
    this.emailField = this.$('#account-email-field');
    this.publicNameField = this.$('#account-public-name-field');
    this.timezoneField = this.$('#account-timezone-field');
    this.domainField = this.$('#account-domain-field');
    this.localeField = this.$('#account-locale-field');
    this.infoAlert = this.$('#account-info');
    this.infoAlert.hide();
    this.errorAlert = this.$('#account-error');
    this.errorAlert.hide();
    this.changePasswordForm = this.$('#change-password-form');
    this.accountSubmitButton = this.$('#account-form-button');
    this.accountSubmitButton.click(function(event) {
      event.preventDefault();
      return _this.onNewPasswordSubmit();
    });
    for (_i = 0, _len = timezones.length; _i < _len; _i++) {
      timezone = timezones[_i];
      this.timezoneField.append("<option value=\"" + timezone + "\">" + timezone + "</option>");
    }
    this.backgroundList = new BackgroundList({
      el: this.$('.background-list')
    });
    this.backgroundList.collection.on('change', this.onBackgroundChanged);
    this.backgroundAddButton = this.$('#background-add-button');
    this.fetchData();
    if (window.managed) {
      this.$('#account-domain-field')[0].disabled = true;
      return this.$('#account-domain-field').parent().find('.btn').hide();
    }
  };

  AccountView.prototype.onNewPasswordSubmit = function(event) {
    var form, hideFunc, showError,
      _this = this;
    form = {
      password0: this.password0Field.val(),
      password1: this.password1Field.val(),
      password2: this.password2Field.val()
    };
    this.infoAlert.hide();
    this.errorAlert.hide();
    hideFunc = null;
    showError = function(message) {
      _this.errorAlert.html(t(message));
      _this.errorAlert.fadeIn();
      clearTimeout(hideFunc);
      return hideFunc = setTimeout(function() {
        return _this.errorAlert.fadeOut();
      }, 10000);
    };
    if (form.password1.length < 5) {
      return showError('account change password short');
    } else if (form.password1 !== form.password2) {
      return showError('account change password difference');
    } else {
      this.accountSubmitButton.spin(true);
      return request.post('api/user', form, function(err, data) {
        _this.accountSubmitButton.spin(false);
        if (err) {
          _this.password0Field.val(null);
          _this.password1Field.val(null);
          _this.password2Field.val(null);
          return showError('account change password error');
        } else {
          if (data.success) {
            _this.infoAlert.show();
            _this.password0Field.val(null);
            _this.password1Field.val(null);
            _this.password2Field.val(null);
            return setTimeout(function() {
              return _this.infoAlert.hide();
            }, 10000);
          } else {
            return showError('account change password error');
          }
        }
      });
    }
  };

  AccountView.prototype.getSaveFunction = function(fieldName, fieldWidget, path) {
    var alertMsg, saveButton, saveFunction;
    saveButton = fieldWidget.parent().find('.btn');
    alertMsg = this.$(".error." + fieldName);
    saveFunction = function() {
      var data;
      saveButton.spin(true);
      data = {};
      data[fieldName] = fieldWidget.val();
      return request.post("api/" + path, data, function(err) {
        saveButton.spin(false);
        if (err) {
          err = err.toString();
          err = err.replace('Error: ', '');
          saveButton.addClass('red');
          saveButton.html(t('error'));
          alertMsg.html("" + (t(err)));
          return alertMsg.show();
        } else {
          saveButton.removeClass('red');
          saveButton.addClass('green');
          saveButton.html(t('saved'));
          alertMsg.hide();
          if (fieldName === 'locale') {
            alert(t('changing locale requires reload'));
            window.location.reload();
          }
          return setTimeout(function() {
            if (fieldName === 'locale') {
              return window.location.reload();
            }
          }, 1000);
        }
      });
    };
    saveButton.click(saveFunction);
    return saveFunction;
  };

  AccountView.prototype.fetchData = function() {
    var domain, instance, locale, saveDomain, saveEmail, saveLocale, savePublicName, saveTimezone, userData,
      _this = this;
    userData = window.cozy_user || {};
    this.emailField.val(userData.email);
    this.publicNameField.val(userData.public_name);
    this.timezoneField.val(userData.timezone);
    saveEmail = this.getSaveFunction('email', this.emailField, 'user');
    this.emailField.on('keyup', function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        return saveEmail();
      }
    });
    savePublicName = this.getSaveFunction('public_name', this.publicNameField, 'user');
    this.publicNameField.on('keyup', function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        return savePublicName();
      }
    });
    saveTimezone = this.getSaveFunction('timezone', this.timezoneField, 'user');
    this.timezoneField.change(saveTimezone);
    instance = window.cozy_instance || {};
    this.instance = new Instance(instance);
    domain = (instance != null ? instance.domain : void 0) || t('no domain set');
    locale = (instance != null ? instance.locale : void 0) || 'en';
    if (!window.managed) {
      saveDomain = this.getSaveFunction('domain', this.domainField, 'instance');
      this.domainField.on('keyup', function(event) {
        if (event.keyCode === 13 || event.which === 13) {
          return saveDomain();
        }
      });
    }
    this.domainField.val(domain);
    saveLocale = this.getSaveFunction('locale', this.localeField, 'instance');
    this.localeField.change(saveLocale);
    this.localeField.val(locale);
    this.password0Field = this.$('#account-password0-field');
    this.password1Field = this.$('#account-password1-field');
    this.password2Field = this.$('#account-password2-field');
    this.password0Field.keyup(function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        return _this.password1Field.focus();
      }
    });
    this.password1Field.keyup(function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        return _this.password2Field.focus();
      }
    });
    return this.password2Field.keyup(function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        return _this.onNewPasswordSubmit();
      }
    });
  };

  AccountView.prototype.onAddBackgroundClicked = function() {
    var params,
      _this = this;
    params = {
      type: 'singlePhoto',
      defaultTab: 'photoUpload'
    };
    return new ObjectPicker(params, function(newPhotoChosen, dataUrl) {
      var array, binary, blob, form, i, _i, _ref1;
      if (dataUrl != null) {
        _this.backgroundAddButton.spin(true);
        binary = atob(dataUrl.split(',')[1]);
        array = [];
        for (i = _i = 0, _ref1 = binary.length; 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
          array.push(binary.charCodeAt(i));
        }
        blob = new Blob([new Uint8Array(array)], {
          type: 'image/jpeg'
        });
        form = new FormData();
        form.append('picture', blob);
        return $.ajax({
          type: "POST",
          url: "/api/backgrounds",
          data: form,
          contentType: false,
          processData: false,
          success: function(data) {
            var background;
            background = new Background(data);
            _this.backgroundList.collection.add(background);
            return _this.backgroundList.select(background);
          },
          error: function(data) {
            return alert(t('account background added error'));
          },
          complete: function() {
            return _this.backgroundAddButton.spin(false);
          }
        });
      }
    });
  };

  AccountView.prototype.onBackgroundChanged = function(model) {
    var data;
    data = {
      background: model.get('id')
    };
    return this.instance.saveData(data, function(err) {
      if (err) {
        return alert(t('account background saved error'));
      } else {
        return Backbone.Mediator.pub('backgroundChanged', data.background);
      }
    });
  };

  return AccountView;

})(BaseView);
});

;require.register("views/background_list", function(exports, require, module) {
var BackgroundCollection, BackgroundList, BackgroundListItem, ViewCollection, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ViewCollection = require('lib/view_collection');

BackgroundListItem = require('views/background_list_item');

BackgroundCollection = require('collections/background');

module.exports = BackgroundList = (function(_super) {
  __extends(BackgroundList, _super);

  function BackgroundList() {
    _ref = BackgroundList.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  BackgroundList.prototype.itemView = BackgroundListItem;

  BackgroundList.prototype.template = require('templates/background_list');

  BackgroundList.prototype.collection = new BackgroundCollection;

  BackgroundList.prototype.events = {};

  BackgroundList.prototype.afterRender = function() {
    var _this = this;
    this.collection.init();
    return this.collection.on('change', function(changedModel) {
      return _this.collection.map(function(model) {
        if (changedModel.cid !== model.cid) {
          model.set({
            'selected': false
          }, {
            silent: true
          });
          return _this.views[model.cid].$el.removeClass('selected');
        }
      });
    });
  };

  BackgroundList.prototype.select = function(background) {
    return this.views[background.cid].$el.click();
  };

  BackgroundList.prototype.appendView = function(view) {
    if (view.model.get('predefined')) {
      return this.$el.prepend(view.el);
    } else {
      return this.$el.append(view.el);
    }
  };

  return BackgroundList;

})(ViewCollection);
});

;require.register("views/background_list_item", function(exports, require, module) {
var BackgroundListItem, BaseView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

module.exports = BackgroundListItem = (function(_super) {
  __extends(BackgroundListItem, _super);

  function BackgroundListItem() {
    _ref = BackgroundListItem.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  BackgroundListItem.prototype.className = "mod w33 left background-button";

  BackgroundListItem.prototype.tagName = "div";

  BackgroundListItem.prototype.template = require('templates/background_list_item');

  BackgroundListItem.prototype.events = {
    'click .delete-background-button': 'onDeleteClicked',
    'click': 'onClicked'
  };

  BackgroundListItem.prototype.getRenderData = function() {
    return {
      model: {
        src: this.model.getThumbSrc()
      }
    };
  };

  BackgroundListItem.prototype.afterRender = function() {
    var _this = this;
    this.deleteButton = this.$('.delete-background-button');
    if (this.model.get('predefined')) {
      this.deleteButton.hide();
    }
    return this.model.on('change', function() {
      if (_this.model.get('selected')) {
        return _this.$el.addClass('selected');
      }
    });
  };

  BackgroundListItem.prototype.onClicked = function() {
    return this.model.set('selected', true);
  };

  BackgroundListItem.prototype.onDeleteClicked = function() {
    this.deleteButton.spin(true);
    return this.model.destroy();
  };

  return BackgroundListItem;

})(BaseView);
});

;require.register("views/config_application", function(exports, require, module) {
var ApplicationRow, BaseView, ColorButton, PopoverDescriptionView,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

ColorButton = require('widgets/install_button');

PopoverDescriptionView = require('views/popover_description');

module.exports = ApplicationRow = (function(_super) {
  __extends(ApplicationRow, _super);

  ApplicationRow.prototype.className = "config-application";

  ApplicationRow.prototype.tagName = "div";

  ApplicationRow.prototype.template = require('templates/config_application');

  ApplicationRow.prototype.getRenderData = function() {
    var branch, gitName, website;
    gitName = this.model.get('git');
    if (gitName != null) {
      gitName = gitName.slice(0, -4);
    }
    website = this.model.get('website') || gitName;
    branch = this.model.get('branch') || 'master';
    return {
      app: _.extend({}, this.model.attributes, {
        website: website,
        branch: branch,
        websiteUrl: branch === 'master' ? website : "" + website + "/tree/" + branch
      })
    };
  };

  ApplicationRow.prototype.events = {
    "click .remove-app": "onRemoveClicked",
    "click .update-app": "onUpdateClicked",
    "click .start-stop-btn": "onStartStopClicked",
    "click .app-stoppable": "onStoppableClicked",
    "click .favorite": "onFavoriteClicked"
  };

  /* Constructor*/


  function ApplicationRow(options) {
    this.showLoading = __bind(this.showLoading, this);
    this.onFavoriteClicked = __bind(this.onFavoriteClicked, this);
    this.remove = __bind(this.remove, this);
    this.onStartStopClicked = __bind(this.onStartStopClicked, this);
    this.onUpdateClicked = __bind(this.onUpdateClicked, this);
    this.onRemoveClicked = __bind(this.onRemoveClicked, this);
    this.onStoppableClicked = __bind(this.onStoppableClicked, this);
    this.onAppChanged = __bind(this.onAppChanged, this);
    this.afterRender = __bind(this.afterRender, this);
    this.id = "app-btn-" + options.model.id;
    ApplicationRow.__super__.constructor.apply(this, arguments);
  }

  ApplicationRow.prototype.initialize = function() {
    return this.listenTo(this.model, 'change:version', this.render);
  };

  ApplicationRow.prototype.afterRender = function() {
    this.updateButton = new ColorButton(this.$(".update-app"));
    this.removeButton = new ColorButton(this.$(".remove-app"));
    this.startStopBtn = new ColorButton(this.$(".start-stop-btn"));
    this.stateLabel = this.$('.state-label');
    this.updateIcon = this.$('.update-notification-icon');
    this.appStoppable = this.$(".app-stoppable");
    this.updateLabel = this.$(".to-update-label");
    this.listenTo(this.model, 'change', this.onAppChanged);
    this.onAppChanged(this.model);
    return this.setIcon();
  };

  ApplicationRow.prototype.setIcon = function() {
    var color, hashColor, slug;
    this.setIconSrc();
    slug = this.model.get('slug');
    color = this.model.get('color');
    if (color == null) {
      color = hashColor = ColorHash.getColor(slug, 'cozy');
    }
    this.color = color;
    return this.$('.icon-container img').css('background', color);
  };

  ApplicationRow.prototype.setIconSrc = function() {
    var extension, src;
    this.icon = this.$('.icon');
    if (this.model.isIconSvg()) {
      extension = 'svg';
      this.icon.addClass('svg');
    } else {
      extension = 'png';
      this.icon.removeClass('svg');
    }
    if (this.model.get('state') === 'broken') {
      this.hideLoading();
      return this.icon.attr('src', "img/broken.svg");
    } else if (this.model.get('state') !== 'installing') {
      this.hideLoading();
      src = "api/applications/" + (this.model.get('slug')) + "." + extension;
      return this.icon.attr('src', src);
    } else {
      this.showLoading();
      return this.icon.attr('src', "img/broken.svg");
    }
  };

  /* Listener*/


  ApplicationRow.prototype.onAppChanged = function(app) {
    var bool;
    switch (this.model.get('state')) {
      case 'broken':
        this.stateLabel.show().text(t('broken'));
        this.removeButton.displayGrey(t('remove'));
        this.updateButton.displayGrey(t('retry to install'));
        this.appStoppable.hide();
        this.appStoppable.next().hide();
        this.startStopBtn.hide();
        break;
      case 'installed':
        this.stateLabel.show().text(t('started'));
        this.removeButton.displayGrey(t('remove'));
        this.updateButton.displayGrey(t('update'));
        this.appStoppable.show();
        this.appStoppable.next().show();
        this.startStopBtn.show();
        this.startStopBtn.button.attr({
          title: t('stop this app')
        });
        this.startStopBtn.button.removeClass('stopped');
        break;
      case 'installing':
        this.stateLabel.show().text(t('installing'));
        this.removeButton.displayGrey(t('abort'));
        this.updateButton.hide();
        this.appStoppable.hide();
        this.appStoppable.next().hide();
        this.startStopBtn.hide();
        break;
      case 'stopped':
        this.stateLabel.show().text(t('stopped'));
        this.removeButton.displayGrey(t('remove'));
        this.updateButton.displayGrey(t('update'));
        this.appStoppable.hide();
        this.appStoppable.next().hide();
        this.startStopBtn.show();
        this.startStopBtn.button.attr({
          title: t('start this app')
        });
        this.startStopBtn.button.addClass('stopped');
    }
    this.setIconSrc();
    this.updateIcon.toggle(this.model.get('needsUpdate'));
    if (((this.model.get("branch") == null) || this.model.get('branch' === 'master')) && !(this.model.get('needsUpdate'))) {
      this.$(".update-app").hide();
    }
    bool = this.model.get('isStoppable');
    return this.$('.app-stoppable').attr('checked', bool);
  };

  ApplicationRow.prototype.onStoppableClicked = function(event) {
    var bool,
      _this = this;
    bool = !this.model.get('isStoppable');
    return this.model.save({
      isStoppable: bool
    }, {
      success: function() {
        return _this.$('.app-stoppable').attr('checked', bool);
      },
      error: function() {
        return _this.$('.app-stoppable').attr('checked', !bool);
      }
    });
  };

  ApplicationRow.prototype.onRemoveClicked = function(event) {
    var _this = this;
    event.preventDefault();
    this.removeButton.spin(true);
    this.stateLabel.html(t('removing'));
    return this.model.uninstall({
      success: function() {
        _this.remove();
        return Backbone.Mediator.pub('app-state:changed', {
          status: 'uninstalled',
          updated: false,
          slug: _this.model.get('slug')
        });
      },
      error: function() {
        _this.removeButton.displayRed(t("retry to install"));
        return Backbone.Mediator.pub('app-state:changed', {
          status: 'uninstalled',
          updated: false,
          slug: _this.model.get('slug')
        });
      }
    });
  };

  ApplicationRow.prototype.onUpdateClicked = function(event) {
    event.preventDefault();
    return this.openPopover();
  };

  ApplicationRow.prototype.openPopover = function() {
    var _this = this;
    if (this.popover != null) {
      this.popover.hide();
    }
    this.popover = new PopoverDescriptionView({
      model: this.model,
      label: t('update'),
      confirm: function(application) {
        $('#no-app-message').hide();
        _this.popover.hide();
        _this.popover.remove();
        return _this.updateApp();
      },
      cancel: function(application) {
        _this.popover.hide();
        return _this.popover.remove();
      }
    });
    $("#config-applications-view").append(this.popover.$el);
    return this.popover.show();
  };

  ApplicationRow.prototype.onStartStopClicked = function(event) {
    var _this = this;
    event.preventDefault();
    this.startStopBtn.spin(true);
    if (this.model.isRunning()) {
      return this.model.stop({
        success: function() {
          _this.startStopBtn.spin(false);
          _this.stateLabel.html(t('stopped'));
          return Backbone.Mediator.pub('app-state:changed', {
            status: 'stopped',
            updated: false,
            slug: _this.model.get('slug')
          });
        },
        error: function() {
          return _this.startStopBtn.spin(false);
        }
      });
    } else {
      return this.model.start({
        success: function() {
          _this.startStopBtn.spin(false);
          _this.stateLabel.html(t('started'));
          Backbone.Mediator.pub('app-state:changed', {
            status: 'started',
            updated: false,
            slug: _this.model.get('slug')
          });
          return window.location.href = "#apps/" + (_this.model.get('slug'));
        },
        error: function() {
          var errormsg, msg;
          _this.startStopBtn.spin(false);
          _this.stateLabel.html(t('stopped'));
          Backbone.Mediator.pub('app-state:changed', {
            status: 'stopped',
            updated: false,
            slug: _this.model.get('slug')
          });
          msg = 'This app cannot start.';
          errormsg = _this.model.get('errormsg');
          if (errormsg) {
            msg += " Error was : " + errormsg;
          }
          return alert(msg);
        }
      });
    }
  };

  ApplicationRow.prototype.remove = function() {
    var _this = this;
    if (this.model.get('state') !== 'installed') {
      return ApplicationRow.__super__.remove.apply(this, arguments);
    }
    this.removeButton.spin(false);
    this.removeButton.displayGreen(t("removed"));
    return setTimeout(function() {
      return _this.$el.fadeOut(function() {
        return ApplicationRow.__super__.remove.apply(_this, arguments);
      });
    }, 1000);
  };

  ApplicationRow.prototype.updateApp = function() {
    var _this = this;
    this.updateButton.spin(true);
    if (this.model.get('state') !== 'broken') {
      this.stateLabel.html(t('updating'));
      Backbone.Mediator.pub('app-state:changed', {
        status: 'updating',
        updated: true,
        slug: this.model.get('slug')
      });
    } else {
      this.stateLabel.html(t('installing'));
      Backbone.Mediator.pub('app-state:changed', {
        status: 'installing',
        updated: false,
        slug: this.model.get('slug')
      });
    }
    return this.model.updateApp({
      success: function() {
        _this.updateButton.displayGreen(t("updated"));
        _this.updateButton.spin(false);
        if (_this.model.get('state') === 'installed') {
          _this.stateLabel.html(t('started'));
        }
        if (_this.model.get('state') === 'stopped') {
          _this.stateLabel.html(t('stopped'));
        }
        Backbone.Mediator.pub('app-state:changed', {
          status: 'started',
          updated: true,
          slug: _this.model.get('slug')
        });
        return setTimeout(function() {
          _this.updateButton.hide();
          return _this.updateLabel.hide();
        }, 1000);
      },
      error: function(jqXHR) {
        _this.updateButton.spin(false);
        alert(t('update error'));
        _this.stateLabel.html(t('broken'));
        _this.updateButton.displayRed(t("update failed"));
        return Backbone.Mediator.pub('app-state:changed', {
          status: 'broken',
          updated: false,
          slug: _this.model.get('slug')
        });
      }
    });
  };

  ApplicationRow.prototype.onFavoriteClicked = function() {
    this.model.set('favorite', !this.model.get('favorite'));
    this.model.save();
    Backbone.Mediator.pub('app:changed:favorite', this.model);
    return this.render();
  };

  ApplicationRow.prototype.showLoading = function() {
    this.icon.hide();
    return this.$('.spinner').show();
  };

  ApplicationRow.prototype.hideLoading = function() {
    this.$('.spinner').hide();
    return this.icon.show();
  };

  return ApplicationRow;

})(BaseView);
});

;require.register("views/config_application_list", function(exports, require, module) {
var ApplicationRow, ApplicationsList, ApplicationsListView, PopoverDescriptionView, ViewCollection,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ViewCollection = require('lib/view_collection');

ApplicationRow = require('views/config_application');

PopoverDescriptionView = require('views/popover_description');

ApplicationsList = require('../collections/application');

module.exports = ApplicationsListView = (function(_super) {
  __extends(ApplicationsListView, _super);

  ApplicationsListView.prototype.id = 'config-application-list';

  ApplicationsListView.prototype.tagName = 'div';

  ApplicationsListView.prototype.template = require('templates/config_application_list');

  ApplicationsListView.prototype.itemView = require('views/config_application');

  ApplicationsListView.prototype.events = {
    "click .app": "launchApp"
  };

  ApplicationsListView.prototype.itemViewOptions = function(model) {
    var app, comment;
    app = this.market.get(model.get('slug'));
    comment = app != null ? app.get('comment') : 'community contribution';
    return model.set('comment', comment);
  };

  function ApplicationsListView(apps, market) {
    this.afterRender = __bind(this.afterRender, this);
    this.apps = apps;
    this.market = market;
    ApplicationsListView.__super__.constructor.call(this, {
      collection: this.apps
    });
  }

  ApplicationsListView.prototype.afterRender = function() {
    this.appList = this.$("#app-list");
    return this.apps.sort();
  };

  ApplicationsListView.prototype.appendView = function(view) {
    var index, next, previous, sortedViews, views;
    if (this.$el.is(':empty')) {
      return this.$el.append(view.el);
    } else {
      views = _.values(this.views);
      sortedViews = _.sortBy(views, function(view) {
        var _ref;
        if ((view != null ? (_ref = view.model) != null ? _ref.get('displayName') : void 0 : void 0) != null) {
          return view.model.get('displayName').toLowerCase();
        } else {
          return 'unknown';
        }
      });
      index = _.indexOf(sortedViews, view) - 1;
      if (index >= 0) {
        previous = this.$el.find(".config-application:eq(" + index + ")");
        return view.$el.insertAfter(previous);
      } else {
        next = this.$el.find(".config-application:eq(" + (index + 1) + ")");
        return view.$el.insertBefore(next);
      }
    }
  };

  ApplicationsListView.prototype.openUpdatePopover = function(slug) {
    var appToUpdateView, cids, i, view;
    appToUpdateView = null;
    cids = Object.keys(this.views);
    i = 0;
    while ((cids[i] != null) && (appToUpdateView == null)) {
      view = this.views[cids[i]];
      if (view.model.get('slug') === slug) {
        appToUpdateView = view;
      }
      i++;
    }
    if (appToUpdateView != null) {
      return appToUpdateView.openPopover();
    } else {
      return alert(t('error update uninstalled app'));
    }
  };

  ApplicationsListView.prototype.launchApp = function(e) {
    var dest;
    e.preventDefault();
    dest = e.currentTarget.getAttribute('href').slice(1);
    if (e.which === 2 || e.ctrlKey || e.metaKey || $(window).width() <= 640) {
      return window.open(dest, "_blank");
    } else if (e.which === 1) {
      return window.app.routers.main.navigate(dest, true);
    }
  };

  return ApplicationsListView;

})(ViewCollection);
});

;require.register("views/config_applications", function(exports, require, module) {
var Application, AppsCollection, BaseView, ColorButton, ConfigApplicationList, ConfigApplicationsView, ConfigDeviceList, StackApplication, UpdateStackModal, request,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

request = require('lib/request');

BaseView = require('lib/base_view');

ColorButton = require('widgets/install_button');

Application = require('models/application');

StackApplication = require('models/stack_application');

ConfigApplicationList = require('./config_application_list');

ConfigDeviceList = require('./config_device_list');

UpdateStackModal = require('./update_stack_modal');

AppsCollection = require('../collections/application');

module.exports = ConfigApplicationsView = (function(_super) {
  __extends(ConfigApplicationsView, _super);

  ConfigApplicationsView.prototype.id = 'config-applications-view';

  ConfigApplicationsView.prototype.template = require('templates/config_applications');

  ConfigApplicationsView.prototype.subscriptions = {
    'app-state:changed': 'onAppStateChanged'
  };

  ConfigApplicationsView.prototype.events = {
    "click .update-all": "onUpdateClicked",
    "click .reboot-stack": "onRebootStackClicked"
  };

  function ConfigApplicationsView(apps, devices, stackApps, market) {
    this.apps = apps;
    this.devices = devices;
    this.stackApps = stackApps;
    this.market = market;
    this.runFullUpdate = __bind(this.runFullUpdate, this);
    this.fetch = __bind(this.fetch, this);
    this.displayDevices = __bind(this.displayDevices, this);
    this.displayStackVersion = __bind(this.displayStackVersion, this);
    this.listenTo(this.devices, 'reset', this.displayDevices);
    this.listenTo(this.stackApps, 'reset', this.displayStackVersion);
    ConfigApplicationsView.__super__.constructor.call(this);
  }

  ConfigApplicationsView.prototype.afterRender = function() {
    this.spanRefresh = this.$('.refresh');
    this.spanRefresh.hide();
    this.memoryFree = this.$('.memory-free');
    this.diskSpace = this.$('.disk-space');
    this.updateBtn = this.$('.update-all');
    this.rebootStackBtn = this.$('.reboot-stack');
    this.fetch();
    this.applicationList = new ConfigApplicationList(this.apps, this.market);
    this.deviceList = new ConfigDeviceList(this.devices);
    this.$el.find('.title-app').after(this.applicationList.$el);
    this.applications = new Application();
    this.stackApps.fetch({
      reset: true
    });
    this.displayDevices();
    this.stackApplications = new StackApplication;
    return this.showOrHideUpdateBtn();
  };

  ConfigApplicationsView.prototype.showOrHideUpdateBtn = function() {
    var appNeedUpdate;
    appNeedUpdate = this.apps.where({
      needsUpdate: true
    }).length > 0;
    if (this.toUpdate || appNeedUpdate) {
      return this.updateBtn.show();
    } else {
      return this.updateBtn.hide();
    }
  };

  ConfigApplicationsView.prototype.openUpdatePopover = function(slug) {
    return this.applicationList.openUpdatePopover(slug);
  };

  ConfigApplicationsView.prototype.displayStackVersion = function() {
    var app, currentVersion, lastVersion, newVersion, _i, _len, _ref;
    this.toUpdate = false;
    _ref = this.stackApps.models;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      app = _ref[_i];
      this.$("." + (app.get('name'))).html(app.get('version'));
      currentVersion = app.get('version').split('.');
      lastVersion = app.get('lastVersion') || '0.0.0';
      newVersion = lastVersion.split('.');
      if (parseInt(currentVersion[2]) < parseInt(newVersion[2])) {
        this.$("." + (app.get('name'))).css('font-weight', "bold");
        this.$("." + (app.get('name'))).css('color', "Orange");
        this.toUpdate = true;
      }
      if (parseInt(currentVersion[1]) < parseInt(newVersion[1])) {
        this.$("." + (app.get('name'))).css('font-weight', "bold");
        this.$("." + (app.get('name'))).css('color', "OrangeRed");
        this.toUpdate = true;
      }
      if (parseInt(currentVersion[0]) < parseInt(newVersion[0])) {
        this.$("." + (app.get('name'))).css('font-weight', "bold");
        this.$("." + (app.get('name'))).css('color', "Red");
        this.toUpdate = true;
      }
    }
    return this.showOrHideUpdateBtn();
  };

  ConfigApplicationsView.prototype.displayDevices = function() {
    if (!(this.devices.length === 0)) {
      return this.$el.find('.no-device').after(this.deviceList.$el);
    } else {
      return this.$el.find('.no-device p').before("<p>" + (t('status no device')) + "</p>");
    }
  };

  ConfigApplicationsView.prototype.fetch = function() {
    var _this = this;
    this.$('.amount').html("--");
    this.$('.total').html("--");
    return request.get('api/sys-data', function(err, data) {
      var diskTotal, diskUsed;
      if (err) {
        return alert(t('Server error occured, infos cannot be displayed.'));
      } else {
        if (data.usedUnit === 'T') {
          data.usedUnit = 'G';
          data.usedDiskSpace *= 1000;
        }
        if (data.totalUnit === 'T') {
          data.totalUnit = 'G';
          data.totalDiskSpace *= 1000;
        }
        diskUsed = "" + data.usedDiskSpace + " ";
        diskTotal = "" + data.totalDiskSpace + " ";
        _this.displayMemory(data.freeMem, data.totalMem);
        return _this.displayDiskSpace(diskUsed, diskTotal);
      }
    });
  };

  ConfigApplicationsView.prototype.displayMemory = function(amount, total) {
    this.memoryFree.find('.amount').html(Math.floor((total - amount) / 1000));
    return this.memoryFree.find('.total').html(Math.floor(total / 1000));
  };

  ConfigApplicationsView.prototype.displayDiskSpace = function(amount, total) {
    this.diskSpace.find('.amount').html(amount);
    return this.diskSpace.find('.total').html(total);
  };

  ConfigApplicationsView.prototype.onAppStateChanged = function() {
    return setTimeout(this.fetch, 10000);
  };

  ConfigApplicationsView.prototype.onUpdateClicked = function() {
    return this.showUpdateStackDialog();
  };

  ConfigApplicationsView.prototype.showUpdateStackDialog = function() {
    var _this = this;
    if (this.popover != null) {
      this.popover.hide();
    }
    this.popover = new UpdateStackModal({
      confirm: function(application) {
        return _this.runFullUpdate(function(err, permissionChanges) {
          if (err) {
            return _this.popover.onError(err, permissionChanges);
          } else {
            return _this.popover.onSuccess(permissionChanges);
          }
        });
      },
      cancel: function(application) {
        _this.popover.hide();
        return _this.popover.remove();
      },
      end: function(success) {
        if (success) {
          return location.reload();
        }
      }
    });
    $("#config-applications-view").append(this.popover.$el);
    return this.popover.show();
  };

  ConfigApplicationsView.prototype.runFullUpdate = function(callback) {
    var _this = this;
    Backbone.Mediator.pub('update-stack:start');
    return this.applications.updateAll(function(err, permissionChanges) {
      var _ref;
      if (err) {
        return callback(err, (_ref = err.data) != null ? _ref.permissionChanges : void 0);
      }
      return _this.stackApplications.updateStack(function(err) {
        Backbone.Mediator.pub('update-stack:end');
        return callback(err, permissionChanges);
      });
    });
  };

  ConfigApplicationsView.prototype.onRebootStackClicked = function() {
    var _this = this;
    this.rebootStackBtn.spin(true);
    return this.stackApplications.rebootStack(function(err) {
      if (err) {
        alert(t('reboot stack error'));
        return _this.rebootStackBtn.spin(false);
      } else {
        return location.reload();
      }
    });
  };

  return ConfigApplicationsView;

})(BaseView);
});

;require.register("views/config_device", function(exports, require, module) {
var BaseView, DeviceRow,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

module.exports = DeviceRow = (function(_super) {
  __extends(DeviceRow, _super);

  DeviceRow.prototype.className = "config-device";

  DeviceRow.prototype.tagName = "div";

  DeviceRow.prototype.template = require('templates/config_device');

  DeviceRow.prototype.events = {
    'click .remove-device': 'onRemoveClicked'
  };

  DeviceRow.prototype.getRenderData = function() {
    return {
      device: this.model.attributes
    };
  };

  function DeviceRow(options) {
    this.model = options.model;
    this.id = "device-btn-" + options.model.id;
    DeviceRow.__super__.constructor.apply(this, arguments);
  }

  DeviceRow.prototype.onRemoveClicked = function(event) {
    var _this = this;
    if (window.confirm(t('revoke device confirmation message'))) {
      $(event.currentTarget).spin(true);
      return $.ajax("/api/devices/" + (this.model.get('id')), {
        type: "DELETE",
        success: function() {
          return _this.$el.fadeOut(function() {});
        },
        error: function() {
          _this.$('.remove-device').html(t('revoke device access'));
          return console.log("error while revoking the device access");
        }
      });
    }
  };

  return DeviceRow;

})(BaseView);
});

;require.register("views/config_device_list", function(exports, require, module) {
var DeviceRow, DevicesListView, ViewCollection,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ViewCollection = require('lib/view_collection');

DeviceRow = require('views/config_device');

module.exports = DevicesListView = (function(_super) {
  __extends(DevicesListView, _super);

  DevicesListView.prototype.id = 'config-device-list';

  DevicesListView.prototype.tagName = 'div';

  DevicesListView.prototype.template = require('templates/config_device_list');

  DevicesListView.prototype.itemView = require('views/config_device');

  function DevicesListView(devices) {
    this.afterRender = __bind(this.afterRender, this);
    this.devices = devices;
    DevicesListView.__super__.constructor.call(this, {
      collection: devices
    });
  }

  DevicesListView.prototype.afterRender = function() {
    return this.deviceList = this.$("#device-list");
  };

  return DevicesListView;

})(ViewCollection);
});

;require.register("views/error_modal", function(exports, require, module) {
var BaseView, ErrorModal, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

module.exports = ErrorModal = (function(_super) {
  __extends(ErrorModal, _super);

  function ErrorModal() {
    this.onKeyStroke = __bind(this.onKeyStroke, this);
    _ref = ErrorModal.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ErrorModal.prototype.id = 'market-popover-description-view';

  ErrorModal.prototype.className = 'modal md-modal md-effect-1';

  ErrorModal.prototype.tagName = 'div';

  ErrorModal.prototype.template = require('templates/error_modal');

  ErrorModal.prototype.events = {
    'click #more': 'onMore',
    'click #ok': 'onConfirm',
    'click #cancelbtn': 'onClose'
  };

  ErrorModal.prototype.initialize = function(options) {
    this.errortype = options.errortype;
    this.details = options.details;
    this.confirmCallback = options.onConfirm || function() {};
    this.ok = options.confirm || t('ok');
    this.cancel = options.cancel || false;
    ErrorModal.__super__.initialize.apply(this, arguments);
    return $('body').keyup(this.onKeyStroke);
  };

  ErrorModal.prototype.getRenderData = function() {
    return {
      errortype: this.errortype,
      details: this.details,
      ok: this.ok,
      cancel: this.cancel
    };
  };

  ErrorModal.prototype.afterRender = function() {
    var _this = this;
    this.overlay = $('.md-overlay');
    this.overlay.click(function() {
      return _this.hide();
    });
    this.$('.details').hide();
    return this.body = this.$(".md-body");
  };

  ErrorModal.prototype.handleContentHeight = function() {
    var _this = this;
    this.body.css('max-height', "" + ($(window).height() / 2) + "px");
    return $(window).on('resize', function() {
      return _this.body.css('max-height', "" + ($(window).height() / 2) + "px");
    });
  };

  ErrorModal.prototype.show = function() {
    var _this = this;
    this.$el.addClass('md-show');
    this.overlay.addClass('md-show');
    $('#home-content').addClass('md-open');
    return setTimeout(function() {
      return _this.$('.md-content').addClass('md-show');
    }, 300);
  };

  ErrorModal.prototype.hide = function() {
    var _this = this;
    $('.md-content').fadeOut(function() {
      _this.overlay.removeClass('md-show');
      _this.$el.removeClass('md-show');
      return _this.remove();
    });
    return $('#home-content').removeClass('md-open');
  };

  ErrorModal.prototype.onConfirm = function() {
    this.hide();
    return this.confirmCallback();
  };

  ErrorModal.prototype.onClose = function() {
    return this.hide();
  };

  ErrorModal.prototype.onKeyStroke = function(e) {
    var _ref1;
    e.stopPropagation();
    if ((_ref1 = e.which) === 13 || _ref1 === 27) {
      return this.onClose();
    }
  };

  ErrorModal.prototype.onMore = function() {
    if (this.$('.details').css('display') === 'none') {
      return this.$('.details').show();
    } else {
      return this.$('.details').hide();
    }
  };

  return ErrorModal;

})(BaseView);
});

;require.register("views/help", function(exports, require, module) {
var BaseView, request, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

request = require('lib/request');

module.exports = exports.HelpView = (function(_super) {
  __extends(HelpView, _super);

  function HelpView() {
    this.onSendMessageClicked = __bind(this.onSendMessageClicked, this);
    _ref = HelpView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  HelpView.prototype.el = '#help-menu';

  HelpView.prototype.template = require('templates/help');

  HelpView.prototype.events = {
    'click #send-message-button': 'onSendMessageClicked'
  };

  HelpView.prototype.afterRender = function() {
    this.sendMessageButton = this.$('#send-message-button');
    this.sendMessageInput = this.$('#send-message-textarea');
    this.alertMessageError = this.$('#send-message-error');
    this.alertMessageSuccess = this.$('#send-message-success');
    this.configureHelpUrl();
    return this.$el.hide();
  };

  HelpView.prototype.configureHelpUrl = function() {
    var helpUrl, template, _ref1;
    helpUrl = (_ref1 = window.app.instance) != null ? _ref1.helpUrl : void 0;
    if (helpUrl != null) {
      template = require('templates/help_url');
      return this.$el.find('.help-section:last').prepend(template({
        helpUrl: helpUrl
      }));
    }
  };

  HelpView.prototype.onSendMessageClicked = function() {
    var messageText, sendLogs,
      _this = this;
    this.alertMessageError.hide();
    this.alertMessageSuccess.hide();
    messageText = this.sendMessageInput.val();
    sendLogs = this.$('#send-message-logs').is(':checked');
    if (messageText.length > 0) {
      this.sendMessageButton.spin(true);
      return request.post("help/message", {
        messageText: messageText,
        sendLogs: sendLogs
      }, function(err) {
        _this.sendMessageButton.spin(false);
        if (err) {
          return _this.alertMessageError.show();
        } else {
          return _this.alertMessageSuccess.show();
        }
      });
    }
  };

  HelpView.prototype.toggle = function() {
    if (this.$el.is(':visible')) {
      return this.$el.hide();
    } else {
      $('.right-menu').hide();
      return this.$el.show();
    }
  };

  return HelpView;

})(BaseView);
});

;require.register("views/home", function(exports, require, module) {
var ApplicationsListView, ViewCollection,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ViewCollection = require('lib/view_collection');

module.exports = ApplicationsListView = (function(_super) {
  __extends(ApplicationsListView, _super);

  ApplicationsListView.prototype.id = 'applications-view';

  ApplicationsListView.prototype.template = require('templates/home');

  ApplicationsListView.prototype.itemView = require('views/home_application');

  ApplicationsListView.prototype.subscriptions = {
    'app:changed:favorite': 'render'
  };

  /* Constructor*/


  function ApplicationsListView(apps, market) {
    this.onAppRemoved = __bind(this.onAppRemoved, this);
    this.afterRender = __bind(this.afterRender, this);
    this.initialize = __bind(this.initialize, this);
    var _this = this;
    this.apps = apps;
    this.market = market;
    this.state = 'view';
    this.isLoading = true;
    this.itemViewOptions = function() {
      return {
        market: _this.market
      };
    };
    ApplicationsListView.__super__.constructor.call(this, {
      collection: apps
    });
  }

  ApplicationsListView.prototype.initialize = function() {
    var _this = this;
    this.listenTo(this.collection, 'request', function() {
      return _this.isLoading = true;
    });
    this.listenTo(this.collection, 'reset', function() {
      return _this.isLoading = false;
    });
    this.collection.on('remove', this.onAppRemoved);
    return ApplicationsListView.__super__.initialize.apply(this, arguments);
  };

  ApplicationsListView.prototype.afterRender = function() {
    this.$("#no-app-message").hide();
    $(".menu-btn a").click(function(event) {
      $(".menu-btn").removeClass('active');
      return $(event.target).closest('.menu-btn').addClass('active');
    });
    return ApplicationsListView.__super__.afterRender.apply(this, arguments);
  };

  ApplicationsListView.prototype.checkIfEmpty = function() {
    var noapps;
    noapps = this.apps.size() === 0 && !this.isLoading;
    return this.$("#no-app-message").toggle(noapps);
  };

  ApplicationsListView.prototype.appendView = function(view) {
    var section, sectionName, section_apps;
    sectionName = view.model.getSection();
    section = this.$("section#apps-" + sectionName);
    section_apps = this.$("section#apps-" + sectionName + " .application-container");
    section_apps.append(view.$el);
    section.addClass('show');
    return section.show();
  };

  ApplicationsListView.prototype.onAppRemoved = function(model) {
    var section, sectionName;
    sectionName = model.getSection();
    section = this.$("section#apps-" + sectionName);
    if (section.find('.application-container').children().length === 1) {
      return section.hide();
    }
  };

  return ApplicationsListView;

})(ViewCollection);
});

;require.register("views/home_application", function(exports, require, module) {
var ApplicationRow, BaseView, ColorButton, Modal,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

ColorButton = require('widgets/install_button');

Modal = require('./error_modal');

module.exports = ApplicationRow = (function(_super) {
  __extends(ApplicationRow, _super);

  ApplicationRow.prototype.className = "application w360-33 w640-25 full-20";

  ApplicationRow.prototype.tagName = "div";

  ApplicationRow.prototype.template = require('templates/home_application');

  ApplicationRow.prototype.getRenderData = function() {
    return {
      app: this.model.attributes
    };
  };

  ApplicationRow.prototype.events = {
    "mouseup .application-inner": "onAppClicked"
  };

  function ApplicationRow(options) {
    this.showSpinner = __bind(this.showSpinner, this);
    this.launchApp = __bind(this.launchApp, this);
    this.startApp = __bind(this.startApp, this);
    this.onAppClicked = __bind(this.onAppClicked, this);
    this.onUninstall = __bind(this.onUninstall, this);
    this.onAppChanged = __bind(this.onAppChanged, this);
    this.afterRender = __bind(this.afterRender, this);
    this.id = "app-btn-" + options.model.id;
    this.enabled = true;
    ApplicationRow.__super__.constructor.apply(this, arguments);
    this.inMarket = options.market.findWhere({
      slug: this.model.get('slug')
    });
  }

  ApplicationRow.prototype.afterRender = function() {
    this.icon = this.$('img.icon');
    this.title = this.$('.app-title');
    this.background = this.$('img');
    this.listenTo(this.model, 'change', this.onAppChanged);
    this.listenTo(this.model, 'uninstall', this.onUninstall);
    this.onAppChanged(this.model);
    this.setBackgroundColor();
    if (this.model.isIconSvg()) {
      return this.icon.addClass('svg');
    }
  };

  /* Listener*/


  ApplicationRow.prototype.onAppChanged = function() {
    var extension, src;
    switch (this.model.get('state')) {
      case 'broken':
        this.hideSpinner();
        return this.icon.attr('src', "img/broken.svg");
      case 'installed':
        this.hideSpinner();
        this.setBackgroundColor();
        if (this.model.isIconSvg()) {
          extension = 'svg';
          this.icon.addClass('svg');
        } else {
          extension = 'png';
          this.icon.removeClass('svg');
        }
        src = "api/applications/" + this.model.id + "." + extension;
        this.icon.attr('src', src);
        this.icon.show();
        this.icon.removeClass('stopped');
        return $("#" + (this.model.get('slug')) + "-frame").remove();
      case 'installing':
        this.showSpinner();
        return this.setBackgroundColor();
      case 'stopped':
        if (this.model.isIconSvg()) {
          extension = 'svg';
          this.icon.addClass('svg');
        } else {
          extension = 'png';
          this.icon.removeClass('svg');
        }
        this.icon.attr('src', "api/applications/" + this.model.id + "." + extension);
        this.icon.addClass('stopped');
        return this.hideSpinner();
    }
  };

  ApplicationRow.prototype.onUninstall = function() {
    this.$el.addClass('uninstalling');
    this.showSpinner();
    $("#" + (this.model.get('slug')) + "-frame").remove();
    return this.enabled = false;
  };

  ApplicationRow.prototype.onAppClicked = function(event) {
    var errorcode, errormsg, errortype, modal, modalOptions;
    event.preventDefault();
    if (!this.enabled) {
      return null;
    }
    switch (this.model.get('state')) {
      case 'broken':
        errortype = '';
        errorcode = this.model.get('errorcode');
        if (errorcode != null) {
          switch (errorcode[0]) {
            case '1':
              msg += '\n' + t('error user linux');
              break;
            case '2':
              errortype = t('error git');
              switch (errorcode[1]) {
                case '0':
                  errortype += '\n' + t('error github repo');
                  break;
                case '1':
                  errortype += '\n' + t('error github');
              }
              break;
            case '3':
              errortype = t('error npm');
              break;
            case '4':
              errortype = t('error start');
          }
        }
        errormsg = this.model.get('errormsg');
        modalOptions = {
          title: 'Broken application',
          errortype: errortype,
          details: errormsg
        };
        if (errorcode[0] === '4') {
          modalOptions.confirm = t('start this app');
          modalOptions.cancel = t('cancel');
          modalOptions.onConfirm = this.startApp;
        }
        modal = new Modal(modalOptions);
        $("#" + this.id).append(modal.$el);
        return modal.show();
      case 'installed':
        return this.launchApp(event);
      case 'installing':
        return alert(t('state app installing'));
      case 'stopped':
        return this.startApp(event);
    }
  };

  /* Functions*/


  ApplicationRow.prototype.startApp = function(event) {
    var _this = this;
    this.showSpinner();
    return this.model.start({
      success: function() {
        _this.launchApp(event);
        return _this.hideSpinner();
      },
      error: function() {
        var errormsg, msg;
        _this.hideSpinner();
        msg = t('state app stopped error');
        errormsg = _this.model.get('errormsg');
        if (errormsg) {
          msg += " : " + errormsg;
        }
        return alert(msg);
      }
    });
  };

  ApplicationRow.prototype.launchApp = function(event) {
    if (event.which === 2 || event.ctrlKey || event.metaKey || $(window).width() <= 640) {
      return window.open("apps/" + this.model.id + "/", "_blank");
    } else if (event.which === 1) {
      return window.app.routers.main.navigate("apps/" + this.model.id + "/", true);
    }
  };

  ApplicationRow.prototype.setBackgroundColor = function() {
    var color, hashColor, slug, _ref;
    slug = this.model.get('slug');
    color = this.model.get('color');
    if (color == null) {
      hashColor = ColorHash.getColor(slug, 'cozy');
      color = ((_ref = this.inMarket) != null ? _ref.get('color') : void 0) || hashColor;
      this.color = color;
    }
    return this.background.css('background-color', color);
  };

  ApplicationRow.prototype.showSpinner = function() {
    this.icon.hide();
    return this.$('.spinner').show();
  };

  ApplicationRow.prototype.hideSpinner = function() {
    this.$('.spinner').hide();
    return this.icon.show();
  };

  return ApplicationRow;

})(BaseView);
});

;require.register("views/image_list", function(exports, require, module) {
var BUFFER_COEF, CELL_PADDING, LongList, MAX_SPEED, MONTH_HEADER_HEIGHT, MONTH_LABEL_TOP, Photo, SAFE_ZONE_COEF, THROTTLE, THROTTLE_INDEX, THUMB_DIM_UNIT, THUMB_HEIGHT,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Photo = require('../models/photo');

THROTTLE = 450;

THROTTLE_INDEX = 300;

MAX_SPEED = 1.5 * THROTTLE / 1000;

BUFFER_COEF = 3;

SAFE_ZONE_COEF = 2;

THUMB_DIM_UNIT = 'em';

MONTH_HEADER_HEIGHT = 2.5;

CELL_PADDING = 0.6;

THUMB_HEIGHT = 10;

MONTH_LABEL_TOP = 0.8;

module.exports = LongList = (function() {
  function LongList(externalViewPort$, modal) {
    var _this = this;
    this.externalViewPort$ = externalViewPort$;
    this.modal = modal;
    this._moveViewportToBottomOfThumb$ = __bind(this._moveViewportToBottomOfThumb$, this);
    this._unselectAll = __bind(this._unselectAll, this);
    this._dblclickHandler = __bind(this._dblclickHandler, this);
    this._clickHandler = __bind(this._clickHandler, this);
    this.getSelectedFile = __bind(this.getSelectedFile, this);
    this.selected = {};
    this.viewPort$ = document.createElement('div');
    this.viewPort$.classList.add('viewport');
    this.externalViewPort$.appendChild(this.viewPort$);
    this.thumbs$ = document.createElement('div');
    this.thumbs$.classList.add('thumbs');
    this.viewPort$.appendChild(this.thumbs$);
    this.index$ = document.createElement('div');
    this.index$.classList.add('long-list-index');
    this.externalViewPort$.appendChild(this.index$);
    this.viewPort$.style.position = 'relative';
    this.index$.style.position = 'absolute';
    this.index$.style.top = 0;
    this.index$.style.bottom = 0;
    this.index$.style.right = this._getScrollBarWidth() + 'px';
    this._lastSelectedCol = null;
    this.isInited = this.isPhotoArrayLoaded = false;
    Photo.getMonthdistribution(function(error, res) {
      _this.isPhotoArrayLoaded = true;
      _this.months = res;
      _this._DOM_controlerInit();
      return true;
    });
  }

  /**
   * To compute the geometry we mus know the the width and height of the
   * externalViewPort$.
   * This is possible only if this element is inserted in the DOM of we give
   * the dimension that will be available with the following function.
   * @param {Integer} width  in px of the externalViewPort$ when it will be
   *                  inserted
   * @param {Integer} heigth in px of the externalViewPort$ when it will be
   *                  inserted
  */


  LongList.prototype.setInitialDimensions = function(width, heigth) {
    this.initialWidth = width;
    this.initialHeight = heigth;
    return this._resizeHandler();
  };

  /**
   * returns the selected "file", ie the same document as in Couch
   * {id, name, path, lastModification, binary, class, docType, mime,
   * creationDate, size, tags}
  */


  LongList.prototype.getSelectedFile = function() {
    var k, thumb$, _ref;
    _ref = this.selected;
    for (k in _ref) {
      thumb$ = _ref[k];
      if (thumb$) {
        return thumb$.file;
      }
    }
    return null;
  };

  /**
   * There is an event delegation, so the parent (externalViewPort$ or above)
   * are in charge of listening and transmitting the event with this function.
   * @param  {Event} e Event
  */


  LongList.prototype.keyHandler = function(e) {
    switch (e.which) {
      case 39:
        e.stopPropagation();
        e.preventDefault();
        this._selectNextThumb();
        break;
      case 37:
        e.stopPropagation();
        e.preventDefault();
        this._selectPreviousThumb();
        break;
      case 38:
        e.stopPropagation();
        e.preventDefault();
        this._selectThumbUp();
        break;
      case 40:
        e.stopPropagation();
        e.preventDefault();
        this._selectThumbDown();
        break;
      case 36:
        e.stopPropagation();
        e.preventDefault();
        this._selectStartLineThumb();
        break;
      case 35:
        e.stopPropagation();
        e.preventDefault();
        this._selectEndLineThumb();
        break;
      case 34:
        e.stopPropagation();
        e.preventDefault();
        this._selectPageDownThumb();
        break;
      case 33:
        e.stopPropagation();
        e.preventDefault();
        this._selectPageUpThumb();
        break;
      default:
        return false;
    }
  };

  /**
   * Must be called when the goemetry of the parent (externalViewPort$) of the
   * long list changes.
  */


  LongList.prototype.resizeHandler = function() {};

  /**
   * This is the main procedure. Its scope contains all the functions used to
   * update the buffer and the shared variables between those functions. This
   * approach has been chosen for performance reasons (acces to scope
   * variables faster than to nested properties of objects). It's not an
   * obvious choice.
   * Called only when we get from the server the month distribution
   * (Photo.getMonthdistribution)
  */


  LongList.prototype._DOM_controlerInit = function() {
    var buffer, bufferAlreadyAdapted, cellPadding, colWidth, currentIndexRkSelected, current_scrollTop, indexHeight, indexVisible, isDefaultToSelect, lastOnScroll_Y, lazyHideIndex, marginLeft, monthHeaderHeight, monthLabelTop, monthTopPadding, months, nRowsInSafeZoneMargin, nThumbsInBuffer, nThumbsInBufferMargin, nThumbsInSafeZone, nThumbsPerRow, previousWidth, rowHeight, safeZone, thumbHeight, thumbWidth, thumbs$Height, viewPortHeight, _SZ_bottomCase, _SZ_initEndPoint, _SZ_initStartPoint, _SZ_setMarginAtStart, _adaptBuffer, _adaptIndex, _computeSafeZone, _emToPixels, _getBufferNextFirst, _getBufferNextLast, _getDimInPixels, _getElementFontSize, _getStaticDimensions, _indexClickHandler, _indexMouseEnter, _indexMouseLeave, _initBuffer, _insertMonthLabel, _moveBufferToBottom, _moveBufferToTop, _rePositionThumbs, _remToPixels, _resizeHandler, _scrollHandler, _selectCurrentIndex, _updateThumb,
      _this = this;
    months = this.months;
    buffer = null;
    previousWidth = null;
    bufferAlreadyAdapted = false;
    cellPadding = null;
    monthHeaderHeight = null;
    monthTopPadding = null;
    marginLeft = null;
    thumbWidth = null;
    thumbHeight = null;
    colWidth = null;
    rowHeight = null;
    nThumbsPerRow = null;
    nRowsInSafeZoneMargin = null;
    nThumbsInSafeZone = null;
    nThumbsInBufferMargin = null;
    nThumbsInBuffer = null;
    viewPortHeight = null;
    indexHeight = null;
    indexVisible = null;
    currentIndexRkSelected = 0;
    thumbs$Height = null;
    monthLabelTop = null;
    lastOnScroll_Y = null;
    current_scrollTop = null;
    safeZone = {
      firstRk: null,
      firstMonthRk: null,
      firstInMonthRow: null,
      firstCol: null,
      firstVisibleRk: null,
      firstY: null,
      lastRk: null,
      endCol: null,
      endMonthRk: null,
      endY: null,
      firstThumbToUpdate: null,
      firstThumbRkToUpdate: null
    };
    isDefaultToSelect = true;
    /**
     * called after a scroll, will launch _adaptBuffer and _adaptIndex
     * (both throttled)
    */

    _scrollHandler = function(e) {
      if (_this.noScrollScheduled) {
        lastOnScroll_Y = _this.viewPort$.scrollTop;
        setTimeout(_adaptBuffer, THROTTLE);
        _this.noScrollScheduled = false;
      }
      if (_this.noIndexScrollScheduled) {
        setTimeout(_adaptIndex, THROTTLE_INDEX);
        _this.noIndexScrollScheduled = false;
      }
      if (!indexVisible) {
        _this.index$.classList.add('visible');
        return indexVisible = true;
      }
    };
    this._scrollHandler = _scrollHandler;
    /**
     * called once for all during _DOM_controlerInit
     * computes the static parameters of the geometry
    */

    _getStaticDimensions = function() {
      thumbHeight = _getDimInPixels(THUMB_HEIGHT);
      cellPadding = _getDimInPixels(CELL_PADDING);
      _this.thumbHeight = thumbHeight;
      thumbWidth = thumbHeight;
      colWidth = thumbWidth + cellPadding;
      rowHeight = thumbHeight + cellPadding;
      monthHeaderHeight = _getDimInPixels(MONTH_HEADER_HEIGHT);
      monthTopPadding = monthHeaderHeight + cellPadding;
      monthLabelTop = _getDimInPixels(MONTH_LABEL_TOP);
      return _this.monthLabelTop = monthLabelTop;
    };
    /**
     * returns the font-size in px of a given element (context) or of the
     * root element of the document if no context is provided.
     * @param  {element} context Optionnal: an elemment to get the font-size
     * @return {integer}         the font-size
    */

    _getElementFontSize = function(context) {
      return parseFloat(getComputedStyle(context || document.documentElement).fontSize);
    };
    _remToPixels = function(value) {
      return _emToPixels(value);
    };
    _emToPixels = function(value, context) {
      return Math.round(value * _getElementFontSize(context));
    };
    _getDimInPixels = function(value) {
      switch (THUMB_DIM_UNIT) {
        case 'px':
          return value;
        case 'em':
          return _emToPixels(value, _this.viewPort$);
        case 'rem':
          return _remToPixels(value);
      }
    };
    /**
     * Compute all the geometry after a resize or when the list in inserted
     * in the DOM.
     * _adaptBuffer will be executed at the end except if
     *     1- the distribution array of photo has not been received.
     *     2- the geometry could not be computed (for instance if the width
     *     of the list is null when the list is not visible)
    */

    _resizeHandler = function() {
      var MONTH_LABEL_HEIGHT, VP_width, c, d, div, h, label$, minMonthHeight, minMonthNphotos, minimumIndexHeight, month, nPhotos, nPhotosInMonth, nRowsInBufferMargin, nRowsInViewPort, nThumbsInSZ_Margin, nThumbsInViewPort, nextY, rk, txt, y, _i, _j, _len, _len1, _ref, _ref1;
      if (!_this.isPhotoArrayLoaded) {
        return;
      }
      viewPortHeight = _this.viewPort$.clientHeight;
      VP_width = _this.viewPort$.clientWidth;
      if (VP_width <= 0 || viewPortHeight <= 0) {
        if (_this.initialWidth && _this.initialHeight) {
          VP_width = _this.initialWidth;
          viewPortHeight = _this.initialHeight;
        } else {
          return false;
        }
      }
      if (VP_width === previousWidth) {
        _adaptBuffer();
        return;
      }
      previousWidth = VP_width;
      nThumbsPerRow = Math.floor((VP_width - cellPadding) / colWidth);
      _this.nThumbsPerRow = nThumbsPerRow;
      marginLeft = cellPadding + Math.round((VP_width - nThumbsPerRow * colWidth - cellPadding) / 2);
      nRowsInViewPort = Math.ceil(viewPortHeight / rowHeight);
      nRowsInSafeZoneMargin = Math.round(SAFE_ZONE_COEF * nRowsInViewPort);
      nThumbsInSZ_Margin = nRowsInSafeZoneMargin * nThumbsPerRow;
      nThumbsInViewPort = nRowsInViewPort * nThumbsPerRow;
      nThumbsInSafeZone = nThumbsInSZ_Margin * 2 + nThumbsInViewPort;
      nRowsInBufferMargin = Math.round(BUFFER_COEF * nRowsInViewPort);
      nThumbsInBufferMargin = nRowsInBufferMargin * nThumbsPerRow;
      nThumbsInBuffer = nThumbsInViewPort + 2 * nThumbsInBufferMargin;
      nextY = 0;
      nPhotos = 0;
      minMonthHeight = Infinity;
      minMonthNphotos = Infinity;
      _ref = _this.months;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        month = _ref[_i];
        nPhotosInMonth = month.nPhotos;
        month.nRows = Math.ceil(nPhotosInMonth / nThumbsPerRow);
        month.height = monthTopPadding + month.nRows * rowHeight;
        month.y = nextY;
        month.yBottom = nextY + month.height;
        month.firstRk = nPhotos;
        month.lastRk = nPhotos + nPhotosInMonth - 1;
        month.lastThumbCol = (nPhotosInMonth - 1) % nThumbsPerRow;
        month.date = moment(month.month, 'YYYYMM');
        nextY += month.height;
        nPhotos += nPhotosInMonth;
        minMonthHeight = Math.min(minMonthHeight, month.height);
        minMonthNphotos = Math.min(minMonthNphotos, month.nPhotos);
      }
      _this.nPhotos = nPhotos;
      thumbs$Height = nextY;
      _this.thumbs$.style.setProperty('height', thumbs$Height + 'px');
      MONTH_LABEL_HEIGHT = 27;
      minimumIndexHeight = _this.months.length * MONTH_LABEL_HEIGHT;
      if (minimumIndexHeight * 1.3 <= viewPortHeight) {
        indexHeight = viewPortHeight;
      } else {
        indexHeight = 1.5 * minimumIndexHeight;
      }
      y = 0;
      c = indexHeight - _this.months.length * MONTH_LABEL_HEIGHT;
      d = nPhotos - minMonthNphotos * _this.months.length;
      _ref1 = _this.months;
      for (rk = _j = 0, _len1 = _ref1.length; _j < _len1; rk = ++_j) {
        month = _ref1[rk];
        txt = month.date.format('MMM YYYY');
        h = c * (month.nPhotos - minMonthNphotos);
        h = h / d;
        h += MONTH_LABEL_HEIGHT;
        y += h;
        div = "<div style='height:" + h + "px; right:0px'>" + txt + "</div>";
        label$ = $(div)[0];
        label$.dataset.monthRk = rk;
        _this.index$.appendChild(label$);
      }
      if (bufferAlreadyAdapted) {
        _rePositionThumbs();
        _adaptBuffer();
      }
      return bufferAlreadyAdapted = true;
    };
    this.resizeHandler = _resizeHandler;
    /**
     * Initialize the buffer.
     * The buffer lists all the created thumbs, keep a reference on the
     * first (top most) and the last (bottom most) thumb.
     * The buffer is a closed double linked chain.
     * Each element of the chain is a "thumb" with a previous (prev) and
     * next (next) element.
     * "closed" means that buffer.last.prev == buffer.first
     * data structure : see the beginning of this file.
    */

    _initBuffer = function() {
      var col, firstCreatedThb, localRk, month, monthRk, nToCreate, previousCreatedThb, rk, rowY, thumb, thumb$, thumbImg$, _i, _ref;
      nToCreate = Math.min(_this.nPhotos, nThumbsInBuffer);
      firstCreatedThb = {};
      previousCreatedThb = firstCreatedThb;
      rowY = monthTopPadding;
      col = 0;
      monthRk = 0;
      month = _this.months[0];
      localRk = 0;
      for (rk = _i = 0, _ref = nToCreate - 1; _i <= _ref; rk = _i += 1) {
        if (localRk === 0) {
          _insertMonthLabel(month);
        }
        thumbImg$ = document.createElement('img');
        thumb$ = document.createElement('div');
        thumb$.appendChild(thumbImg$);
        thumb$.setAttribute('class', 'long-list-thumb thumb');
        thumb$.style.height = thumbHeight + 'px';
        thumb$.style.width = thumbHeight + 'px';
        thumb = {
          prev: null,
          next: previousCreatedThb,
          el: thumb$,
          rank: rk,
          monthRk: monthRk,
          id: null
        };
        previousCreatedThb.prev = thumb;
        previousCreatedThb = thumb;
        thumb$.style.cssText = "top:" + rowY + "px;\nleft:" + (marginLeft + col * colWidth) + "px;\nheight:" + thumbHeight + "px;\nwidth:" + thumbHeight + "px;";
        _this.thumbs$.appendChild(thumb$);
        localRk += 1;
        if (localRk === month.nPhotos) {
          monthRk += 1;
          month = _this.months[monthRk];
          localRk = 0;
          col = 0;
          rowY += rowHeight + monthTopPadding;
        } else {
          col += 1;
          if (col === nThumbsPerRow) {
            rowY += rowHeight;
            col = 0;
          }
        }
      }
      buffer = {
        first: firstCreatedThb.prev,
        firstRk: 0,
        last: thumb,
        lastRk: nToCreate - 1,
        nThumbs: 1,
        nextLastRk: null,
        nextLastCol: null,
        nextLastY: null,
        nextLastMonthRk: null,
        nextFirstCol: null,
        nextFirstMonthRk: null,
        nextFirstRk: null,
        nextFirstY: null
      };
      buffer.first.next = buffer.last;
      buffer.last.prev = buffer.first;
      _this.buffer = buffer;
      safeZone.firstThumbToUpdate = buffer.first;
      return Photo.listFromFiles(0, nToCreate, function(error, res) {
        if (error) {
          console.error(error);
        }
        return _updateThumb(res.files, res.firstRank);
      });
    };
    /**
     * called by onscroll (throttled), adapt the position of the index (top)
     * according to the new scroll position
    */

    _adaptIndex = function() {
      var C, C_bis, H, td_a, td_b, vph, y;
      y = _this.viewPort$.scrollTop;
      H = thumbs$Height;
      vph = viewPortHeight;
      C = (H - vph) / (indexHeight - vph);
      td_a = Math.round((vph * C - vph) / 2);
      td_b = H - td_a - vph;
      C_bis = (indexHeight - vph) / (td_b - td_a);
      if (td_b < td_a) {
        td_a = Math.round((H - vph) / 2);
        td_b = td_a;
      }
      if (td_a < y && y < td_b) {
        _this.index$.style.top = -Math.round(C_bis * (y - td_a)) + 'px';
        return;
      }
      if (y < td_a) {
        _this.index$.style.top = 0;
      }
      if (td_b < y) {
        return _this.index$.style.top = -(indexHeight - vph) + 'px';
      }
    };
    /**
     * modify the apperence of the index label corresponding of the first
     * month displayed in the viewPort
    */

    _selectCurrentIndex = function(monthRk) {
      _this.index$.children[currentIndexRkSelected].classList.remove('current');
      _this.index$.children[monthRk].classList.add('current');
      return currentIndexRkSelected = monthRk;
    };
    /**
     * will hide the index 2s after its last call
    */

    lazyHideIndex = _.debounce(function() {
      _this.index$.classList.remove('visible');
      return indexVisible = false;
    }, 2000);
    /**
     * Adapt the buffer when the viewport has moved.
     * Launched at init and by _scrollHandler
    */

    _adaptBuffer = function() {
      var bufr, nToMove, previous_firstThumbToUpdate, speed, targetCol, targetMonthRk, targetRk, targetY;
      _this.noScrollScheduled = true;
      _this.noIndexScrollScheduled = true;
      lazyHideIndex();
      current_scrollTop = _this.viewPort$.scrollTop;
      speed = Math.abs(current_scrollTop - lastOnScroll_Y) / viewPortHeight;
      if (speed > MAX_SPEED) {
        _scrollHandler();
        return;
      }
      bufr = buffer;
      safeZone.firstRk = null;
      safeZone.firstMonthRk = null;
      safeZone.firstInMonthRow = null;
      safeZone.firstCol = null;
      safeZone.firstVisibleRk = null;
      safeZone.firstY = null;
      safeZone.lastRk = null;
      safeZone.endCol = null;
      safeZone.endMonthRk = null;
      safeZone.endY = null;
      previous_firstThumbToUpdate = safeZone.firstThumbToUpdate;
      safeZone.firstThumbToUpdate = null;
      safeZone.firstThumbRkToUpdate = null;
      _computeSafeZone();
      if (safeZone.lastRk > bufr.lastRk) {
        nToMove = Math.min(safeZone.lastRk - bufr.lastRk, nThumbsInSafeZone);
        if (safeZone.firstRk <= bufr.lastRk) {
          _getBufferNextLast();
          targetRk = bufr.nextLastRk;
          targetMonthRk = bufr.nextLastMonthRk;
          targetCol = bufr.nextLastCol;
          targetY = bufr.nextLastY;
        } else {
          targetRk = safeZone.firstRk;
          targetMonthRk = safeZone.firstMonthRk;
          targetCol = safeZone.firstCol;
          targetY = safeZone.firstY;
        }
        if (nToMove > 0) {
          Photo.listFromFiles(targetRk, nToMove, function(error, res) {
            return _updateThumb(res.files, res.firstRank);
          });
          _moveBufferToBottom(nToMove, targetRk, targetCol, targetY, targetMonthRk);
        }
      } else if (safeZone.firstRk < bufr.firstRk) {
        nToMove = Math.min(bufr.firstRk - safeZone.firstRk, nThumbsInSafeZone);
        if (safeZone.lastRk >= bufr.firstRk) {
          _getBufferNextFirst();
          targetRk = bufr.nextFirstRk;
          targetMonthRk = bufr.nextFirstMonthRk;
          targetCol = bufr.nextFirstCol;
          targetY = bufr.nextFirstY;
        } else {
          targetRk = safeZone.lastRk;
          targetCol = safeZone.endCol;
          targetMonthRk = safeZone.endMonthRk;
          targetY = safeZone.endY;
        }
        if (nToMove > 0) {
          Photo.listFromFiles(targetRk - nToMove + 1, nToMove, function(error, res) {
            if (error) {
              console.error(error);
            }
            return _updateThumb(res.files, res.firstRank);
          });
          _moveBufferToTop(nToMove, targetRk, targetCol, targetY, targetMonthRk);
        }
      }
      if (nToMove == null) {
        return safeZone.firstThumbToUpdate = previous_firstThumbToUpdate;
      }
    };
    _rePositionThumbs = function() {
      var bufr, col, deltaTop, firstVisibleThumb, lastLast, localRk, month, monthRk, rk, row, rowY, scrollTop, startRk, style, thumb, thumb$, _i, _ref;
      bufr = buffer;
      thumb = bufr.first;
      thumb$ = thumb.el;
      monthRk = thumb.monthRk;
      scrollTop = _this.viewPort$.scrollTop;
      month = months[monthRk];
      startRk = thumb.rank;
      localRk = startRk - monthRk;
      row = Math.floor(localRk / nThumbsPerRow);
      rowY = month.y + monthTopPadding + row * rowHeight;
      col = localRk % nThumbsPerRow;
      firstVisibleThumb = null;
      lastLast = bufr.last;
      for (rk = _i = 0, _ref = buffer.nThumbs - 1; _i <= _ref; rk = _i += 1) {
        if (localRk === 0) {
          _insertMonthLabel(month);
        }
        if (!firstVisibleThumb && parseInt(thumb.el.style.top) > scrollTop) {
          firstVisibleThumb = {
            top: parseInt(thumb.el.style.top),
            el: thumb.el
          };
        }
        style = thumb.el.style;
        style.top = rowY + 'px';
        style.left = (marginLeft + col * colWidth) + 'px';
        localRk += 1;
        if (localRk === month.nPhotos) {
          monthRk += 1;
          month = months[monthRk];
          localRk = 0;
          col = 0;
          rowY += rowHeight + monthTopPadding;
        } else {
          col += 1;
          if (col === nThumbsPerRow) {
            rowY += rowHeight;
            col = 0;
          }
        }
        thumb = thumb.prev;
      }
      if (firstVisibleThumb) {
        deltaTop = firstVisibleThumb.top - parseInt(firstVisibleThumb.el.style.top);
        return _this.viewPort$.scrollTop -= deltaTop;
      }
    };
    /**
     * Called when we get from the server the ids of the thumbs that have
     * been created or moved
     * @param  {Array} files     [{id},..,{id}] in chronological order
     * @param  {Integer} fstFileRk The rank of the first file of files
    */

    _updateThumb = function(files, fstFileRk) {
      var bufr, file, fileId, file_i, first, firstThumbRkToUpdate, firstThumbToUpdate, last, lstFileRk, th, thumb, thumb$, _i, _j, _ref, _ref1, _ref2;
      lstFileRk = fstFileRk + files.length - 1;
      bufr = buffer;
      thumb = bufr.first;
      firstThumbToUpdate = safeZone.firstThumbToUpdate;
      firstThumbRkToUpdate = firstThumbToUpdate.rank;
      last = bufr.last;
      first = bufr.first;
      if (firstThumbRkToUpdate < fstFileRk) {
        th = firstThumbToUpdate.prev;
        while (true) {
          if (th === bufr.first) {
            return;
          }
          if (th.rank === fstFileRk) {
            firstThumbToUpdate = th;
            firstThumbRkToUpdate = th.rank;
            break;
          }
          th = th.prev;
        }
      }
      if (lstFileRk < firstThumbRkToUpdate) {
        th = firstThumbToUpdate.next;
        while (true) {
          if (th === bufr.last) {
            return;
          }
          if (th.rank === lstFileRk) {
            firstThumbToUpdate = th;
            firstThumbRkToUpdate = th.rank;
            break;
          }
          th = th.next;
        }
      }
      thumb = firstThumbToUpdate;
      for (file_i = _i = _ref = firstThumbRkToUpdate - fstFileRk, _ref1 = files.length - 1; _i <= _ref1; file_i = _i += 1) {
        file = files[file_i];
        fileId = file.id;
        thumb$ = thumb.el;
        thumb$.file = file;
        thumb$.firstElementChild.src = "files/photo/thumbs/" + fileId + ".jpg";
        thumb$.dataset.id = fileId;
        thumb.id = fileId;
        thumb = thumb.prev;
        if (_this.selected[fileId]) {
          thumb$.setAttribute('aria-selected', true);
          _this.selected[fileId] = thumb$;
        } else {
          thumb$.setAttribute('aria-selected', false);
        }
      }
      thumb = firstThumbToUpdate.next;
      for (file_i = _j = _ref2 = firstThumbRkToUpdate - fstFileRk - 1; _j >= 0; file_i = _j += -1) {
        file = files[file_i];
        fileId = file.id;
        thumb$ = thumb.el;
        thumb$.file = file;
        thumb$.src = "files/photo/thumbs/" + fileId + ".jpg";
        thumb$.dataset.id = fileId;
        thumb.id = fileId;
        thumb = thumb.next;
        if (_this.selected[fileId]) {
          thumb$.setAttribute('aria-selected', true);
          _this.selected[fileId] = thumb$;
        } else {
          thumb$.setAttribute('aria-selected', false);
        }
      }
      if (isDefaultToSelect) {
        _this._toggleOnThumb$(bufr.first.el);
        return isDefaultToSelect = false;
      }
    };
    _getBufferNextFirst = function() {
      var bufr, inMonthRow, initMonthRk, localRk, month, monthRk, nextFirstRk, _i;
      bufr = buffer;
      nextFirstRk = bufr.firstRk - 1;
      if (nextFirstRk === -1) {
        return;
      }
      bufr.nextFirstRk = nextFirstRk;
      initMonthRk = safeZone.endMonthRk;
      for (monthRk = _i = initMonthRk; _i >= 0; monthRk = _i += -1) {
        month = months[monthRk];
        if (month.firstRk <= nextFirstRk) {
          break;
        }
      }
      bufr.nextFirstMonthRk = monthRk;
      localRk = nextFirstRk - month.firstRk;
      inMonthRow = Math.floor(localRk / nThumbsPerRow);
      bufr.nextFirstY = month.y + monthTopPadding + inMonthRow * rowHeight;
      return bufr.nextFirstCol = localRk % nThumbsPerRow;
    };
    _getBufferNextLast = function() {
      var bufr, inMonthRow, initMonthRk, localRk, month, monthRk, nextLastRk, _i, _ref;
      bufr = buffer;
      nextLastRk = bufr.lastRk + 1;
      if (nextLastRk === _this.nPhotos) {
        return;
      }
      bufr.nextLastRk = nextLastRk;
      initMonthRk = safeZone.firstMonthRk;
      for (monthRk = _i = initMonthRk, _ref = months.length - 1; _i <= _ref; monthRk = _i += 1) {
        month = months[monthRk];
        if (nextLastRk <= month.lastRk) {
          break;
        }
      }
      bufr.nextLastMonthRk = monthRk;
      localRk = nextLastRk - month.firstRk;
      inMonthRow = Math.floor(localRk / nThumbsPerRow);
      bufr.nextLastY = month.y + monthTopPadding + inMonthRow * rowHeight;
      return bufr.nextLastCol = localRk % nThumbsPerRow;
    };
    /**
     * after a scroll throttle, will compute the safe zone
    */

    _computeSafeZone = function() {
      var hasReachedLastPhoto;
      _SZ_initStartPoint();
      _SZ_setMarginAtStart();
      hasReachedLastPhoto = _SZ_initEndPoint();
      if (hasReachedLastPhoto) {
        return _SZ_bottomCase();
      }
    };
    /**
     * set the start of the safe zone on the top of the viewport.
    */

    _SZ_initStartPoint = function() {
      var SZ, Y, inMonthRow, month, monthRk, _i, _len, _ref;
      SZ = safeZone;
      Y = current_scrollTop;
      _ref = _this.months;
      for (monthRk = _i = 0, _len = _ref.length; _i < _len; monthRk = ++_i) {
        month = _ref[monthRk];
        if (month.yBottom > Y) {
          break;
        }
      }
      inMonthRow = Math.floor((Y - month.y - monthTopPadding) / rowHeight);
      if (inMonthRow < 0) {
        inMonthRow = 0;
      }
      SZ.firstRk = month.firstRk + inMonthRow * nThumbsPerRow;
      SZ.firstY = month.y + monthTopPadding + inMonthRow * rowHeight;
      SZ.firstMonthRk = monthRk;
      SZ.firstCol = 0;
      SZ.firstThumbToUpdate = null;
      SZ.firstInMonthRow = inMonthRow;
      SZ.firstVisibleRk = SZ.firstRk;
      return _selectCurrentIndex(monthRk);
    };
    /**
     * move up the start of the safe zone of 'nRowsInSafeZoneMargin' rows
     * @return {[type]} [description]
    */

    _SZ_setMarginAtStart = function() {
      var SZ, inMonthRow, j, month, rowsSeen, _i, _ref;
      SZ = safeZone;
      inMonthRow = SZ.firstInMonthRow - nRowsInSafeZoneMargin;
      if (inMonthRow >= 0) {
        month = _this.months[SZ.firstMonthRk];
        SZ.firstRk = month.firstRk + inMonthRow * nThumbsPerRow;
        SZ.firstY = month.y + monthTopPadding + inMonthRow * rowHeight;
        SZ.firstInMonthRow = inMonthRow;
        return;
      } else {
        rowsSeen = SZ.firstInMonthRow;
        for (j = _i = _ref = SZ.firstMonthRk - 1; _i >= 0; j = _i += -1) {
          month = _this.months[j];
          if (rowsSeen + month.nRows >= nRowsInSafeZoneMargin) {
            inMonthRow = month.nRows - nRowsInSafeZoneMargin + rowsSeen;
            SZ.firstRk = month.firstRk + inMonthRow * nThumbsPerRow;
            SZ.firstY = month.y + monthTopPadding + inMonthRow * rowHeight;
            SZ.firstInMonthRow = inMonthRow;
            SZ.firstMonthRk = j;
            return;
          } else {
            rowsSeen += month.nRows;
          }
        }
      }
      SZ.firstRk = 0;
      SZ.firstMonthRk = 0;
      SZ.firstInMonthRow = 0;
      SZ.firstCol = 0;
      return SZ.firstY = monthTopPadding;
    };
    /**
     * Finds the end point of the safeZone, which is 'nThumbsInSafeZone'
     * after the first thumb of the SZ (the number of thumb in the safe zone
     * and in the buffer is constant)
     * Returns true if the safeZone end pointer should be after the last
     * thumb
    */

    _SZ_initEndPoint = function() {
      var SZ, inMonthRk, inMonthRow, lastRk, month, monthRk, _i, _ref, _ref1;
      SZ = safeZone;
      lastRk = SZ.firstRk + nThumbsInSafeZone - 1;
      if (lastRk >= _this.nPhotos) {
        lastRk = _this.nPhotos - 1;
        safeZone.lastRk = lastRk;
        return true;
      }
      for (monthRk = _i = _ref = SZ.firstMonthRk, _ref1 = months.length - 1; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; monthRk = _ref <= _ref1 ? ++_i : --_i) {
        month = months[monthRk];
        if (lastRk <= month.lastRk) {
          break;
        }
      }
      inMonthRk = lastRk - month.firstRk;
      inMonthRow = Math.floor(inMonthRk / nThumbsPerRow);
      safeZone.lastRk = lastRk;
      safeZone.endMonthRk = monthRk;
      safeZone.endCol = inMonthRk % nThumbsPerRow;
      safeZone.endY = month.y + monthTopPadding + inMonthRow * rowHeight;
      return false;
    };
    /**
     * if the safe zone is bellow the last thumb => move up the safe zone
    */

    _SZ_bottomCase = function() {
      var SZ, inMonthRk, inMonthRow, month, monthRk, rk, thumbsSeen, thumbsTarget, _i;
      SZ = safeZone;
      months = _this.months;
      monthRk = months.length - 1;
      thumbsSeen = 0;
      thumbsTarget = nThumbsInSafeZone;
      for (monthRk = _i = monthRk; _i >= 0; monthRk = _i += -1) {
        month = months[monthRk];
        thumbsSeen += month.nPhotos;
        if (thumbsSeen >= thumbsTarget) {
          break;
        }
      }
      if (thumbsSeen < thumbsTarget) {
        SZ.firstMonthRk = 0;
        SZ.firstInMonthRow = 0;
        SZ.firstRk = 0;
        return SZ.firstY = month.y + cellPadding + monthHeaderHeight;
      } else {
        rk = _this.nPhotos - thumbsTarget;
        inMonthRk = rk - month.firstRk;
        inMonthRow = Math.floor(inMonthRk / nThumbsPerRow);
        SZ.firstMonthRk = monthRk;
        SZ.firstInMonthRow = inMonthRow;
        SZ.firstCol = inMonthRk % nThumbsPerRow;
        SZ.firstRk = rk;
        return SZ.firstY = month.y + cellPadding + monthHeaderHeight + inMonthRow * rowHeight;
      }
    };
    _moveBufferToBottom = function(nToMove, startRk, startCol, startY, monthRk) {
      var col, localRk, month, monthRk_initial, rk, rowY, style, thumb, thumb$, _i, _ref;
      monthRk_initial = monthRk;
      rowY = startY;
      col = startCol;
      month = _this.months[monthRk];
      localRk = startRk - month.firstRk;
      if (safeZone.firstThumbToUpdate === null) {
        safeZone.firstThumbToUpdate = buffer.first;
      }
      for (rk = _i = startRk, _ref = startRk + nToMove - 1; _i <= _ref; rk = _i += 1) {
        if (localRk === 0) {
          _insertMonthLabel(month);
        }
        thumb = buffer.first;
        thumb$ = thumb.el;
        thumb$.dataset.rank = rk;
        thumb.rank = rk;
        thumb.monthRk = monthRk;
        thumb$.src = '';
        thumb$.dataset.id = '';
        style = thumb$.style;
        style.top = rowY + 'px';
        style.left = (marginLeft + col * colWidth) + 'px';
        if (rk === safeZone.firstVisibleRk) {
          safeZone.firstThumbToUpdate = thumb;
        }
        buffer.last = buffer.first;
        buffer.first = buffer.first.prev;
        buffer.firstRk = buffer.first.rank;
        buffer.last.rank = rk;
        localRk += 1;
        if (localRk === month.nPhotos) {
          monthRk += 1;
          month = _this.months[monthRk];
          localRk = 0;
          col = 0;
          rowY += rowHeight + monthTopPadding;
        } else {
          col += 1;
          if (col === nThumbsPerRow) {
            rowY += rowHeight;
            col = 0;
          }
        }
      }
      buffer.lastRk = rk - 1;
      buffer.firstRk = buffer.first.rank;
      buffer.nextLastRk = rk;
      buffer.nextLastCol = col;
      buffer.nextLastY = rowY;
      return buffer.nextLastMonthRk = monthRk;
    };
    _moveBufferToTop = function(nToMove, startRk, startCol, startY, monthRk) {
      var col, localRk, month, rk, rowY, style, thumb, thumb$, _i, _ref;
      rowY = startY;
      col = startCol;
      month = _this.months[monthRk];
      localRk = startRk - month.firstRk;
      if (safeZone.firstThumbToUpdate === null) {
        safeZone.firstThumbToUpdate = buffer.last;
      }
      for (rk = _i = startRk, _ref = startRk - nToMove + 1; _i >= _ref; rk = _i += -1) {
        thumb = buffer.last;
        thumb$ = thumb.el;
        thumb$.dataset.rank = rk;
        thumb.rank = rk;
        thumb.monthRk = monthRk;
        thumb$.src = '';
        thumb$.dataset.id = '';
        style = thumb$.style;
        style.top = rowY + 'px';
        style.left = (marginLeft + col * colWidth) + 'px';
        if (rk === safeZone.firstVisibleRk) {
          safeZone.firstThumbToUpdate = thumb;
        }
        buffer.first = buffer.last;
        buffer.last = buffer.last.next;
        buffer.lastRk = buffer.last.rank;
        buffer.first.rank = rk;
        localRk -= 1;
        if (localRk === -1) {
          if (rk === 0) {
            rk = -1;
            break;
          }
          _insertMonthLabel(month);
          monthRk -= 1;
          month = _this.months[monthRk];
          localRk = month.nPhotos - 1;
          col = month.lastThumbCol;
          rowY -= cellPadding + monthHeaderHeight + rowHeight;
        } else {
          col -= 1;
          if (col === -1) {
            rowY -= rowHeight;
            col = nThumbsPerRow - 1;
          }
        }
      }
      buffer.firstRk = rk + 1;
      return buffer.lastRk = buffer.last.rank;
    };
    _insertMonthLabel = function(month) {
      var label$;
      if (month.label$) {
        label$ = month.label$;
      } else {
        label$ = document.createElement('div');
        label$.classList.add('long-list-month-label');
        _this.thumbs$.appendChild(label$);
        month.label$ = label$;
      }
      label$.textContent = month.date.format('MMMM YYYY');
      label$.style.top = (month.y + monthLabelTop) + 'px';
      return label$.style.left = Math.round(marginLeft / 2) + 'px';
    };
    _indexClickHandler = function(e) {
      var monthRk;
      monthRk = e.target.dataset.monthRk;
      if (monthRk) {
        _this.viewPort$.scrollTop = _this.months[monthRk].y;
        return _adaptIndex();
      }
    };
    _indexMouseEnter = function() {
      _this.index$.classList.add('hardVisible');
      return indexVisible = false;
    };
    _indexMouseLeave = function() {
      _this.index$.classList.add('visible');
      _this.index$.classList.remove('hardVisible');
      return lazyHideIndex();
    };
    _getStaticDimensions();
    _resizeHandler();
    _initBuffer();
    this.noScrollScheduled = true;
    this.thumbs$.addEventListener('click', this._clickHandler);
    this.thumbs$.addEventListener('dblclick', this._dblclickHandler);
    this.viewPort$.addEventListener('scroll', _scrollHandler);
    this.index$.addEventListener('click', _indexClickHandler);
    this.index$.addEventListener('mouseenter', _indexMouseEnter);
    return this.index$.addEventListener('mouseleave', _indexMouseLeave);
  };

  LongList.prototype._clickHandler = function(e) {
    var th, thBottomY, thTopY, viewPortBottomY, viewPortTopY;
    th = e.target;
    while (!th.classList.contains('thumb')) {
      th = th.parentElement;
      if (th.classList.contains('thumbs')) {
        return;
      }
    }
    if (!this._toggleOnThumb$(th)) {
      return null;
    }
    this._lastSelectedCol = this._coordonate.left(th);
    viewPortTopY = this.viewPort$.scrollTop;
    viewPortBottomY = viewPortTopY + this.viewPort$.clientHeight;
    thTopY = this._coordonate.top(th);
    thBottomY = thTopY + this.thumbHeight;
    if (viewPortBottomY < thBottomY) {
      th.scrollIntoView(false);
    }
    if (thTopY < viewPortTopY) {
      return th.scrollIntoView(true);
    }
  };

  LongList.prototype._dblclickHandler = function(e) {
    var th;
    th = e.target;
    while (!th.classList.contains('thumb')) {
      th = th.parentElement;
      if (th.classList.contains('thumbs')) {
        return;
      }
    }
    this._toggleOnThumb$(th);
    this._lastSelectedCol = this._coordonate.left(th);
    return this.modal.onYes();
  };

  /**
   * toogles on a thumb.
   * Returns null if the thumb is already selected or if there is no image id
   * associated yet
  */


  LongList.prototype._toggleOnThumb$ = function(thumb$) {
    if (thumb$.dataset.id === '') {
      return null;
    }
    if (this.selected[thumb$.dataset.id]) {
      return null;
    }
    this._unselectAll();
    thumb$.setAttribute('aria-selected', true);
    return this.selected[thumb$.dataset.id] = thumb$;
  };

  LongList.prototype._unselectAll = function() {
    var id, thumb$, _ref, _results;
    _ref = this.selected;
    _results = [];
    for (id in _ref) {
      thumb$ = _ref[id];
      if (typeof thumb$ === 'object') {
        thumb$.setAttribute('aria-selected', false);
        _results.push(this.selected[id] = false);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  LongList.prototype._getSelectedThumb$ = function() {
    var id, thumb$, _ref;
    _ref = this.selected;
    for (id in _ref) {
      thumb$ = _ref[id];
      if (typeof thumb$ === 'object') {
        return thumb$;
      }
    }
    return null;
  };

  LongList.prototype._selectNextThumb = function() {
    var id, nextThumb$, thumb$, _ref;
    _ref = this.selected;
    for (id in _ref) {
      thumb$ = _ref[id];
      if (typeof thumb$ === 'object') {
        break;
      }
    }
    nextThumb$ = this._getNextThumb$(thumb$);
    if (nextThumb$ === null) {
      return null;
    }
    this._lastSelectedCol = this._coordonate.left(nextThumb$);
    if (!this._toggleOnThumb$(nextThumb$)) {
      return null;
    }
    return this._moveViewportToBottomOfThumb$(nextThumb$);
  };

  LongList.prototype._selectPreviousThumb = function() {
    var prevThumb$, thumb$;
    thumb$ = this._getSelectedThumb$();
    prevThumb$ = this._getPreviousThumb$(thumb$);
    if (prevThumb$ === null) {
      return null;
    }
    this._lastSelectedCol = this._coordonate.left(prevThumb$);
    if (!this._toggleOnThumb$(prevThumb$)) {
      return null;
    }
    return this._moveViewportToTopOfThumb$(prevThumb$);
  };

  LongList.prototype._selectThumbUp = function() {
    var left, th, thumb$, top;
    thumb$ = this._getSelectedThumb$();
    if (thumb$ === null) {
      return null;
    }
    if (thumb$.dataset.rank === '0') {
      return null;
    }
    if (this._lastSelectedCol === null) {
      left = this._coordonate.left(thumb$);
    } else {
      left = this._lastSelectedCol;
    }
    top = thumb$.style.top;
    th = this._getPreviousThumb$(thumb$);
    if (th === null) {
      return null;
    }
    while (th.style.left !== left) {
      if (th.dataset.rank === '0') {
        this._lastSelectedCol = this._coordonate.left(th);
        if (!this._toggleOnThumb$(th)) {
          return null;
        }
        this._moveViewportToTopOfThumb$(th);
        return th;
      }
      if (th.style.top !== top) {
        if (this._coordonate.left(th) <= left) {
          if (!this._toggleOnThumb$(th)) {
            return null;
          }
          this._moveViewportToTopOfThumb$(th);
          return th;
        }
      }
      th = this._getPreviousThumb$(th);
      if (th === null) {
        return null;
      }
    }
    if (!this._toggleOnThumb$(th)) {
      return null;
    }
    this._moveViewportToTopOfThumb$(th);
    return th;
  };

  LongList.prototype._selectThumbDown = function() {
    var hasAlreadyChangedOfRow, left, th, thumb$, top;
    thumb$ = this._getSelectedThumb$();
    if (thumb$ === null) {
      return null;
    }
    if (this._coordonate.rank(thumb$) === this.nPhotos - 1) {
      return null;
    }
    if (this._lastSelectedCol === null) {
      left = this._coordonate.left(thumb$);
    } else {
      left = this._lastSelectedCol;
    }
    top = thumb$.style.top;
    th = this._getNextThumb$(thumb$);
    if (th === null) {
      return null;
    }
    hasAlreadyChangedOfRow = false;
    while (this._coordonate.left(th) !== left) {
      if (this._coordonate.rank(th) === this.nPhotos - 1) {
        this._lastSelectedCol = this._coordonate.left(th);
        if (!this._toggleOnThumb$(th)) {
          return null;
        }
        this._moveViewportToBottomOfThumb$(th);
        return th;
      }
      if (th.style.top !== top) {
        if (hasAlreadyChangedOfRow) {
          th = this._getPreviousThumb$(th);
          if (th === null) {
            return null;
          }
          if (!this._toggleOnThumb$(th)) {
            return null;
          }
          this._moveViewportToBottomOfThumb$(th);
          return th;
        }
        hasAlreadyChangedOfRow = true;
        top = th.style.top;
        if (this._coordonate.left(th) >= left) {
          if (!this._toggleOnThumb$(th)) {
            return null;
          }
          this._moveViewportToBottomOfThumb$(th);
          return th;
        }
      }
      th = this._getNextThumb$(th);
      if (th === null) {
        return null;
      }
    }
    if (!this._toggleOnThumb$(th)) {
      return null;
    }
    this._moveViewportToBottomOfThumb$(th);
    return th;
  };

  LongList.prototype._selectEndLineThumb = function() {
    var left, th, thumb$, top;
    thumb$ = this._getSelectedThumb$();
    if (thumb$ === null) {
      return;
    }
    if (this._coordonate.rank(thumb$) === this.nPhotos - 1) {
      return;
    }
    if (this._lastSelectedCol === null) {
      left = this._coordonate.left(thumb$);
    } else {
      left = this._lastSelectedCol;
    }
    top = thumb$.style.top;
    th = this._getNextThumb$(thumb$);
    if (th === null) {
      return null;
    }
    while (th.style.top === top) {
      if (this._coordonate.rank(th) === this.nPhotos - 1) {
        this._lastSelectedCol = this._coordonate.left(th);
        if (!this._toggleOnThumb$(th)) {
          return null;
        }
        this._moveViewportToBottomOfThumb$(th);
        return;
      }
      th = this._getNextThumb$(th);
      if (th === null) {
        return null;
      }
    }
    th = this._getPreviousThumb$(th);
    if (th === null) {
      return null;
    }
    this._lastSelectedCol = this._coordonate.left(th);
    if (!this._toggleOnThumb$(th)) {
      return null;
    }
    this._moveViewportToBottomOfThumb$(th);
  };

  LongList.prototype._selectStartLineThumb = function() {
    var left, th, thumb$, top;
    thumb$ = this._getSelectedThumb$();
    if (thumb$ === null) {
      return;
    }
    if (Number(thumb$.dataset.rank) === 0) {
      return;
    }
    if (this._lastSelectedCol === null) {
      left = this._coordonate.left(thumb$);
    } else {
      left = this._lastSelectedCol;
    }
    top = thumb$.style.top;
    th = this._getPreviousThumb$(thumb$);
    if (th === null) {
      return null;
    }
    while (th.style.top === top) {
      if (this._coordonate.rank(th) === 0) {
        this._lastSelectedCol = this._coordonate.left(th);
        if (!this._toggleOnThumb$(th)) {
          return null;
        }
        this._moveViewportToBottomOfThumb$(th);
        return;
      }
      th = this._getPreviousThumb$(th);
    }
    th = this._getNextThumb$(th);
    if (th === null) {
      return null;
    }
    this._lastSelectedCol = this._coordonate.left(th);
    if (!this._toggleOnThumb$(th)) {
      return null;
    }
    this._moveViewportToBottomOfThumb$(th);
  };

  LongList.prototype._coordonate = {
    top: function(thumb$) {
      return parseInt(thumb$.style.top, 10);
    },
    left: function(thumb$) {
      return parseInt(thumb$.style.left, 10);
    },
    rank: function(thumb$) {
      return thumb$.dataset.rank;
    }
  };

  LongList.prototype._selectPageDownThumb = function() {
    var th, thBottomY, thTopY, thumb$, viewPortBottomY;
    viewPortBottomY = this.viewPort$.scrollTop + this.viewPort$.clientHeight;
    thumb$ = this._getSelectedThumb$();
    if (thumb$ === null) {
      return;
    }
    th = thumb$;
    thTopY = this._coordonate.top(th);
    thBottomY = thTopY + this.thumbHeight;
    while (thBottomY <= viewPortBottomY) {
      th = this._selectThumbDown();
      if (th === null) {
        return;
      }
      thTopY = this._coordonate.top(th);
      thBottomY = thTopY + this.thumbHeight;
    }
    th.scrollIntoView(true);
    return this._moveViewportToTopOfThumb$(th);
  };

  LongList.prototype._selectPageUpThumb = function() {
    var th, thTopY, thumb$, viewPortTopY;
    viewPortTopY = this.viewPort$.scrollTop;
    thumb$ = this._getSelectedThumb$();
    th = thumb$;
    thTopY = this._coordonate.top(th);
    while (thTopY >= viewPortTopY) {
      th = this._selectThumbUp();
      if (th === null) {
        return;
      }
      thTopY = this._coordonate.top(th);
    }
    return th.scrollIntoView(false);
  };

  LongList.prototype._moveViewportToBottomOfThumb$ = function(thumb$) {
    var thumb$Bottom, thumb$Top, viewPortBottomY;
    thumb$Top = this._coordonate.top(thumb$);
    thumb$Bottom = thumb$Top + this.thumbHeight;
    viewPortBottomY = this.viewPort$.scrollTop + this.viewPort$.clientHeight;
    if (viewPortBottomY < thumb$Bottom) {
      thumb$.scrollIntoView(false);
      return this._scrollHandler();
    }
  };

  /**
   * will move the viewport so that the top of the given thumb is at the top
   * of the viewport, but only if the top of the thumb is above the viewport
   * @param  {element} thumb$ # the thumb
  */


  LongList.prototype._moveViewportToTopOfThumb$ = function(thumb$) {
    var inMonthRow, month, monthRk, thumb$Top, thumbRk, viewPortTop, _i, _len, _ref;
    thumb$Top = this._coordonate.top(thumb$);
    viewPortTop = this.viewPort$.scrollTop;
    thumbRk = parseInt(thumb$.dataset.rank);
    _ref = this.months;
    for (monthRk = _i = 0, _len = _ref.length; _i < _len; monthRk = ++_i) {
      month = _ref[monthRk];
      if (thumbRk <= month.lastRk) {
        break;
      }
    }
    inMonthRow = Math.floor((thumbRk - month.firstRk) / this.nThumbsPerRow);
    if (inMonthRow === 0) {
      if (month.y + this.monthLabelTop < this.viewPort$.scrollTop) {
        this.viewPort$.scrollTop = month.y + this.monthLabelTop;
        return this._scrollHandler();
      }
    } else {
      if (thumb$Top < viewPortTop) {
        thumb$.scrollIntoView(true);
        this._scrollHandler();
      }
    }
  };

  /**
   * @param  {Element} thumb$ # the element corresponding to the thumb
   * @return {null}        # return null if on first thumb
   * @return {Element}     # the previous element thumb or null if on first
   *                         thumb of first of the buffer
  */


  LongList.prototype._getPreviousThumb$ = function(thumb$) {
    var th;
    if (thumb$.dataset.rank === '0') {
      return null;
    }
    if (thumb$ === this.buffer.first.el) {
      return null;
    }
    th = thumb$.previousElementSibling;
    if (th == null) {
      th = thumb$.parentNode.lastElementChild;
      if (th === thumb$) {
        return null;
      }
    }
    while (!th.classList.contains('thumb')) {
      th = th.previousElementSibling;
      if (th == null) {
        th = thumb$.parentNode.lastElementChild;
        if (th === thumb$) {
          return null;
        }
      }
    }
    return th;
  };

  /**
   *
   * @param  {Element} thumb$ # the start thumb element
   * @return {Element|null}   # returns an element or null if on the last
   *                            thumb or the last of the buffer
  */


  LongList.prototype._getNextThumb$ = function(thumb$) {
    var th;
    if (this._coordonate.rank(thumb$) === this.nPhotos - 1) {
      return null;
    }
    if (thumb$ === this.buffer.last.el) {
      return null;
    }
    th = thumb$.nextElementSibling;
    if (th == null) {
      th = thumb$.parentNode.firstElementChild;
      if (th === thumb$) {
        return null;
      }
    }
    while (!th.classList.contains('thumb')) {
      th = th.nextElementSibling;
      if (th == null) {
        th = thumb$.parentNode.firstElementChild;
        if (th === thumb$) {
          return null;
        }
      }
    }
    return th;
  };

  /**
   * a helper in charge of getting the width in px of the scrollbar this one
   * appears
  */


  LongList.prototype._getScrollBarWidth = function() {
    var inner, outer, w1, w2;
    inner = document.createElement('p');
    inner.style.width = "100%";
    inner.style.height = "200px";
    outer = document.createElement('div');
    outer.style.position = "absolute";
    outer.style.top = "0px";
    outer.style.left = "0px";
    outer.style.visibility = "hidden";
    outer.style.width = "200px";
    outer.style.height = "150px";
    outer.style.overflow = "hidden";
    outer.appendChild(inner);
    document.body.appendChild(outer);
    w1 = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    w2 = inner.offsetWidth;
    if (w1 === w2) {
      w2 = outer.clientWidth;
    }
    document.body.removeChild(outer);
    return w1 - w2;
  };

  return LongList;

})();
});

;require.register("views/main", function(exports, require, module) {
var AccountView, AppCollection, ApplicationsListView, BaseView, ConfigApplicationsView, DeviceCollection, HomeView, IntentManager, MarketView, NavbarView, NotificationCollection, SocketListener, StackAppCollection, User, appIframeTemplate,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

appIframeTemplate = require('templates/application_iframe');

AppCollection = require('collections/application');

StackAppCollection = require('collections/stackApplication');

NotificationCollection = require('collections/notifications');

DeviceCollection = require('collections/device');

NavbarView = require('views/navbar');

AccountView = require('views/account');

ConfigApplicationsView = require('views/config_applications');

MarketView = require('views/market');

ApplicationsListView = require('views/home');

SocketListener = require('lib/socket_listener');

User = require('models/user');

IntentManager = require('lib/intent_manager');

module.exports = HomeView = (function(_super) {
  __extends(HomeView, _super);

  HomeView.prototype.el = 'body';

  HomeView.prototype.template = require('templates/layout');

  HomeView.prototype.subscriptions = {
    'backgroundChanged': 'changeBackground',
    'app-state:changed': 'onAppStateChanged',
    'update-stack:start': 'onUpdateStackStart',
    'update-stack:end': 'onUpdateStackEnd'
  };

  function HomeView() {
    this.forceIframeRendering = __bind(this.forceIframeRendering, this);
    this.onAppHashChanged = __bind(this.onAppHashChanged, this);
    this.displayUpdateApplication = __bind(this.displayUpdateApplication, this);
    this.displayConfigApplications = __bind(this.displayConfigApplications, this);
    this.displayAccount = __bind(this.displayAccount, this);
    this.displayMarket = __bind(this.displayMarket, this);
    this.displayApplicationsListEdit = __bind(this.displayApplicationsListEdit, this);
    this.displayApplicationsList = __bind(this.displayApplicationsList, this);
    this.displayView = __bind(this.displayView, this);
    this.afterRender = __bind(this.afterRender, this);
    this.apps = new AppCollection(window.applications);
    this.stackApps = new StackAppCollection(window.stack_applications);
    this.devices = new DeviceCollection(window.devices);
    this.market = new AppCollection(window.market_applications);
    this.notifications = new NotificationCollection();
    this.intentManager = new IntentManager();
    SocketListener.watch(this.apps);
    SocketListener.watch(this.notifications);
    SocketListener.watch(this.devices);
    HomeView.__super__.constructor.apply(this, arguments);
  }

  HomeView.prototype.afterRender = function() {
    if (this.viewModel == null) {
      this.viewModel = new Backbone.Model;
    }
    this.navbar = new NavbarView(this.apps, this.notifications);
    this.applicationListView = new ApplicationsListView(this.apps, this.market);
    this.configApplications = new ConfigApplicationsView(this.apps, this.devices, this.stackApps, this.market);
    this.accountView = new AccountView();
    this.marketView = new MarketView(this.apps, this.market);
    this.frames = this.$('#app-frames');
    this.content = this.$('#content');
    this.changeBackground(window.app.instance.background);
    this.backButton = this.$('.back-button');
    this.backButton.hide();
    $(window).resize(this.forceIframeRendering);
    return this.forceIframeRendering();
  };

  /* Functions*/


  HomeView.prototype.changeBackground = function(background) {
    var name, val;
    if (background == null) {
      background = 'background_07';
    }
    if (background === void 0 || background === null) {
      this.content.css('background_07.jpg', 'none');
    }
    if (background === 'background-none') {
      return this.content.css('background-image', 'none');
    } else {
      if (background.indexOf('background') > -1) {
        name = background.replace('-', '_');
        val = "url('/img/backgrounds/" + name + ".jpg')";
      } else {
        val = "url('/api/backgrounds/" + background + "/picture.jpg')";
      }
      return this.content.css('background-image', val);
    }
  };

  HomeView.prototype.logout = function(event) {
    var user;
    if (app.mainView.viewModel.get('updatingStack')) {
      return alert(t('stack updating block message'));
    } else {
      user = new User();
      return user.logout(function(err) {
        if (err) {
          return alert('Server error occured, logout failed.');
        } else {
          return window.location = window.location.origin + '/login/';
        }
      });
    }
  };

  HomeView.prototype.displayView = function(view, title) {
    var displayView,
      _this = this;
    if (app.mainView.viewModel.get('updatingStack')) {
      return alert(t('stack updating block message'));
    } else {
      if (title != null) {
        title = title.substring(6);
      } else {
        if (title == null) {
          title = t('home');
        }
      }
      window.document.title = "Cozy - " + title;
      $('#current-application').html(title);
      if (view === this.applicationListView) {
        this.backButton.hide();
      } else {
        this.backButton.show();
      }
      displayView = function() {
        _this.frames.hide();
        view.$el.hide();
        _this.content.show();
        $('#home-content').append(view.$el);
        view.$el.show();
        _this.currentView = view;
        _this.forceIframeRendering();
        return _this.content.scrollTop(0);
      };
      if (this.currentView != null) {
        if (view === this.currentView) {
          this.frames.hide();
          this.content.show();
          this.forceIframeRendering();
          return;
        }
        this.currentView.$el.hide();
        this.currentView.$el.detach();
        return displayView();
      } else {
        return displayView();
      }
    }
  };

  HomeView.prototype.displayApplicationsList = function() {
    this.displayView(this.applicationListView);
    return window.document.title = t("cozy home title");
  };

  HomeView.prototype.displayApplicationsListEdit = function() {
    return this.displayView(this.applicationListView, t("cozy home title"));
  };

  HomeView.prototype.displayMarket = function() {
    return this.displayView(this.marketView, t("cozy app store title"));
  };

  HomeView.prototype.displayAccount = function() {
    return this.displayView(this.accountView, t('cozy account title'));
  };

  HomeView.prototype.displayConfigApplications = function() {
    return this.displayView(this.configApplications, t("cozy applications title"));
  };

  HomeView.prototype.displayUpdateApplication = function(slug) {
    var action, method, timeout;
    this.displayView(this.configApplications, t("cozy applications title"));
    window.app.routers.main.navigate('config-applications', false);
    method = this.configApplications.openUpdatePopover;
    action = method.bind(this.configApplications, slug);
    timeout = null;
    if (this.apps.length === 0) {
      this.listenToOnce(this.apps, 'reset', function() {
        clearTimeout(timeout);
        return action();
      });
      return timeout = setTimeout(action, 1500);
    } else {
      return setTimeout(action, 500);
    }
  };

  HomeView.prototype.displayUpdateStack = function() {
    var _this = this;
    this.displayView(this.configApplications);
    window.document.title = t("cozy applications title");
    window.app.routers.main.navigate('config-applications', false);
    return setTimeout(function() {
      return _this.configApplications.onUpdateClicked();
    }, 500);
  };

  HomeView.prototype.displayApplication = function(slug, hash) {
    var contentWindow, currentHash, err, frame, onLoad, _base, _base1,
      _this = this;
    if (app.mainView.viewModel.get('updatingStack')) {
      return alert(t('stack updating block message'));
    } else if (this.apps.length === 0) {
      if ((_base = this.apps).once == null) {
        _base.once = this.apps.on;
      }
      if (typeof this.apps.once !== 'function') {
        if ((_base1 = this.apps).once == null) {
          _base1.once = this.apps.on;
        }
      }
      return this.apps.once('reset', function() {
        return _this.displayApplication(slug, hash);
      });
    } else {
      this.$("#app-btn-" + slug + " .spinner").show();
      this.$("#app-btn-" + slug + " .icon").hide();
      frame = this.$("#" + slug + "-frame");
      onLoad = function() {
        var app, name;
        _this.frames.css('top', '0');
        _this.frames.css('left', '0');
        _this.frames.css('position', 'inherit');
        _this.frames.show();
        _this.content.hide();
        _this.backButton.show();
        _this.$('#app-frames').find('iframe').hide();
        frame.show();
        _this.selectedApp = slug;
        app = _this.apps.get(slug);
        name = app.get('displayName') || app.get('name') || '';
        if (name.length > 0) {
          name = name.replace(/^./, name[0].toUpperCase());
        }
        window.document.title = "Cozy - " + name;
        $("#current-application").html(name);
        _this.$("#app-btn-" + slug + " .spinner").hide();
        return _this.$("#app-btn-" + slug + " .icon").show();
      };
      if (frame.length === 0) {
        frame = this.createApplicationIframe(slug, hash);
        this.frames.show();
        this.frames.css('top', '-9999px');
        this.frames.css('left', '-9999px');
        this.frames.css('position', 'absolute');
        return frame.on('load', _.once(onLoad));
      } else if (hash) {
        contentWindow = frame.prop('contentWindow');
        try {
          currentHash = contentWindow.location.hash.substring(1);
        } catch (_error) {
          err = _error;
          console.err(err);
        }
        return onLoad();
      } else if (frame.is(':visible')) {
        try {
          frame.prop('contentWindow').location.hash = '';
        } catch (_error) {
          err = _error;
          console.err(err);
        }
        return onLoad();
      } else {
        return onLoad();
      }
    }
  };

  HomeView.prototype.createApplicationIframe = function(slug, hash) {
    var iframe$, iframeHTML,
      _this = this;
    if (hash == null) {
      hash = "";
    }
    if ((hash != null ? hash.length : void 0) > 0) {
      hash = "#" + hash;
    }
    iframeHTML = appIframeTemplate({
      id: slug,
      hash: hash
    });
    iframe$ = $(iframeHTML).appendTo(this.frames);
    iframe$.prop('contentWindow').addEventListener('hashchange', function() {
      var location, newhash;
      location = iframe$.prop('contentWindow').location;
      newhash = location.hash.replace('#', '');
      return _this.onAppHashChanged(slug, newhash);
    });
    this.forceIframeRendering();
    this.intentManager.registerIframe(iframe$[0], '*');
    return iframe$;
  };

  HomeView.prototype.onAppHashChanged = function(slug, newhash) {
    var currentHash;
    if (slug === this.selectedApp) {
      currentHash = location.hash.substring(("#apps/" + slug + "/").length);
      if (currentHash !== newhash) {
        if (typeof app !== "undefined" && app !== null) {
          app.routers.main.navigate("apps/" + slug + "/" + newhash, false);
        }
      }
      return this.forceIframeRendering();
    }
  };

  HomeView.prototype.onAppStateChanged = function(appState) {
    var frame, _ref;
    if ((_ref = appState.status) === 'updating' || _ref === 'broken' || _ref === 'uninstalled') {
      frame = this.getAppFrame(appState.slug);
      frame.remove();
      return frame.off('load');
    }
  };

  HomeView.prototype.onUpdateStackStart = function() {
    return this.viewModel.set({
      updatingStack: true
    });
  };

  HomeView.prototype.onUpdateStackEnd = function() {
    return this.viewModel.set({
      updatingStack: false
    });
  };

  HomeView.prototype.forceIframeRendering = function() {
    var _this = this;
    this.frames.find('iframe').height("99%");
    return setTimeout(function() {
      return _this.frames.find('iframe').height("100%");
    }, 10);
  };

  HomeView.prototype.getAppFrame = function(slug) {
    return this.$("#" + slug + "-frame");
  };

  HomeView.prototype.displayToken = function(token, slug) {
    var iframeWin;
    iframeWin = document.getElementById("" + slug + "-frame").contentWindow;
    return iframeWin.postMessage({
      token: token,
      appName: slug
    }, '*');
  };

  return HomeView;

})(BaseView);
});

;require.register("views/market", function(exports, require, module) {
var AppCollection, Application, ApplicationRow, BaseView, ColorButton, MarketView, PopoverDescriptionView, REPOREGEX, slugify,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

PopoverDescriptionView = require('views/popover_description');

ApplicationRow = require('views/market_application');

ColorButton = require('widgets/install_button');

AppCollection = require('collections/application');

Application = require('models/application');

slugify = require('helpers/slugify');

REPOREGEX = /^(https?:\/\/)?([\da-z\.-]+\.[a-z\.]{2,})(:[0-9]{1,5})?([\/\w\.-]*)*(?:\.git)?(@[\/\w\.-]+)?$/;

module.exports = MarketView = (function(_super) {
  __extends(MarketView, _super);

  MarketView.prototype.id = 'market-view';

  MarketView.prototype.template = require('templates/market');

  MarketView.prototype.tagName = 'div';

  MarketView.prototype.events = {
    'keyup #app-git-field': 'onEnterPressed',
    "click #your-app .app-install-button": "onInstallClicked"
  };

  /* Constructor*/


  function MarketView(installedApps, marketApps) {
    this.resetForm = __bind(this.resetForm, this);
    this.hideError = __bind(this.hideError, this);
    this.displayError = __bind(this.displayError, this);
    this.displayInfo = __bind(this.displayInfo, this);
    this.onInstallClicked = __bind(this.onInstallClicked, this);
    this.onEnterPressed = __bind(this.onEnterPressed, this);
    this.addApplication = __bind(this.addApplication, this);
    this.onAppListsChanged = __bind(this.onAppListsChanged, this);
    this.afterRender = __bind(this.afterRender, this);
    this.marketApps = marketApps;
    this.installedApps = installedApps;
    MarketView.__super__.constructor.call(this);
  }

  MarketView.prototype.afterRender = function() {
    this.appList = this.$('#market-applications-list');
    this.appGitField = this.$("#app-git-field");
    this.installInfo = this.$("#add-app-modal .loading-indicator");
    this.infoAlert = this.$("#your-app .info");
    this.infoAlert.hide();
    this.errorAlert = this.$("#your-app .error");
    this.errorAlert.hide();
    this.noAppMessage = this.$('#no-app-message');
    this.installAppButton = new ColorButton(this.$("#add-app-submit"));
    this.onAppListsChanged();
    this.listenTo(this.installedApps, 'reset', this.onAppListsChanged);
    this.listenTo(this.installedApps, 'change', this.onAppListsChanged);
    this.listenTo(this.installedApps, 'remove', this.onAppListsChanged);
    return this.listenTo(this.marketApps, 'reset', this.onAppListsChanged);
  };

  MarketView.prototype.onAppListsChanged = function() {
    var installedApps, installeds,
      _this = this;
    installedApps = new AppCollection(this.installedApps.filter(function(app) {
      var _ref;
      return (_ref = app.get('state')) === 'installed' || _ref === 'stopped' || _ref === 'broken';
    }));
    installeds = installedApps.pluck('slug');
    this.$('.cozy-app').remove();
    this.marketApps.each(function(app) {
      var slug;
      slug = app.get('slug');
      if (installeds.indexOf(slug) === -1) {
        if (_this.$("#market-app-" + (app.get('slug'))).length === 0) {
          return _this.addApplication(app);
        }
      }
    });
    if (this.$('.cozy-app').length === 0) {
      return this.noAppMessage.show();
    }
  };

  MarketView.prototype.addApplication = function(application) {
    var appButton, row;
    row = new ApplicationRow(application, this);
    this.noAppMessage.hide();
    this.appList.append(row.el);
    return appButton = this.$(row.el);
  };

  MarketView.prototype.onEnterPressed = function(event) {
    var _ref, _ref1;
    if (event.which === 13 && !((_ref = this.popover) != null ? _ref.$el.is(':visible') : void 0)) {
      return this.onInstallClicked(event);
    } else if (event.which === 13) {
      return (_ref1 = this.popover) != null ? _ref1.confirmCallback() : void 0;
    }
  };

  MarketView.prototype.onInstallClicked = function(event) {
    var data;
    data = {
      git: this.$("#app-git-field").val()
    };
    this.parsedGit(data);
    return event.preventDefault();
  };

  MarketView.prototype.parsedGit = function(app) {
    var application, data, icon, parsed;
    parsed = this.parseGitUrl(app.git);
    if (parsed.error) {
      return this.displayError(parsed.msg);
    } else {
      this.hideError();
      application = new Application(parsed);
      if (this.marketApps._byId[application.id]) {
        icon = this.marketApps._byId[application.id].get('icon');
        application.set('icon', icon);
      }
      data = {
        app: application
      };
      return this.showDescription(data);
    }
  };

  MarketView.prototype.showDescription = function(appWidget) {
    var _this = this;
    this.popover = new PopoverDescriptionView({
      model: appWidget.app,
      confirm: function(application) {
        $('#no-app-message').hide();
        _this.popover.hide();
        _this.appList.show();
        if (appWidget.$el) {
          appWidget.installing();
          return _this.runInstallation(appWidget.app, false);
        } else {
          return _this.runInstallation(appWidget.app, true);
        }
      },
      cancel: function(application) {
        _this.popover.hide();
        return _this.appList.show();
      }
    });
    this.$el.append(this.popover.$el);
    this.popover.show();
    if ($(window).width() <= 640) {
      return this.appList.hide();
    }
  };

  MarketView.prototype.runInstallation = function(application, shouldRedirect) {
    var _this = this;
    this.hideError();
    return application.install({
      ignoreMySocketNotification: true,
      success: function(data) {
        if (((data != null ? data.state : void 0) === "broken") || !data.success) {
          alert(data.message);
        } else {
          _this.resetForm();
        }
        if (shouldRedirect) {
          return typeof app !== "undefined" && app !== null ? app.routers.main.navigate('home', true) : void 0;
        }
      },
      error: function(jqXHR) {
        return _this.displayError(t(JSON.parse(jqXHR.responseText).message));
      }
    });
  };

  MarketView.prototype.parseGitUrl = function(url) {
    var branch, domain, error, git, name, out, parsed, parts, path, port, proto, slug;
    url = url.trim();
    url = url.replace('git@github.com:', 'https://github.com/');
    url = url.replace('git://', 'https://');
    parsed = REPOREGEX.exec(url);
    if (parsed == null) {
      error = {
        error: true,
        msg: t("Git url should be of form https://.../my-repo.git")
      };
      return error;
    }
    git = parsed[0], proto = parsed[1], domain = parsed[2], port = parsed[3], path = parsed[4], branch = parsed[5];
    if (!((proto != null) && (domain != null) && (path != null))) {
      error = {
        error: true,
        msg: t("Git url should be of form https://.../my-repo.git")
      };
      return error;
    }
    path = path.replace(/\.git$/, '');
    parts = path.split("/");
    name = parts[parts.length - 1];
    name = name.replace(/-|_/g, " ");
    name = name.replace('cozy ', '');
    slug = slugify(name);
    if (port == null) {
      port = "";
    }
    git = proto + domain + port + path + '.git';
    if (branch != null) {
      branch = branch.substring(1);
    }
    out = {
      git: git,
      name: name,
      slug: slug
    };
    if (branch != null) {
      out.branch = branch;
    }
    return out;
  };

  MarketView.prototype.displayInfo = function(msg) {
    this.errorAlert.hide();
    this.infoAlert.html(msg);
    return this.infoAlert.show();
  };

  MarketView.prototype.displayError = function(msg) {
    this.infoAlert.hide();
    this.errorAlert.html(msg);
    return this.errorAlert.show();
  };

  MarketView.prototype.hideError = function() {
    return this.errorAlert.hide();
  };

  MarketView.prototype.resetForm = function() {
    return this.appGitField.val('');
  };

  return MarketView;

})(BaseView);
});

;require.register("views/market_application", function(exports, require, module) {
var ApplicationRow, BaseView, ColorButton, REGEXP_SPRITED_SVG,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

ColorButton = require('widgets/install_button');

REGEXP_SPRITED_SVG = /img\/apps\/(.*)\.svg/;

module.exports = ApplicationRow = (function(_super) {
  __extends(ApplicationRow, _super);

  ApplicationRow.prototype.tagName = "div";

  ApplicationRow.prototype.className = "cozy-app";

  ApplicationRow.prototype.template = require('templates/market_application');

  ApplicationRow.prototype.events = {
    "click .website": "onWebsiteClicked",
    "click .btn": "onInstallClicked",
    "click": "onInstallClicked"
  };

  ApplicationRow.prototype.getRenderData = function() {
    var all, app, match, slug;
    app = this.app.toJSON();
    if (match = app.icon.match(REGEXP_SPRITED_SVG)) {
      all = match[0], slug = match[1];
      app = _.extend({}, app, {
        svgSpriteSlug: 'svg-' + slug
      });
    }
    return {
      app: app
    };
  };

  function ApplicationRow(app, marketView) {
    this.app = app;
    this.marketView = marketView;
    this.onInstallClicked = __bind(this.onInstallClicked, this);
    this.afterRender = __bind(this.afterRender, this);
    ApplicationRow.__super__.constructor.call(this);
    this.mouseOut = true;
  }

  ApplicationRow.prototype.afterRender = function() {
    var color, iconNode, slug;
    this.$el.attr('id', "market-app-" + (this.app.get('slug')));
    this.installButton = new ColorButton(this.$("#add-" + this.app.id + "-install"));
    if (this.app.get('comment') === 'official application') {
      this.$el.addClass('official');
    }
    slug = this.app.get('slug');
    color = this.app.get('color');
    if (this.app.get('icon').indexOf('.svg') !== -1) {
      if (color == null) {
        color = ColorHash.getColor(slug, 'cozy');
      }
      iconNode = this.$('.app-img img');
      iconNode.addClass('svg');
      iconNode.css('background-color', color);
    }
    if (this.app.isInstalling()) {
      return this.installing();
    }
  };

  ApplicationRow.prototype.installing = function() {
    this.$el.addClass('install');
    return this.$('.app-img img').attr('src', '/img/spinner-white-thin.svg');
  };

  ApplicationRow.prototype.onInstallClicked = function() {
    if (this.app.isInstalling()) {
      return;
    }
    return this.marketView.showDescription(this, this.installButton);
  };

  ApplicationRow.prototype.onWebsiteClicked = function(e) {
    return e.stopPropagation();
  };

  return ApplicationRow;

})(BaseView);
});

;require.register("views/menu_application", function(exports, require, module) {
var ApplicationView, BaseView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

module.exports = ApplicationView = (function(_super) {
  __extends(ApplicationView, _super);

  function ApplicationView() {
    _ref = ApplicationView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ApplicationView.prototype.tagName = 'div';

  ApplicationView.prototype.className = 'menu-application clearfix';

  ApplicationView.prototype.template = require('templates/menu_application');

  return ApplicationView;

})(BaseView);
});

;require.register("views/menu_applications", function(exports, require, module) {
var AppsMenu, ViewCollection,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ViewCollection = require('lib/view_collection');

module.exports = AppsMenu = (function(_super) {
  __extends(AppsMenu, _super);

  AppsMenu.prototype.el = '#menu-applications-container';

  AppsMenu.prototype.itemView = require('views/menu_application');

  AppsMenu.prototype.template = require('templates/menu_applications');

  function AppsMenu(collection) {
    this.collection = collection;
    AppsMenu.__super__.constructor.apply(this, arguments);
  }

  AppsMenu.prototype.appendView = function(view) {};

  return AppsMenu;

})(ViewCollection);
});

;require.register("views/modal", function(exports, require, module) {
var Modal, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Modal = (function(_super) {
  __extends(Modal, _super);

  function Modal() {
    this.onKeyStroke = __bind(this.onKeyStroke, this);
    _ref = Modal.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Modal.prototype.id = 'modal-dialog';

  Modal.prototype.className = 'modalCY fade';

  Modal.prototype.attributes = {
    'data-backdrop': "static",
    'data-keyboard': "false"
  };

  Modal.prototype.initialize = function(options) {
    var _this = this;
    if (this.title == null) {
      this.title = options.title;
    }
    if (this.content == null) {
      this.content = options.content;
    }
    if (this.yes == null) {
      this.yes = options.yes || t('ok');
    }
    if (this.no == null) {
      this.no = options.no || t('cancel');
    }
    this.back = options.back || t('chooseAgain');
    if (this.cb == null) {
      this.cb = options.cb || function() {};
    }
    this.render();
    if (options.cssSpaceName != null) {
      this.el.classList.add(options.cssSpaceName);
    }
    this.saving = false;
    this.el.tabIndex = 0;
    this.el.focus();
    this.$('button.close').click(function(event) {
      event.stopPropagation();
      return _this.onNo();
    });
    return this.$el.on('keyup', this.onKeyStroke);
  };

  Modal.prototype.events = function() {
    return {
      "click #modal-dialog-no": 'onNo',
      "click #modal-dialog-yes": 'onYes',
      'click': 'onClickAnywhere'
    };
  };

  Modal.prototype.onNo = function() {
    this.close();
    return this.cb(false);
  };

  Modal.prototype.onYes = function() {
    this.close();
    return this.cb(true);
  };

  Modal.prototype.close = function() {
    var _this = this;
    if (this.closing) {
      return;
    }
    this.closing = true;
    this.backdrop.parentElement.removeChild(this.backdrop);
    this.el.classList.remove('in');
    this.el.classList.add('out');
    return setTimeout((function() {
      return _this.remove();
    }), 500);
  };

  Modal.prototype.onKeyStroke = function(e) {
    e.stopPropagation();
    if (e.which === 27) {
      this.onNo();
      return false;
    }
  };

  Modal.prototype.remove = function() {
    this.$el.off('keyup', this.onKeyStroke);
    return Modal.__super__.remove.apply(this, arguments);
  };

  Modal.prototype.render = function() {
    var backBtn, body, close, foot, head, noBtn, title, yesBtn;
    close = $('<button class="close" data-dismiss="modal">×</button>');
    title = $('<p>').text(this.title);
    head = $('<div class="modalCY-header">').append(close, title);
    body = $('<div class="modalCY-body"></div>').append(this.renderContent());
    foot = $('<div class="modalCY-footer">');
    backBtn = $("<button id=\"modal-dialog-back\" class=\"btn transparent-grey left back\">\n    <i class=\"fa fa-chevron-left\"/> " + this.back + "\n</button>").appendTo(foot);
    yesBtn = $('<button id="modal-dialog-yes" class="btn right"/>').text(this.yes).appendTo(foot);
    noBtn = this.no ? $('<button id="modal-dialog-no" class="btn transparent-grey right"/>').text(this.no).appendTo(foot) : void 0;
    this.backdrop = document.createElement('div');
    this.backdrop.classList.add('modalCY-backdrop');
    $("body").append(this.backdrop);
    $("body").append(this.$el.append(head, body, foot));
    window.getComputedStyle(this.el).opacity;
    window.getComputedStyle(this.el).top;
    return this.$el.addClass('in');
  };

  Modal.prototype.renderContent = function() {
    return this.content;
  };

  Modal.prototype.onClickAnywhere = function(event) {
    if (event.target.id === this.id) {
      return this.onNo();
    }
  };

  return Modal;

})(Backbone.View);

Modal.alert = function(title, content, cb) {
  return new Modal({
    title: title,
    content: content,
    yes: 'ok',
    no: null,
    cb: cb
  });
};

Modal.confirm = function(title, content, yesMsg, noMsg, cb) {
  return new Modal({
    title: title,
    content: content,
    yes: yesMsg,
    no: noMsg,
    cb: cb
  });
};

Modal.error = function(text, cb) {
  return new Modal({
    title: t('modal error'),
    content: text,
    yes: t('modal ok'),
    no: false,
    cb: cb
  });
};

module.exports = Modal;
});

;require.register("views/navbar", function(exports, require, module) {
var AppsMenu, BaseView, HelpView, NavbarView, NotificationsView, appButtonTemplate,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

appButtonTemplate = require("templates/navbar_app_btn");

NotificationsView = require('./notifications_view');

HelpView = require('./help');

AppsMenu = require('./menu_applications');

module.exports = NavbarView = (function(_super) {
  __extends(NavbarView, _super);

  NavbarView.prototype.el = '.navbar';

  NavbarView.prototype.template = require('templates/navbar');

  NavbarView.prototype.events = {
    'click #help-toggle': 'toggleHelp'
  };

  function NavbarView(apps, notifications) {
    this.afterRender = __bind(this.afterRender, this);
    this.apps = apps;
    this.notifications = notifications;
    NavbarView.__super__.constructor.call(this);
  }

  NavbarView.prototype.afterRender = function() {
    this.notifications = new NotificationsView({
      collection: this.notifications
    });
    this.helpView = new HelpView();
    return this.appMenu = new AppsMenu(this.apps);
  };

  NavbarView.prototype.toggleHelp = function(event) {
    event.preventDefault();
    return this.helpView.toggle();
  };

  return NavbarView;

})(BaseView);
});

;require.register("views/notification_view", function(exports, require, module) {
var BaseView, NotificationView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

module.exports = NotificationView = (function(_super) {
  __extends(NotificationView, _super);

  function NotificationView() {
    _ref = NotificationView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  NotificationView.prototype.tagName = 'li';

  NotificationView.prototype.className = 'notification clearfix';

  NotificationView.prototype.template = require('templates/notification');

  NotificationView.prototype.events = {
    "click .doaction": "onActionClicked",
    "click .dismiss": "onDismissClicked"
  };

  NotificationView.prototype.getRenderData = function() {
    return {
      model: _.extend(this.model.attributes, {
        actionText: this.actionText || null,
        update: this.update,
        date: moment(parseInt(this.model.get('publishDate'))).fromNow()
      })
    };
  };

  NotificationView.prototype.initialize = function() {
    var action;
    this.listenTo(this.model, 'change', this.render);
    this.update = false;
    action = this.model.get('resource');
    if (action != null) {
      if ((action.app != null) && action.app !== 'home') {
        return this.actionText = 'notification open application';
      } else if (action.url != null) {
        if (action.url.indexOf('update-stack') >= 0) {
          this.actionText = 'notification update stack';
          return this.update = true;
        } else if (action.url.indexOf('update') >= 0) {
          this.actionText = 'notification update application';
          return this.update = true;
        }
      }
    }
  };

  NotificationView.prototype.onActionClicked = function() {
    var action, url;
    action = this.model.get('resource');
    if (action == null) {
      action = {
        app: home
      };
    }
    if (typeof action === 'string') {
      url = action;
    } else if (action.app != null) {
      url = action.app === 'home' ? "/" : "/apps/" + action.app + "/";
      url += action.url || '';
      url = url.replace('//', '/');
      $('.right-menu').hide();
      this.model.destroy();
    } else {
      url = null;
    }
    if (url) {
      return window.app.routers.main.navigate(url, true);
    }
  };

  NotificationView.prototype.onDismissClicked = function(event) {
    if (event != null) {
      event.preventDefault();
    }
    if (event != null) {
      event.stopPropagation();
    }
    return this.model.destroy();
  };

  return NotificationView;

})(BaseView);
});

;require.register("views/notifications_view", function(exports, require, module) {
var Notification, NotificationsView, SocketListener, ViewCollection, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ViewCollection = require('lib/view_collection');

SocketListener = require('lib/socket_listener');

Notification = require('models/notification');

SocketListener = require('../lib/socket_listener');

module.exports = NotificationsView = (function(_super) {
  __extends(NotificationsView, _super);

  function NotificationsView() {
    this.dismissAll = __bind(this.dismissAll, this);
    this.hideNotifList = __bind(this.hideNotifList, this);
    this.showNotifList = __bind(this.showNotifList, this);
    this.windowClicked = __bind(this.windowClicked, this);
    this.checkIfEmpty = __bind(this.checkIfEmpty, this);
    this.remove = __bind(this.remove, this);
    this.afterRender = __bind(this.afterRender, this);
    _ref = NotificationsView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  NotificationsView.prototype.el = '#notifications-container';

  NotificationsView.prototype.itemView = require('views/notification_view');

  NotificationsView.prototype.template = require('templates/notifications');

  NotificationsView.prototype.events = {
    "click #notifications-toggle": "showNotifList",
    "click #clickcatcher": "hideNotifList"
  };

  NotificationsView.prototype.initialize = function() {
    NotificationsView.__super__.initialize.apply(this, arguments);
    return this.initializing = true;
  };

  NotificationsView.prototype.appendView = function(view) {
    if (this.notifList == null) {
      this.notifList = $('#notifications-list');
    }
    this.notifList.prepend(view.el);
    if (!this.initializing) {
      return this.sound.play();
    }
  };

  NotificationsView.prototype.afterRender = function() {
    this.counter = this.$('#notifications-counter');
    this.counter.html('0');
    this.clickcatcher = this.$('#clickcatcher');
    this.clickcatcher.hide();
    this.noNotifMsg = $('#no-notif-msg');
    this.notifList = $('#notifications-list');
    this.hideNotifList();
    this.sound = $('#notification-sound')[0];
    this.dismissButton = $("#dismiss-all");
    this.dismissButton.click(this.dismissAll);
    NotificationsView.__super__.afterRender.apply(this, arguments);
    this.initializing = false;
    this.collection.fetch();
    if (window.cozy_user != null) {
      return this.noNotifMsg.html(t('you have no notifications', {
        name: window.cozy_user.public_name || ''
      }));
    }
  };

  NotificationsView.prototype.remove = function() {
    return NotificationsView.__super__.remove.apply(this, arguments);
  };

  NotificationsView.prototype.checkIfEmpty = function() {
    var newCount;
    newCount = this.collection.length;
    this.noNotifMsg.toggle(newCount === 0);
    if (newCount === 0) {
      this.counter.html("");
      return this.counter.hide();
    } else {
      this.counter.html(newCount);
      return this.counter.show();
    }
  };

  NotificationsView.prototype.windowClicked = function() {
    if ((typeof event !== "undefined" && event !== null) && this.$el.has($(event.target)).length === 0) {
      return this.hideNotifList();
    }
  };

  NotificationsView.prototype.showNotifList = function() {
    if ($('#notifications-menu').is(':visible')) {
      return this.hideNotifList();
    } else {
      $('.right-menu').hide();
      $('#notifications-menu').show();
      return this.clickcatcher.show();
    }
  };

  NotificationsView.prototype.hideNotifList = function(event) {
    $('#notifications-menu').hide();
    return this.clickcatcher.hide();
  };

  NotificationsView.prototype.dismissAll = function() {
    var _this = this;
    this.dismissButton.spin(true);
    return this.collection.removeAll({
      success: function() {
        return _this.dismissButton.spin(false);
      },
      error: function() {
        return _this.dismissButton.spin(false);
      }
    });
  };

  return NotificationsView;

})(ViewCollection);
});

;require.register("views/object_picker", function(exports, require, module) {
var MARGIN_BETWEEN_IMG_AND_CROPED, Modal, ObjectPickerAlbum, ObjectPickerImage, ObjectPickerPhotoURL, ObjectPickerUpload, PhotoPickerCroper, THUMB_HEIGHT, THUMB_WIDTH, tabControler, template, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Modal = require('../views/modal');

template = require('../templates/object_picker');

ObjectPickerPhotoURL = require('./object_picker_photourl');

ObjectPickerUpload = require('./object_picker_upload');

ObjectPickerImage = require('./object_picker_image');

ObjectPickerAlbum = require('./object_picker_album');

tabControler = require('views/tab_controller');

MARGIN_BETWEEN_IMG_AND_CROPED = 30;

THUMB_WIDTH = 100;

THUMB_HEIGHT = 100;

module.exports = PhotoPickerCroper = (function(_super) {
  __extends(PhotoPickerCroper, _super);

  function PhotoPickerCroper() {
    this._updateCropedPreview = __bind(this._updateCropedPreview, this);
    this._onImgToCropLoaded = __bind(this._onImgToCropLoaded, this);
    this._showCropingTool = __bind(this._showCropingTool, this);
    this._onImgResultLoaded = __bind(this._onImgResultLoaded, this);
    this.resizeHandler = __bind(this.resizeHandler, this);
    _ref = PhotoPickerCroper.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  PhotoPickerCroper.prototype.events = function() {
    return _.extend(PhotoPickerCroper.__super__.events.apply(this, arguments), {
      'click a.next': 'displayMore',
      'click a.prev': 'displayPrevPage',
      'click .back': '_chooseAgain'
    });
  };

  PhotoPickerCroper.prototype.initialize = function(params, cb) {
    var body, previewTops, tab;
    this.id = 'object-picker';
    this.title = t('pick from files');
    this.config = {
      cssSpaceName: "object-picker",
      singleSelection: true,
      numPerPage: 50,
      yes: t('modal ok'),
      no: t('modal cancel'),
      cb: cb,
      target_h: 100,
      target_w: 100
    };
    this.params = params;
    this.state = {
      currentStep: 'objectPicker',
      img_naturalW: 0,
      img_naturalH: 0
    };
    this.el.dataset.step = this.state.currentStep;
    PhotoPickerCroper.__super__.initialize.call(this, this.config);
    body = this.el.querySelector('.modalCY-body');
    body.innerHTML = template();
    this.body = body;
    this.objectPickerCont = body.querySelector('.objectPickerCont');
    this.tablist = body.querySelector('[role=tablist]');
    this.imgResult = body.querySelector('#img-result');
    this.cropper$ = this.el.querySelector('.croperCont');
    this.framePreview = this.cropper$.querySelector('#frame-preview');
    this.frameToCrop = this.cropper$.querySelector('.frame-to-crop');
    this.imgToCrop = this.cropper$.querySelector('#img-to-crop');
    this.imgPreview = this.cropper$.querySelector('#img-preview');
    this.chooseAgain = this.el.querySelector('.back');
    this.panelsControlers = {};
    this.uploadPanel = new ObjectPickerUpload(this);
    tabControler.addTab(this.objectPickerCont, this.tablist, this.uploadPanel);
    this.panelsControlers[this.uploadPanel.name] = this.uploadPanel;
    this.photoURLpanel = new ObjectPickerPhotoURL();
    tabControler.addTab(this.objectPickerCont, this.tablist, this.photoURLpanel);
    this.panelsControlers[this.photoURLpanel.name] = this.photoURLpanel;
    tabControler.initializeTabs(body);
    this._listenTabsSelection();
    tab = this.params.defaultTab;
    if ((tab == null) && (this.imagePanel != null)) {
      tab = this.imagePanel.name;
    }
    if (tab == null) {
      tab = this.uploadPanel.name;
    }
    this._selectDefaultTab(tab);
    this.imgToCrop.addEventListener('load', this._onImgToCropLoaded, false);
    this.cropper$.setAttribute('aria-hidden', true);
    this.framePreview.style.width = THUMB_WIDTH + 'px';
    this.framePreview.style.height = THUMB_HEIGHT + 'px';
    previewTops = this.cropper$.clientHeight - THUMB_HEIGHT;
    this.imgResult.addEventListener('load', this._onImgResultLoaded, false);
    window.addEventListener('resize', this.resizeHandler);
    return true;
  };

  PhotoPickerCroper.prototype.onYes = function() {
    var dimension, obj, url;
    obj = this.state.activePanel.getObject();
    if (!this.params.isCropped) {
      this._sendResult(obj);
      return;
    }
    if (this.state.currentStep === 'objectPicker') {
      url = this._getUrlForCropping(obj);
      if (url) {
        return this._showCropingTool(url);
      }
    } else {
      dimension = this._getCroppedDimensions();
      this.cb(true, this._getResultDataURL(this.imgPreview, dimension));
      return this.close();
    }
  };

  PhotoPickerCroper.prototype.resizeHandler = function(event) {
    if (this.state.activePanel.resizeHandler) {
      return this.state.activePanel.resizeHandler();
    }
  };

  PhotoPickerCroper.prototype._sendResult = function(obj) {
    if (obj.dataUrl) {
      this.cb(true, obj.dataUrl);
      this.close();
      return;
    }
    if (obj.urlToFetch) {
      this.imgResult.src = obj.urlToFetch;
      return;
    }
    if ((obj.docType != null) && obj.docType === 'file' && (obj.id != null)) {
      if (obj.id) {
        this.imgResult.src = "files/photo/" + obj.id + ".jpg";
      }
    }
  };

  PhotoPickerCroper.prototype._getUrlForCropping = function(obj) {
    if (obj.urlToFetch) {
      return obj.urlToFetch;
    }
    if (obj.dataUrl) {
      return obj.dataUrl;
    }
    if ((obj.docType != null) && obj.docType === 'file' && (obj.id != null)) {
      return "files/photo/screens/" + obj.id + ".jpg";
    }
  };

  PhotoPickerCroper.prototype._onImgResultLoaded = function(e) {
    this.cb(true, this._getResultDataURL(this.imgResult, null));
    return this.close();
  };

  /**
   * returns the coordonates of the region to cropp into the original image
   * (imgPreview)
   * @return {Object} #
   *   # sx      : x of the top left corner
   *   # sy      : y of the top left corner
   *   # sWidth  : widht of the region to crop
   *   # sHeight : height of the region to crop
  */


  PhotoPickerCroper.prototype._getCroppedDimensions = function() {
    var d, r, s;
    s = this.imgPreview.style;
    r = this.state.img_naturalW / this.imgPreview.width;
    d = {
      sx: Math.round(-parseInt(s.marginLeft) * r),
      sy: Math.round(-parseInt(s.marginTop) * r),
      sWidth: Math.round(this.config.target_h * r),
      sHeight: Math.round(this.config.target_w * r)
    };
    if (d.sx < 0) {
      d.sx = 0;
    }
    if (d.sy < 0) {
      d.sy = 0;
    }
    if (d.sx + d.sWidth > this.imgPreview.naturalWidth) {
      d.sWidth = this.imgPreview.naturalWidth - d.sx;
    }
    if (d.sy + d.sHeight > this.imgPreview.naturalHeight) {
      d.sHeight = this.imgPreview.naturalHeight - d.sy;
    }
    return d;
  };

  PhotoPickerCroper.prototype._getResultDataURL = function(img, dimensions) {
    var IMAGE_DIMENSION, canvas, ctx, d, dataUrl;
    IMAGE_DIMENSION = 600;
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    if (dimensions) {
      canvas.height = canvas.width = IMAGE_DIMENSION;
      d = dimensions;
      ctx.drawImage(img, d.sx, d.sy, d.sWidth, d.sHeight, 0, 0, IMAGE_DIMENSION, IMAGE_DIMENSION);
    } else {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
    }
    return dataUrl = canvas.toDataURL('image/jpeg');
  };

  PhotoPickerCroper.prototype.onKeyStroke = function(e) {
    var _ref1;
    if (e.which === 13) {
      e.stopPropagation();
      this.onYes();
      return;
    }
    if (e.which === 27) {
      e.stopPropagation();
      if (this.state.currentStep === 'croper') {
        this._chooseAgain();
      } else {
        this.onNo();
      }
      return;
    }
    return (_ref1 = this.state.activePanel) != null ? _ref1.keyHandler(e) : void 0;
  };

  PhotoPickerCroper.prototype._showCropingTool = function(url) {
    this.state.currentStep = 'croper';
    this.currentPhotoScroll = this.body.scrollTop;
    this.el.dataset.step = this.state.currentStep;
    this.objectPickerCont.setAttribute('aria-hidden', true);
    this.cropper$.setAttribute('aria-hidden', false);
    this._imgToCropTemp = new Image();
    this._imgToCropTemp.id = 'img-to-crop';
    this._imgToCropTemp.addEventListener('load', this._onImgToCropLoaded, false);
    this._imgToCropTemp.src = url;
    return this.imgPreview.src = url;
  };

  /**
   * triggered when the image to crop is loaded, will compute the geometry
   * and initialize jCrop
  */


  PhotoPickerCroper.prototype._onImgToCropLoaded = function() {
    var cropTop, frame_H, frame_W, img_h, img_w, margin, natural_h, natural_w, options, selection_w, t, x, y;
    console.debug(this._imgToCropTemp);
    natural_h = this._imgToCropTemp.naturalHeight;
    natural_w = this._imgToCropTemp.naturalWidth;
    frame_H = this.cropper$.clientHeight;
    frame_W = this.cropper$.clientWidth - MARGIN_BETWEEN_IMG_AND_CROPED - THUMB_WIDTH;
    if (frame_H < natural_h || frame_W < natural_w) {
      if (frame_H / frame_W > natural_h / natural_w) {
        img_w = Math.round(frame_W);
        img_h = Math.round(frame_W * natural_h / natural_w);
      } else {
        img_h = Math.round(frame_H);
        img_w = Math.round(frame_H * natural_w / natural_h);
      }
      this._imgToCropTemp.style.width = img_w + 'px';
      this._imgToCropTemp.style.height = img_h + 'px';
    } else {
      img_w = natural_w;
      img_h = natural_h;
    }
    this.frameToCrop.style.width = img_w + 'px';
    this.frameToCrop.style.height = img_h + 'px';
    this.img_w = img_w;
    this.img_h = img_h;
    this.state.img_naturalW = natural_w;
    this.state.img_naturalH = natural_h;
    this.imgToCrop.parentElement.appendChild(this._imgToCropTemp);
    this.imgToCrop.parentElement.removeChild(this.imgToCrop);
    this.imgToCrop = this._imgToCropTemp;
    margin = Math.round((frame_W - img_w) / 2);
    this.frameToCrop.style.left = margin + 'px';
    cropTop = Math.round((frame_H - img_h) / 2);
    this.frameToCrop.style.top = cropTop + 'px';
    this.framePreview.style.top = cropTop + 'px';
    this.framePreview.style.right = margin + 'px';
    selection_w = Math.round(Math.min(this.img_h, this.img_w) * 1);
    x = Math.round((this.img_w - selection_w) / 2);
    y = Math.round((this.img_h - selection_w) / 2);
    options = {
      onChange: this._updateCropedPreview,
      onSelect: this._updateCropedPreview,
      aspectRatio: 1,
      setSelect: [x, y, x + selection_w, y + selection_w]
    };
    t = this;
    this.imgToCrop.offsetHeight;
    $(this.imgToCrop).Jcrop(options, function() {
      return t.jcrop_api = this;
    });
    return t.jcrop_api.focus();
  };

  PhotoPickerCroper.prototype._updateCropedPreview = function(coords) {
    var prev_h, prev_w, prev_x, prev_y, s;
    prev_w = this.img_w / coords.w * this.config.target_w;
    prev_h = this.img_h / coords.h * this.config.target_h;
    prev_x = this.config.target_w / coords.w * coords.x;
    prev_y = this.config.target_h / coords.h * coords.y;
    s = this.imgPreview.style;
    s.width = Math.round(prev_w) + 'px';
    s.height = Math.round(prev_h) + 'px';
    s.marginLeft = '-' + Math.round(prev_x) + 'px';
    s.marginTop = '-' + Math.round(prev_y) + 'px';
    return true;
  };

  PhotoPickerCroper.prototype._chooseAgain = function() {
    this.state.currentStep = 'objectPicker';
    this.jcrop_api.destroy();
    this.imgToCrop.removeAttribute('style');
    this.imgToCrop.src = '';
    this.objectPickerCont.setAttribute('aria-hidden', false);
    this.cropper$.setAttribute('aria-hidden', true);
    this.body.scrollTop = this.currentPhotoScroll;
    this.el.dataset.step = this.state.currentStep;
    return this._setFocus();
  };

  PhotoPickerCroper.prototype._setFocus = function() {
    if (!this.state.activePanel.setFocusIfExpected) {
      return;
    }
    if (!this.state.activePanel.setFocusIfExpected()) {
      return this.el.focus();
    }
  };

  PhotoPickerCroper.prototype._listenTabsSelection = function() {
    var _this = this;
    return this.objectPickerCont.addEventListener('panelSelect', function(event) {
      return _this._activatePanel(event.target.classList[0]);
    });
  };

  PhotoPickerCroper.prototype._selectDefaultTab = function(panelClassName) {
    var _ref1;
    return (_ref1 = this.tablist.querySelector("[aria-controls=" + panelClassName + "]")) != null ? _ref1.click() : void 0;
  };

  PhotoPickerCroper.prototype._activatePanel = function(panelClassName) {
    this.state.activePanel = this.panelsControlers[panelClassName];
    if (this.state.activePanel.resizeHandler) {
      this.state.activePanel.resizeHandler();
    }
    return this._setFocus();
  };

  return PhotoPickerCroper;

})(Modal);
});

;require.register("views/object_picker_album", function(exports, require, module) {
var BaseView, ObjectPickerAlbum, Photo, client,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Photo = require('../models/photo');

BaseView = require('lib/base_view');

client = require('../lib/request');

module.exports = ObjectPickerAlbum = (function(_super) {
  __extends(ObjectPickerAlbum, _super);

  ObjectPickerAlbum.prototype.tagName = "section";

  function ObjectPickerAlbum(modal) {
    this._updateThumbs = __bind(this._updateThumbs, this);
    this._getAlbumPhotos = __bind(this._getAlbumPhotos, this);
    this._initAlbum = __bind(this._initAlbum, this);
    this._unselectAll = __bind(this._unselectAll, this);
    this._toggleOnThumb$ = __bind(this._toggleOnThumb$, this);
    this._clickHandler = __bind(this._clickHandler, this);
    this._dblclickHandler = __bind(this._dblclickHandler, this);
    this.modal = modal;
    ObjectPickerAlbum.__super__.constructor.call(this);
  }

  ObjectPickerAlbum.prototype.initialize = function() {
    this.name = 'albumPicker';
    this.tabLabel = 'album';
    this.tab = $("<div class='fa fa-book'>" + this.tabLabel + "</div>")[0];
    this.panel = this.el;
    this.albums$ = $('<div class="albums"></div>')[0];
    this.thumbs$ = $("<div class=\"thumbs\">\n    <div class=\"thumb\"><img/></div>\n</div>")[0];
    this.panel.appendChild(this.albums$);
    this.panel.appendChild(this.thumbs$);
    this._getAlbums();
    this.selectedThumbs = {};
    this.thumbs$.addEventListener('click', this._clickHandler);
    return this.thumbs$.addEventListener('dblclick', this._dblclickHandler);
  };

  ObjectPickerAlbum.prototype.getObject = function() {
    var id, photo, res, thumb$, _ref;
    _ref = this.selectedThumbs;
    for (id in _ref) {
      thumb$ = _ref[id];
      if (thumb$) {
        break;
      }
    }
    photo = thumb$.photo;
    res = {
      id: photo.id,
      docType: 'photo',
      name: photo.title,
      urlToFetch: "photos/raws/" + photo.id + ".jpg"
    };
    return res;
  };

  ObjectPickerAlbum.prototype.setFocusIfExpected = function() {
    return false;
  };

  ObjectPickerAlbum.prototype.keyHandler = function(e) {};

  ObjectPickerAlbum.prototype.resizeHandler = function() {
    var colWidth, margin, thumbStyle, width;
    thumbStyle = window.getComputedStyle(this.thumbs$.children[0]);
    colWidth = parseInt(thumbStyle.width) + parseInt(thumbStyle.marginLeft) + parseInt(thumbStyle.marginRight) + 2;
    width = this.thumbs$.clientWidth;
    return margin = Math.floor((width % colWidth) / 2);
  };

  ObjectPickerAlbum.prototype._dblclickHandler = function(e) {
    var thumb$;
    thumb$ = e.target;
    if (!this._toggleOnThumb$(thumb$)) {
      return;
    }
    return this.modal.onYes();
  };

  ObjectPickerAlbum.prototype._clickHandler = function(e) {
    var th;
    th = e.target;
    while (!th.classList.contains('thumb')) {
      th = th.parentElement;
      if (th.classList.contains('thumbs')) {
        return;
      }
    }
    if (!this._toggleOnThumb$(th)) {
      return null;
    }
    return th.setAttribute('aria-selected', true);
  };

  ObjectPickerAlbum.prototype._toggleOnThumb$ = function(thumb$) {
    if (thumb$.getAttribute('aria-selected') === 'true') {
      return true;
    }
    this._unselectAll();
    thumb$.setAttribute('aria-selected', true);
    this.selectedThumbs[thumb$.dataset.id] = thumb$;
    return true;
  };

  ObjectPickerAlbum.prototype._unselectAll = function() {
    var id, thumb$, _ref, _results;
    _ref = this.selectedThumbs;
    _results = [];
    for (id in _ref) {
      thumb$ = _ref[id];
      if (typeof thumb$ === 'object') {
        thumb$.setAttribute('aria-selected', false);
        _results.push(this.selectedThumbs[id] = false);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  ObjectPickerAlbum.prototype._getAlbums = function() {
    var _this = this;
    return client.get("albums/?", function(err, res) {
      var album, albumLabel$, n, _i, _len;
      if (err) {
        console.error(err);
        return;
      }
      if (res.length === 0) {
        _this.panel.removeChild(_this.albums$);
        _this.panel.removeChild(_this.thumbs$);
        _this.panel.classList.add('noAlbum');
        $(_this.panel).append("<div></div>\n<div class='noAlbumDisclaimer'>\n    " + (t('you have no album')) + "\n</div>\n<div></div>");
        return;
      }
      n = 0;
      for (_i = 0, _len = res.length; _i < _len; _i++) {
        album = res[_i];
        albumLabel$ = _this._initAlbum(album);
        if (n === 0) {
          _this.previousSelectedAlbum$ = albumLabel$;
          albumLabel$.setAttribute('aria-selected', true);
          _this._getAlbumPhotos(album.id);
        }
        n += 1;
      }
      return _this.resizeHandler();
    });
  };

  ObjectPickerAlbum.prototype._initAlbum = function(album) {
    var cover, el, label,
      _this = this;
    el = $(require('../templates/album_thumb')())[0];
    cover = el.querySelector('.cover');
    label = el.querySelector('.label');
    cover.src = "photos/thumbs/" + album.coverPicture + ".jpg";
    label.textContent = album.title;
    this.albums$.appendChild(el);
    el.addEventListener('click', function(event) {
      _this.previousSelectedAlbum$.setAttribute('aria-selected', false);
      el.setAttribute('aria-selected', true);
      _this.previousSelectedAlbum$ = el;
      return _this._getAlbumPhotos(album.id);
    });
    return el;
  };

  ObjectPickerAlbum.prototype._getAlbumPhotos = function(albumId) {
    var _this = this;
    return client.get("albums/" + albumId, function(err, res) {
      if (err) {
        return;
      }
      _this._updateThumbs(res);
      return _this._toggleOnThumb$(_this.thumbs$.children[0]);
    });
  };

  ObjectPickerAlbum.prototype._updateThumbs = function(res) {
    var nPhoto, photoId, photoRank, photos, thumb, thumbImg, _i, _j, _len, _ref, _ref1, _results;
    photos = res.photos;
    nPhoto = photos.length;
    photoRank = 0;
    _ref = this.thumbs$.children;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      thumb = _ref[_i];
      if (photoRank >= nPhoto) {
        thumb.setAttribute('aria-hidden', true);
        thumb.firstElementChild.src = '';
        thumb.dataset.id = '';
        thumb.photo = null;
      } else {
        thumb.setAttribute('aria-hidden', false);
        thumb.dataset.id = photoId = photos[photoRank].id;
        thumb.firstElementChild.src = "photos/thumbs/" + photoId + ".jpg";
        thumb.photo = photos[photoRank];
      }
      photoRank += 1;
    }
    _results = [];
    for (photoRank = _j = photoRank, _ref1 = nPhoto - 1; _j <= _ref1; photoRank = _j += 1) {
      thumbImg = document.createElement('img');
      thumbImg.src = "photos/thumbs/" + photos[photoRank].id + ".jpg";
      thumb = document.createElement('div');
      thumb.appendChild(thumbImg);
      thumb.classList.add('thumb');
      thumb.photo = photos[photoRank];
      thumb.dataset.id = photos[photoRank].id;
      _results.push(this.thumbs$.appendChild(thumb));
    }
    return _results;
  };

  return ObjectPickerAlbum;

})(BaseView);
});

;require.register("views/object_picker_image", function(exports, require, module) {
var BaseView, LongList, ObjectPickerImage, Photo,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Photo = require('../models/photo');

LongList = require('views/image_list');

BaseView = require('lib/base_view');

module.exports = ObjectPickerImage = (function(_super) {
  __extends(ObjectPickerImage, _super);

  ObjectPickerImage.prototype.tagName = "section";

  function ObjectPickerImage(modal) {
    this.modal = modal;
    ObjectPickerImage.__super__.constructor.call(this);
  }

  ObjectPickerImage.prototype.initialize = function() {
    var _this = this;
    this.name = 'thumbPicker';
    this.tabLabel = 'image';
    this.tab = $("<div class='fa fa-photo'>" + this.tabLabel + "</div>")[0];
    this.panel = this.el;
    return this.el.addEventListener('panelSelect', function() {
      return _this.longList = new LongList(_this.panel, _this.modal);
    });
  };

  ObjectPickerImage.prototype.getObject = function() {
    var file;
    file = this.longList.getSelectedFile();
    if (file) {
      return {
        id: file.id,
        docType: 'file',
        name: file.name
      };
    }
    return false;
  };

  ObjectPickerImage.prototype.setFocusIfExpected = function() {
    return false;
  };

  ObjectPickerImage.prototype.setInitialDimensions = function(width, heigth) {
    return this.longList.setInitialDimensions(width, heigth);
  };

  ObjectPickerImage.prototype.keyHandler = function(e) {
    this.longList.keyHandler(e);
  };

  ObjectPickerImage.prototype.resizeHandler = function() {
    return this.longList.resizeHandler();
  };

  return ObjectPickerImage;

})(BaseView);
});

;require.register("views/object_picker_photourl", function(exports, require, module) {
var BaseView, ObjectPickerPhotoURL, proxyclient, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

proxyclient = require('lib/proxyclient');

BaseView = require('lib/base_view');

module.exports = ObjectPickerPhotoURL = (function(_super) {
  __extends(ObjectPickerPhotoURL, _super);

  function ObjectPickerPhotoURL() {
    _ref = ObjectPickerPhotoURL.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ObjectPickerPhotoURL.prototype.template = require('../templates/object_picker_photourl');

  ObjectPickerPhotoURL.prototype.tagName = 'section';

  ObjectPickerPhotoURL.prototype.initialize = function() {
    this.render();
    this.name = 'urlPhotoUpload';
    this.tabLabel = 'url';
    this.tab = $("<div class='fa fa-link'>" + this.tabLabel + "</div>")[0];
    this.panel = this.el;
    this.img = this.panel.querySelector('.url-preview');
    this.blocContainer = this.panel.querySelector('.bloc-container');
    this.url = void 0;
    this.input = this.panel.querySelector('.modal-url-input');
    return this._setupInput();
  };

  ObjectPickerPhotoURL.prototype.getObject = function() {
    if (this.url) {
      return {
        urlToFetch: this.url
      };
    } else {
      return false;
    }
  };

  ObjectPickerPhotoURL.prototype.setFocusIfExpected = function() {
    this.input.focus();
    this.input.select();
    return true;
  };

  ObjectPickerPhotoURL.prototype.keyHandler = function(e) {
    return false;
  };

  /**
   * manages the url typed in the input and update image
  */


  ObjectPickerPhotoURL.prototype._setupInput = function() {
    var img, imgTmp, preloadImage, urlRegexp,
      _this = this;
    img = this.img;
    urlRegexp = /\b(https?|ftp|file):\/\/[\-A-Z0-9+&@#\/%?=~_|$!:,.;]*[A-Z0-9+&@#\/%=~_|$]/i;
    imgTmp = new Image();
    imgTmp.onerror = function() {
      img.style.backgroundImage = "";
      return this.url = void 0;
    };
    imgTmp.onload = function() {
      img.style.height = imgTmp.naturalHeight + 'px';
      img.parentElement.style.display = 'flex';
      img.style.backgroundImage = 'url(' + imgTmp.src + ')';
      _this.url = imgTmp.src;
      return _this.blocContainer.style.height = (imgTmp.naturalHeight / 2) + 'px';
    };
    preloadImage = function(src) {
      return imgTmp.src = src;
    };
    return this.input.addEventListener('input', function(e) {
      var newurl, url;
      newurl = e.target.value;
      if (urlRegexp.test(newurl)) {
        url = 'api/proxy/?url=' + encodeURIComponent(newurl);
        return preloadImage(url);
      } else {
        img.style.backgroundImage = "";
        return this.url = void 0;
      }
    }, false);
  };

  return ObjectPickerPhotoURL;

})(BaseView);
});

;require.register("views/object_picker_upload", function(exports, require, module) {
var BaseView, ObjectPickerUpload,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

module.exports = ObjectPickerUpload = (function(_super) {
  __extends(ObjectPickerUpload, _super);

  ObjectPickerUpload.prototype.template = require('../templates/object_picker_upload');

  ObjectPickerUpload.prototype.tagName = "section";

  function ObjectPickerUpload(objectPicker) {
    this._handleFile = __bind(this._handleFile, this);
    this._handleUploaderChange = __bind(this._handleUploaderChange, this);
    this._changePhotoFromUpload = __bind(this._changePhotoFromUpload, this);
    ObjectPickerUpload.__super__.constructor.call(this);
    this.objectPicker = objectPicker;
  }

  ObjectPickerUpload.prototype.initialize = function() {
    var btn;
    this.render();
    this.name = 'photoUpload';
    this.tabLabel = 'upload';
    this.tab = this._createTab();
    this.panel = this.el;
    this._bindFileDropZone();
    btn = this.panel.querySelector('.photoUpload-btn');
    btn.addEventListener('click', this._changePhotoFromUpload);
    this.btn = btn;
    this.uploader = this.panel.querySelector('.uploader');
    return this.uploader.addEventListener('change', this._handleUploaderChange);
  };

  ObjectPickerUpload.prototype.getObject = function() {
    return {
      dataUrl: this.dataUrl
    };
  };

  ObjectPickerUpload.prototype.setFocusIfExpected = function() {
    this.btn.focus();
    return true;
  };

  ObjectPickerUpload.prototype.keyHandler = function(e) {
    return false;
  };

  ObjectPickerUpload.prototype._createTab = function() {
    return $("<div class='fa fa-upload'>" + this.tabLabel + "</div>")[0];
  };

  ObjectPickerUpload.prototype._bindFileDropZone = function() {
    var dragenter, dragover, drop, dropbox, hasEnteredText,
      _this = this;
    dropbox = this.panel.querySelector(".modal-file-drop-zone>div");
    hasEnteredText = false;
    dropbox.addEventListener("dragenter", function(e) {
      e.stopPropagation();
      e.preventDefault();
      return dropbox.classList.add('dragging');
    }, false);
    dropbox.addEventListener("dragleave", function(e) {
      e.stopPropagation();
      e.preventDefault();
      return dropbox.classList.remove('dragging');
    }, false);
    dragenter = function(e) {
      e.stopPropagation();
      return e.preventDefault();
    };
    drop = function(e) {
      var dt, files;
      e.stopPropagation();
      e.preventDefault();
      dt = e.dataTransfer;
      files = dt.files;
      return _this._handleFile(files[0]);
    };
    dragover = dragenter;
    dropbox.addEventListener("dragover", dragover, false);
    return dropbox.addEventListener("drop", drop, false);
  };

  ObjectPickerUpload.prototype._changePhotoFromUpload = function() {
    this.uploadPopupOpened = true;
    return this.uploader.click();
  };

  ObjectPickerUpload.prototype._handleUploaderChange = function() {
    var file;
    file = this.uploader.files[0];
    return this._handleFile(file);
  };

  ObjectPickerUpload.prototype._handleFile = function(file) {
    var img, reader,
      _this = this;
    if (!file.type.match(/image\/.*/)) {
      return alert(t('This is not an image'));
    }
    reader = new FileReader();
    img = new Image();
    reader.readAsDataURL(file);
    return reader.onloadend = function() {
      _this.dataUrl = reader.result;
      return _this.objectPicker.onYes();
    };
  };

  return ObjectPickerUpload;

})(BaseView);
});

;require.register("views/popover_description", function(exports, require, module) {
var BaseView, PopoverDescriptionView, request, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

request = require('lib/request');

module.exports = PopoverDescriptionView = (function(_super) {
  __extends(PopoverDescriptionView, _super);

  function PopoverDescriptionView() {
    this.onConfirmClicked = __bind(this.onConfirmClicked, this);
    this.onCancelClicked = __bind(this.onCancelClicked, this);
    this.hide = __bind(this.hide, this);
    this.show = __bind(this.show, this);
    this.renderDescription = __bind(this.renderDescription, this);
    _ref = PopoverDescriptionView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  PopoverDescriptionView.prototype.id = 'market-popover-description-view';

  PopoverDescriptionView.prototype.className = 'modal md-modal md-effect-1';

  PopoverDescriptionView.prototype.tagName = 'div';

  PopoverDescriptionView.prototype.template = require('templates/popover_description');

  PopoverDescriptionView.prototype.events = {
    'click #cancelbtn': 'onCancelClicked',
    'click #confirmbtn': 'onConfirmClicked'
  };

  PopoverDescriptionView.prototype.initialize = function(options) {
    PopoverDescriptionView.__super__.initialize.apply(this, arguments);
    this.confirmCallback = options.confirm;
    this.cancelCallback = options.cancel;
    this.label = options.label != null ? options.label : t('install');
    return this.$("#confirmbtn").html(this.label);
  };

  PopoverDescriptionView.prototype.afterRender = function() {
    var _this = this;
    this.body = this.$(".md-body");
    this.header = this.$(".md-header h3");
    this.header.html(this.model.get('displayName'));
    this.body.addClass('loading');
    this.body.html(t('please wait data retrieval') + '<div class="spinner-container" />');
    this.body.find('.spinner-container').spin(true);
    this.model.getMetaData({
      success: function() {
        _this.body.removeClass('loading');
        return _this.renderDescription();
      },
      error: function(error) {
        _this.body.removeClass('loading');
        _this.body.addClass('error');
        if (error.responseText.indexOf('Not Found') !== -1) {
          return _this.body.html(t('package.json not found'));
        } else if (error.responseText.indexOf('unknown provider') !== -1) {
          _this.body.html(t('unknown provider'));
          return _this.$("#confirmbtn").hide();
        } else {
          return _this.body.html("" + (t('error connectivity issue')) + "\n" + error.responseText);
        }
      }
    });
    this.overlay = $('.md-overlay');
    return this.overlay.click(function() {
      return _this.hide();
    });
  };

  PopoverDescriptionView.prototype.renderDescription = function() {
    var description, docType, localeDesc, localeKey, permission, permissions, permissionsDiv, _ref1;
    this.body.html("");
    this.header = this.$(".md-header h3");
    this.header.html(this.model.get('displayName'));
    description = this.model.get('description');
    if (description != null) {
      localeKey = "" + (this.model.get('name')) + " description";
      localeDesc = t(localeKey);
      if (localeDesc === localeKey) {
        localeDesc = t(description);
      }
    } else {
      localeDesc = this.model.get('remoteDescription');
    }
    if (localeDesc != null) {
      this.header.parent().append("<p class=\"line\"> " + localeDesc + " </p>");
    }
    permissions = this.model.get("permissions");
    if ((permissions == null) || Object.keys(permissions).length === 0) {
      permissionsDiv = $("<div class='permissionsLine'>\n    <h5>" + (t('no specific permissions needed')) + " </h5>\n</div>");
      this.body.append(permissionsDiv);
    } else {
      this.body.append("<h5>" + (t('required permissions')) + "</h5>");
      _ref1 = this.model.get("permissions");
      for (docType in _ref1) {
        permission = _ref1[docType];
        permissionsDiv = $("<div class='permissionsLine'>\n  <strong> " + docType + " </strong>\n  <p> " + permission.description + " </p>\n</div>");
        this.body.append(permissionsDiv);
      }
    }
    this.handleContentHeight();
    return this.body.slideDown();
  };

  PopoverDescriptionView.prototype.handleContentHeight = function() {
    var _this = this;
    this.body.css('max-height', "" + ($(window).height() / 2) + "px");
    return $(window).on('resize', function() {
      return _this.body.css('max-height', "" + ($(window).height() / 2) + "px");
    });
  };

  PopoverDescriptionView.prototype.show = function() {
    var _this = this;
    this.$el.addClass('md-show');
    this.overlay.addClass('md-show');
    setTimeout(function() {
      return _this.$('.md-content').addClass('md-show');
    }, 300);
    return document.addEventListener('keydown', this.onCancelClicked);
  };

  PopoverDescriptionView.prototype.hide = function() {
    var _this = this;
    this.body.getNiceScroll().hide();
    $('.md-content').fadeOut(function() {
      _this.overlay.removeClass('md-show');
      _this.$el.removeClass('md-show');
      return _this.remove();
    });
    $('#home-content').removeClass('md-open');
    return document.removeEventListener('keydown', this.onCancelClicked);
  };

  PopoverDescriptionView.prototype.onCancelClicked = function(event) {
    if ((event.keyCode != null) && event.keyCode !== 27) {
      return;
    }
    this.hide();
    return this.cancelCallback(this.model);
  };

  PopoverDescriptionView.prototype.onConfirmClicked = function() {
    return this.confirmCallback(this.model);
  };

  return PopoverDescriptionView;

})(BaseView);
});

;require.register("views/tab_controller", function(exports, require, module) {
var tabControler;

module.exports = tabControler = {
  initializeTabs: function(element) {
    var tablists;
    tablists = element.querySelectorAll('[role=tablist]');
    return Array.prototype.forEach.call(tablists, function(tablist) {
      var panelList;
      panelList = tablist.getAttribute('aria-controls');
      panelList = document.querySelector("." + panelList);
      return tablist.addEventListener('click', function(event) {
        var pan, panel, panelName, panelSelectEvt, tab, _i, _j, _len, _len1, _ref, _ref1, _results;
        if (event.target.getAttribute('role') !== 'tab') {
          return;
        }
        panelName = event.target.getAttribute('aria-controls');
        panel = panelList.querySelector("." + panelName);
        _ref = panelList.children;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          pan = _ref[_i];
          if (pan.getAttribute('role') !== 'tabpanel') {
            continue;
          }
          if (pan !== panel) {
            pan.setAttribute('aria-hidden', true);
          }
        }
        panel.setAttribute('aria-hidden', false);
        panelSelectEvt = new Event('panelSelect', {
          bubbles: true,
          cancelable: false
        });
        panel.dispatchEvent(panelSelectEvt);
        _ref1 = tablist.querySelectorAll('[role=tab]');
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          tab = _ref1[_j];
          if (tab === event.target) {
            _results.push(event.target.setAttribute('aria-selected', true));
          } else {
            _results.push(tab.setAttribute('aria-selected', false));
          }
        }
        return _results;
      });
    });
  },
  addTab: function(panelsContainer, tabsContainer, params) {
    var panel, tab;
    tab = params.tab;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', params.name);
    tab.setAttribute('aria-selected', false);
    tabsContainer.appendChild(tab);
    panel = params.panel;
    panel.classList.add(params.name);
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-hidden', true);
    panel.setAttribute('aria-selected', true);
    return panelsContainer.appendChild(panel);
  }
};
});

;require.register("views/update_stack_modal", function(exports, require, module) {
var ApplicationCollection, BaseView, UpdateStackModal, request, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

request = require('lib/request');

ApplicationCollection = require('../collections/application');

module.exports = UpdateStackModal = (function(_super) {
  __extends(UpdateStackModal, _super);

  function UpdateStackModal() {
    this.onCancelClicked = __bind(this.onCancelClicked, this);
    this.onClose = __bind(this.onClose, this);
    _ref = UpdateStackModal.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  UpdateStackModal.prototype.id = 'market-popover-description-view';

  UpdateStackModal.prototype.className = 'modal md-modal md-effect-1';

  UpdateStackModal.prototype.tagName = 'div';

  UpdateStackModal.prototype.template = require('templates/update_stack_modal');

  UpdateStackModal.prototype.events = {
    'click #cancelbtn': 'onCancelClicked',
    'click #confirmbtn': 'onConfirmClicked',
    'click #ok': 'onClose'
  };

  UpdateStackModal.prototype.initialize = function(options) {
    UpdateStackModal.__super__.initialize.apply(this, arguments);
    this.confirmCallback = options.confirm;
    this.cancelCallback = options.cancel;
    return this.endCallback = options.end;
  };

  UpdateStackModal.prototype.afterRender = function() {
    this.overlay = $('.md-overlay');
    this.overlay.click(this.onCancelClicked);
    this.$('.step2').hide();
    this.$('.success').hide();
    this.$('.error').hide();
    this.$('.permission-changes').hide();
    this.$('#ok').hide();
    return this.body = this.$(".md-body");
  };

  UpdateStackModal.prototype.handleContentHeight = function() {
    var _this = this;
    this.body.css('max-height', "" + ($(window).height() / 2) + "px");
    return $(window).on('resize', function() {
      return _this.body.css('max-height', "" + ($(window).height() / 2) + "px");
    });
  };

  UpdateStackModal.prototype.show = function() {
    var _this = this;
    this.$el.addClass('md-show');
    this.overlay.addClass('md-show');
    $('#home-content').addClass('md-open');
    return setTimeout(function() {
      return _this.$('.md-content').addClass('md-show');
    }, 300);
  };

  UpdateStackModal.prototype.hide = function() {
    var _this = this;
    $('.md-content').fadeOut(function() {
      _this.overlay.removeClass('md-show');
      _this.$el.removeClass('md-show');
      return _this.remove();
    });
    return $('#home-content').removeClass('md-open');
  };

  UpdateStackModal.prototype.onSuccess = function(permissionChanges) {
    this.$('.step2').hide();
    this.$('.success').show();
    this.showPermissionsChanged(permissionChanges);
    this.$('#ok').show();
    return this.$('#confirmbtn').hide();
  };

  UpdateStackModal.prototype.onError = function(err, permissionChanges) {
    var app, html, infos, _ref1;
    this.blocked = false;
    this.$('.step2').hide();
    this.$('.error').show();
    this.$('#ok').show();
    this.$('#confirmbtn').hide();
    this.showPermissionsChanged(permissionChanges);
    if ((((_ref1 = err.data) != null ? _ref1.message : void 0) != null) && typeof err.data.message === 'object') {
      infos = err.data.message;
      if (Object.keys(infos).length > 0) {
        this.$(".stack-error").hide();
        html = "<ul>";
        for (app in infos) {
          html += "<li class='app-broken'>" + app + "</li>";
        }
        html += "</ul>";
        this.body.append(html);
      }
    } else {
      this.$('.apps-error').hide();
    }
    return this.endCallback(false);
  };

  UpdateStackModal.prototype.showPermissionsChanged = function(permissionChanges) {
    var app, html;
    if ((permissionChanges != null) && Object.keys(permissionChanges).length > 0) {
      html = "<ul>";
      for (app in permissionChanges) {
        html += "<li class='app-changed'>" + app + "</li>";
      }
      html += "</ul>";
      this.$('.permission-changes').append(html);
      return this.$('.permission-changes').show();
    }
  };

  UpdateStackModal.prototype.onClose = function() {
    this.hide();
    return this.endCallback(true);
  };

  UpdateStackModal.prototype.onCancelClicked = function() {
    if (this.blocked) {
      return alert(t('stack updating block message'));
    } else {
      this.hide();
      return this.cancelCallback();
    }
  };

  UpdateStackModal.prototype.onConfirmClicked = function() {
    this.$('#cancelbtn').addClass('disabled');
    this.confirmCallback();
    this.blocked = true;
    this.$('.step1').hide();
    this.$('.step2').show();
    return this.$('#confirmbtn').spin(true);
  };

  return UpdateStackModal;

})(BaseView);
});

;require.register("widgets/install_button", function(exports, require, module) {
var ColorButton;

module.exports = ColorButton = (function() {
  function ColorButton(button) {
    this.button = button;
    this.label = this.button.find('.label' || this.button);
  }

  ColorButton.prototype.displayGrey = function(text) {
    this.button.show();
    this.label.html(text);
    this.button.removeClass("btn-red");
    this.button.removeClass("btn-green");
    return this.button.removeClass("btn-orange");
  };

  ColorButton.prototype.displayOrange = function(text) {
    this.button.show();
    this.label.html(text);
    this.button.removeClass("btn-red");
    this.button.removeClass("btn-green");
    return this.button.addClass("btn-orange");
  };

  ColorButton.prototype.displayGreen = function(text) {
    this.button.show();
    this.label.html(text);
    this.button.addClass("btn-green");
    this.button.removeClass("btn-red");
    return this.button.removeClass("btn-orange");
  };

  ColorButton.prototype.displayRed = function(text) {
    this.button.show();
    this.label.html(text);
    this.button.removeClass("btn-green");
    this.button.addClass("btn-red");
    return this.button.removeClass("btn-orange");
  };

  ColorButton.prototype.hide = function() {
    return this.button.hide();
  };

  ColorButton.prototype.show = function() {
    return this.button.show();
  };

  ColorButton.prototype.isGreen = function() {
    return this.button.hasClass("btn-green");
  };

  ColorButton.prototype.spin = function(toggle) {
    return this.button.spin(toggle);
  };

  ColorButton.prototype.isHidden = function() {
    return !this.button.is(":visible");
  };

  return ColorButton;

})();
});

;
//# sourceMappingURL=app.js.map