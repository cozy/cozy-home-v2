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

exports.getSAMEORIGINError = function(hash) {
  return hash.match(/^(\w*:\/\/\w+\.)/);
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

;require.register("locales/da", function(exports, require, module) {
module.exports = {
    "home": "Hjem",
    "apps": "Apps",
    "account": "Konto",
    "email": "Email",
    "timezone": "Tidszone",
    "domain": "Domæne",
    "no domain set": "intet.domæne.indstillet",
    "locale": "Sprog",
    "change password": "Skift adgangskode",
    "input your current password": "Indtast din nuværende adgangskode:",
    "enter a new password": "Indtast din nye adgangskode:",
    "confirm new password": "Bekræft din ny adgangskode:",
    "send changes": "Gem",
    "manage": "Manage",
    "total": "Total",
    "memory consumption": "Memory usage",
    "disk consumption": "Disk usage",
    "you have no notifications": "<span>Hello %{name}</span><br>You have currently no notification.",
    "dismiss all": "Dismiss all",
    "add application": "Tilføj app?",
    "install": "Installer",
    "github": "Github",
    "website": "Hjemmeside",
    "your app": "Din app!",
    "community contribution": "Community contribution",
    "official application": "Udviklet af Cozy",
    "application description": "App Beskrivelse",
    "downloading description": "Downloader beskrivelse...",
    "downloading permissions": "Downloader tilladelser...",
    "Cancel": "Annuller",
    "ok": "Ok",
    "applications permissions": "App tilladelser",
    "confirm": "Bekræft",
    "installing": "Installere",
    "remove": "Fjern",
    "update": "Opdater",
    "config application unmark favorite": "fjern fra favorit",
    "config application mark favorite": "tilføj som favorit",
    "started": "started",
    "notifications": "Notifikationer",
    "questions and help forum": "Questions and help forum",
    "sign out": "Log ud",
    "open in a new tab": "Åben i en ny fane",
    "always on": "altid til",
    "keep always on": "keep always on",
    "stop this app": "Stop denne app",
    "update required": "Opdatering tilgængelig",
    "navbar faq": "Ofte Stillede Spørgsmål",
    "application is installing": "En app bliver allerede installeret.\nVent til den er færdig, og prøv igen.",
    "no app message": "You currently have no app installed on your Cozy.\nGo to the <a href=\"#applications\">Cozy store</a> and install new apps!",
    "welcome to app store": "Welcome to your Cozy store, install your own app from here\nor add one from the list of available ones.",
    "installed everything": "Du har allerede installeret alt!",
    "already similarly named app": "Du har allerede en app med det navn.",
    "your app list": "Tilgå dine apps",
    "customize your cozy": "Customize your layout",
    "manage your apps": "Applications",
    "choose your apps": "Vælg dine apps",
    "configure your cozy": "Konfigurer din Cozy",
    "ask for assistance": "Spørg om hjælp",
    "logout": "Log ud",
    "navbar logout": "Log ud",
    "welcome to your cozy": "Velkommen til din Cozy!",
    "you have no apps": "Du har ingen apps.",
    "app management": "App management",
    "app store": "Butik",
    "configuration": "Konfiguration",
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
    "status hard drive label": "Lager",
    "status memory label": "Memory",
    "manage your applications": "Applications",
    "manage your devices": "Forbundne enheder",
    "synchronized": "synkroniseret",
    "revoke device access": "Revoke device",
    "no application installed": "Der er ingen app installeret.",
    "your parameters": "Dine indstillinger",
    "alerts and password recovery email": "Your email is used for notifications or password recovery.",
    "public name description": "Your username will be displayed when you share files with people or invite them to events.",
    "domain name for urls and email": "The domain name is used to connect to your Cozy from any devices and build sharing URLs.",
    "account timezone field description": "Your time zone helps to properly display your calendar.",
    "save": "Gem",
    "saved": "Gemt",
    "error": "Fejl",
    "error proper email": "Indtastede email er ikke korrekt",
    "error email empty": "Indtastede email er tom",
    "account language field description": "Choose the language you want to see:",
    "account background selection": "Select your background for your Cozy Home:",
    "account localization": "Localization",
    "account identifiers": "Konto",
    "account personalization": "Customization",
    "account password": "Adgangskode",
    "account two factors auth": "Two-factor authentication",
    "account 2fa strategy": "Authentication strategy",
    "account 2fa hotp": "HOTP (based on a counter)",
    "account 2fa totp": "TOTP (based on a timer)",
    "enable 2fa": "Enable two-factor authentication",
    "disable 2fa": "Disable two-factor authentication",
    "reset 2fa tokens": "Reset your recovery tokens",
    "account 2fa enabled": "Two-factor authentication has been enabled. Page will now reload.",
    "account 2fa disabled": "Two-factor authentication has been disabled. Page will now reload.",
    "account 2fa error": "There was something wrong while enabling two-factor authentication. Please try again in a few minutes or contact the support.",
    "account 2fa token explanation": "Two-factor authentication is enabled on Cozy. To use it with your favourite app or device, you have to enter the following key when setting up the account:",
    "account 2fa qrcode explanation": "You can also scan the QR code below if your app supports it.",
    "account 2fa rectokens": "Below are your recovery tokens. Make sure to copy them somewhere safe (not on Cozy) so you won't get locked outside of your Cozy.",
    "2fa strategy hotp": "Two-factor authentication is enabled on Cozy with the HOTP strategy (counter-based).",
    "2fa strategy totp": "Two-factor authentication is enabled on Cozy with the TOTP strategy (timer-based).",
    "account 2fa hotp reset explanation": "If you're changing from one authentication app or device to another, you must reset the HOTP counter in order to not get locked outside of your Cozy.",
    "2fa reset hotp": "Reset the HOTP counter",
    "account 2fa reset": "The HOTP counter has been successfully reset.",
    "account 2fa disable explanation": "You can disable the two-factor authentication at any time:",
    "2fa if yubikey": "If you are using a Yubikey to authenticate, use the key below as your Secret Key.",
    "french": "Fransk",
    "english": "Engelsk",
    "german": "Tysk",
    "spanish": "Spansk",
    "korean": "Koreansk",
    "japanese": "Japanese",
    "portuguese": "Portugisisk",
    "russian": "Russian",
    "change password procedure": "Steps to change your password",
    "current password": "nuværende adgangskode",
    "new password": "ny adgangskode",
    "confirm your new password": "confirm your new password",
    "save your new password": "Gem din nye adgangskode",
    "do you want assistance": "Har du brug for hjælp?",
    "help email title": "Email",
    "help twitter title": "Twitter",
    "help forum title": "Forum",
    "help IRC title": "IRC",
    "help github title": "Github",
    "Visit the project website and learn to build your app:": "Besøg projekt hjemmeside:",
    "your own application": "din egen app",
    "installed": "Installeret",
    "updated": "opdateret",
    "updating": "opdatere",
    "update all": "Update Stack and applications",
    "show home logs": "Show Home Logs",
    "show data system logs": "Show Data System Logs",
    "show proxy logs": "Show Proxy Logs",
    "show logs": "Show Logs",
    "update stack": "Opdater platform",
    "reboot stack waiting message": "Wait please, rebooting takes several minutes.",
    "update stack waiting message": "Wait please, updating takes several minutes.",
    "status no device": "There is no device connected to your Cozy.",
    "download apk": "Download .APK-fil",
    "mobile app promo": "Backup you photos and synchronize your contacts and calendars with your mobile via the dedicated mobile app:",
    "desktop app promo": "You can also download the cozy-desktop client to synchronize your files on your laptop/desktop:",
    "download desktop linux": "Download cozy desktop for Linux",
    "update stack modal title": "Opdatere din Cozy",
    "update stack modal content": "You are about to update the platform. Your Cozy will be unavailable a few minutes. Is that OK?",
    "update stack modal confirm": "Opdater",
    "update stack success": "Your applications are updated, page will refresh.",
    "update stack error": "An error occurred during the update. Your Cozy may become unstable. If you notice any troubles, you should contact your hosting provider. When you will click on the OK button, the current window will be refreshed.",
    "applications broken": "Applications broken",
    "cozy platform": "Platform",
    "navbar back button title": "Hjem",
    "navbar notifications": "Notifikationer",
    "or:": "eller:",
    "reboot stack": "Genstart",
    "update error": "An error occurred while updating the app",
    "update failed": "Opdatering fejlede",
    "error update uninstalled app": "You can't update an app that is not installed.",
    "notification open application": "Åben applikation",
    "notification update stack": "Opdater platform",
    "notification update application": "Opdater nu",
    "broken": "ødelagt",
    "start this app": "Start denne app",
    "stopped": "stoppet",
    "retry to install": "Prøv installation igen",
    "cozy account title": "Cozy - Indstillinger",
    "cozy app store title": "Cozy - Butik",
    "cozy home title": "Cozy - Hjem",
    "cozy applications title": "Cozy - Status",
    "running": "kører",
    "cozy help title": "Cozy - Hjælp",
    "help support title": "Officiel Support",
    "help community title": "Fællesskab Support",
    "help direct title": "Direct Message",
    "help documentation title": "Dokumentation",
    "changing locale requires reload": "Changing the locale requires to reload the page.",
    "cancel": "fortryd",
    "abort": "annuller",
    "Once updated, this application will require the following permissions:": "Once updated, this app will require the following permissions:",
    "confirm update": "bekræft opdatering",
    "confirm install": "bekræft installation",
    "no specific permissions needed": "This app doesn't require any permission",
    "removed": "fjernet",
    "removing": "fjerner",
    "required permissions": "Påkrævede tilladelser",
    "finish layout edition": "Gem",
    "reset customization": "Nulstil",
    "use icon": "Brug ikon",
    "home section favorites": "Favoritter",
    "home section leave": "Importér",
    "home section main": "Daglig",
    "home section productivity": "Produktivitet",
    "home section data management": "Data",
    "home section personal watch": "Watch",
    "home section misc": "Andet",
    "home section platform": "Platform",
    "app status": "Status",
    "settings": "Indstillinger",
    "help": "Hjælp",
    "change layout": "Change the layout",
    "market app install": "Installere...",
    "install your app": "Install an app from its Git Repository",
    "market install your app": "Just copy/paste its Git URL in the field below:",
    "market install your app tutorial": "To know more about how to build your own app, feel free to read our",
    "market app tutorial": "guide",
    "help send message title": "Write directly to the Cozy Team",
    "help send message action": "Send",
    "help send logs": "Send server logs to ease debug",
    "send message success": "Besked sendt!",
    "send message error": "An error occurred while sending your support message. Try to send it via an email client to support@cozycloud.cc",
    "account change password success": "The password was changed successfully.",
    "account change password short": "The new password is too short.",
    "account change password difference": "The password confirmation doesn't match the new password.",
    "account change password error": "There was something wrong while changing your password. Ensure that your previous password is correct.",
    "account background add": "Tilføj baggrund",
    "introduction market": "Welcome to the Cozy store!\nHere, you can install\napps provided by Cozy Cloud, apps from the community or apps built by yourself!",
    "error connectivity issue": "An error occurred while retrieving the data.<br />Please try again later.",
    "package.json not found": "Unable to fetch package.json. Check your repo url.",
    "unknown provider": "For now, applications can only be installed from Github or CozyCloud Market",
    "please wait data retrieval": "Please wait while the data is being retrieved…",
    "revoke device confirmation message": "This will prevent the device from accessing your Cozy. Are you sure?",
    "dashboard": "Dashboard",
    "calendars description": "Manage your events and sync them with your smartphone.",
    "contacts description": "Manage your contacts and sync them with your smartphone.",
    "emails description": "Læs, send og tag backup af dine emails.",
    "files description": "Dit online fil-system, synkroniseret med dine enheder.",
    "photos description": "Organiser dine billeder og del dem med venner.",
    "sync description": "The tool required to sync your contacts and calendar with your smartphone.",
    "quickmarks description": "Gem og ændre dine bogmærker.",
    "cozic description": "En medieafspiller til at lytte musik fra din browser.",
    "databrowser description": "Browse and visualize all your data (raw format).",
    "zero-feeds description": "Aggregate your feeds and save your favorite links as bookmarks.",
    "kyou description": "Improve your health and happiness by quantifying yourself.",
    "konnectors description": "Import data from external services (Twitter, Jawbone…).",
    "kresus description": "Additional tools for your personal finance manager.",
    "nirc description": "Adgang til dine favorit IRC kanaler fra Cozy",
    "shout description": "Access to your favorite IRC channels from your Cozy with the Shout Web application",
    "notes description": "Organiser og skriv noter.",
    "owm description": "Kend vejret overalt i verdenen.",
    "remote storage description": "A Remote Storage appliance to store data from your Unhosted applications.",
    "tasky description": "Super fast and simple tag-based task manager.",
    "todos description": "Write your tasks, order them and complete them efficiently.",
    "term description": "En terminal app til Cozy",
    "ghost description": "Share your stories with the world with this app based on the Ghost Blogging Platform.",
    "leave google description": "An app to import your current data from your Google account.",
    "mstsc.js description": "Manage your Windows Desktop remotely through the RDP protocol.",
    "hastebin description": "A simple pastebin, a tool to easily share texts.",
    "polybios description": "Manage your PGP keys from your browser.",
    "frost description": "Build your internet memories by archiving web pages into your Cozy.",
    "tiddlywiki description": "A non-linear personal web notebook.",
    "hari description": "Encrypted personal diary.",
    "map description": "Open Street Map in your Cozy",
    "moi description": "A new experience to visualize your data",
    "warning unofficial app": "This app is a community app and isn't maintained by the Cozy team.\nTo report a bug, please file an issue in <a href='https://forum.cozy.io'>our forum</a>.",
    "update available notification": "A new version of %{appName} is available.",
    "stack update available notification": "A new version of the platform is available.",
    "app broken title": "Ødelagt applikation",
    "app broken": "This application is broken. Can you try to install it again:",
    "reinstall broken app": "geninstaller den.",
    "error git": "We can't retrieve the source code.",
    "error github repo": "Applikations repository er ikke tilgængelig.",
    "error github": "Github er ikke tilgængelig. Se status her https://status.github.com/.",
    "error npm": "We can't install the application dependencies.",
    "error user linux": "We can't create a specific Linux user for this application.",
    "error start": "Application can't start. You can find more details in log application.",
    "app msg": "If error persists, you can contact us at contact@cozycloud.cc or on IRC #cozycloud on irc.freenode.net.",
    "more details": "Flere detaljer",
    "noapps": {
        "customize your cozy": "You can also <a href=\"%{account}\">go to your settings</a> and customize your Cozy,\nor <a href=\"%{appstore}\">take a look at the App Store</a> to install your first app."
    },
    "pick from files": "Vælg et billede",
    "Crop the photo": "Beskær billede",
    "chooseAgain": "vælg et andet billede",
    "modal ok": "OK",
    "modal cancel": "Fortryd",
    "no image": "Der er ingen billeder i Cozy",
    "ObjPicker upload btn": "Upload en lokal fil",
    "or": "eller",
    "drop a file": "Træk & Slip en fil eller",
    "url of an image": "Indsæt URL-adresse på et billede fra internettet",
    "you have no album": "<p>You haven't got any photo album<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:-(</p><p>Create one from the <a href='/#applications' target='_blank'>the Photo app</a><br>and use photos taken from your smartphone with the <a href='https://play.google.com/store/apps/details?id=io.cozy.files_client&hl=en' target='_blank'>mobile app!</a><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:-)</p>",
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
};
});

require.register("locales/de", function(exports, require, module) {
module.exports = {
    "home": "Home",
    "apps": "Apps",
    "account": "Account",
    "email": "E-Mail",
    "timezone": "Zeitzone",
    "domain": "Domain",
    "no domain set": "no.domain.set",
    "locale": "Sprache",
    "change password": "Passwort ändern",
    "input your current password": "Tragen Sie Ihr aktuelles Passwort ein",
    "enter a new password": "Benutzen Sie das Feld um ein neues Passwort zu erstellen",
    "confirm new password": "Bestätigen Sie das neue Passwort",
    "send changes": "Speichern",
    "manage": "Verwalten",
    "total": "Total",
    "memory consumption": "Arbeitsspeicher Verbrauch",
    "disk consumption": "Speicherplatz Verbrauch",
    "you have no notifications": "<span>Hallo %{name}</span><br>Du hast keine neuen Benachrichtigungen.",
    "dismiss all": "Alle ausblenden",
    "add application": "App hinzufügen?",
    "install": "Installieren",
    "github": "Github",
    "website": "Website",
    "your app": "Deine App!",
    "community contribution": "Community Mitwirkung",
    "official application": "Developed by Cozy",
    "application description": "App Beschreibung",
    "downloading description": "Beschreibungen herunterladen…",
    "downloading permissions": "Berechtigungen herunterladen…",
    "Cancel": "Abbrechen",
    "ok": "Ok",
    "applications permissions": "App Berechtigungen",
    "confirm": "Bestätigen",
    "installing": "Installieren",
    "remove": "Entfernen",
    "update": "Aktualisieren",
    "config application unmark favorite": "als Favorit entfernen",
    "config application mark favorite": "als Favorit hinzufügen",
    "started": "Gestartet",
    "notifications": "Mitteilungen",
    "questions and help forum": "Fragen und Hilfe Forum",
    "sign out": "Abmelden",
    "open in a new tab": "In neuem Tab öffnen",
    "always on": "Immer eingeschaltet",
    "keep always on": "Immer eingeschaltet lassen",
    "stop this app": "Diese App stoppen",
    "update required": "Aktualisierung verfügbar",
    "navbar faq": "Häufig gestellte Fragen",
    "application is installing": "Eine App wird bereits installiert.\nWarten Sie bis zu dessen Ende, und versuchen Sie erneut.",
    "no app message": "Zuzeit ist keine App auf Ihrem Cozy installiert.\nGehen Sie zu <a href=\"#applications\">app store</a> und installieren Sie neue Apps!",
    "welcome to app store": "Willkommen in Ihrem Cozy App Store, installieren Sie Ihre eigene App\nvon hier aus und fügen Sie eine von der Liste hinzu.",
    "installed everything": "Sie haben bereits alles installiert!",
    "already similarly named app": "Sie haben bereits eine App mit gleichem Namen.",
    "your app list": "Zugriff Ihrer Apps",
    "customize your cozy": "Ihr Layout anpassen",
    "manage your apps": "Ihre Apps verwalten",
    "choose your apps": "Ihre Apps auswählen",
    "configure your cozy": "Ihr Cozy konfigurieren",
    "ask for assistance": "Nach Hilfe fragen",
    "logout": "Abmelden",
    "navbar logout": "Abmelden",
    "welcome to your cozy": "Willkommen zu Ihrem Cozy!",
    "you have no apps": "Sie haben kein Apps.",
    "app management": "App management",
    "app store": "Store",
    "configuration": "Konfiguration",
    "assistance": "Unterstützung",
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
    "manage your applications": "Ihre Apps verwalten",
    "manage your devices": "Connected devices",
    "synchronized": "synchronisiert",
    "revoke device access": "Gerätezugriff aufheben",
    "no application installed": "Es ist keine App installiert.",
    "your parameters": "Ihre Einstellungen",
    "alerts and password recovery email": "Ihre E-Mail wird für Mitteilungen oder eine Passwortwiederherstellung benötigt.",
    "public name description": "Ihr Benutzername wird angezeigt, wenn sie Dateien mit anderen Personen teilen oder diese zu Veranstaltungen einladen.",
    "domain name for urls and email": "The domain name is used to connect to your Cozy from any devices and build sharing URLs.",
    "account timezone field description": "Ihre Zeitzone hilft, Ihre Kalender korrekt darzustellen.",
    "save": "Speichern",
    "saved": "Gespeichert",
    "error": "Fehler",
    "error proper email": "Angegebene E-Mail ist falsch",
    "error email empty": "Angegebene E-Mail ist leer",
    "account language field description": "Wählen Sie die Sprache, die Sie sehen möchten:",
    "account background selection": "Wählen sie den Hintergrund für Cozy Home aus:",
    "account localization": "Localization",
    "account identifiers": "Account",
    "account personalization": "Customization",
    "account password": "Passwort",
    "account two factors auth": "Zwei-Wege-Authentifizierung",
    "account 2fa strategy": "Authentifizierungs-Strategie",
    "account 2fa hotp": "HOTP (auf einem Zähler basierend)",
    "account 2fa totp": "TOTP (auf einem Timer basierend)",
    "enable 2fa": "Aktiviere Zwei-Wege-Authentifizierung",
    "disable 2fa": "Deaktiviere Zwei-Wege-Authentifizierung",
    "reset 2fa tokens": "Setzen Sie Ihre Wiederherstellungstoken zurück",
    "account 2fa enabled": "Zwei-Wege-Authentifizierung wurde aktiviert. Die Seite wird jetzt neu geladen.",
    "account 2fa disabled": "Zwei-Wege-Authentifizierung wurde deaktiviert. Die Seite wird jetzt neu geladen.",
    "account 2fa error": "Es ist bei der Aktivierung der Zwei-Wege-Authentifizierung etwas schief gegangen. Bitte versuchen Sie es in ein paar Minuten erneut oder kontaktieren Sie den Support.",
    "account 2fa token explanation": "Die Zwei-Wege-Authentifizierung auf Cozy wurde aktiviert. Um sie auf Ihrer bevorzugten App oder Gerät zu nutzen, müssen Sie den folgenden Schlüssel eingeben, wenn Sie das Konto einrichten: ",
    "account 2fa qrcode explanation": "Sie können auch den QR-Code unten einscannen, wenn Ihre App dies unterstützt.",
    "account 2fa rectokens": "Unten stehend sind Ihre Wiederherstellungstoken. Speichern Sie diese an einem sicheren Ort (nicht auf Cozy), so dass Sie sich keinesfalls aussperren. ",
    "2fa strategy hotp": "Zwei-Wege-Authentifizierung für Cozy ist auf Basis von HOTP aktiviert (Ereignis-basiert).",
    "2fa strategy totp": "Zwei-Wege-Authentifizierung für Cozy ist auf Basis von TOTP aktiviert (Zeit-basiert).",
    "account 2fa hotp reset explanation": "Wenn Sie von einer Authentifizierungs- App oder Gerät zu einer anderen wechseln, müssen Sie den HOTP Zähler zurücksetzen um nicht aus  Cozy ausgesperrt zu werden.",
    "2fa reset hotp": "HOTP Zähler zurücksetzen",
    "account 2fa reset": "Der HOTP Zähler wurde erfolgreich zurückgesetzt",
    "account 2fa disable explanation": "Sie können die Zwei-Wege-Authentifizierung jederzeit deaktivieren:",
    "2fa if yubikey": "Wenn Sie einen Yubikey zur Authenftifizierung benutzen, verwenden Sie den unten stehenden Schlüssel als \"Secret Key\"",
    "french": "Französisch",
    "english": "Englisch",
    "german": "Deutsch",
    "spanish": "Spanisch",
    "korean": "Koreanisch",
    "japanese": "Japanisch",
    "portuguese": "Portugisisch",
    "russian": "Russisch",
    "change password procedure": "Schritte um Ihr Passwort zu ändern",
    "current password": "Aktuelles Passwort",
    "new password": "Neues Passwort",
    "confirm your new password": "Bestägigen Sie in neues Passwort",
    "save your new password": "neues Passwort speichern",
    "do you want assistance": "Brauchen Sie etwas Hilfe?",
    "help email title": "E-Mail",
    "help twitter title": "Twitter",
    "help forum title": "Forum",
    "help IRC title": "IRC",
    "help github title": "Github",
    "Visit the project website and learn to build your app:": "Besuchen Sie die Projektwebseite und lernen Sie Ihre eigene App zu erstellen:",
    "your own application": "Ihre eigene App",
    "installed": "installiert",
    "updated": "aktualisiert",
    "updating": "aktualisierung läuft",
    "update all": "Alle aktualisieren",
    "show home logs": "Zeige Home-Protokolle",
    "show data system logs": "Zeige Dateisystem-Protokolle",
    "show proxy logs": "Zeige Proxy-Protokolle",
    "show logs": "Protokolle anzeigen",
    "update stack": "Aktualsieren",
    "reboot stack waiting message": "Bitte warten sie. Der Neustart einige Minuten dauert.",
    "update stack waiting message": "Bitte warten sie. Die Aktualisierung dauert einige Minuten.",
    "status no device": "Kein Gerät ist mit Cozy verbunden.",
    "download apk": ".APK herunterladen",
    "mobile app promo": "Sichern sie ihre Fotos und synchronisieren sie ihre Kontakte und Kalender mit ihrem Mobiltelefon mit Hilfe der zugehörigen App:",
    "desktop app promo": "Sie können auch den Cozy Desktop Client für Linux herunterladen um Ihre DAteien auf den PC/Laptop zu synchronisieren:",
    "download desktop linux": "Cozy Desktop für Linux herunterladen",
    "update stack modal title": "Aktualisieren Sie Ihren Cozy",
    "update stack modal content": "Sie sind dabei die Plattform zu aktualisieren. Ihr Cozy wird einige Minuten nicht verfügbar sein. Ist das OK?",
    "update stack modal confirm": "Aktualisierung",
    "update stack success": "Ihre Applikation wurde aktualisiert, Seite wird neu geladen.",
    "update stack error": "Es trat ein Fehler während der Aktualisierung auf. Dein Cozy läuft möglicherweise instabil. Sollten Fehler auftreten wende dich bitte an deinen Provider. Klicke Ok um das aktuelle Fenster neu zu laden.",
    "applications broken": "Applikation abgestürtzt",
    "cozy platform": "Plattform",
    "navbar back button title": "Zurück Home",
    "navbar notifications": "Benachrichtigungen:",
    "or:": "oder:",
    "reboot stack": "Neustart",
    "update error": "Es trat ein fehler während der aktualisierung der App auf",
    "update failed": "Update failed",
    "error update uninstalled app": "Sie können keine App aktualisieren, die nicht installiert ist.",
    "notification open application": "Applikation öffnen",
    "notification update stack": "Plattform aktualisieren",
    "notification update application": "Jetzt aktualisieren",
    "broken": "Absturz",
    "start this app": "Diese App starten",
    "stopped": "Gestoppt",
    "retry to install": "Installation wiederholen",
    "cozy account title": "Cozy - Einstellungen",
    "cozy app store title": "Cozy - Store",
    "cozy home title": "Cozy - Home",
    "cozy applications title": "Cozy - Status",
    "running": "Läuft",
    "cozy help title": "Cozy - Hilfe",
    "help support title": "Offizieller Support",
    "help community title": "Community Support",
    "help direct title": "Direkte Nachricht",
    "help documentation title": "Dokumentation",
    "changing locale requires reload": "Ändern Sie das Gebietsschema um die Seite neu zu laden.",
    "cancel": "Abbrechen",
    "abort": "Abbruch",
    "Once updated, this application will require the following permissions:": "Einmal aktualisiert, benötigt diese App folgende Rechte:",
    "confirm update": "Aktualisierung bestätigen",
    "confirm install": "Installation bestätigen",
    "no specific permissions needed": "Diese App benötigt keine Rechte",
    "removed": "Entfernt",
    "removing": "Entfernen",
    "required permissions": "Benötigte Rechte",
    "finish layout edition": "Speichern",
    "reset customization": "Zurücksetzen",
    "use icon": "Icon verwenden",
    "home section favorites": "Favoriten",
    "home section leave": "Importieren",
    "home section main": "Täglich",
    "home section productivity": "Produktivität",
    "home section data management": "Daten",
    "home section personal watch": "im Auge behalten",
    "home section misc": "Verschiedenes",
    "home section platform": "Plattform",
    "app status": "Status",
    "settings": "Einstellungen",
    "help": "Hilfe",
    "change layout": "Layout verändern",
    "market app install": "Installiere...",
    "install your app": "Installieren sie eine App von einem Git Repository",
    "market install your app": "Kopieren sie einfach die Git URL in das untenstehende Feld:",
    "market install your app tutorial": "Um mehr darüber zu erfahren wie eingene Apps baut werden, lies doch einfach in unserem ",
    "market app tutorial": "Anleitung",
    "help send message title": "Direkt an das Cozy Team schreiben",
    "help send message action": "Senden",
    "help send logs": "Serverprotokolle senden, um die Fehlersuche und -beseitigung zu erleichtern",
    "send message success": "Nachricht erfolgreich gesendet.",
    "send message error": "Es trat ein Fehler beim Versenden der Support Nachricht auf. Bitte sende diese direkt per E-Mail an support@cozycloud.cc",
    "account change password success": "Das Passwort wurde erfolgreich geändert.",
    "account change password short": "Das neue Passwort ist zu kurz.",
    "account change password difference": "Die Passwortbestätigung stimmt nicht mit dem neuen Passwort überein.",
    "account change password error": "Etwas ist schief gelaufen währen der Passwortänderung. Bitte überprüfen sie, dass sie ihr altes Passwort korrekt eingeben haben.",
    "account background add": "Hintergrund hinzufügen",
    "introduction market": "Willkommen im Cozy App Store.\nInstallieren sie hier\nApps entwickelt von Cozy Cloud, geteilt von der Community oder von Ihnen persönlich erstellt!",
    "error connectivity issue": "Beim Abrufen der Daten ist ein Fehler aufgetreten.<br />Bitte versuchen Sie später erneut.",
    "package.json not found": "Abruf von package.json ist nicht möglich. Prüfen Sie Ihre Repository URL.",
    "unknown provider": "Zur Zeit können Applikation nur von Github oder CozyCloud Market installiert werden",
    "please wait data retrieval": "Bitte warten während die Daten abgerufen werden…",
    "revoke device confirmation message": "Dies verhindert den Zugriff des Gerätes auf Ihr Cozy. Sind Sie sicher?",
    "dashboard": "Dashboard",
    "calendars description": "Verwalten Sie Ihre Termine und synchronisieren Sie diese mit Ihrem Smartphone.",
    "contacts description": "Verwalten Sie Ihre Kontakte und synchronisieren Sie diese mit Ihrem Smartphone.",
    "emails description": "Lesen, versenden und sichern Sie Ihre E-Mails.",
    "files description": "Ihr online Dateisystem, synchronisiert mit Ihren Geräten.",
    "photos description": "Organisieren Sie Ihre Fotos und teilen Sie diese mit Freunden.",
    "sync description": "Dieses Hilfsprogramm ist Vorausetzung zur Synchronisation Ihrer Kontakte und Kalender mit Ihrem Smartphone.",
    "quickmarks description": "Speichern und verwalten Ihrer Lesezeichen.",
    "cozic description": "Ein Audio-Player um Ihre Musik von in Ihrem Browser aus abzuspielen.",
    "databrowser description": "Durchsuchen und Visualisierung Ihrer Daten (RAW Format).",
    "zero-feeds description": "Fassen Sie Ihre Newsfeeds zusammen und speichern Sie Ihre liebsten Webseiten als Lesezeichen.",
    "kyou description": "Verbessern Sie Ihre Gesundheit und Zufriedenheit durch Bewertung Ihrer selbst.",
    "konnectors description": "Datenimport von externen Anbietern (Twitter, Jawbone…).",
    "kresus description": "Zusätzliche Hilfsprogramme für Ihre private Finanzverwaltung.",
    "nirc description": "Zugriff auf Ihre favorisierten IRC-Kanäle von Ihrem Cozy.",
    "shout description": "Zugriff auf Ihre favorisierten IRC-Kanäle von Ihrem Cozy mit der Shout Web-Applikation",
    "notes description": "Organisieren und schreiben von Notizen.",
    "owm description": "Wissen wie das Wetter wird, überall auf der Welt.",
    "remote storage description": "Eine Anwendung zur Online-Datensicherung Ihrer nicht gehosteten Applikationen.",
    "tasky description": "Tag basierte, super schnelle und einfache Aufgabenverwaltung.",
    "todos description": "Erstellen Sie Ihre Aufgaben, ordnen Sie diese und führen Sie diese effizient aus.",
    "term description": "Eine Terminal App für Ihr Cozy.",
    "ghost description": "Teilen Sie Ihre Erlebnisse mit der Welt. Diese App basiert auf der Ghost Blogging-Plattform.",
    "leave google description": "Eine App zum Importieren deiner Daten von deinem Google Account.",
    "mstsc.js description": "Verwalten Sie Ihren Windows Desktop entfernt durch das RDP-Protokoll.",
    "hastebin description": "Ein simples pastebin, ein Hilfsmittel um einfach Texte zu teilen.",
    "polybios description": "Verwalten Sie Ihre PGP-Schlüssel direkt von Ihrem Browser.",
    "frost description": "Erbaue deine eigenen Internet-Erinnerungen indem du Webseiten in deinem Cozy archivierst.",
    "tiddlywiki description": "Ein persönliches nicht-lineares Web-Notizbuch",
    "hari description": "Verschlüsseltes Tagebuch",
    "map description": "Open Street Map in deinem Cozy",
    "moi description": "A new experience to visualize your data",
    "warning unofficial app": "Diese App is eine aus der Gemeinschaft und wird nicht durch das Cozy Team betreut.\nUm einen Fehler zu melden, beschreiben Sie bitte das Problem in <a href='https://forum.cozy.io'>unserem Forum</a>.",
    "update available notification": "Eine neue Version von %{appName} ist verfügbar.",
    "stack update available notification": "Eine neue Version der Plattform ist verfügbar.",
    "app broken title": "Fehlerhafte Applikation",
    "app broken": "This application is broken. Can you try to install it again:",
    "reinstall broken app": "Erneut Installieren.",
    "error git": "Wir können den Quellcode nicht empfangen.",
    "error github repo": "Application Repository scheint nicht erreichbar zu sein.",
    "error github": "Es scheint als wäre GitHub nicht erreichbar. Sie können den GitHub Status unter https://status.github.com/ überprüfen.",
    "error npm": "Die Abhängigkeiten der App onnten nicht installiert werden.",
    "error user linux": "Spezifischer Linux-Benutzer für diese Anwendung kann nicht erstellt werden.",
    "error start": "Die Applikation konnte nicht gestartet werden. Details finden Sie im Protokoll der Applikation.",
    "app msg": "Wenn der Fehler erneut Auftritt können Sie uns unter contact@cozycloud.cc erreichen oder mit IRC im Raum #cozycloud auf irc.freenode.net.",
    "more details": "Mehr Details",
    "noapps": {
        "customize your cozy": "Sie können außerdem <a href=\"%{account}\">zu den Einstellungen gehen</a> um Ihr Cozy anzupassen,\noder <a href=\"%{appstore}\">den App Store besuchen</a> um Ihre erste App zu installieren."
    },
    "pick from files": "Foto auswählen",
    "Crop the photo": "Foto zuschneiden",
    "chooseAgain": "Ein anderes Foto auswählen",
    "modal ok": "OK",
    "modal cancel": "Abbrechen",
    "no image": "Es sind keine Fotos in Ihrem Cozy vorhanden",
    "ObjPicker upload btn": "Eine Datei hochladen",
    "or": "oder",
    "drop a file": "Drag & Drop eine Datei oder",
    "url of an image": "Kopieren Sie eine URL eines Bildes aus dem Internet",
    "you have no album": "<p>Sie haben kein Fotoalbum<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:-(</p><p>Erstellen Sie eines aus <a href='/#applications' target='_blank'>der Photo App</a><br>und nutzen Sie Bilder, die Sie mit Ihrem Mobiltelefon aufgenommen haben, mit der <a href='https://play.google.com/store/apps/details?id=io.cozy.files_client&hl=en' target='_blank'>Mobile App!</a><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:-)</p>",
    "state app installing": "Die App wird installiert. Bitte warte einen Moment",
    "state app stopped error": "Die App kann nicht gestartet werden",
    "stack updating block message": "Du kannst dein Cozy aktuell nicht benutzen, da es gerade aktualisiert wird.",
    "update apps error title": "Ein Fehler ist während der Aktualisierung der Apps aufgetreten",
    "update apps error": "Eine oder mehrere Apps sind defekt und wurden makrkiert. Du musst diese möglicherweise deinstallieren oder erneut installieren.",
    "update apps error list title": "Fehlerhafte Applikationen",
    "update stack error title": "Ein Fehler ist während der Aktualisierung von Cozy aufgetreten",
    "update stack permission changes": "Die unten aufgeführten Apps konnten Aufgrund geänderter Berechtigungen nicht aktualisiert werden. Bitte aktualisiere diese manuell um die neuen Berechtigungen anzunehmen oder abzulehnen.",
    "update stack warning": "Warnung",
    "reboot stack error": "Es ist ein Fehler während des Neustarts von Cozy aufgetreten. Es läuft möglicherweise instabil. Bitte kontaktiere deinen Provider, wenn dein Cozy nicht mehr funktioniert."
};
});

require.register("locales/en", function(exports, require, module) {
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
  "account two factors auth": "Two-factor authentication",
  "account 2fa strategy": "Authentication strategy",
  "account 2fa hotp": "HOTP (based on a counter)",
  "account 2fa totp": "TOTP (based on a timer)",
  "enable 2fa": "Enable two-factor authentication",
  "disable 2fa": "Disable two-factor authentication",
  "reset 2fa tokens": "Reset your recovery tokens",
  "account 2fa enabled": "Two-factor authentication has been enabled. Page will now reload.",
  "account 2fa disabled": "Two-factor authentication has been disabled. Page will now reload.",
  "account 2fa error": "There was something wrong while enabling two-factor authentication. Please try again in a few minutes or contact the support.",
  "account 2fa token explanation": "Two-factor authentication is enabled on Cozy. To use it with your favourite app or device, you have to enter the following key when setting up the account:",
  "account 2fa qrcode explanation": "You can also scan the QR code below if your app supports it.",
  "account 2fa rectokens": "Below are your recovery tokens. Make sure to copy them somewhere safe (not on Cozy) so you won't get locked outside of your Cozy.",
  "2fa strategy hotp": "Two-factor authentication is enabled on Cozy with the HOTP strategy (counter-based).",
  "2fa strategy totp": "Two-factor authentication is enabled on Cozy with the TOTP strategy (timer-based).",
  "account 2fa hotp reset explanation": "If you're changing from one authentication app or device to another, you must reset the HOTP counter in order to not get locked outside of your Cozy.",
  "2fa reset hotp": "Reset the HOTP counter",
  "account 2fa reset": "The HOTP counter has been successfully reset.",
  "account 2fa disable explanation": "You can disable the two-factor authentication at any time:",
  "2fa if yubikey": "If you are using a Yubikey to authenticate, use the key below as your Secret Key.",
  "french": "French",
  "english": "English",
  "german": "German",
  "spanish": "Spanish",
  "korean": "Korean",
  "japanese": "Japanese",
  "portuguese": "Portuguese",
  "russian": "Russian",
  "dutch": "Dutch",
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
  "desktop app promo": "You can also download the cozy-desktop client to synchronize your files on your laptop/desktop:",
  "download desktop linux": "Download cozy desktop for Linux",
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
  "map description": "Open Street Map in your Cozy",
  "moi description": "A new experience to visualize your data",
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

require.register("locales/eo", function(exports, require, module) {
module.exports = {
    "home": "Hejmo",
    "apps": "Aplikaĵoj",
    "account": "Konto",
    "email": "Retpoŝtadreso",
    "timezone": "Horzono",
    "domain": "Domajno",
    "no domain set": "no.domain.set",
    "locale": "Lokaĵaro",
    "change password": "Ŝanĝi pasvorton",
    "input your current password": "Entajpu vian aktualan pasvorton:",
    "enter a new password": "Entajpu vian novan pasvorton:",
    "confirm new password": "Konfirmu vian novan pasvorton:",
    "send changes": "Konservi",
    "manage": "Administri",
    "total": "Totalo",
    "memory consumption": "Memoruzado",
    "disk consumption": "Diskuzado",
    "you have no notifications": "<span>Saluton %{name}</span><br>Vi momente havas neniun sciigon.",
    "dismiss all": "Rezigni pri ĉiuj",
    "add application": "Ĉu aldoni aplikaĵon?",
    "install": "Instali",
    "github": "Github",
    "website": "Retejo",
    "your app": "Via aplikaĵo!",
    "community contribution": "Komunuma kontribuo",
    "official application": "Programita de Cozy",
    "application description": "App Description",
    "downloading description": "Elŝutado de la priskribo…",
    "downloading permissions": "Elŝutado de la permesoj…",
    "Cancel": "Nuligi",
    "ok": "Bone",
    "applications permissions": "Permesoj de la aplikaĵo",
    "confirm": "Konfirmi",
    "installing": "Instalado",
    "remove": "Forigi",
    "update": "Ĝisdatigi",
    "config application unmark favorite": "malmarki kiel  preferatan",
    "config application mark favorite": "marki kiel preferatan",
    "started": "startigita",
    "notifications": "Sciigoj",
    "questions and help forum": "Demandoj kaj helpoforumo",
    "sign out": "Elsaluti",
    "open in a new tab": "Malfermi en novan langeton",
    "always on": "ĉiam aktiva",
    "keep always on": "teni ĉiam aktiva",
    "stop this app": "Haltigi tiun ĉi aplikaĵon",
    "update required": "Disponebla ĝisdatigo",
    "navbar faq": "Oftaj demandoj",
    "application is installing": "An app is already installing.\nWait for it to finish, then try again.",
    "no app message": "Vi momente havas neniun instalitan aplikaĵon ĉe via Cozy.\nIru al la <a href=\"#applications\">Cozy-butiko</a> kaj instalu novajn aplikaĵojn!",
    "welcome to app store": "Welcome to your Cozy store, install your own app from here\nor add one from the available list.",
    "installed everything": "Vi jam instalis ĉion!",
    "already similarly named app": "Vi jam havas aplikaĵon kun simila nomo.",
    "your app list": "Aliri viajn aplikaĵojn",
    "customize your cozy": "Tajloru vian paĝoaranĝon",
    "manage your apps": "Aplikaĵoj",
    "choose your apps": "Elektu viajn aplikaĵojn",
    "configure your cozy": "Agordu vian cozy",
    "ask for assistance": "Peti helpon",
    "logout": "Elsaluti",
    "navbar logout": "Elsaluti",
    "welcome to your cozy": "Bonvenon al via Cozy!",
    "you have no apps": "Vi ha havas aplikaĵojn.",
    "app management": "Administrado de aplikaĵoj",
    "app store": "Butiko",
    "configuration": "Agordoj",
    "assistance": "Asistado",
    "hardware consumption": "Aparataro",
    "gigabytes": "GB",
    "megabytes": "MB",
    "terabyte": "MB",
    "G": "GB",
    "M": "MB",
    "T": "MB",
    "disk unit": "GB",
    "memory unit": "MB",
    "status hard drive label": "Enmemorigo",
    "status memory label": "Memoro",
    "manage your applications": "Aplikaĵoj",
    "manage your devices": "Konektitaj aparatoj",
    "synchronized": "sinkronigite",
    "revoke device access": "Senrajtigi aparaton",
    "no application installed": "Neniu aplikaĵo instalita.",
    "your parameters": "Viaj agordoj",
    "alerts and password recovery email": "Via retpoŝtadreso estas uzata por sciigoj aŭ rememorigo de la pasporto.",
    "public name description": "Your username will be displayed when you share files with people or invite them to events.",
    "domain name for urls and email": "The domain name is used to connect to your Cozy from any devices and build sharing URLs.",
    "account timezone field description": "Via horzono helpas adekvate montri vian kalendaron.",
    "save": "Konservi",
    "saved": "Konservite",
    "error": "Eraro",
    "error proper email": "Given email is not correct",
    "error email empty": "Given email is empty",
    "account language field description": "Elektu la lingvon vi volas vidi:",
    "account background selection": "Select your background for your Cozy Home:",
    "account localization": "Localization",
    "account identifiers": "Account",
    "account personalization": "Customization",
    "account password": "Password",
    "account two factors auth": "Two-factor authentication",
    "account 2fa strategy": "Authentication strategy",
    "account 2fa hotp": "HOTP (based on a counter)",
    "account 2fa totp": "TOTP (based on a timer)",
    "enable 2fa": "Enable two-factor authentication",
    "disable 2fa": "Disable two-factor authentication",
    "reset 2fa tokens": "Reset your recovery tokens",
    "account 2fa enabled": "Two-factor authentication has been enabled. Page will now reload.",
    "account 2fa disabled": "Two-factor authentication has been disabled. Page will now reload.",
    "account 2fa error": "There was something wrong while enabling two-factor authentication. Please try again in a few minutes or contact the support.",
    "account 2fa token explanation": "Two-factor authentication is enabled on Cozy. To use it with your favourite app or device, you have to enter the following key when setting up the account:",
    "account 2fa qrcode explanation": "You can also scan the QR code below if your app supports it.",
    "account 2fa rectokens": "Below are your recovery tokens. Make sure to copy them somewhere safe (not on Cozy) so you won't get locked outside of your Cozy.",
    "2fa strategy hotp": "Two-factor authentication is enabled on Cozy with the HOTP strategy (counter-based).",
    "2fa strategy totp": "Two-factor authentication is enabled on Cozy with the TOTP strategy (timer-based).",
    "account 2fa hotp reset explanation": "If you're changing from one authentication app or device to another, you must reset the HOTP counter in order to not get locked outside of your Cozy.",
    "2fa reset hotp": "Reset the HOTP counter",
    "account 2fa reset": "The HOTP counter has been successfully reset.",
    "account 2fa disable explanation": "You can disable the two-factor authentication at any time:",
    "2fa if yubikey": "If you are using a Yubikey to authenticate, use the key below as your Secret Key.",
    "french": "French",
    "english": "English",
    "german": "German",
    "spanish": "Spanish",
    "korean": "Korean",
    "japanese": "Japana lingvo",
    "portuguese": "Portuguese",
    "russian": "Rusa lingvo",
    "change password procedure": "Steps to change your password",
    "current password": "current password",
    "new password": "new password",
    "confirm your new password": "confirm your new password",
    "save your new password": "Save new password",
    "do you want assistance": "Do you need some help?",
    "help email title": "Email",
    "help twitter title": "Twitter",
    "help forum title": "Forum",
    "help IRC title": "IRC",
    "help github title": "GitHub",
    "Visit the project website and learn to build your app:": "Visit the project website:",
    "your own application": "your own app",
    "installed": "installed",
    "updated": "updated",
    "updating": "updating",
    "update all": "Update all",
    "show home logs": "Show Home Logs",
    "show data system logs": "Show Data System Logs",
    "show proxy logs": "Show Proxy Logs",
    "show logs": "Show Logs",
    "update stack": "Update",
    "reboot stack waiting message": "Wait please, rebooting takes several minutes.",
    "update stack waiting message": "Wait please, updating takes several minutes.",
    "status no device": "There is no device connected to your Cozy.",
    "download apk": "Download .APK",
    "mobile app promo": "Backup you photos and synchronize your contacts and calendars with your mobile via the dedicated mobile app:",
    "desktop app promo": "You can also download the cozy-desktop client to synchronize your files on your laptop/desktop:",
    "download desktop linux": "Download cozy desktop for Linux",
    "update stack modal title": "Updating your Cozy",
    "update stack modal content": "You are about to update the platform. Your Cozy will be unavailable a few minutes. Is that OK?",
    "update stack modal confirm": "Update",
    "update stack success": "Your applications are updated, page will refresh.",
    "update stack error": "An error occurred during the update. Your Cozy may become unstable. If you notice any troubles, you should contact your hosting provider. When you will click on the OK button, the current window will be refreshed.",
    "applications broken": "Applications broken",
    "cozy platform": "Platform",
    "navbar back button title": "Back Home",
    "navbar notifications": "Notifications",
    "or:": "or:",
    "reboot stack": "Reboot",
    "update error": "Eraro okazis dum ĝisdatiganta la aplikaĵo",
    "update failed": "Update failed",
    "error update uninstalled app": "Vi ne povas ĝisdatigi app kiu ne estas instalita.",
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
    "help direct title": "Rekta Mesaĝo",
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
    "app status": "Status",
    "settings": "Settings",
    "help": "Help",
    "change layout": "Change the layout",
    "market app install": "Installing...",
    "install your app": "Install an app from its Git Repository",
    "market install your app": "Just copy/paste its Git URL in the field below:",
    "market install your app tutorial": "To know more about how to build your own app, feel free to read our",
    "market app tutorial": "tutorial",
    "help send message title": "Write directly to the Cozy Team",
    "help send message action": "Sendu",
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
    "map description": "Open Street Map in your Cozy",
    "moi description": "A new experience to visualize your data",
    "warning unofficial app": "This app is a community app and isn't maintained by the Cozy team.\nTo report a bug, please file an issue in <a href='https://forum.cozy.io'>our forum</a>.",
    "update available notification": "A new version of %{appName} is available.",
    "stack update available notification": "A new version of the platform is available.",
    "app broken title": "Broken application",
    "app broken": "This application is broken. Can you try to install it again:",
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
    "you have no album": "<p>You've haven't got any photo album<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:-(</p><p>Create one from the <a href='/#applications' target='_blank'>the Photo app</a><br>and use photos taken from your smartphone with the <a href='https://play.google.com/store/apps/details?id=io.cozy.files_client&hl=en' target='_blank'>mobile app!</a><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:-)</p>",
    "state app installing": "This app is being installed. Wait a little",
    "state app stopped error": "This app cannot start",
    "stack updating block message": "Your Cozy is currently updating, you cannot use it until the update is finished.",
    "update apps error title": "Eraro okazis dum ĝisdatiganta aplikaĵoj",
    "update apps error": "One or several applications failed. Concerned applications are marked as broken. You will probably have to uninstall and reinstall these applications.",
    "update apps error list title": "Rompita aplikoj",
    "update stack error title": "Eraro okazis dum ĝisdatiganta via Cozy",
    "update stack permission changes": "Applications listed below were not updated due to permission changes. Please, update them individually to choose whether or not you accept the new permissions.",
    "update stack warning": "Averto",
    "reboot stack error": "An error occurred while rebooting your Cozy. The Cozy may become unstable. Contact your hosting provider if your Cozy doesn't work anymore."
};
});

require.register("locales/es", function(exports, require, module) {
module.exports = {
    "home": "Inicio",
    "apps": "Aplicaciones",
    "account": "Cuenta",
    "email": "Correo electrónico",
    "timezone": "Huso horario",
    "domain": "Nombre del dominio",
    "no domain set": "no.hay.dominio.definido",
    "locale": "Idioma",
    "change password": "Cambiar la contraseña",
    "input your current password": "Esribir su contraseña actual",
    "enter a new password": "Usar este campo para crear una nueva contraseña",
    "confirm new password": "Confirmar la nueva contraseña",
    "send changes": "Guardar",
    "manage": "Administración",
    "total": "Total",
    "memory consumption": "Utilización de la memoria",
    "disk consumption": "Utilización del disco",
    "you have no notifications": "<span>Hola %{name}</span><br>Actualmente no tiene ninguna notificación.",
    "dismiss all": "Borrrar todo",
    "add application": "¿Añadir una aplicación?",
    "install": "Instalar",
    "github": "Github",
    "website": "Página web",
    "your app": "¡Su aplicación!",
    "community contribution": "Desarrollador independiente",
    "official application": "Desarrollada por Cozy",
    "application description": "Descripción de la aplicación",
    "downloading description": "Descargar la descripción",
    "downloading permissions": "Descargar los permisos...",
    "Cancel": "Anular",
    "ok": "Ok",
    "applications permissions": "Permisos para la aplicación",
    "confirm": "Confirmar",
    "installing": "Se está instalando",
    "remove": "Suprimir",
    "update": "Actualizar",
    "config application unmark favorite": "desmarcar como favorita",
    "config application mark favorite": "marcar como favorita",
    "started": "activada",
    "notifications": "Notificaciones",
    "questions and help forum": "Foro de ayuda",
    "sign out": "Salir",
    "open in a new tab": "Abrir en una nueva pestaña",
    "always on": "Siempre se está ejecutando",
    "keep always on": "mantener siempre ejecutándose",
    "stop this app": "Parar esta aplicación",
    "update required": "Actualización disponible",
    "navbar faq": "Preguntas más frecuentes",
    "application is installing": "Se está instalando una aplicación.\nEspere que esté instalada antes de lanzar una nueva.",
    "no app message": "¡ Usted no ha instalado ninguna aplicación en su Cozy.\nVaya a <a href=\"#applications\">Apliteca</a> para instalar al menos una !",
    "welcome to app store": "Bienvenido(a) a Apliteca, usted puede instalar su propia aplicación desde aquí\no añadir una que esté en la lista.",
    "installed everything": "¡Usted ya ha instalado todo!",
    "already similarly named app": "Una aplicación con nombre similar ya ha sido instalada.",
    "your app list": "Acceder a sus aplicaciones",
    "customize your cozy": "Personalizar la presentación",
    "manage your apps": "Administrar sus aplicaciones",
    "choose your apps": "Escoger sus aplicaciones",
    "configure your cozy": "Configurar su Cozy",
    "ask for assistance": "Pedir ayuda",
    "logout": "Desconexión",
    "navbar logout": "Salir",
    "welcome to your cozy": "Bienvenido(a) a su Cozy",
    "you have no apps": "Usted no ha instalado niguna aplicación.",
    "app management": "Gestión de las aplicaciones",
    "app store": "Apliteca",
    "configuration": "Configuración",
    "assistance": "Ayuda",
    "hardware consumption": "Material",
    "gigabytes": "Go",
    "megabytes": "Mo",
    "terabyte": "Mo",
    "G": "Go",
    "M": "Mo",
    "T": "Mo",
    "disk unit": "Go",
    "memory unit": "Mo",
    "status hard drive label": "Almacenamiento",
    "status memory label": "Memoria",
    "manage your applications": "Administrar sus aplicaciones",
    "manage your devices": "Periféricos conectados",
    "synchronized": "sincronizado",
    "revoke device access": "Revocar el acceso al periférico",
    "no application installed": "No hay aplicaciones instaladas.",
    "your parameters": "Ajustes",
    "alerts and password recovery email": "Su email se utilizará para las notificaciones o para recuperar la contraseña.",
    "public name description": "Su nombre de usuario será visualizado cuando  comparta archivos con personas o cuando las invite a eventos.",
    "domain name for urls and email": "El nombre de dominio se usa para conectarse a su Cozy desde cualquier periférico y lograr compartir URLs.",
    "account timezone field description": "La zona horaria ayuda a visualizar correctamente su agenda.",
    "save": "Guardar",
    "saved": "Guardado",
    "error": "Error",
    "error proper email": "El email que usted señala no es el correcto",
    "error email empty": "La casilla email está vacía",
    "account language field description": "Escoger el idioma que usted quiere utlizar:",
    "account background selection": "Seleccionar el fondo de pantalla de su página Inicio:",
    "account localization": "Regionalización",
    "account identifiers": "Cuenta",
    "account personalization": "Personalización",
    "account password": "Contraseña",
    "account two factors auth": "Autenticación de dos factores",
    "account 2fa strategy": "Estrategia de autenticación",
    "account 2fa hotp": "HOTP (basada en un contador)",
    "account 2fa totp": "TOTP (basada en un temporizador)",
    "enable 2fa": "Activar autenticación de dos factores",
    "disable 2fa": "Desactivar autenticación de dos factores",
    "reset 2fa tokens": "Reiniciar sus tokens recuperados",
    "account 2fa enabled": "La autenticación de dos factores ha sido activada. La página va a recargarse.",
    "account 2fa disabled": "La autenticación de dos factores ha sido desactivada. La página va a recargarse.",
    "account 2fa error": "Hay algo que no funciona al activar la autenticación de dos factores. Por favor, ensaye de nuevo en algunos minutos o contacte la asistencia técnica.",
    "account 2fa token explanation": "La autenticación de dos factores está activada en Cozy. Para utilizarla con sus aplicaciones favoritas o con su periférico, debe ingresar la siguiente clave al configurar la cuenta.",
    "account 2fa qrcode explanation": "usted también puede numerizar el código QR si su aplicación lo acepta.",
    "account 2fa rectokens": "Más abajo se encuentran sus tokens recuperados. Asegúrese de hacer una copia segura de ellos (no en Cozy), así garantizará que siempre podrá entrar en Cozy.",
    "2fa strategy hotp": "La autenticación de dos factores está activada en Cozy con la estrategia HOTP (basada  en un contador).",
    "2fa strategy totp": "La autenticación de dos factores está activada en Cozy con la estrategia TOTP (basada  en un temporizador).",
    "account 2fa hotp reset explanation": "Si usted quiere cambiar de una aplicación o periférico de autenticación a otro, debe reiniciar el contador para no salirse de su Cozy.",
    "2fa reset hotp": "Reiniciar el contador HOTP",
    "account 2fa reset": "El contador HOTP ha ido reiniciado exitosamente.",
    "account 2fa disable explanation": "Usted puede desactivar la autenticación de dos factores cuando lo desee:",
    "2fa if yubikey": "Si usted está utilizando para autenticar una Yubikey, use la clave que se muestra abajo como su clave secreta. ",
    "french": "Francés",
    "english": "Inglés",
    "german": "Alemán",
    "spanish": "Español",
    "korean": "Coreano",
    "japanese": "Japonés",
    "portuguese": "Portugués",
    "russian": "Ruso",
    "change password procedure": "Pasos a seguir para cambiar la contraseña",
    "current password": "contraseña actual",
    "new password": "nueva contraseña",
    "confirm your new password": "confirme su nueva contraseña",
    "save your new password": "Guardar la nueva contraseña",
    "do you want assistance": "¿Quiere ayuda?",
    "help email title": "Email",
    "help twitter title": "Twitter",
    "help forum title": "Foro",
    "help IRC title": "IRC",
    "help github title": "Github",
    "Visit the project website and learn to build your app:": "Visite el sitio web del Proyecto y aprenda a crear aplicaciones:",
    "your own application": "su propia aplicación",
    "installed": "instalada",
    "updated": "actualizada",
    "updating": "actualización en curso",
    "update all": "Actualizar todo",
    "show home logs": "Mostrar Logs de Inicio",
    "show data system logs": "Mostrar Logs del Data System",
    "show proxy logs": "Motrar Logs del Proxy",
    "show logs": "Mostrar Logs",
    "update stack": "Actualizar",
    "reboot stack waiting message": "Por favor, tenga paciencia, el reinicio puede tomar algunos minutos.",
    "update stack waiting message": "Por favor, tenga paciencia, la actualización puede tomar algunos minutos.",
    "status no device": "No hay ningún periférico conectado a su Cozy.",
    "download apk": "Descargar APK",
    "mobile app promo": "Haga una copia de seguridad de sus fotos y sincronice sus contactos con su celular por medio de la aplicación :",
    "desktop app promo": "Usted puede descargar el cliente del escritorio de cozy para sincronizar sus archivos con su ordenador portatil o su computador de escritorio:",
    "download desktop linux": "Descargue el escritorio Cozy para Linux",
    "update stack modal title": "Actualización de su Cozy",
    "update stack modal content": "Usted está a punto de actualizar la plataforma. Su Cozy estará indisponible algunos instantes. ¿Está usted seguro(a)?",
    "update stack modal confirm": "Actualizar",
    "update stack success": "Sus aplicaciones están actualizadas, la página se va a recargar.",
    "update stack error": "Ha ocurrido un error durante la actualización. Su Cozy puede desestabilizarse. Si usted constata algún problema, debe contactar su proveedor de alojamiento. Cuando haga clic en el botón OK,  la ventana corriente se actualizará.",
    "applications broken": "Aplicaciones averiadas",
    "cozy platform": "Plataforma",
    "navbar back button title": "Volver a Inicio",
    "navbar notifications": "Notificaciones",
    "or:": "o:",
    "reboot stack": "Reiniciar",
    "update error": "Ha ocurrido un error al actualizar su aplicación",
    "update failed": "Falló la actualización",
    "error update uninstalled app": "Usted no puede actualizar una aplicación que no está instalada.",
    "notification open application": "Abrir la aplicación",
    "notification update stack": "Actualizar la plataforma",
    "notification update application": "Actualizar ahora:",
    "broken": "averiada",
    "start this app": "iniciar esta aplicación",
    "stopped": "interrumpida",
    "retry to install": "trate de instalarla de nuevo",
    "cozy account title": "Cozy - Cuenta",
    "cozy app store title": "Cozy - Apliteca",
    "cozy home title": "Cozy - Inicio",
    "cozy applications title": "Cozy - Configuración de Aplicaciones",
    "running": "se está ejecutando",
    "cozy help title": "Cozy - Ayuda",
    "help support title": "Ayuda oficial",
    "help community title": "Ayuda comunitaria",
    "help direct title": "Mensaje directo",
    "help documentation title": "Documentación",
    "changing locale requires reload": "El cambio de idioma requiere recargar la página.",
    "cancel": "anular",
    "abort": "interrumpir",
    "Once updated, this application will require the following permissions:": "Una vez actualizada la aplicación requerirá los siguientes permisos:",
    "confirm update": "confirmar la actualización",
    "confirm install": "confirmar la instalación",
    "no specific permissions needed": "Esta aplicacion no requiere permiso alguno",
    "removed": "suprimida",
    "removing": "en curso de supresión",
    "required permissions": "Permisos requeridos",
    "finish layout edition": "Guardar",
    "reset customization": "Reiniciar",
    "use icon": "Modo ícono",
    "home section favorites": "Favoritos",
    "home section leave": "Importar",
    "home section main": "Aplicaciones principales",
    "home section productivity": "Aplicaciones de productividad",
    "home section data management": "Aplicaciones de datos",
    "home section personal watch": "Observar",
    "home section misc": "Aplicaciones diversas",
    "home section platform": "Plataforma",
    "app status": "Estatus",
    "settings": "Ajustes",
    "help": "Ayuda",
    "change layout": "Modificar la disposición",
    "market app install": "Se está instalando...",
    "install your app": "Instalar una aplicación desde su Repositorio Git",
    "market install your app": "Copie/pegue su Git URL en el campo siguiente:",
    "market install your app tutorial": "Para saber más sobre la manera como construir su propia aplicación, no dude en leer nuestra ",
    "market app tutorial": "guía",
    "help send message title": "Escribir directamente al equipo de Cozy",
    "help send message action": "Enviar",
    "help send logs": "Enviar registros del servidor para facilitar la depuración",
    "send message success": "¡Mensaje enviado con éxito!",
    "send message error": "Ha ocurrido un error al enviar su mensaje de solicitud de ayuda. Trate de enviarlo por medio de un email desde su cliente a support@cozycloud.cc",
    "account change password success": "El cambio de contraseña se ha hecho de manera exitosa.",
    "account change password short": "La nueva contraseña es muy corta.",
    "account change password difference": "La confirmación de la contraseña no corresponde a la nueva contraseña.",
    "account change password error": "Al cambiar su contraseña aparece un error. Asegurese que su contraseña anterior es la correcta.",
    "account background add": "Añadir fondo de pantalla",
    "introduction market": "Bienvenido(a) a la tienda de aplicaciones Cozy.\nDesde aquí usted puede instalar una aplicación de su propia creación o escoger entre\nlas que propone Cozycloud u otros desarrolladores.",
    "error connectivity issue": "Un error se produjo durante la recuperación de los datos. <br/>Por favor, vuelva a ensayar más tarde.",
    "package.json not found": "Imposible recuperar el archivo package.json. Verifique la url de su depósito git.",
    "unknown provider": "Por ahora, las aplicaciones sólo pueden instalarse desde Github o CozyCloud Market",
    "please wait data retrieval": "Por favor, espere que los datos se carguen...",
    "revoke device confirmation message": "Esta acción impedirá que el periférico asociado acceda a su Cozy. ¿Está usted seguro(a)?",
    "dashboard": "Tablero de Control",
    "calendars description": "Administre su agenda y sincronícela con su teléfono.",
    "contacts description": "Gestione sus contactos y sincronícelos con su teléfono.",
    "emails description": "Lea, envíe y guarde sus mensajes.",
    "files description": "Su sistema de archivos en línea sincronizados con sus periféricos.",
    "photos description": "Organice sus fotos y compártalas con sus amigos.",
    "sync description": "La herramienta necesaria para sincronizar sus contactos y su agenda con su teléfono.",
    "quickmarks description": "Guarde y administre sus enlaces favoritos.",
    "cozic description": "Un lector audio para escuchar su música en el navegador.",
    "databrowser description": "Visualice y navegue entre todos sus datos (formato en bruto).",
    "zero-feeds description": "Añada sus canales RSS y guarde sus enlaces favoritos",
    "kyou description": "Mejore su salud y su humor cuantificándose usted mismo.",
    "konnectors description": "Importe datos desde servicios externos (Twitter, Jawbone...).",
    "kresus description": "Herramientas adicionales para la gestión de sus finanzas personales.",
    "nirc description": "Acceda a su canal IRC preferido desde su Cozy.",
    "shout description": "Acceda a su canal IRC favorito desde su Cozy por medio de la aplicación Shout Web",
    "notes description": "Escriba y organice notas inteligentes.",
    "owm description": "Informese del estado del tiempo en cualquier parte del mundo.",
    "remote storage description": "Una aplicacion de Almacenamiento Remoto para guardar datos de sus aplicaciones que no están en el servidor.",
    "tasky description": "Un gestor de tareas, basado en etiquetas, rápido y simple.",
    "todos description": "Escriba y ordene sus tareas de manera eficaz.",
    "term description": "Un terminal para su Cozy.",
    "ghost description": "Comparta sus historias con el mundo entero con la plataforma de blog Ghost.",
    "leave google description": "Aplicación para importar los datos actuales de su cuenta Google.",
    "mstsc.js description": "Administre a distancia su Escritorio Windows por medio del protocolo RDP.",
    "hastebin description": "Un simple pastebin, herramienta para facilitar compartir textos.",
    "polybios description": "Administrar sus claves PGP desde su navegador.",
    "frost description": "Construya su memoria internet archivando sus páginas web en su Cozy.",
    "tiddlywiki description": "Un bloc de notas personal no-lineal",
    "hari description": "Diario personal cifrado.",
    "map description": "Open Street Map en su Cozy",
    "moi description": "Una nueva vivencia al visualizar sus datos",
    "warning unofficial app": "Esta aplicación es una aplicación comunitaria y no la mantiene el equipo Cozy.\nPara señalar un problema, le rogamos llevarlo a <a href='https://forum.cozy.io'>nuestro foro</a>.",
    "update available notification": "Una nueva versión de %{appName} está disponible.",
    "stack update available notification": "Una nueva versión de la Plataforma está disponible.",
    "app broken title": "Aplicación deteriorada",
    "app broken": "Esta aplicación está averiada. Trade de instalarla de nuevo:",
    "reinstall broken app": "reinstalarla.",
    "error git": "No podemos recuperar el código fuente.",
    "error github repo": "El depósito de aplicaciones no parece válido.",
    "error github": "Github parece que no está disponible. Usted puede verificar su estatus en https://status.github.com/.",
    "error npm": "No podemos instalar las dependencias de la aplicación.",
    "error user linux": "No podemos crear un usuario Linux específico para esta aplicación.",
    "error start": "La aplicación no se puede activar. Ustad puede encontrar más detalles en el log de la aplicación.",
    "app msg": "Si el error persiste, contáctenos en contact@cozycloud.cc o en IRC #cozycloud en irc.freenode.net.",
    "more details": "Más detalles.",
    "noapps": {
        "customize your cozy": "Puede igualmente <a href=\"%{account}\">ir a configuración </a> para personalizar su Cozy,\no <a href=\"%{appstore}\"> a la Apliteca</a> para instalar su primera aplicación."
    },
    "pick from files": "Seleccionar una foto",
    "Crop the photo": "Recortar la imagen",
    "chooseAgain": "Escoger otra foto",
    "modal ok": "OK",
    "modal cancel": "Anular",
    "no image": "No hay ninguna imagen en su Cozy",
    "ObjPicker upload btn": "Cargar un archivo local",
    "or": "o",
    "drop a file": "Arrastrar & soltar un archivo o",
    "url of an image": "Pegar la URL de una imagen desde el web",
    "you have no album": "<p>No se ha creado ningún album de fotos<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:-(</p><p>Crear uno a partir de<a href='/#applications' target='_blank'>la aplicación Photo</a><br>y utilice las fotos tomadas con su smartphone y la<a href='https://play.google.com/store/apps/details?id=io.cozy.files_client&hl=en' target='_blank'>aplicación Mobile!</a><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:-)</p>",
    "state app installing": "Esta aplicación se está instalando. Espere un poco",
    "state app stopped error": "Esta aplicación no puede activarse",
    "stack updating block message": "Su Cozy se está actualizando actualmente, no se ouede utilizar hasta que la actualización termine.",
    "update apps error title": "Ha ocurrido un error al actualizar la aplicación",
    "update apps error": "Una o varias aplicaciones han fallado. Las aplicaciones afectadas aparece marcadas como estropeadas. Quizas usted tiene que desinstalar y volver a instalar la aplicación.",
    "update apps error list title": "Aplicaciones estropeadas",
    "update stack error title": "Ha ocurrido un error al actualizar su Cozy",
    "update stack permission changes": "Las aplicaciones siguientes no se han actualizado debido al cambio de permisos. Por favor, actualícelas una por una para escoger si usted acepta o no los nuevos permisos.",
    "update stack warning": "Alerta",
    "reboot stack error": "Ha ocurrido un error al reiniciar su Cozy. Cozy puede llegar a desestabilizarse. Contactar a su proveedor de alojamiento si su Cozy deja de trabajar."
};
});

require.register("locales/fr", function(exports, require, module) {
module.exports = {
    "home": "Bureau",
    "apps": "Applications",
    "account": "Réglages",
    "email": "Email",
    "timezone": "Fuseau horaire",
    "domain": "Nom de domaine",
    "no domain set": "pas.de.domaine.défini",
    "locale": "Langue",
    "change password": "Changer de mot de passe",
    "input your current password": "Par sécurité, veuillez saisir votre mot de passe actuel :",
    "enter a new password": "Votre nouveau mot de passe :",
    "confirm new password": "Confirmer le nouveau mot de passe",
    "send changes": "Enregistrer",
    "manage": "Gestion",
    "total": "Total",
    "memory consumption": "Utilisation mémoire",
    "disk consumption": "Utilisation disque",
    "you have no notifications": "<span>Bonjour %{name}</span><br>Vous n'avez pour l'instant aucune notification.",
    "dismiss all": "Tout effacer",
    "add application": "Ajouter l'application ?",
    "install": "Installer",
    "github": "Github",
    "website": "Site web",
    "your app": "Votre application !",
    "community contribution": "Développeur indépendant",
    "official application": "Développée par Cozy",
    "application description": "Description de l'application",
    "downloading description": "Téléchargement de la description…",
    "downloading permissions": "Téléchargement des permissions…",
    "Cancel": "Annuler",
    "ok": "Ok",
    "applications permissions": "Permissions de l'application",
    "confirm": "Confirmer",
    "installing": "Installation en cours",
    "remove": "Enlever",
    "update": "Mettre à jour",
    "config application unmark favorite": "Supprimer des favoris",
    "config application mark favorite": "Marquer en favori",
    "started": "démarrée",
    "notifications": "Notifications",
    "questions and help forum": "Forum d'aide",
    "sign out": "Sortir",
    "open in a new tab": "Ouvrir dans un onglet",
    "always on": "toujours démarrée",
    "keep always on": "garder toujours démarrée",
    "stop this app": "Arrêter cette application",
    "update required": "Mise à jour disponible",
    "navbar faq": "Foire Aux Questions",
    "application is installing": "Une application est en cours d'installation.\nAttendez la fin de celle-ci avant d'en lancer une nouvelle.",
    "no app message": "Vous n'avez aucune application installée. Allez sur\nl'<a href=\"#applications\">app store</a> pour en installer au moins une !",
    "welcome to app store": "Bienvenue sur l'app store, vous pouvez installer votre propre application\nou ajouter une application existante dans la liste",
    "installed everything": "Vous avez déjà tout installé !",
    "already similarly named app": "Une application qui porte un nom similaire est déjà installée.",
    "your app list": "Accédez à vos apps",
    "customize your cozy": "Personnalisez la mise en page",
    "manage your apps": "Gérez vos apps",
    "choose your apps": "Choisissez vos apps",
    "configure your cozy": "Configurez votre cozy",
    "ask for assistance": "Demandez de l'aide",
    "logout": "déconnexion",
    "navbar logout": "Déconnexion",
    "welcome to your cozy": "Bienvenue sur votre Cozy !",
    "you have no apps": "Vous n'avez aucune application installée.",
    "app management": "Gestion des applications",
    "app store": "Store",
    "configuration": "Configuration",
    "assistance": "Aide",
    "hardware consumption": "Matériel",
    "gigabytes": "Go",
    "megabytes": "Mo",
    "terabyte": "Mo",
    "G": "Go",
    "M": "Mo",
    "T": "Mo",
    "disk unit": "Go",
    "memory unit": "Mo",
    "status hard drive label": "Stockage",
    "status memory label": "Mémoire",
    "manage your applications": "Applications",
    "manage your devices": "Appareils connectés",
    "synchronized": "synchronisé",
    "revoke device access": "Révoquer l'appareil",
    "no application installed": "Il n'y a pas d'applications installées.",
    "your parameters": "Vos paramètres",
    "alerts and password recovery email": "Votre adresse électronique est utilisée pour les notifications ou la récupération du mot de passe perdu.",
    "public name description": "Votre nom d'utilisateur est affiché lorsque vous partagez des fichiers avec des gens ou les invitez à des événements.",
    "domain name for urls and email": "Le nom de domaine est utilisé pour vous connecter à votre Cozy depuis n'importe quel appareil et pour construire des URLs de partage.",
    "account timezone field description": "Renseigner votre fuseau horaire permet d'afficher correctement votre calendrier",
    "save": "Sauver",
    "saved": "Sauvé",
    "error": "Erreur",
    "error proper email": "L'adresse mail fournie n'est pas correcte",
    "error email empty": "L'adresse email ne doit pas être vide",
    "account language field description": "Choisissez la langue que vous souhaitez utiliser sur votre Cozy :",
    "account background selection": "Choisissez votre fond d'écran pour votre bureau Cozy :",
    "account localization": "Régionalisation",
    "account identifiers": "Compte",
    "account personalization": "Personnalisation",
    "account password": "Mot de passe",
    "account two factors auth": "Authentification à double facteur",
    "account 2fa strategy": "Méthode d'authentification",
    "account 2fa hotp": "HOTP (basé sur un compteur)",
    "account 2fa totp": "TOTP (basé sur le temps)",
    "enable 2fa": "Activer l'authentification à double facteur",
    "disable 2fa": "Désactiver l'authentification à double facteur",
    "reset 2fa tokens": "Générer de nouvelles clés de récupération",
    "account 2fa enabled": "L'authentification à double facteur a été activée. La page va maintenant se rafraichir.",
    "account 2fa disabled": "L'authentification à double facteur a été désactivée. La page va maintenant se rafraichir.",
    "account 2fa error": "Une erreur s'est produite pendant l'activation de l'authentification à double facteur. Merci de réessayer dans quelques minutes ou de contacter le support.",
    "account 2fa token explanation": "L'authentification à double facteur est activée sur ce Cozy. Pour l'utiliser avec votre application ou périphérique, vous devez entrer la clé suivante dans ce dernier :",
    "account 2fa qrcode explanation": "Vous pouvez également scanner le QR code ci-dessous si votre application le supporte.",
    "account 2fa rectokens": "Voici vos clés de récupération. Assurez-vous de les copier dans un endroit sûr (pas dans votre Cozy) afin de ne pas rester bloqué hors de votre Cozy.",
    "2fa strategy hotp": "L'authentification à double facteur utilisant la stratégie HOTP (basée sur un compteur) a été activée.",
    "2fa strategy totp": "L'authentification à double facteur utilisant la stratégie TOTP (basée sur le temps) a été activée.",
    "account 2fa hotp reset explanation": "Si vous changez d'application ou périphérique d'authentification, vous devez réinitialiser le compteur HOTP afin de ne pas vous retrouver bloqué en dehors de votre Cozy.",
    "2fa reset hotp": "Réinitialiser le compteur HOTP",
    "account 2fa reset": "Le compteur HOTP a été réinitialisé avec succès.",
    "account 2fa disable explanation": "Vous pouvez désactiver l'authentification à double facteur n'importe quand :",
    "2fa if yubikey": "Si vous utilisez une Yubikey pour vous authentifier, utiliser la clé ci-dessous comme clé secrète.",
    "french": "Français",
    "english": "Anglais",
    "german": "Allemand",
    "spanish": "Espagnol",
    "korean": "Coréen",
    "japanese": "Japonais",
    "portuguese": "Portugais",
    "russian": "Russe",
    "change password procedure": "Procédure de changement de mot de passe",
    "current password": "Mot de passe actuel",
    "new password": "Nouveau mot de passe",
    "confirm your new password": "Confirmez votre nouveau mot de passe :",
    "save your new password": "Enregistrer le nouveau mot de passe",
    "do you want assistance": "Est-ce que vous cherchez de l'aide ?",
    "help email title": "Email",
    "help twitter title": "Twitter",
    "help forum title": "Forum",
    "help IRC title": "IRC",
    "help github title": "Github",
    "Visit the project website and learn to build your app:": "Visitez le site du projet et trouvez les guides pour synchroniser vos périphériques.",
    "your own application": "votre propre application",
    "installed": "installée",
    "updated": "mis à jour réussie",
    "updating": "m.à.j en cours",
    "update all": "Mettre à jour votre Cozy et ses apps",
    "show home logs": "Voir les logs de la Home",
    "show data system logs": "Voir les logs du Data System",
    "show proxy logs": "Voir les logs du Proxy",
    "show logs": "Voir les logs",
    "update stack": "Mettre à jour la plateforme",
    "reboot stack waiting message": "Veuillez patienter, le redémarrage peut prendre quelques minutes.",
    "update stack waiting message": "Veuillez patienter, la mise à jour peut prendre quelques minutes.",
    "status no device": "Aucun appareil n'est connecté à votre Cozy.",
    "download apk": "Télécharger le .APK",
    "mobile app promo": "Sauvegardez vos photos et synchronisez vos contacts et calendriers avec notre application mobile :",
    "desktop app promo": "Vous pouvez télécharger le client cozy-desktop pour synchroniser vos fichiers sur votre ordinateur:",
    "download desktop linux": "Télécharger cozy-desktop pour Linux",
    "update stack modal title": "Mise à jour de votre Cozy",
    "update stack modal content": "Vous êtes sur le point de mettre à jour la plateforme. Votre Cozy sera indisponible quelques instants. Voulez-vous vraiment continuer ?",
    "update stack modal confirm": "Mettre à jour",
    "update stack success": "Vos applications ont bien été mises à jour, la page va se rafraîchir.",
    "update stack error": "Une erreur est survenue durant la mise à jour. Votre serveur pourrait devenir instable. Si vous constatez le moindre soucis, vous devriez contacter votre hébergeur. Après avoir cliqué sur « OK », cette fenêtre va se rafraîchir.",
    "applications broken": "Applications cassées",
    "cozy platform": "Plateforme",
    "navbar back button title": "Retour bureau",
    "navbar notifications": "Notifications",
    "or:": "ou :",
    "reboot stack": "Redémarrer",
    "update error": "Une erreur est survenue pendant la mise à jour de l'application",
    "update failed": "Échec",
    "error update uninstalled app": "Vous ne pouvez pas mettre à jour une application non installée.",
    "notification open application": "Ouvrir l'application",
    "notification update stack": "Mettre à jour la plateforme",
    "notification update application": "Mettre à jour",
    "broken": "cassée",
    "start this app": "Démarrer cette application",
    "stopped": "stoppée",
    "retry to install": "Nouvel essai d'installation",
    "cozy account title": "Cozy - Paramètres",
    "cozy app store title": "Cozy - Store",
    "cozy home title": "Cozy - Bureau",
    "cozy applications title": "Cozy - États",
    "running": "démarrée",
    "cozy help title": "Cozy - Aide",
    "help support title": "Support officiel",
    "help community title": "Support via la communauté",
    "help direct title": "Écrivez-nous directement",
    "help documentation title": "Documentation",
    "changing locale requires reload": "Le changement de langue nécessite le rechargement de la page.",
    "cancel": "annuler",
    "abort": "interrompre",
    "Once updated, this application will require the following permissions:": "Une fois mise à jour l'application demandera les permissions suivantes :",
    "confirm update": "confirmez la mise à jour",
    "confirm install": "confirmez l'installation'",
    "no specific permissions needed": "Cette application n'a pas besoin d'informations spécifiques.",
    "removed": "supprimée",
    "removing": "en cours de suppression",
    "required permissions": "Permissions requises",
    "finish layout edition": "Enregistrer",
    "reset customization": "Remise à zéro",
    "use icon": "Mode icône",
    "home section favorites": "Applications favorites",
    "home section leave": "Service d'import",
    "home section main": "Chaque jour",
    "home section productivity": "Applications de productivité",
    "home section data management": "Applications de données",
    "home section personal watch": "Applications de veille",
    "home section misc": "Divers",
    "home section platform": "Plateforme",
    "app status": "Mes Apps",
    "settings": "Paramètres",
    "help": "Aide",
    "change layout": "Modifier la disposition",
    "market app install": "Installation…",
    "install your app": "Installer une application depuis son dépôt Git",
    "market install your app": "Copiez/collez juste son URL Git dans le champ ci-dessous :",
    "market install your app tutorial": "Pour savoir comment créer votre propre application, suivez notre",
    "market app tutorial": "didacticiel",
    "help send message title": "Écrire directement à l'équipe Cozy",
    "help send message action": "Envoyer",
    "help send logs": "Joindre les logs des applications pour faciliter la résolution des problèmes",
    "send message success": "Message envoyé avec succès !",
    "send message error": "Une erreur est survenue lors de l'envoi du message. Essayez d'envoyer ce message à directement avec un client mail en écrivant à support@cozycloud.cc.",
    "account change password success": "Le mot de passe a été changé avec succès.",
    "account change password short": "Le mot de passe est trop court.",
    "account change password difference": "La confirmation de votre nouveau mot de passe est différente du nouveau mot de passe.",
    "account change password error": "Une erreur s'est produite lors du changement de votre mot de passe. Assurez vous que le mot de passe précédent est correct.",
    "account background add": "Ajouter un fond d'écran",
    "introduction market": "Bienvenue sur le marché d'applications Cozy. Vous pouvez ajouter des applications proposées par Cozy Cloud, d'autres développeurs ou même votre propre application !",
    "error connectivity issue": "Une erreur s'est produite lors de la récupération des données.<br />Merci de réessayer ultérieurement.",
    "package.json not found": "Impossible de récupérer le fichier package.json. Vérifiez l'url de votre dépôt git.",
    "unknown provider": "Pour l'instant, il n'est possible d'installer une application que depuis Github ou le marché d'applications Cozy",
    "please wait data retrieval": "Merci de bien vouloir patienter pendant la récupération des données…",
    "revoke device confirmation message": "Cette action empêchera l'appareil associé d'accéder à votre Cozy. Voulez-vous vraiment continuer ?",
    "dashboard": "Tableau de bord",
    "calendars description": "Gérez vos événements et synchronisez les avec votre mobile.",
    "contacts description": "Gérez vos contacts et synchronisez les avec votre mobile.",
    "emails description": "Lisez, envoyez et sauvegardez vos emails.",
    "files description": "Gérez vos fichiers en ligne et synchronisez les avec votre mobile.",
    "photos description": "Créez un album photo depuis vos fichiers et partagez le.",
    "sync description": "Cette application est nécessaire pour synchroniser vos contacts et vos événements.",
    "quickmarks description": "Sauvegardez et gérez vos liens favoris.",
    "cozic description": "Un lecteur audio pour votre musique dans votre navigateur.",
    "databrowser description": "Naviguez dans vos données dans un format brut.",
    "zero-feeds description": "Agrégez vos flux RSS et sauvegardez vos liens dans vos favoris.",
    "kyou description": "Améliorez  votre humeur et votre santé en vous quantifiant.",
    "konnectors description": "Importation de données depuis des services externes (Twitter, Jawbone…).",
    "kresus description": "Des outils supplémentaires pour gérer vos comptes.",
    "nirc description": "Accédez à votre canal IRC préféré depuis votre Cozy.",
    "shout description": "Accédez à votre canal IRC préféré depuis votre Cozy avec l'application Shout",
    "notes description": "Écrivez et organisez des notes intelligentes.",
    "owm description": "Soyez au courant du temps qu'il fait partout dans le monde !",
    "remote storage description": "Un module Remote Storage pour vos applications Unhosted.",
    "tasky description": "Un gestionnaire de tâches, basé sur les tags, rapide et simple.",
    "todos description": "Écrivez et ordonnez vos tâches efficacement.",
    "term description": "Un terminal pour votre Cozy.",
    "ghost description": "Partagez vos histoires avec le monde entier avec la plateforme de blog Ghost.",
    "leave google description": "Une application pour importer vos données de votre compte Google.",
    "mstsc.js description": "Depuis votre Cozy, prenez contrôle de votre bureau Windows à distance à travers le protocole RDP.",
    "hastebin description": "Un simple pastebin, un outil pour partager facilement vos textes.",
    "polybios description": "Gérez vos clés PGP depuis votre navigateur.",
    "frost description": "Construisez votre archive d'Internet en sauvegardant des pages web dans votre Cozy.",
    "tiddlywiki description": "Un carnet de note personnel non-linéaire.",
    "hari description": "Journal chiffré virtuel.",
    "map description": "Open Street Map dans votre Cozy",
    "moi description": "Une nouvelle expérience pour visualiser ses données",
    "warning unofficial app": "Cette application est une application communautaire et n'est pas maintenue par l'équipe Cozy.\nPour signaler un problème, merci de le rapporter sur <a href='https://forum.cozy.io'>notre forum</a>.",
    "update available notification": "Une nouvelle version de %{appName} est disponible.",
    "stack update available notification": "Une nouvelle version de la plateforme est disponible.",
    "app broken title": "Application cassée",
    "app broken": "Cette application est cassée. Veuillez essayer de la réinstaller :",
    "reinstall broken app": "réinstallation.",
    "error git": "Impossible de retrouver le code source.",
    "error github repo": "Le dépôt de l'application ne semble pas disponible.",
    "error github": "Github semble indisponible. Vous pouvez vérifier son état sur https://status.github.com/.",
    "error npm": "Impossible d'installer les dépendances de l'application.",
    "error user linux": "Impossible de créer un utilisateur Linux spécifique pour cette application.",
    "error start": "L'application ne peut pas démarrer. Vous pouvez trouver plus d'information dans les logs de l'application.",
    "app msg": "Si cette erreur persiste, vous pouvez nous contacter : contact@cozycloud.cc, sur IRC #cozycloud ou encore irc.freenode.net.",
    "more details": "Plus de détails",
    "noapps": {
        "customize your cozy": "Vous pouvez également <a href=\"%{account}\">aller dans les réglages</a> pour personnaliser votre Cozy\nou <a href=\"%{appstore}\">vous rendre dans le Cozy Store</a> pour installer votre première application."
    },
    "pick from files": "Choisissez une photo",
    "Crop the photo": "Recadrez l'image",
    "chooseAgain": "changer de photo",
    "modal ok": "OK",
    "modal cancel": "Annuler",
    "no image": "Il n'y a pas d'image sur votre Cozy",
    "ObjPicker upload btn": "Sélectionnez un fichier local",
    "or": "ou",
    "drop a file": "Glissez et déposez un fichier ou",
    "url of an image": "Collez l'URL d'une image depuis le web",
    "you have no album": "<p>Vous n'avez aucun album photo<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:-(</p><p>Créez-en un depuis <a href='/#applications' target='_blank'>l'application Photo </a><br>et utilisez des photos prises depuis votre smartphone avec <a href='https://play.google.com/store/apps/details?id=io.cozy.files_client&hl=en' target='_blank'>l'application mobile !</a><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:-)</p>",
    "state app installing": "Cette application est en cours d'installation. Veuillez patienter",
    "state app stopped error": "Cette application ne peut pas démarrer",
    "stack updating block message": "Votre Cozy est en cours de mise à jour, vous ne pouvez pas l'utiliser tant que la mise à jour n'est pas terminée.",
    "update apps error title": "Une erreur est survenue pendant la mise à jour des applications",
    "update apps error": "Une ou plusieurs mises à jour d'applications ont échouées. Les applications concernées sont marquées comme cassées. Nous vous conseillons de désinstaller puis de réinstaller ces applications pour qu'elles fonctionnent à nouveau.",
    "update apps error list title": "Applications cassées",
    "update stack error title": "Une erreur s'est produite lors de la mise à jour de la plateforme Cozy",
    "update stack permission changes": "Les applications listées ci-dessous n'ont pas été mises à jour suite à un changement dans leur demande de permissions. Mettez les à jour individuellement afin de pouvoir choisir si oui on non vous acceptez les nouvelles demandes de permissions d'accès à vos données.",
    "update stack warning": "Attention",
    "reboot stack error": "Une erreur s'est produite en redémarrant votre Cozy. Le Cozy peut devenir instable. Si vous constatez que le Cozy ne fonctionne plus bien, veuillez contacter votre hébergeur pour qu'il intervienne dessus."
};
});

require.register("locales/id", function(exports, require, module) {
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
    "config application unmark favorite": "unmark as favorite",
    "config application mark favorite": "mark as favorite",
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
    "app store": "Store",
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
    "account two factors auth": "Two-factor authentication",
    "account 2fa strategy": "Authentication strategy",
    "account 2fa hotp": "HOTP (based on a counter)",
    "account 2fa totp": "TOTP (based on a timer)",
    "enable 2fa": "Enable two-factor authentication",
    "disable 2fa": "Disable two-factor authentication",
    "reset 2fa tokens": "Reset your recovery tokens",
    "account 2fa enabled": "Two-factor authentication has been enabled. Page will now reload.",
    "account 2fa disabled": "Two-factor authentication has been disabled. Page will now reload.",
    "account 2fa error": "There was something wrong while enabling two-factor authentication. Please try again in a few minutes or contact the support.",
    "account 2fa token explanation": "Two-factor authentication is enabled on Cozy. To use it with your favourite app or device, you have to enter the following key when setting up the account:",
    "account 2fa qrcode explanation": "You can also scan the QR code below if your app supports it.",
    "account 2fa rectokens": "Below are your recovery tokens. Make sure to copy them somewhere safe (not on Cozy) so you won't get locked outside of your Cozy.",
    "2fa strategy hotp": "Two-factor authentication is enabled on Cozy with the HOTP strategy (counter-based).",
    "2fa strategy totp": "Two-factor authentication is enabled on Cozy with the TOTP strategy (timer-based).",
    "account 2fa hotp reset explanation": "If you're changing from one authentication app or device to another, you must reset the HOTP counter in order to not get locked outside of your Cozy.",
    "2fa reset hotp": "Reset the HOTP counter",
    "account 2fa reset": "The HOTP counter has been successfully reset.",
    "account 2fa disable explanation": "You can disable the two-factor authentication at any time:",
    "2fa if yubikey": "If you are using a Yubikey to authenticate, use the key below as your Secret Key.",
    "french": "French",
    "english": "English",
    "german": "German",
    "spanish": "Spanish",
    "korean": "Korean",
    "japanese": "Japanese",
    "portuguese": "Portuguese",
    "russian": "Russian",
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
    "desktop app promo": "You can also download the cozy-desktop client to synchronize your files on your laptop/desktop:",
    "download desktop linux": "Download cozy desktop for Linux",
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
    "settings": "Settings",
    "help": "Help",
    "change layout": "Change the layout",
    "market app install": "Installing...",
    "install your app": "Install an app from its Git Repository",
    "market install your app": "Just copy/paste its Git URL in the field below:",
    "market install your app tutorial": "To know more about how to build your own app, feel free to read our",
    "market app tutorial": "tutorial",
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
    "map description": "Open Street Map in your Cozy",
    "moi description": "A new experience to visualize your data",
    "warning unofficial app": "This app is a community app and isn't maintained by the Cozy team.\nTo report a bug, please file an issue in <a href='https://forum.cozy.io'>our forum</a>.",
    "update available notification": "A new version of %{appName} is available.",
    "stack update available notification": "A new version of the platform is available.",
    "app broken title": "Broken application",
    "app broken": "This application is broken. Can you try to install it again:",
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
};
});

require.register("locales/it", function(exports, require, module) {
module.exports = {
    "home": "Home",
    "apps": "Apps",
    "account": "Account",
    "email": "Email",
    "timezone": "Time zone",
    "domain": "Domain",
    "no domain set": "no.domain.set",
    "locale": "Locale",
    "change password": "Cambia la password",
    "input your current password": "Inserisci la tua password attuale:",
    "enter a new password": "Inserisci la nuova password:",
    "confirm new password": "Conferma la nuova password:",
    "send changes": "Salva",
    "manage": "Gestisci",
    "total": "Totale",
    "memory consumption": "Uso della memoria",
    "disk consumption": "Uso del disco",
    "you have no notifications": "<span>Ciao %{name}</span><br>Non c'è nessuna notifica.",
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
    "config application unmark favorite": "unmark as favorite",
    "config application mark favorite": "mark as favorite",
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
    "welcome to app store": "Welcome to your Cozy store, install your own app from here\nor add one from the available list.",
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
    "app store": "Store",
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
    "account two factors auth": "Two-factor authentication",
    "account 2fa strategy": "Authentication strategy",
    "account 2fa hotp": "HOTP (based on a counter)",
    "account 2fa totp": "TOTP (based on a timer)",
    "enable 2fa": "Enable two-factor authentication",
    "disable 2fa": "Disable two-factor authentication",
    "reset 2fa tokens": "Reset your recovery tokens",
    "account 2fa enabled": "Two-factor authentication has been enabled. Page will now reload.",
    "account 2fa disabled": "Two-factor authentication has been disabled. Page will now reload.",
    "account 2fa error": "There was something wrong while enabling two-factor authentication. Please try again in a few minutes or contact the support.",
    "account 2fa token explanation": "Two-factor authentication is enabled on Cozy. To use it with your favourite app or device, you have to enter the following key when setting up the account:",
    "account 2fa qrcode explanation": "You can also scan the QR code below if your app supports it.",
    "account 2fa rectokens": "Below are your recovery tokens. Make sure to copy them somewhere safe (not on Cozy) so you won't get locked outside of your Cozy.",
    "2fa strategy hotp": "Two-factor authentication is enabled on Cozy with the HOTP strategy (counter-based).",
    "2fa strategy totp": "Two-factor authentication is enabled on Cozy with the TOTP strategy (timer-based).",
    "account 2fa hotp reset explanation": "If you're changing from one authentication app or device to another, you must reset the HOTP counter in order to not get locked outside of your Cozy.",
    "2fa reset hotp": "Reset the HOTP counter",
    "account 2fa reset": "The HOTP counter has been successfully reset.",
    "account 2fa disable explanation": "You can disable the two-factor authentication at any time:",
    "2fa if yubikey": "If you are using a Yubikey to authenticate, use the key below as your Secret Key.",
    "french": "French",
    "english": "English",
    "german": "German",
    "spanish": "Spanish",
    "korean": "Korean",
    "japanese": "Giapponese",
    "portuguese": "Portuguese",
    "russian": "Russo",
    "change password procedure": "Steps to change your password",
    "current password": "current password",
    "new password": "new password",
    "confirm your new password": "confirm your new password",
    "save your new password": "Save new password",
    "do you want assistance": "Do you need some help?",
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
    "update all": "Update all",
    "show home logs": "Show Home Logs",
    "show data system logs": "Show Data System Logs",
    "show proxy logs": "Show Proxy Logs",
    "show logs": "Show Logs",
    "update stack": "Update",
    "reboot stack waiting message": "Wait please, rebooting takes several minutes.",
    "update stack waiting message": "Wait please, updating takes several minutes.",
    "status no device": "There is no device connected to your Cozy.",
    "download apk": "Download .APK",
    "mobile app promo": "Backup you photos and synchronize your contacts and calendars with your mobile via the dedicated mobile app:",
    "desktop app promo": "You can also download the cozy-desktop client to synchronize your files on your laptop/desktop:",
    "download desktop linux": "Download cozy desktop for Linux",
    "update stack modal title": "Updating your Cozy",
    "update stack modal content": "You are about to update the platform. Your Cozy will be unavailable a few minutes. Is that OK?",
    "update stack modal confirm": "Update",
    "update stack success": "Your applications are updated, page will refresh.",
    "update stack error": "An error occurred during the update. Your Cozy may become unstable. If you notice any troubles, you should contact your hosting provider. When you will click on the OK button, the current window will be refreshed.",
    "applications broken": "Applications broken",
    "cozy platform": "Platform",
    "navbar back button title": "Back Home",
    "navbar notifications": "Notifications",
    "or:": "or:",
    "reboot stack": "Reboot",
    "update error": "An error occurred while updating the app",
    "update failed": "Update failed",
    "error update uninstalled app": "Non puoi aggiornare un'applicazione che non è installata.",
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
    "help direct title": "Messaggio diretto",
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
    "app status": "Status",
    "settings": "Settings",
    "help": "Help",
    "change layout": "Change the layout",
    "market app install": "Installing...",
    "install your app": "Install an app from its Git Repository",
    "market install your app": "Just copy/paste its Git URL in the field below:",
    "market install your app tutorial": "To know more about how to build your own app, feel free to read our",
    "market app tutorial": "tutorial",
    "help send message title": "Write directly to the Cozy Team",
    "help send message action": "Invia",
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
    "tiddlywiki description": "Un web notebook personale non lineare",
    "hari description": "Encrypted personal diary.",
    "map description": "Apri Street map nel tuo Cozy",
    "moi description": "A new experience to visualize your data",
    "warning unofficial app": "This app is a community app and isn't maintained by the Cozy team.\nTo report a bug, please file an issue in <a href='https://forum.cozy.io'>our forum</a>.",
    "update available notification": "A new version of %{appName} is available.",
    "stack update available notification": "A new version of the platform is available.",
    "app broken title": "Broken application",
    "app broken": "This application is broken. Can you try to install it again:",
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
    "you have no album": "<p>You've haven't got any photo album<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:-(</p><p>Create one from the <a href='/#applications' target='_blank'>the Photo app</a><br>and use photos taken from your smartphone with the <a href='https://play.google.com/store/apps/details?id=io.cozy.files_client&hl=en' target='_blank'>mobile app!</a><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:-)</p>",
    "state app installing": "This app is being installed. Wait a little",
    "state app stopped error": "This app cannot start",
    "stack updating block message": "Il tuo Cozy è in fase di aggiornamento, non puoi usarlo fino a quando l'aggiornamento non è finito.",
    "update apps error title": "An error occurred while updating apps",
    "update apps error": "One or several applications failed. Concerned applications are marked as broken. You will probably have to uninstall and reinstall these applications.",
    "update apps error list title": "Broken applications",
    "update stack error title": "An error occurred while updating your Cozy",
    "update stack permission changes": "Applications listed below were not updated due to permission changes. Please, update them individually to choose whether or not you accept the new permissions.",
    "update stack warning": "Avviso",
    "reboot stack error": "An error occurred while rebooting your Cozy. The Cozy may become unstable. Contact your hosting provider if your Cozy doesn't work anymore."
};
});

require.register("locales/ja", function(exports, require, module) {
module.exports = {
    "home": "ホーム",
    "apps": "アプリ",
    "account": "アカウント",
    "email": "メール",
    "timezone": "タイムゾーン",
    "domain": "ドメイン",
    "no domain set": "no.domain.set",
    "locale": "地域",
    "change password": "パスワードを変更",
    "input your current password": "現在のパスワードを入力",
    "enter a new password": "新しいパスワードを入力",
    "confirm new password": "新しいパスワードを確認",
    "send changes": "保存",
    "manage": "管理",
    "total": "合計",
    "memory consumption": "メモリー使用",
    "disk consumption": "ディスク使用",
    "you have no notifications": "<span>%{name} さん、こんにちは</span><br>現在、通知はありません。",
    "dismiss all": "すべて消去",
    "add application": "アプリを追加しますか?",
    "install": "インストール",
    "github": "Github",
    "website": "Web サイト",
    "your app": "お使いのアプリ!",
    "community contribution": "コミュニティの貢献",
    "official application": "Cozy により開発",
    "application description": "アプリの説明",
    "downloading description": "説明のダウンロード中…",
    "downloading permissions": "ダウンロード権限…",
    "Cancel": "キャンセル",
    "ok": "OK",
    "applications permissions": "アプリの権限",
    "confirm": "確認",
    "installing": "インストール中",
    "remove": "削除",
    "update": "更新",
    "config application unmark favorite": "お気に入りとしてのマークを解除",
    "config application mark favorite": "お気に入りとしてマーク",
    "started": "開始しました",
    "notifications": "通知",
    "questions and help forum": "質問とヘルプのフォーラム",
    "sign out": "サインアウト",
    "open in a new tab": "新しいタブで開く",
    "always on": "常にオン",
    "keep always on": "常にオンのままにします",
    "stop this app": "このアプリを停止",
    "update required": "アップデートが利用できます",
    "navbar faq": "よくある質問",
    "application is installing": "アプリをすでにインストールしています。\n完了するまでお待ちください。その後、もう一度試してください。",
    "no app message": "現在 Cozy にアプリはインストールされていません。\n<a href=\"#applications\">Cozy ストア</a> で、今すぐアプリをインストールしてください!",
    "welcome to app store": "Cozy ストアへようこそ、ここから独自のアプリをインストール\nするか、利用可能なリストから追加してください。",
    "installed everything": "すでにすべてインストールされています!",
    "already similarly named app": "すでに似たような名前のアプリがあります。",
    "your app list": "アプリにアクセス",
    "customize your cozy": "レイアウトをカスタマイズ",
    "manage your apps": "アプリケーション",
    "choose your apps": "アプリを選択",
    "configure your cozy": "Cozy を構成",
    "ask for assistance": "ヘルプを求める",
    "logout": "サインアウト",
    "navbar logout": "サインアウト",
    "welcome to your cozy": "Cozy へようこそ!",
    "you have no apps": "アプリはありません。",
    "app management": "アプリの",
    "app store": "ストア",
    "configuration": "構成",
    "assistance": "アシスタンス",
    "hardware consumption": "ハードウェア",
    "gigabytes": "GB",
    "megabytes": "MB",
    "terabyte": "MB",
    "G": "GB",
    "M": "MB",
    "T": "MB",
    "disk unit": "GB",
    "memory unit": "MB",
    "status hard drive label": "ストレージ",
    "status memory label": "メモリー",
    "manage your applications": "アプリケーション",
    "manage your devices": "接続されたデバイス",
    "synchronized": "同期",
    "revoke device access": "デバイスの取り消し",
    "no application installed": "アプリはインストールされていません。",
    "your parameters": "あなたの設定",
    "alerts and password recovery email": "あなたのメールアドレスは通知やパスワードの回復のために使用されます。",
    "public name description": "人とファイルを共有したり、イベントに招待するときに、ユーザー名が表示されます。",
    "domain name for urls and email": "ドメイン名は、任意のデバイスから Cozy に接続し、共有 URL を構築するために使用されます。",
    "account timezone field description": "タイムゾーンは、カレンダーを正しく表示するのに役立ちます。",
    "save": "保存",
    "saved": "保存しました",
    "error": "エラー",
    "error proper email": "指定されたメールは正しくありません",
    "error email empty": "メールが指定されていません",
    "account language field description": "表示する言語を選択してください:",
    "account background selection": "Cozy ホームの背景を選択してください:",
    "account localization": "ローカライズ",
    "account identifiers": "アカウント",
    "account personalization": "カスタマイズ",
    "account password": "Password",
    "account two factors auth": "2 要素認証",
    "account 2fa strategy": "認証ストラテジー",
    "account 2fa hotp": "HOTP (カウンターに基づく)",
    "account 2fa totp": "TOTP (タイマーに基づく)",
    "enable 2fa": "2 要素認証を有効にする",
    "disable 2fa": "2 要素認証を無効にする",
    "reset 2fa tokens": "回復トークンをリセット",
    "account 2fa enabled": "2 要素認証が有効になりました。ページが再読み込みされます。",
    "account 2fa disabled": "2 要素認証が無効になりました。ページが再読み込みされます。",
    "account 2fa error": "2 要素認証を可能にするときに、何か問題がありました。数分後にもう一度お試しいただくか、サポートまでお問い合わせください。",
    "account 2fa token explanation": "Cozy で 2 要素認証が有効になっています。お気に入りのアプリやデバイスで使用するには、アカウントを設定するときに、次のキーを入力する必要があります:",
    "account 2fa qrcode explanation": "アプリがサポートしている場合は、以下のQRコードをスキャンすることもできます。",
    "account 2fa rectokens": "以下に回復トークンがあります。それらを (Cozy 上ではなく) Cozy の外のロックされない安全な場所にコピーすることを確認してください。",
    "2fa strategy hotp": "Cozy で HOTP ストラテジーと 2 要素認証が有効になりました (カウンタベース)。",
    "2fa strategy totp": "Cozy で TOTP ストラテジーと 2 要素認証が有効になりました (タイマーベース)。",
    "account 2fa hotp reset explanation": "認証アプリやデバイスを別のものに変更している場合、Cozyの外でロックされないようにするため、HOTPカウンターをリセットする必要があります。",
    "2fa reset hotp": "HOTP カウンターをリセット",
    "account 2fa reset": "HOTP カウンターを正常にリセットしました。",
    "account 2fa disable explanation": "いつでも 2 要素認証を無効にすることができます:",
    "2fa if yubikey": "認証に Yubikey を使用している場合は、秘密鍵として、以下の鍵を使用します。",
    "french": "フランス語",
    "english": "English",
    "german": "German",
    "spanish": "スペイン語",
    "korean": "韓国語",
    "japanese": "日本語",
    "portuguese": "ポルトガル語",
    "russian": "ロシア語",
    "change password procedure": "パスワードを変更するステップ",
    "current password": "現在のパスワード",
    "new password": "新しいパスワード",
    "confirm your new password": "新しいパスワードの確認",
    "save your new password": "新しいパスワードを保存",
    "do you want assistance": "ヘルプが必要ですか?",
    "help email title": "メール",
    "help twitter title": "Twitter",
    "help forum title": "フォーラム",
    "help IRC title": "IRC",
    "help github title": "Github",
    "Visit the project website and learn to build your app:": "プロジェクトの Web サイトを訪問:",
    "your own application": "独自のアプリ",
    "installed": "インストールしました",
    "updated": "アップデートしました",
    "updating": "アップデート中",
    "update all": "スタックとアプリケーションをアップデート",
    "show home logs": "ホームのログを表示",
    "show data system logs": "データシステムのログを表示",
    "show proxy logs": "Show Proxy Logs",
    "show logs": "ログを表示",
    "update stack": "プラットフォームをアップデート",
    "reboot stack waiting message": "しばらくお待ちください、Cozy の再起動タスクは数分間かかります。",
    "update stack waiting message": "しばらくお待ちください、Cozy のアップデート タスクは数分間かかります。",
    "status no device": "Cozy に接続されたデバイスはありません。",
    "download apk": "APK のダウンロード",
    "mobile app promo": "専用モバイルアプリを使って、お使いの携帯で写真のバックアップや、連絡先やカレンダーの同期をしてください:",
    "desktop app promo": "お使いのラップトップ/デスクトップ上のファイルを同期するために、cozy デスクトップ クライアントをダウンロードすることができます:",
    "download desktop linux": "Linux 用の cozy デスクトップをダウンロード",
    "update stack modal title": "Cozy のアップデート中",
    "update stack modal content": "プラットフォームを更新しようとしています。Cozy は数分間使用できなくなります。 大丈夫ですか?",
    "update stack modal confirm": "アップデート",
    "update stack success": "アプリケーションが更新されます。更新を確定するには、OK ボタンをクリックする必要があります。これにより、現在のウィンドウを更新します。",
    "update stack error": "アップデート中にエラーが発生しました。Cozy が不安定になる可能性があります。何かトラブルに気付いた場合は、ホスティング プロバイダーにお問い合わせください。 OK ボタンをクリックすると、現在のウィンドウが更新されます。",
    "applications broken": "アプリケーションが破損しています",
    "cozy platform": "プラットフォーム",
    "navbar back button title": "ホームに戻る",
    "navbar notifications": "通知",
    "or:": "または:",
    "reboot stack": "再起動",
    "update error": "アプリのアップデート中にエラーが発生しました",
    "update failed": "アップデートに失敗しました",
    "error update uninstalled app": "インストールされていないアプリはアップデートできません。",
    "notification open application": "アプリケーションを開く",
    "notification update stack": "プラットフォームをアップデート",
    "notification update application": "今すぐアップデート",
    "broken": "破損しています",
    "start this app": "このアプリを開始",
    "stopped": "停止しました",
    "retry to install": "インストールの再試行",
    "cozy account title": "Cozy - 設定",
    "cozy app store title": "Cozy - ストア",
    "cozy home title": "Cozy - ホーム",
    "cozy applications title": "Cozy - ステータス",
    "running": "実行中",
    "cozy help title": "Cozy - ヘルプ",
    "help support title": "公式サポート",
    "help community title": "コミュニティ サポート",
    "help direct title": "ダイレクトメッセージ",
    "help documentation title": "ドキュメント",
    "changing locale requires reload": "ロケールを変更するには、ページを再読み込みする必要があります。",
    "cancel": "キャンセル",
    "abort": "中断",
    "Once updated, this application will require the following permissions:": "アップデートすると、このアプリは次のアクセス許可が必要になります:",
    "confirm update": "アップデートの確認",
    "confirm install": "インストールの確認",
    "no specific permissions needed": "このアプリは特別なアクセス許可は必要ありません",
    "removed": "削除しました",
    "removing": "削除中",
    "required permissions": "必要なアクセス許可",
    "finish layout edition": "保存",
    "reset customization": "リセット",
    "use icon": "アイコンを使用する",
    "home section favorites": "お気に入り",
    "home section leave": "インポート",
    "home section main": "日常",
    "home section productivity": "生産性",
    "home section data management": "データ",
    "home section personal watch": "ウォッチ",
    "home section misc": "その他",
    "home section platform": "プラットフォーム",
    "app status": "マイ アプリ",
    "settings": "設定",
    "help": "ヘルプ",
    "change layout": "レイアウトの変更",
    "market app install": "インストール中...",
    "install your app": "Git リポジトリからアプリをインストール",
    "market install your app": "次のフィールドに Git URL をコピー/貼り付けしてください:",
    "market install your app tutorial": "独自のアプリを構築する方法に関してさらに知りたい場合は、お読みください",
    "market app tutorial": "チュートリアル",
    "help send message title": "Cozy チームに直接書き込み",
    "help send message action": "送信",
    "help send logs": "デバッグを容易にするサーバーログを送信",
    "send message success": "メッセージを正常に送信しました!",
    "send message error": "サポートのメッセージを送信中にエラーが発生しました。 メールクライアントで support@cozycloud.cc に送信してみてください",
    "account change password success": "パスワードを正常に変更しました。",
    "account change password short": "新しいパスワードが短すぎます。",
    "account change password difference": "確認のパスワードが新しいパスワードと一致しません。",
    "account change password error": "パスワードの変更時に何か問題がありました。以前のパスワードが正しいことを確認してください。",
    "account background add": "背景を追加",
    "introduction market": "Cozy ストアへようこそ!\nここでは、Cozy クラウドが提供するアプリ、コミュニティのアプリ、または自分で構築したアプリ、\nをインストールすることができます!",
    "error connectivity issue": "データの取得中にエラーが発生しました。.<br />後でもう一度試してください。",
    "package.json not found": "package.json が取得できません。リポジトリの URL を確認してください。",
    "unknown provider": "今は、Github または CozyCloud マーケットからのみアプリケーションをインストールすることができます",
    "please wait data retrieval": "データを取得する間、しばらくお待ちください…",
    "revoke device confirmation message": "これはデバイスが Cozy にアクセスするのを防止します。よろしいですか?",
    "dashboard": "ダッシュボード",
    "calendars description": "イベントを管理し、それをスマートフォンと同期します。",
    "contacts description": "連絡先を管理し、それをスマートフォンと同期します。",
    "emails description": "メールを受信、送信、バックアップします。",
    "files description": "お使いのデバイスと同期する、オンライン ファイルシステム。",
    "photos description": "写真を整理して、友達と共有します。",
    "sync description": "お使いのスマートフォンと、連絡先やカレンダーを同期するために必要なツール。",
    "quickmarks description": "ブックマークを保存して管理します。",
    "cozic description": "ブラウザーから音楽を聴くオーディオプレイヤー。",
    "databrowser description": "すべてのデータ (RAW 形式) を参照して視覚化します。",
    "zero-feeds description": "フィードを集約して、お気に入りのリンクをブックマークとして保存します。",
    "kyou description": "自分を定量化することによって、健康と幸福度を向上させます。",
    "konnectors description": "外部サービス (Twitter、Jawbone…) からデータをインポートします。",
    "kresus description": "個人的な財務管理用の追加のツール。",
    "nirc description": "Cozy から、お好みの IRC チャンネルへアクセスします。",
    "shout description": "Shout Web アプリケーションを使用してCozy から、お好みの IRC チャンネルへアクセスします",
    "notes description": "スマートなメモを整理したり書くことができます。",
    "owm description": "世界中の天気を知ることができます。",
    "remote storage description": "ホスト型ではないアプリケーションからデータを格納する、リモートストレージ アプライアンス。",
    "tasky description": "超高速かつシンプルなタグベースのタスク管理。",
    "todos description": "効率的に、タスクを書いて、整理して、完了します。",
    "term description": "Cozy 用のターミナルアプリ。",
    "ghost description": "Ghost ブログ プラットフォームに基づいたこのアプリで、あなたのストーリーを世界と共有してください。",
    "leave google description": "Google アカウントから、現在のデータをインポートするアプリ。",
    "mstsc.js description": "RDP プロトコルを介して、リモートで Windows のデスクトップを管理します。",
    "hastebin description": "シンプルな貼り付けビン、簡単にテキストを共有するためのツール。",
    "polybios description": "お使いのブラウザーから、PGP 鍵を管理します。",
    "frost description": "Cozy に Webページをアーカイブして、インターネットの記録を構築します。",
    "tiddlywiki description": "罫線のない個人用 Web ノート",
    "hari description": "暗号化された個人用日記。",
    "map description": "Cozy で Open Street Map",
    "moi description": "データをビジュアライズする新しい体験",
    "warning unofficial app": "このアプリは、コミュニティのアプリで、Cozy チームは管理していません。\nバグを報告するには、<a href='https://forum.cozy.io'>私たちのフォーラム</a> に問題を提出してください。",
    "update available notification": "新しいバージョンの %{appName} が利用できます。",
    "stack update available notification": "新しいバージョンのプラットフォームが利用できます。",
    "app broken title": "破損したアプリケーション",
    "app broken": "このアプリケーションは破損しています。もう一度インストールしてみてください:",
    "reinstall broken app": "再インストール。",
    "error git": "ソースコードを取得できません。",
    "error github repo": "アプリケーションのリポジトリが利用できないようです。",
    "error github": "Github が利用できないようです。 https://status.github.com/ でステータスを確認することができます。",
    "error npm": "アプリケーションの依存関係をインストールできません。",
    "error user linux": "このアプリケーションの特定の Linux ユーザーを作成できません。",
    "error start": "アプリケーションが起動できません。ログ アプリケーションで、より詳細な情報を見ることができます。",
    "app msg": "エラーが続く場合は、contact@cozycloud.cc にメール、または irc.freenode.net の IRC #cozycloud で私たちに連絡することができます。",
    "more details": "さらに詳細",
    "noapps": {
        "customize your cozy": "<a href=\"%{account}\">設定に移動</a> して、Cozy をカスタマイズすることもできます。\nまた、<a href=\"%{appstore}\">アプリストアを見て</a> 最初のアプリをインストールしてください。"
    },
    "pick from files": "写真を選ぶ",
    "Crop the photo": "画像をトリミング",
    "chooseAgain": "別の写真を選択",
    "modal ok": "OK",
    "modal cancel": "キャンセル",
    "no image": "Cozy 上に画像はありません",
    "ObjPicker upload btn": "ローカルファイルをアップロード",
    "or": "または",
    "drop a file": "ファイルをドラッグ＆ドロップ、または",
    "url of an image": "Web から画像の URL を貼り付け",
    "you have no album": "<p>フォトアルバムがありません<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:-(</p><p><a href='/#applications' target='_blank'>写真アプリ</a> から作成して<br>お使いのスマートフォンから <a href='https://play.google.com/store/apps/details?id=io.cozy.files_client&hl=en' target='_blank'>モバイルアプリ!</a> で撮影した写真を使用してください<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:-)</p>",
    "state app installing": "このアプリをインストールしています。しばらくお待ちください",
    "state app stopped error": "このアプリを起動できません",
    "stack updating block message": "Cozy は現在アップデート中です。アップデートが完了するまで使用できません。",
    "update apps error title": "アプリのアップデート中にエラーが発生しました",
    "update apps error": "一つまたは複数のアプリケーションが失敗しました。懸念のあるアプリケーションが破損としてマークされています。おそらく、これらのアプリケーションをアンインストールして、再インストールする必要があります。",
    "update apps error list title": "破損したアプリケーション",
    "update stack error title": "Cozy のアップデート中にエラーが発生しました",
    "update stack permission changes": "次に記載されているアプリケーションは、アクセス許可の変更のためにアップデートされませんでした。 個別にアップデートして、新しいアクセス許可を受け入れるかどうかを選択してください。",
    "update stack warning": "警告",
    "reboot stack error": "Cozy の再起動中にエラーが発生しました。Cozy が不安定になる可能性があります。Cozy が動作しなくなった場合は、ホスティングプロバイダーにお問い合わせください。"
};
});

require.register("locales/ko", function(exports, require, module) {
module.exports = {
    "home": "홈",
    "apps": "앱",
    "account": "계정",
    "email": "이메일",
    "timezone": "시간대",
    "domain": "도메인",
    "no domain set": "도메인 없음",
    "locale": "언어",
    "change password": "비밀번호 변경",
    "input your current password": "현재 비밀번호:",
    "enter a new password": "새로운 비밀번호:",
    "confirm new password": "비밀번호 확인:",
    "send changes": "저장",
    "manage": "관리",
    "total": "전체",
    "memory consumption": "메모리 사용량",
    "disk consumption": "디스크 사용량",
    "you have no notifications": "<span>%{name}님 안녕하세요</span><br>알림 메시지가 없습니다.",
    "dismiss all": "전체 읽음",
    "add application": "앱 추가?",
    "install": "설치",
    "github": "Github",
    "website": "웹사이트",
    "your app": "나의 앱",
    "community contribution": "커뮤니티 배포",
    "official application": "개발사",
    "application description": "앱 설명",
    "downloading description": "다운로드 설명",
    "downloading permissions": "다운로드 권한",
    "Cancel": "취소",
    "ok": "확인",
    "applications permissions": "앱 권한",
    "confirm": "확인",
    "installing": "설치중",
    "remove": "제거",
    "update": "업데이트",
    "config application unmark favorite": "즐겨 찾기에서 해제",
    "config application mark favorite": "즐겨 찾기에 추가",
    "started": "시작됨",
    "notifications": "알림",
    "questions and help forum": "질문답변",
    "sign out": "회원탈퇴",
    "open in a new tab": "새로운 탭에서 실행",
    "always on": "항상 켜기",
    "keep always on": "항상 켜기 사용",
    "stop this app": "앱 정지",
    "update required": "업데이트 가능",
    "navbar faq": "자주하는 질문",
    "application is installing": "이미 설치된 앱입니다.\n종료후 다시 시도 하세요.",
    "no app message": "현재 까지 설치된 앱이 없습니다.\n<a href=\"#applications\">스토어</a>로 이동하여 새로운 앱을 설치 하세요.",
    "welcome to app store": "스토어에 오신 것을 환영 합니다.\n자신의 앱을 직접 설치하거나 목록에서 추가 하세요.",
    "installed everything": "이미 모든 앱이 설치되어 있습니다.",
    "already similarly named app": "이미 비슷한 이름을 가진 앱이 설치 되어 있습니다",
    "your app list": "앱 접속",
    "customize your cozy": "레이아웃 변경",
    "manage your apps": "앱",
    "choose your apps": "앱 선택",
    "configure your cozy": "환경설정",
    "ask for assistance": "문의하기",
    "logout": "로그아웃",
    "navbar logout": "로그아웃",
    "welcome to your cozy": "환영합니다.",
    "you have no apps": "설치된 앱이 없습니다.",
    "app management": "앱 관리",
    "app store": "스토어",
    "configuration": "설정",
    "assistance": "지원",
    "hardware consumption": "하드웨어",
    "gigabytes": "GB",
    "megabytes": "MB",
    "terabyte": "MB",
    "G": "GB",
    "M": "MB",
    "T": "MB",
    "disk unit": "GB",
    "memory unit": "MB",
    "status hard drive label": "저장소",
    "status memory label": "메모리",
    "manage your applications": "앱",
    "manage your devices": "접속된 장치",
    "synchronized": "동기화됨",
    "revoke device access": "장치 분리",
    "no application installed": "설치된 앱이 없습니다.",
    "your parameters": "나의 설정",
    "alerts and password recovery email": "이메일은 알림 공지 및 비밀 번호 복구 시 사용 됩니다.",
    "public name description": "파일 공유나, 이벤트 초대 시 표시 되는 이름 입니다.",
    "domain name for urls and email": "모바일 연결과 공유 URL 생성 시 사용 됩니다.",
    "account timezone field description": "Your time zone helps to properly display your calendar.",
    "save": "저장",
    "saved": "저장됨",
    "error": "오류",
    "error proper email": "이메일 주소가 올바르지 않습니다.",
    "error email empty": "이메일을 입력하세요",
    "account language field description": "Choose the language you want to see:",
    "account background selection": "배경화면을 선택하세요:",
    "account localization": "지역",
    "account identifiers": "계정",
    "account personalization": "배경화면 설정",
    "account password": "비밀번호",
    "account two factors auth": "Two-factor authentication",
    "account 2fa strategy": "Authentication strategy",
    "account 2fa hotp": "HOTP (based on a counter)",
    "account 2fa totp": "TOTP (based on a timer)",
    "enable 2fa": "Enable two-factor authentication",
    "disable 2fa": "Disable two-factor authentication",
    "reset 2fa tokens": "Reset your recovery tokens",
    "account 2fa enabled": "Two-factor authentication has been enabled. Page will now reload.",
    "account 2fa disabled": "Two-factor authentication has been disabled. Page will now reload.",
    "account 2fa error": "There was something wrong while enabling two-factor authentication. Please try again in a few minutes or contact the support.",
    "account 2fa token explanation": "Two-factor authentication is enabled on Cozy. To use it with your favourite app or device, you have to enter the following key when setting up the account:",
    "account 2fa qrcode explanation": "You can also scan the QR code below if your app supports it.",
    "account 2fa rectokens": "Below are your recovery tokens. Make sure to copy them somewhere safe (not on Cozy) so you won't get locked outside of your Cozy.",
    "2fa strategy hotp": "Two-factor authentication is enabled on Cozy with the HOTP strategy (counter-based).",
    "2fa strategy totp": "Two-factor authentication is enabled on Cozy with the TOTP strategy (timer-based).",
    "account 2fa hotp reset explanation": "If you're changing from one authentication app or device to another, you must reset the HOTP counter in order to not get locked outside of your Cozy.",
    "2fa reset hotp": "Reset the HOTP counter",
    "account 2fa reset": "The HOTP counter has been successfully reset.",
    "account 2fa disable explanation": "You can disable the two-factor authentication at any time:",
    "2fa if yubikey": "If you are using a Yubikey to authenticate, use the key below as your Secret Key.",
    "french": "프랑스어",
    "english": "영어",
    "german": "독일어",
    "spanish": "스페인어",
    "korean": "한국어",
    "japanese": "Japanese",
    "portuguese": "포르투칼어",
    "russian": "Russian",
    "change password procedure": "비밀번호를 변경 단계",
    "current password": "현재 비밀번호",
    "new password": "새로운 비밀번호",
    "confirm your new password": "새 비밀번호 확인",
    "save your new password": "새 비밀번호 저장",
    "do you want assistance": "도움이 필요하세요?",
    "help email title": "이메일",
    "help twitter title": "트위터",
    "help forum title": "포럼",
    "help IRC title": "IRC",
    "help github title": "Github",
    "Visit the project website and learn to build your app:": "프로젝트 홈페이지 방문:",
    "your own application": "나의 앱",
    "installed": "설치됨",
    "updated": "업데이트됨",
    "updating": "업데이트중",
    "update all": "전체 업데이트",
    "show home logs": "홈 로그 보기",
    "show data system logs": "데이터 시스템 로그 보기",
    "show proxy logs": "프락시 로그 보기",
    "show logs": "로그 보기",
    "update stack": "업데이트",
    "reboot stack waiting message": "기다려 주세요, 부팅 하는데 잠시 시간이 걸립니다.",
    "update stack waiting message": "기다려 주세요, 업데이트 하는 시간이 걸립니다.",
    "status no device": "연결된 장치가 없습니다.",
    "download apk": "안드로이드 앱 다운로드",
    "mobile app promo": "사진을 백업하고, 모바일 앱과 연락처, 일정 동기화 :",
    "desktop app promo": "You can also download the cozy-desktop client to synchronize your files on your laptop/desktop:",
    "download desktop linux": "Download cozy desktop for Linux",
    "update stack modal title": "클라우드 업데이트중",
    "update stack modal content": "클라우드를 업데이트 할 것입니다. 잠시동안 사용 할 수 없습니다. 계속 하시겠습니까?",
    "update stack modal confirm": "업데이트",
    "update stack success": "앱이 업데이트 되었습니다, 페이지를 새로 고침 하세요.",
    "update stack error": "An error occurred during the update. Your Cozy may become unstable. If you notice any troubles, you should contact your hosting provider. When you will click on the OK button, the current window will be refreshed.",
    "applications broken": "앱 설치오류",
    "cozy platform": "플랫폼",
    "navbar back button title": "홈으로",
    "navbar notifications": "알림",
    "or:": "또는:",
    "reboot stack": "재시작",
    "update error": "An error occurred while updating the app",
    "update failed": "업데이트를 실패 하였습니다.",
    "error update uninstalled app": "You can't update an app that is not installed.",
    "notification open application": "오픈 앱",
    "notification update stack": "시스템 업데이트",
    "notification update application": "지금 업데이트",
    "broken": "깨짐",
    "start this app": "앱 시작",
    "stopped": "정지됨",
    "retry to install": "다시 설치",
    "cozy account title": "클라우드 - 설정",
    "cozy app store title": "클라우드 - 스토어",
    "cozy home title": "클라우드 - 홈",
    "cozy applications title": "클라우드 - 상태",
    "running": "실행중",
    "cozy help title": "클라우드 - 도움말",
    "help support title": "공식 지원",
    "help community title": "커뮤니티 지원",
    "help direct title": "메시지",
    "help documentation title": "문서",
    "changing locale requires reload": "언어를 변경하려면 페이지를 새로 고침 하세요.",
    "cancel": "취소",
    "abort": "취소",
    "Once updated, this application will require the following permissions:": "업데이트됨, 이 앱은 다음 권한이 필요 합니다:",
    "confirm update": "업데이트 확인",
    "confirm install": "설치 확인",
    "no specific permissions needed": "이 앱은 권한 설정이 필요 없습니다.",
    "removed": "삭제됨",
    "removing": "삭제중",
    "required permissions": "권한 필요",
    "finish layout edition": "저장",
    "reset customization": "초기화",
    "use icon": "아이콘 사용",
    "home section favorites": "즐겨찾기",
    "home section leave": "가져오기",
    "home section main": "매일",
    "home section productivity": "생산성",
    "home section data management": "데이터",
    "home section personal watch": "보기",
    "home section misc": "기타",
    "home section platform": "시스템",
    "app status": "시스템 상태",
    "settings": "설정",
    "help": "도움말",
    "change layout": "레이아웃 변경",
    "market app install": "설치중",
    "install your app": "Git 저장소로 부터 설치",
    "market install your app": "아래에 Git URL을 복사해서 붙여 넣으세요:",
    "market install your app tutorial": "To know more about how to build your own app, feel free to read our",
    "market app tutorial": "튜토리얼",
    "help send message title": "개발자팀에게 보내기",
    "help send message action": "보내기",
    "help send logs": "디버깅을 위해 서버로그 보내기",
    "send message success": "메시지를 성공적으로 보냈습니다!",
    "send message error": "An error occurred while sending your support message. Try to send it via an email client to support@cozycloud.cc",
    "account change password success": "비밀번호를 변경 하였습니다.",
    "account change password short": "새 비밀번호가 너무 짧습니다.",
    "account change password difference": "새로 입력한 비밀번호가 일치 하지 않습니다.",
    "account change password error": "비밀 번호를 변경하는동안 문제가 발생 하였습니다. 이전 비밀번호가 정확한지 확인하세요",
    "account background add": "배경 그림 추가",
    "introduction market": "스토어에 오신 것을 환영 합니다.\n커뮤니티 앱 또는 자신의 앱을 설치 할 수 있습니다.",
    "error connectivity issue": "데이터를 검색 하는 동안 오류가 발생 하였습니다.<br/>잠시 후에 다시 시도하세요.",
    "package.json not found": "package.json을 불러 올수 없습니다. 저장소 주소를 확인하세요.",
    "unknown provider": "Github 또는 CozyCloud 마켓 에서만 설치가 가능 합니다.",
    "please wait data retrieval": "데이터를 검색 하는 중입니다...",
    "revoke device confirmation message": "클라우드에서 접근이 금지된 장치 입니다. 그래도 사용 하시겠습니까?",
    "dashboard": "대시보드",
    "calendars description": "스마트폰으로 이벤트를 관리하고 동기화 합니다.",
    "contacts description": "스마트폰과 주소록을 동기화 합니다.",
    "emails description": "읽고, 내 이메일로 보내주세요.",
    "files description": "여러분의 파일 시스템이 온라인 상태이며, 장치와 동기화 되었습니다.",
    "photos description": "사진을 관리 하고, 여러분의 친구들과 사진을 공유하세요.",
    "sync description": "스마트폰과 주소록, 일정 동기화가 필요합니다.",
    "quickmarks description": "즐겨찾기를 저장하고 관리 합니다.",
    "cozic description": "브라우저에서 음악을 들을 수 있습니다.",
    "databrowser description": "저장된 데이터를 확인 합니다.",
    "zero-feeds description": "여러분의 RSS피드를 집계 및 즐겨찾기 처럼 저장 합니다.",
    "kyou description": "여러분의 건강과 행복을 향상 시키세요.",
    "konnectors description": "외부 서비스에서 데이터 가져오기(트위터, Jawbone..).",
    "kresus description": "개인 자산관리 앱",
    "nirc description": "즐겨찾는 IRC채널 접속",
    "shout description": "Shout Web앱을 사용하여 즐겨찾는 IRC채널 접속",
    "notes description": "스마트 노트 관리",
    "owm description": "전세계의 날씨를 볼 수 있습니다.",
    "remote storage description": "배포된 앱으로 부터 데이터를 저장 하기 위한 원격 스토리지 장비",
    "tasky description": "아주 빠르고, 간단한 태그 기반의 일정 관리 매니저.",
    "todos description": "할일을 입력하세요, 순서를 정렬 하고 효과적으로 완료를 합니다.",
    "term description": "터미널 앱",
    "ghost description": "Ghost 블로그 플랫폼을 사용하는 전세계 사람들과 여러분의 이야기를 공유하세요.",
    "leave google description": "구글 계정에서 데이터를 가져오는 앱입니다.",
    "mstsc.js description": "RDP 프로토콜을 이용하여 원격 데스크탑 관리",
    "hastebin description": "간단 붙여넣기, 텍스트를 쉽게 공유하기 위한 툴 입니다.",
    "polybios description": "브라우저에서 PGP 키 관리",
    "frost description": "Build your internet memories by archiving web pages into your Cozy.",
    "tiddlywiki description": "A non-linear personal web notebook.",
    "hari description": "Encrypted personal diary.",
    "map description": "Open Street Map in your Cozy",
    "moi description": "A new experience to visualize your data",
    "warning unofficial app": "이 앱은 커뮤니티 앱이며, Cozy팀에서 지원하지 않습니다.\n버그 리포트는  <a href='https://forum.cozy.io'>포럼 게시판</a>을 이용하세요.",
    "update available notification": "%{appName}의 새로운 버전이 나왔습니다.",
    "stack update available notification": "새 버전의 플랫폼이 사용 가능 합니다.",
    "app broken title": "앱설치 오류",
    "app broken": "이 앱은 손상 되었습니다. 다시 설치해 주세요:",
    "reinstall broken app": "재설치",
    "error git": "이 소스 코드를 삭제 할 수 없습니다.",
    "error github repo": "앱 저장소가 사용 할 수 없습니다.",
    "error github": "Github를 사용 할 수 없습니다. https://status.github.com/에 상태를 확인 하세요.",
    "error npm": "이 앱의 의존성 프로그램을 설치 할 수 없습니다.",
    "error user linux": "이 앱을 위한 특정 리눅스 계정을 만들 수 없습니다.",
    "error start": "앱을 시작 할 수 없습니다. 더 자세한 내용은 로그를 확인 하세요.",
    "app msg": "에러가 지속 된다면, contact@cozycloud.cc 또는 IRC #cozycloud(irc.freenode.net)에 문의 하세요.",
    "more details": "더 자세히",
    "noapps": {
        "customize your cozy": "여러분의 취향에 맞게 <a href=\"%{account}\">환경설정</a>에서 원하는 내용을 변경 하거나,\n <a href=\"%{appstore}\">스토어</a> 에 새로운 앱을 추가 해 보세요."
    },
    "pick from files": "사진 선택",
    "Crop the photo": "이미지 자르기",
    "chooseAgain": "다른 사진 선택",
    "modal ok": "확인",
    "modal cancel": "취소",
    "no image": "이미지가 없습니다",
    "ObjPicker upload btn": "내컴퓨터 파일 올리기",
    "or": "또는",
    "drop a file": "드래그 앤 드롭 파일 또는",
    "url of an image": "웹으로 부터 이미지 URL 붙이기",
    "you have no album": "<p>사진첩 데이터가 없습니다.<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:-(</p><p> <a href='/#applications' target='_blank'>사진첩 앱</a>을 사용해서 새로 생성하거나<br><a href='https://play.google.com/store/apps/details?id=io.cozy.files_client&hl=en' target='_blank'>모바일 앱</a>으로 스마트 폰에서 가져 올 수 있습니다.<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:-)</p>",
    "state app installing": "설치 중입니다. 잠시 기다려 주세요.",
    "state app stopped error": "이 앱을 시작 할 수 없습니다.",
    "stack updating block message": "업데이트 중입니다, 완료 될 때까지 사용 할 수 없습니다.",
    "update apps error title": "An error occurred while updating apps",
    "update apps error": "앱 설치에 실패 하였습니다. 앱을 삭제 후 다시 설치해 주세요.",
    "update apps error list title": "설치 실패",
    "update stack error title": "An error occurred while updating your Cozy",
    "update stack permission changes": "Applications listed below were not updated due to permission changes. Please, update them individually to choose whether or not you accept the new permissions.",
    "update stack warning": "경고",
    "reboot stack error": "An error occurred while rebooting your Cozy. The Cozy may become unstable. Contact your hosting provider if your Cozy doesn't work anymore."
};
});

require.register("locales/nl", function(exports, require, module) {
module.exports = {
    "home": "Start",
    "apps": "Apps",
    "account": "Account",
    "email": "Email",
    "timezone": "Tijdszone",
    "domain": "Domein",
    "no domain set": "geen.domein.set",
    "locale": "Locale",
    "change password": "Wachtwoord veranderen",
    "input your current password": "Type je huidige wachtwoord:",
    "enter a new password": "Type je nieuwe wachtwoord:",
    "confirm new password": "Bevestig je nieuwe wachtwoord:",
    "send changes": "Opslaan",
    "manage": "Beheren",
    "total": "Totaal",
    "memory consumption": "Geheugen gebruik",
    "disk consumption": "Harde schijf gebruik",
    "you have no notifications": "<span>Hallo %{name}</span><br>Je hebt nu geen notificaties.",
    "dismiss all": "Alles afwijzen",
    "add application": "App toevoegen?",
    "install": "Installeer",
    "github": "Github",
    "website": "Website",
    "your app": "Jouw app!",
    "community contribution": "Bijdrage vanuit de gemeenschap",
    "official application": "Ontwikkeld door Cozy",
    "application description": "App beschrijving",
    "downloading description": "Beschrijving downloaden...",
    "downloading permissions": "Toestemmingen downloaden...",
    "Cancel": "Annuleer",
    "ok": "Ok",
    "applications permissions": "App toestemmingen",
    "confirm": "Bevestig",
    "installing": "Installeren",
    "remove": "Verwijder",
    "update": "Bijwerken",
    "config application unmark favorite": "verwijder uit favorieten",
    "config application mark favorite": "voeg toe aan favorieten",
    "started": "gestart",
    "notifications": "Notificaties",
    "questions and help forum": "Vragen en hulp forum",
    "sign out": "Afmelden",
    "open in a new tab": "Open in een nieuw tabblad",
    "always on": "altijd aan",
    "keep always on": "houd altijd aan",
    "stop this app": "Stop deze app",
    "update required": "Kan bijgewerkt worden",
    "navbar faq": "Vaak Gestelde Vragen",
    "application is installing": "Er is al een app aan het installeren.\nWacht totdat deze klaar is en probeer opnieuw.",
    "no app message": "Je hebt momenteel geen app geinstalleerd op jouw Cozy.\nGa naar de <a href=\"#applications\">Cozy winkel</a> en installeer nieuwe apps!",
    "welcome to app store": "Welkom in de Cozy winkel, installeer jouw eigen apps hier\nof voeg er een toe uit de lijst.",
    "installed everything": "Je hebt alles al geinstalleerd!",
    "already similarly named app": "Je hebt al een app met die naam.",
    "your app list": "Toegang tot je apps",
    "customize your cozy": "Pas je lay-out aan",
    "manage your apps": "Applicaties",
    "choose your apps": "Kies je applicaties",
    "configure your cozy": "Configureer jouw cozy",
    "ask for assistance": "Vraag om hulp",
    "logout": "Afmelden",
    "navbar logout": "Aanmelden",
    "welcome to your cozy": "Welkom in jouw Cozy!",
    "you have no apps": "Je hebt geen apps.",
    "app management": "Apps beheren",
    "app store": "Winkel",
    "configuration": "Configuratie",
    "assistance": "Assistentie",
    "hardware consumption": "Hardware",
    "gigabytes": "GB",
    "megabytes": "MB",
    "terabyte": "MB",
    "G": "GB",
    "M": "MB",
    "T": "MB",
    "disk unit": "GB",
    "memory unit": "MB",
    "status hard drive label": "Opslag",
    "status memory label": "Geheugen",
    "manage your applications": "Applicaties",
    "manage your devices": "Verbonden apparaten",
    "synchronized": "gesynchroniseerd",
    "revoke device access": "Intrekken apparaat",
    "no application installed": "Er is geen app geïnstalleerd.",
    "your parameters": "Jouw instellingen",
    "alerts and password recovery email": "Jouw e-mail wordt gebruikt voor notificaties of wachtwoord herstel.",
    "public name description": "Je gebruikersnaam zal worden getoond als je bestanden deelt met anderen of iemand uitnodigt voor een gebeurtenis.",
    "domain name for urls and email": "De domein naam zal worden gebruikt om contact te maken met jouw Cozy van elk apparaat en om gedeelde URL's te maken.",
    "account timezone field description": "Je tijdszone helpt om je kalender goed te kunnen weergeven.",
    "save": "Opslaan",
    "saved": "Opgeslagen",
    "error": "Fout",
    "error proper email": "Het opgegeven email adres is onjuist",
    "error email empty": "Het opgegeven email adres is leeg",
    "account language field description": "Kies de taal waarin je wilt zien:",
    "account background selection": "Selecteer de achtergrond voor jouw Cozy Startpagina:",
    "account localization": "Lokalisatie",
    "account identifiers": "Account",
    "account personalization": "Maatwerk",
    "account password": "Wachtwoord",
    "account two factors auth": "Twee-weg authenticatie",
    "account 2fa strategy": "Authenticatie strategie",
    "account 2fa hotp": "HOTP (gebaseerd op een teller)",
    "account 2fa totp": "TOTP (gebaseerd op een tijdklok)",
    "enable 2fa": "Pas twee-weg authenticatie toe",
    "disable 2fa": "Pas geen twee-weg authenticatie toe",
    "reset 2fa tokens": "Herstel jouw terughaalbewijzen",
    "account 2fa enabled": "Twee-weg authenticatie is toegepast. De pagina zal worden herladen.",
    "account 2fa disabled": "Twee-weg authenticatie is niet meer toegepast. De pagina zal worden herladen.",
    "account 2fa error": "Er is een fout opgetreden met het toepassen van twee-weg authenticatie. Probeer het over een paar minuten nog eens of neem contact op met support.",
    "account 2fa token explanation": "Twee-weg authenticatie is toegepast op Cozy. Om dit te gebruiken met jouw favoriete app of apparaat, moet je de volgende code invoeren bij het opzetten van het account:",
    "account 2fa qrcode explanation": "Je kan ook de QR-code scannen die hieronder staat als je app dat ondersteund.",
    "account 2fa rectokens": "Hieronder staat jouw terughaalbewijzen. Wees er zeker van om ze ergens veilig te bewaren (niet binnen Cozy) zodat je niet buitengesloten wordt uit Cozy.",
    "2fa strategy hotp": "Twee-weg authenticatie is aangezet op Cozy met de HOTP strategie (teller gebaseerd)",
    "2fa strategy totp": "Twee-weg authenticatie is aangezet op Cozy met de TOTP strategie (tijdklok gebaseerd)",
    "account 2fa hotp reset explanation": "Als je wisselt van de ene authenticatie app of apparaat naar een andere, moet je de HOTP teller opnieuw op nul zetten om te voorkomen dat je niet meer in kunt loggen in Cozy.",
    "2fa reset hotp": "De HOTP teller op nul zetten",
    "account 2fa reset": "De HOTP teller is succesvol op nul gezet.",
    "account 2fa disable explanation": "Je kunt ten aller tijde de twee-weg authenticatie uitzetten:",
    "2fa if yubikey": "Als je een Yubikey gebruikt om te authenticeren, gebruik dan de sleutel die hieronder staat als jouw geheime sleutel.",
    "french": "Frans",
    "english": "Engels",
    "german": "Duits",
    "spanish": "Spaans",
    "korean": "Koreaans",
    "japanese": "Japans",
    "portuguese": "Portugees",
    "russian": "Russisch",
    "change password procedure": "Stappen om jouw wachtwoord te veranderen",
    "current password": "huidig wachtwoord",
    "new password": "nieuw wachtwoord",
    "confirm your new password": "bevestig het nieuwe wachtwoord",
    "save your new password": "Sla het nieuwe wachtwoord op",
    "do you want assistance": "Heb je hulp nodig?",
    "help email title": "Email",
    "help twitter title": "Twitter",
    "help forum title": "Forum",
    "help IRC title": "IRC",
    "help github title": "Github",
    "Visit the project website and learn to build your app:": "Bezoek de project website:",
    "your own application": "jouw eigen app",
    "installed": "Geïnstalleerd",
    "updated": "bijgewerkt",
    "updating": "bijwerken",
    "update all": "Werk de Stack en applicaties bij",
    "show home logs": "Toon Start log bestanden",
    "show data system logs": "Toon Data System log bestanden",
    "show proxy logs": "Toon proxy log bestanden",
    "show logs": "Toon log bestanden",
    "update stack": "Werk het platform bij",
    "reboot stack waiting message": "Wacht a.u.b., jouw Cozy herstarten kost een paar minuten.",
    "update stack waiting message": "Wacht alsjeblieft, jouw Cozy herstarten kost een paar minuten.",
    "status no device": "Er is geen apparaat verbonden met jouw Cozy.",
    "download apk": "Download .APK",
    "mobile app promo": "Back-up je foto's en synchroniseer jouw contacten en kalenders met je mobiel via de speciale mobiele app:",
    "desktop app promo": "Je kunt ook de cozy bureaublad toepassing downloaden om je bestanden te synchroniseren op je laptop / PC:",
    "download desktop linux": "Download Cozy bureaublad voor Linux",
    "update stack modal title": "Werk jouw Cozy bij",
    "update stack modal content": "Je staat op het punt om het platform bij te werken. Jouw Cozy zal een paar minuten onbereikbaar zijn. Is dat goed?",
    "update stack modal confirm": "Bijwerken",
    "update stack success": "Jouw applicaties zijn bijgewerkt. Om het bijwerken te voltooien, moet je op de OK knop drukken. Dit zal de huidige venster verversen.",
    "update stack error": "Er is een fout opgetreden tijdens het bijwerken. Jouw Cozy kan onstabiel geworden zijn. Als je problemen ondervind, moet je contact opnemen het jouw hosting provider. Als je op de OK knop drukt, zal het huidige venster ververst worden.",
    "applications broken": "Kapotte applicaties",
    "cozy platform": "Platform",
    "navbar back button title": "Terug naar Start",
    "navbar notifications": "Notificaties",
    "or:": "of:",
    "reboot stack": "Herstart",
    "update error": "Er is een fout opgetreden tijdens het bijwerken van de app",
    "update failed": "Bijwerken mislukt",
    "error update uninstalled app": "Je kan een niet geïnstalleerde app niet bijwerken.",
    "notification open application": "Open applicatie",
    "notification update stack": "Werk het platform bij",
    "notification update application": "Nu bijwerken",
    "broken": "kapot",
    "start this app": "Start deze app",
    "stopped": "gestopt",
    "retry to install": "Probeer het installeren opnieuw",
    "cozy account title": "Cozy - Instellingen",
    "cozy app store title": "Cozy - Winkel",
    "cozy home title": "Cozy - Start",
    "cozy applications title": "Cozy - Status",
    "running": "draait",
    "cozy help title": "Cozy - Hulp",
    "help support title": "Officiële support",
    "help community title": "Support vanuit de gemeenschap",
    "help direct title": "Direct Bericht",
    "help documentation title": "Documentatie",
    "changing locale requires reload": "Om de locale te veranderen is herladen van de pagina noodzakelijk",
    "cancel": "annuleren",
    "abort": "afbreken",
    "Once updated, this application will require the following permissions:": "Als het bijgewerkt is, heeft deze app de volgende toestemmingen nodig.",
    "confirm update": "bevestig het bijwerken",
    "confirm install": "bevestig het installeren",
    "no specific permissions needed": "Deze app heeft geen toestemmingen nodig",
    "removed": "verwijderd",
    "removing": "verwijderen",
    "required permissions": "Vereiste toestemmingen",
    "finish layout edition": "Opslaan",
    "reset customization": "Resetten",
    "use icon": "Gebruik icoon",
    "home section favorites": "Favorieten",
    "home section leave": "Importeren",
    "home section main": "Dagelijks",
    "home section productivity": "Productiviteit",
    "home section data management": "Data",
    "home section personal watch": "Bekijk",
    "home section misc": "Diversen",
    "home section platform": "Platform",
    "app status": "Mijn Apps",
    "settings": "Instellingen",
    "help": "Hulp",
    "change layout": "De lay-out veranderen",
    "market app install": "Installeren...",
    "install your app": "Installeer een app vanuit zijn Git repository",
    "market install your app": "Knik en plak zijn Git URL in het veld hieronder:",
    "market install your app tutorial": "Om meer te weten te komen over hoe je je eigen app bouwt, kun je lezen in onze",
    "market app tutorial": "tutorial",
    "help send message title": "Schrijf direct naar het Cozy team",
    "help send message action": "Verstuur",
    "help send logs": "Verstuur server log bestanden om makkelijk bugs te vinden",
    "send message success": "Bericht succesvol verzonden!",
    "send message error": "Er is een fout opgetreden bij het versturen van jouw support bericht. Probeer het via e-mail te versturen naar: support@cozycloud.cc",
    "account change password success": "Het wachtwoord is succesvol veranderd.",
    "account change password short": "Het nieuwe wachtwoord is te kort.",
    "account change password difference": "De bevestiging en het nieuwe wachtwoord komen niet overeen.",
    "account change password error": "Er is een fout opgetreden tijdens het veranderen van je wachtwoord. Verzeker jezelf ervan dat het oude wachtwoord correct is.",
    "account background add": "Voeg achtergrond toe",
    "introduction market": "Welkom bij de Cozy winkel!\nHier kun je apps installeren\ndie aangeboden worden door Cozy Cloud, apps uit de gemeenschap of apps door jouzelf zijn gebouwd!",
    "error connectivity issue": "Er is een fout opgetreden tijdens het ophalen van data.<br>Probeer het later nog eens.",
    "package.json not found": "Kan het bestand package.json niet ophalen. Controleer jouw repo URL.",
    "unknown provider": "Voorlopig kunnen applicaties alleen geïnstalleerd worden vanuit Github of de CozyCloud Markt",
    "please wait data retrieval": "Een ogenblik geduld terwijl de data wordt overgehaald...",
    "revoke device confirmation message": "Dit voorkomt dat dit apparaat verbinding kan maken met Cozy. Weet je het zeker?",
    "dashboard": "Instrumentenbord",
    "calendars description": "Beheer jouw gebeurtenissen en synchroniseer ze met je telefoon.",
    "contacts description": "Beheer jouw contacten en synchroniseer ze met je telefoon.",
    "emails description": "Lees, stuur en back-up je e-mail berichten.",
    "files description": "Jouw online bestandssysteem, gesynchroniseerd met jouw apparaten.",
    "photos description": "Organiseer je foto's en deel ze met je vrienden.",
    "sync description": "et gereedschap om jouw contacten en kalender te synchroniseren met je telefoon.",
    "quickmarks description": "Beheer je bladwijzers en sla ze op.",
    "cozic description": "Een muziek speler om vanuit je browser naar jouw muziek te luisteren.",
    "databrowser description": "Blader door en bekijk all je data (ruw formaat).",
    "zero-feeds description": "Voeg jouw feeds samen en sla je favoriete links op als bladwijzer.",
    "kyou description": "Verbeter je gezondheid en geluk door jezelf te kwantificeren.",
    "konnectors description": "Importeer data van verschillende bronnen (Twitter, Jawbone...).",
    "kresus description": "Meer gereedschappen voor jouw persoonlijke financiele beheerder.",
    "nirc description": "Toegang tot jouw favoriete IRC kanalen vanuit jouw Cozy.",
    "shout description": "Toegang tot jouw favoriete IRC kanalen vanuit jouw Cozy met de Shout web applicatie",
    "notes description": "Organiseer en schrijf slimme notities.",
    "owm description": "Ken het weer, waar ook ter wereld.",
    "remote storage description": "Een opslag toepassing om de data uit jouw niet gehoste applicaties. ",
    "tasky description": "Snel en super simpel label gebaseerde taak beheerder.",
    "todos description": "Schrijd jouw taken, zet ze op volgorde en vink ze af op een efficiente manier.",
    "term description": "Een terminal app voor jouw Cozy.",
    "ghost description": "Deel je verhalen met de wereld met deze app gebaseerd op het Ghost Blog Platform.",
    "leave google description": "Een app om de huidige data uit jouw Google account te importeren.",
    "mstsc.js description": "Beheer jouw Windows bureaublad op afstand via het RDP protocol.",
    "hastebin description": "Een simpele pastebin, een gereedschap om makkelijk teksten te delen.",
    "polybios description": "Beheer jouw PGP sleutels vanuit je browser.",
    "frost description": "Bou je eigen Internet archief op, door web pagina's op te nemen in jouw Cozy.",
    "tiddlywiki description": "Een niet lineair persoonlijk web schrijfblok.",
    "hari description": "Versleutelt persoonlijk dagboek.",
    "map description": "Open Street Map in jouw Cozy.",
    "moi description": "A new experience to visualize your data",
    "warning unofficial app": "Dit is een gemeenschaps app en wordt niet onderhouden door het Cozy team.\nOm een fout te melden, leg een probleem in in <a href='https://forum.cozy.io'>ons forum</a>.",
    "update available notification": "Er is een nieuwe versie van %{appName} beschikbaar.",
    "stack update available notification": "Er is een nieuwe versie van het platform beschikbaar.",
    "app broken title": "Kapotte applicatie.",
    "app broken": "Deze applicatie is kapot. Je kunt proberen het opnieuw te installeren:",
    "reinstall broken app": "het opnieuw installeren.",
    "error git": "We kunnen de broncode niet ophalen.",
    "error github repo": "De applicatie repository lijkt niet beschikbaar te zijn.",
    "error github": "Github lijkt niet beschikbaar te zijn. Je kan de status checken op https://status.github.com/.",
    "error npm": "We kunnen de afhankelijkheden van de applicatie niet installeren.",
    "error user linux": "We kunnen geen specifiek Linux gebruiker aanmaken voor deze applicatie.",
    "error start": "Applicatie start niet op. Je kunt meer details vinden in de logboek applicatie.",
    "app msg": "Als de fout blijft optreden, kun je contact opnemen via contact@cozycloud.cc of op IRC #cozycloud op irc.freenode.net.",
    "more details": "Meer details",
    "noapps": {
        "customize your cozy": "Je kunt ook  <a href=\"%{account}\">naar instellingen gaan</a> en jouw Cozy aanpassen,\nof <a href=\"%{appstore}\">kijk in de app winkel</a> om je eerste app te installeren."
    },
    "pick from files": "Kies een foto",
    "Crop the photo": "Snij de foto bij",
    "chooseAgain": "kies een andere foto",
    "modal ok": "OK",
    "modal cancel": "Annuleer",
    "no image": "Er is geen foto op jouw Cozy.",
    "ObjPicker upload btn": "Upload een lokaal bestand",
    "or": "of",
    "drop a file": "Sleep een bestand of",
    "url of an image": "Plak de URL van een foto van het Web",
    "you have no album": "<p>Je hebt geen fotoalbum<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:-(</p><p>Maak er eentje in <a href='/#applications' target='_blank'>de Foto app</a><br>en gebruik foto's gemaakt op je telefoon met de <a href='https://play.google.com/store/apps/details?id=io.cozy.files_client&hl=en' target='_blank'>mobiele app!</a><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:-)</p>",
    "state app installing": "Deze app wordt geïnstalleerd. Even geduld",
    "state app stopped error": "Deze app kan niet gestart worden",
    "stack updating block message": "Jouw Cozy wordt nu bijgewerkt, je kunt het pas gebruiken als het bijwerken is voltooid.",
    "update apps error title": "Er is een fout opgetreden tijdens het bijwerken van apps",
    "update apps error": "Eén of meerdere apps hebben een probleem. Deze applicaties zijn gemarkeerd als kapot. Je zult ze vermoedelijk moeten verwijderen en opnieuw installeren.",
    "update apps error list title": "Kapotte applicaties",
    "update stack error title": "Er is een fout opgetreden tijdens het bijwerken van Cozy",
    "update stack permission changes": "Applicaties in de lijst hieronder zijn niet bijgewerkt vanwege wijzigingen in de vereiste toestemmingen. Werk ze individueel bij en kies of je de nieuwe toestemmingen toekent. ",
    "update stack warning": "Waarschuwing",
    "reboot stack error": "Er is een fout opgetreden tijdens het herstarten van Cozy. Cozy kan onstabiel geworden zijn. Neem contact op met jouw hosting provider als Cozy niet meer werkt."
};
});

require.register("locales/pl", function(exports, require, module) {
module.exports = {
    "home": "Home",
    "apps": "Aplikacje",
    "account": "Konto",
    "email": "Email",
    "timezone": "Strefa czasowa",
    "domain": "Domena",
    "no domain set": "domena.nie.ustawiona",
    "locale": "Lokalizacja",
    "change password": "Zmień hasło",
    "input your current password": "Wpisz swoje aktualne hasło:",
    "enter a new password": "Wpisz swoje nowe hasło:",
    "confirm new password": "Wpisz ponownie swoje nowe hasło:",
    "send changes": "Zapisz",
    "manage": "Zarządzaj",
    "total": "Razem",
    "memory consumption": "Wykorzystanie pamięci",
    "disk consumption": "Wykorzystanie dysku",
    "you have no notifications": "<span>Witaj %{name}</span><br>Aktualnie nie masz żadnych powiadomień.",
    "dismiss all": "Zignoruj wszystkie",
    "add application": "Dodać aplikację?",
    "install": "Zainstaluj",
    "github": "Github",
    "website": "Strona WWW",
    "your app": "Twoje aplikacje!",
    "community contribution": "Community contribution",
    "official application": "Rozwijana przez Cozy",
    "application description": "Opis aplikacji",
    "downloading description": "Ładowanie opisu…",
    "downloading permissions": "Ładowanie uprawnień…",
    "Cancel": "Anuluj",
    "ok": "Ok",
    "applications permissions": "Uprawnienia aplikacji",
    "confirm": "Potwierdź",
    "installing": "Instalowanie",
    "remove": "Usuń",
    "update": "Aktualizuj",
    "config application unmark favorite": "odznacz ulubione",
    "config application mark favorite": "oznacz jako ulubione",
    "started": "uruchomiona",
    "notifications": "Powiadomienia",
    "questions and help forum": "Pytania i pomoc forum",
    "sign out": "Wyloguj",
    "open in a new tab": "Otwórz w nowej zakładce",
    "always on": "zawsze włączony",
    "keep always on": "utrzymuj zawsze właczony",
    "stop this app": "Zatrzymaj aplikację",
    "update required": "Dostępna jest aktualizacja",
    "navbar faq": "Najczęściej Zadawane Pytania",
    "application is installing": "Wczesniejsza instalacja jeszcze trwa.\nPoczekaj na jej zakończenie, potem spróbuj ponownie.",
    "no app message": "Nie masz jeszcze zainstalowanej żadnej aplikacji Cozy.\nPrzejdź do <a href=\"#applications\">Sklep Cozy</a> i zainstaluj nowe aplikacje!",
    "welcome to app store": "Witamy w Sklepie Cozy, tutaj zainstalujesz swoją własną aplikację\nlub dodasz jedną z dostępnych na liście.",
    "installed everything": "Już wszystko zainstalowałeś!",
    "already similarly named app": "Masz już aplikację o podobnej nazwie.",
    "your app list": "Dostęp do aplikacji",
    "customize your cozy": "Dostosuj wygląd Cozy",
    "manage your apps": "Aplikacje",
    "choose your apps": "Zamknij aplikacje",
    "configure your cozy": "Konfiguracja Cozy",
    "ask for assistance": "Poproś o pomoc",
    "logout": "Wyloguj",
    "navbar logout": "Wyloguj",
    "welcome to your cozy": "Witaj w Twoim Cozy!",
    "you have no apps": "Nie masz jeszcze aplikacji.",
    "app management": "Zarządzaj aplikacjami",
    "app store": "Sklep",
    "configuration": "Konfiguracja",
    "assistance": "Wsparcie",
    "hardware consumption": "Sprzęt",
    "gigabytes": "GB",
    "megabytes": "MB",
    "terabyte": "MB",
    "G": "GB",
    "M": "MB",
    "T": "MB",
    "disk unit": "GB",
    "memory unit": "MB",
    "status hard drive label": "Miejsce",
    "status memory label": "Dysk",
    "manage your applications": "Aplikacje",
    "manage your devices": "Podłączone urządzenia",
    "synchronized": "zsynchronizowane",
    "revoke device access": "Odłącz urządzenie",
    "no application installed": "Nie zainstalowano jeszcze żadnych aplikacji.",
    "your parameters": "Twoje ustawienia",
    "alerts and password recovery email": "Twój email, używany do wysyłania powiadomień oraz przywracania hasła.",
    "public name description": "Twoja nazwa użytkownika, wyświetlana gdy udostępnisz komuś plik lub zaprosisz na wydarzenie.",
    "domain name for urls and email": "Nazwa domeny, używana do podłączenia się do Cozy z dowolnego urządzenia oraz tworzenia linków do udostępnianych plików.",
    "account timezone field description": "Twoja strea czasowa, pozwala prawidłowo wyświetlać Twój kalendarz.",
    "save": "Zapisz",
    "saved": "Zapisano",
    "error": "Błąd",
    "error proper email": "Podany adres email jest niepoprawny",
    "error email empty": "Podany email jest pusty",
    "account language field description": "Język interfejsu Cozy:",
    "account background selection": "Wybierz tapetę dla Twojego Cozy Home:",
    "account localization": "Lokalizacja",
    "account identifiers": "Konto",
    "account personalization": "Dostosowanie",
    "account password": "Hasło",
    "account two factors auth": "Uwierzytelnianie dwuetapowe",
    "account 2fa strategy": "Metoda uwierzytelniania",
    "account 2fa hotp": "HOTP (bazująca na liczniku)",
    "account 2fa totp": "TOTP (bazująca na czasie)",
    "enable 2fa": "Włącz uwierzytenianie dwuetapowe",
    "disable 2fa": "Wyłącz uwierzytelnianie dwuteapowe",
    "reset 2fa tokens": "Reset your recovery tokens",
    "account 2fa enabled": "Uwierzyteknianie dwuetapowe zostało włączone. Strona zostanie załadowana na nowo.",
    "account 2fa disabled": "Uwierzyteknianie dwuetapowe zostało wyłączone. Strona zostanie załadowana na nowo.",
    "account 2fa error": "Coś poszło nie tak podczas włączania uwierzytelniania dwuetapowego. Proszę spróbować jeszcze raz za kilka minut lub skontaktować się z działem wsparcia.",
    "account 2fa token explanation": "Uwierzyteknianie dwuetapowe jest włączone w Cozy. Aby skorzystać z niego na Twoim urządzeniu lub w aplikacji, wprowadź następujący klucz podczas konfigurowania ustawień konta:",
    "account 2fa qrcode explanation": "Możesz również zeskanować poniższy kod QR, jeśli Twoja aplikacja ma taką opcję.",
    "account 2fa rectokens": "Below are your recovery tokens. Make sure to copy them somewhere safe (not on Cozy) so you won't get locked outside of your Cozy.",
    "2fa strategy hotp": "Two-factor authentication is enabled on Cozy with the HOTP strategy (counter-based).",
    "2fa strategy totp": "Two-factor authentication is enabled on Cozy with the TOTP strategy (timer-based).",
    "account 2fa hotp reset explanation": "Jeśli zmieniasz aplikację lub urządzenie wykorzystywane do uwierzyteniania na inną / inne, musisz wyzerować licznik aby nie zablokować dostępu swojego Cozy.",
    "2fa reset hotp": "Wyzeruj licznik HOTP",
    "account 2fa reset": "Licznik HOTP został poprawnie wyzerowany.",
    "account 2fa disable explanation": "Możesz wyłaczyć uwierzytelnianie dwuetapowe w dowolnym momencie:",
    "2fa if yubikey": "If you are using a Yubikey to authenticate, use the key below as your Secret Key.",
    "french": "Francuski",
    "english": "Angielski",
    "german": "Niemiecki",
    "spanish": "Hiszpański",
    "korean": "Koreański",
    "japanese": "japoński",
    "portuguese": "Portugalski",
    "russian": "Rosyjski",
    "change password procedure": "Etapy zmiany hasła",
    "current password": "aktualne hasło",
    "new password": "nowe hasło",
    "confirm your new password": "podaj ponownie nowe hasło",
    "save your new password": "Zapisz nowe hasło",
    "do you want assistance": "Czy potrzebujesz pomocy?",
    "help email title": "Email",
    "help twitter title": "Twitter",
    "help forum title": "Forum",
    "help IRC title": "IRC",
    "help github title": "Github",
    "Visit the project website and learn to build your app:": "Odwiedź stronę projektu:",
    "your own application": "Twoja własna aplikacja",
    "installed": "Zainstalowano",
    "updated": "zaktualizowano",
    "updating": "aktualizowanie",
    "update all": "Aktualizuj platformę i aplikacje",
    "show home logs": "Pokaż logi strony głównej",
    "show data system logs": "Pokaż logi danych systemowych",
    "show proxy logs": "Pokaż logi proxy",
    "show logs": "Pokaż logi",
    "update stack": "Aktualizuj platformę",
    "reboot stack waiting message": "Wait please, rebooting takes several minutes.",
    "update stack waiting message": "Wait please, updating takes several minutes.",
    "status no device": "There is no device connected to your Cozy.",
    "download apk": "Download .APK",
    "mobile app promo": "Backup you photos and synchronize your contacts and calendars with your mobile via the dedicated mobile app:",
    "desktop app promo": "You can also download the cozy-desktop client to synchronize your files on your laptop/desktop:",
    "download desktop linux": "Download cozy desktop for Linux",
    "update stack modal title": "Updating your Cozy",
    "update stack modal content": "You are about to update the platform. Your Cozy will be unavailable a few minutes. Is that OK?",
    "update stack modal confirm": "Update",
    "update stack success": "Your applications are updated, page will refresh.",
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
    "app status": "Status",
    "settings": "Settings",
    "help": "Help",
    "change layout": "Change the layout",
    "market app install": "Installing...",
    "install your app": "Install an app from its Git Repository",
    "market install your app": "Just copy/paste its Git URL in the field below:",
    "market install your app tutorial": "To know more about how to build your own app, feel free to read our",
    "market app tutorial": "tutorial",
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
    "map description": "Open Street Map in your Cozy",
    "moi description": "A new experience to visualize your data",
    "warning unofficial app": "This app is a community app and isn't maintained by the Cozy team.\nTo report a bug, please file an issue in <a href='https://forum.cozy.io'>our forum</a>.",
    "update available notification": "A new version of %{appName} is available.",
    "stack update available notification": "A new version of the platform is available.",
    "app broken title": "Broken application",
    "app broken": "This application is broken. Can you try to install it again:",
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
    "you have no album": "<p>You've haven't got any photo album<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:-(</p><p>Create one from the <a href='/#applications' target='_blank'>the Photo app</a><br>and use photos taken from your smartphone with the <a href='https://play.google.com/store/apps/details?id=io.cozy.files_client&hl=en' target='_blank'>mobile app!</a><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:-)</p>",
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
};
});

require.register("locales/pt", function(exports, require, module) {
module.exports = {
    "home": "Inicio",
    "apps": "Aplicações",
    "account": "Conta",
    "email": "Email",
    "timezone": "Fuso Horário",
    "domain": "Dominio",
    "no domain set": "nenhum.dominio.configurado",
    "locale": "Locale",
    "change password": "Mudar Password",
    "input your current password": "coloque a sua password actual",
    "enter a new password": "preencha este campo para colocar a sua nova password",
    "confirm new password": "confirme a sua nova password",
    "send changes": "Gravar Mudanças",
    "manage": "Gerir",
    "total": "Total",
    "memory consumption": "Consumo de Memória",
    "disk consumption": "Consumo de Disco",
    "you have no notifications": "<span>Hello %{name}</span><br>You have currently no notification.",
    "dismiss all": "Dispensar Tudo",
    "add application": "adicionar aplicação ?",
    "install": "Instalar",
    "github": "Github",
    "website": "Website",
    "your app": "a tua aplicação!",
    "community contribution": "contribuição da comunidade",
    "official application": "Developed by Cozy",
    "application description": "Descrição da Aplicação",
    "downloading description": "A fazer download da descrição…",
    "downloading permissions": "A fazer download das permissões…",
    "Cancel": "Cancelar",
    "ok": "Ok",
    "applications permissions": "Permissões da Aplicação",
    "confirm": "Confirmar",
    "installing": "A instalar",
    "remove": "remover",
    "update": "actualizar",
    "config application unmark favorite": "unmark as favorite",
    "config application mark favorite": "mark as favorite",
    "started": "inicidada",
    "notifications": "Notificações",
    "questions and help forum": "Perguntas e fórum de ajuda",
    "sign out": "Sair",
    "open in a new tab": "Abrir numa nova janela",
    "always on": "sempre ligada",
    "keep always on": "manter sempre ligada",
    "stop this app": "parar esta aplicação",
    "update required": "Atualização disponível",
    "navbar faq": "Frequently Asked Questions",
    "application is installing": "Uma aplicação já está a ser instalada.\nPor favor espere que acabe a instalçaõ e tente de novo.",
    "no app message": "Não tem aplicações instaladas no seu Cozy.\nVá á <a href=\"#applications\">loja</a> para instalar algumas!",
    "welcome to app store": "Bem vindo á loja de aplicações, instale a sua aplicação\nou escolha uma da lista.",
    "installed everything": "Já instalou tudo!",
    "already similarly named app": "Já existe uma aplicação com um nome igual.",
    "your app list": "Acceso ás tua aplicações",
    "customize your cozy": "Muda o teu layout",
    "manage your apps": "Gere a tua aplicação",
    "choose your apps": "Escolhe as tuas aplicações",
    "configure your cozy": "Configura o teu Cozy",
    "ask for assistance": "Pede assistência",
    "logout": "sair",
    "navbar logout": "Sign out",
    "welcome to your cozy": "Ben vindo ao teu Cozy!",
    "you have no apps": "Não tens aplicações instaladas",
    "app management": "Gestão de aplicações",
    "app store": "Loja de aplicações",
    "configuration": "Configuração",
    "assistance": "Assistência",
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
    "manage your applications": "Gere as tuas aplicações",
    "manage your devices": "Connected devices",
    "synchronized": "sincronizado",
    "revoke device access": "Revoke device access",
    "no application installed": "Não há aplicações instaladas.",
    "your parameters": "Os seus parâmetros",
    "alerts and password recovery email": "Your email is used for notifications or password recovery.",
    "public name description": "Your username will be displayed when you share files with people or invite them to events.",
    "domain name for urls and email": "The domain name is used to connect to your Cozy from any devices and build sharing URLs.",
    "account timezone field description": "Your time zone helps to properly display your calendar.",
    "save": "guardar",
    "saved": "saved",
    "error": "Error",
    "error proper email": "Given email is not correct",
    "error email empty": "Given email is empty",
    "account language field description": "Choose the language you want to see:",
    "account background selection": "Select your background for your Cozy Home:",
    "account localization": "Localization",
    "account identifiers": "Account",
    "account personalization": "Customization",
    "account password": "Password",
    "account two factors auth": "Two-factor authentication",
    "account 2fa strategy": "Authentication strategy",
    "account 2fa hotp": "HOTP (based on a counter)",
    "account 2fa totp": "TOTP (based on a timer)",
    "enable 2fa": "Enable two-factor authentication",
    "disable 2fa": "Disable two-factor authentication",
    "reset 2fa tokens": "Reset your recovery tokens",
    "account 2fa enabled": "Two-factor authentication has been enabled. Page will now reload.",
    "account 2fa disabled": "Two-factor authentication has been disabled. Page will now reload.",
    "account 2fa error": "There was something wrong while enabling two-factor authentication. Please try again in a few minutes or contact the support.",
    "account 2fa token explanation": "Two-factor authentication is enabled on Cozy. To use it with your favourite app or device, you have to enter the following key when setting up the account:",
    "account 2fa qrcode explanation": "You can also scan the QR code below if your app supports it.",
    "account 2fa rectokens": "Below are your recovery tokens. Make sure to copy them somewhere safe (not on Cozy) so you won't get locked outside of your Cozy.",
    "2fa strategy hotp": "Two-factor authentication is enabled on Cozy with the HOTP strategy (counter-based).",
    "2fa strategy totp": "Two-factor authentication is enabled on Cozy with the TOTP strategy (timer-based).",
    "account 2fa hotp reset explanation": "If you're changing from one authentication app or device to another, you must reset the HOTP counter in order to not get locked outside of your Cozy.",
    "2fa reset hotp": "Reset the HOTP counter",
    "account 2fa reset": "The HOTP counter has been successfully reset.",
    "account 2fa disable explanation": "You can disable the two-factor authentication at any time:",
    "2fa if yubikey": "If you are using a Yubikey to authenticate, use the key below as your Secret Key.",
    "french": "Francês",
    "english": "Inglês",
    "german": "German",
    "spanish": "Spanish",
    "korean": "Korean",
    "japanese": "Japanese",
    "portuguese": "Português",
    "russian": "Russian",
    "change password procedure": "Mudar procedimento de password",
    "current password": "password actual",
    "new password": "password nova",
    "confirm your new password": "confirme a sua nova pasword",
    "save your new password": "Save new password",
    "do you want assistance": "Procura ajuda ?",
    "help email title": "Email",
    "help twitter title": "Twitter",
    "help forum title": "Forum",
    "help IRC title": "IRC",
    "help github title": "Github",
    "Visit the project website and learn to build your app:": "Visita o site do projecto para aprenderes a fazer a tua aplicação:",
    "your own application": "a tua aplicação",
    "installed": "instalada",
    "updated": "actualizada",
    "updating": "a actualizar",
    "update all": "Actualizar todos",
    "show home logs": "Show Home Logs",
    "show data system logs": "Show Data System Logs",
    "show proxy logs": "Show Proxy Logs",
    "show logs": "Show Logs",
    "update stack": "Actualizar",
    "reboot stack waiting message": "Wait please, rebooting takes several minutes.",
    "update stack waiting message": "Wait please, updating takes several minutes.",
    "status no device": "There is no device connected to your Cozy.",
    "download apk": "Download .APK",
    "mobile app promo": "Backup you photos and synchronize your contacts and calendars with your mobile via the dedicated mobile app:",
    "desktop app promo": "You can also download the cozy-desktop client to synchronize your files on your laptop/desktop:",
    "download desktop linux": "Download cozy desktop for Linux",
    "update stack modal title": "Update of your Cozy",
    "update stack modal content": "You are about to update the platform. Your Cozy will be unavailable a few minutes. Are you sure?",
    "update stack modal confirm": "Actualizar",
    "update stack success": "Your applications are updated, page will refresh.",
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
    "broken": "quebrado",
    "start this app": "iniciar esta aplicação",
    "stopped": "parada",
    "retry to install": "repita para instalar",
    "cozy account title": "Cozy - Conta",
    "cozy app store title": "Cozy - Loja",
    "cozy home title": "Cozy - Inicio",
    "cozy applications title": "Cozy - Configurações de aplicações",
    "running": "a correr",
    "cozy help title": "Cozy - Ajuda",
    "help support title": "Official Support",
    "help community title": "Community Support",
    "help direct title": "Direct Message",
    "help documentation title": "Documentation",
    "changing locale requires reload": "Mudar o locale requer que faça refresh á página.",
    "cancel": "cancelar",
    "abort": "abortar",
    "Once updated, this application will require the following permissions:": "Depois de actualizada a aplicação irá requerer as seguintes permissões:",
    "confirm update": "confirmar actualização",
    "confirm install": "confirm install",
    "no specific permissions needed": "Esta aplicação necssita de permissões especificas",
    "removed": "removido",
    "removing": "removing",
    "required permissions": "Permissões necessárias:",
    "finish layout edition": "Guardar",
    "reset customization": "Repo",
    "use icon": "Usar icon",
    "home section favorites": "Favorites",
    "home section leave": "Import",
    "home section main": "Daily",
    "home section productivity": "Productivity",
    "home section data management": "Data",
    "home section personal watch": "Watch",
    "home section misc": "Misc",
    "home section platform": "Platform",
    "app status": "Status",
    "settings": "Settings",
    "help": "Help",
    "change layout": "Mudar o layout",
    "market app install": "Installing...",
    "install your app": "Install an app from its Git Repository",
    "market install your app": "Just copy/paste its Git URL in the field below:",
    "market install your app tutorial": "To know more about how to build your own app, feel free to read our",
    "market app tutorial": "tutorial",
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
    "introduction market": "Bem vindo á loja de aplicações do Cozy. Este é o sitio onde podes personalizar o teu Cozy\nao adicionar aplicações.\nApartir dai podes instalar a aplicação que construiste ou escolher entre\naplicações criadas pela Cozy Cloud e outros programadores.",
    "error connectivity issue": "Ocurreu um erro ao receber os teus dados.<br />Por favor tenta de novo.",
    "package.json not found": "Unable to fetch package.json. Check your repo url.",
    "unknown provider": "For now, applications can only be installed from Github or CozyCloud Market",
    "please wait data retrieval": "Por favor aguarda enquanto os teus dados são recebidos…",
    "revoke device confirmation message": "This will prevent the related device to access your Cozy. Are you sure?",
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
    "map description": "Open Street Map in your Cozy",
    "moi description": "A new experience to visualize your data",
    "warning unofficial app": "This app is a communautary app and isn't maintained by the Cozy team.\nTo report a bug, please file an issue in <a href='https://forum.cozy.io'>our forum</a>.",
    "update available notification": "A new version of %{appName} is available.",
    "stack update available notification": "A new version of the platform is available.",
    "app broken title": "Broken application",
    "app broken": "This application is broken. Can you try to install it again:",
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
        "customize your cozy": "You can also <a href=\"%{account}\">go to your settings</a> to customize your Cozy\nor <a href=\"%{appstore}\">take a look at the App Store</a> to install your first app."
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
    "you have no album": "<p>You've haven't got any photo album<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:-(</p><p>Create one from the <a href='/#applications' target='_blank'>the Photo app</a><br>and use photos taken from your smartphone with the <a href='https://play.google.com/store/apps/details?id=io.cozy.files_client&hl=en' target='_blank'>mobile app!</a><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:-)</p>",
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
};
});

require.register("locales/pt_BR", function(exports, require, module) {
module.exports = {
    "home": "Início",
    "apps": "Aplicativos",
    "account": "Conta",
    "email": "E-mail",
    "timezone": "Fuso horário",
    "domain": "Domínio",
    "no domain set": "nenhum.dominio.registrado",
    "locale": "Localização",
    "change password": "Alterar senha",
    "input your current password": "Digite sua senha atual:",
    "enter a new password": "Digite sua nova senha:",
    "confirm new password": "Confirme sua nova senha:",
    "send changes": "Salvar",
    "manage": "Administrar",
    "total": "Total",
    "memory consumption": "Uso da memória",
    "disk consumption": "Uso do disco",
    "you have no notifications": "<span>Olá %{name}</span><br>Não há notificações.",
    "dismiss all": "Deletar tudo",
    "add application": "Adicionar aplicativo?",
    "install": "Instalar",
    "github": "Github",
    "website": "Website",
    "your app": "Seu aplicativo!",
    "community contribution": "Contribuição comunitária",
    "official application": "Desenvolvido por Cozy",
    "application description": "Descrição do aplicativo",
    "downloading description": "Baixando descrição...",
    "downloading permissions": "Baixando permissões...",
    "Cancel": "Cancelar",
    "ok": "Ok",
    "applications permissions": "Permissões do aplicativo",
    "confirm": "Confirmar",
    "installing": "Instalando",
    "remove": "Remover",
    "update": "Atualizar",
    "config application unmark favorite": "desmarcar como favorito",
    "config application mark favorite": "marcar como favorito",
    "started": "iniciado",
    "notifications": "Notificações",
    "questions and help forum": "Perguntas e fórum de ajuda",
    "sign out": "Sair",
    "open in a new tab": "Abrir em uma nova aba",
    "always on": "sempre ligado",
    "keep always on": "sempre manter ligado",
    "stop this app": "Parar esse aplicativo",
    "update required": "Atualização disponível",
    "navbar faq": "Perguntas Freqüentes",
    "application is installing": "Um aplicativo já está sendo instalado.\nAguarde o término, e então tente novamente.",
    "no app message": "Não há aplicativo no seu Cozy agora.\nEntre em <a href=\"#applications\">Loja Cozy</a> e instale novos aplicativos!",
    "welcome to app store": "Bem-vindo à Loja Cozy, instale seu próprio aplicativo aqui\nou adicione um na lista de disponíveis.",
    "installed everything": "Você já instalou tudo!",
    "already similarly named app": "Você já possui um aplicativo com nome similar.",
    "your app list": "Acessar seus aplicativos",
    "customize your cozy": "Customizar seu esboço",
    "manage your apps": "Aplicativos",
    "choose your apps": "Escolher seus aplicativos",
    "configure your cozy": "Configurar seu Cozy",
    "ask for assistance": "Solicitar ajuda",
    "logout": "Sair",
    "navbar logout": "Sair",
    "welcome to your cozy": "Bem-vindo ao seu Cozy!",
    "you have no apps": "Você não possui aplicativos.",
    "app management": "Administração de aplicativo",
    "app store": "Loja",
    "configuration": "Configuração",
    "assistance": "Assistência",
    "hardware consumption": "Hardware",
    "gigabytes": "GB",
    "megabytes": "MB",
    "terabyte": "MB",
    "G": "GB",
    "M": "MB",
    "T": "MB",
    "disk unit": "GB",
    "memory unit": "MB",
    "status hard drive label": "Capacidade",
    "status memory label": "Memória",
    "manage your applications": "Aplicativos",
    "manage your devices": "Dispositivos conectados",
    "synchronized": "sincronizado",
    "revoke device access": "Desconectar dispositivo",
    "no application installed": "Nenhum aplicativo instalado",
    "your parameters": "Suas configurações",
    "alerts and password recovery email": "Seu e-mail é usado para notificações ou recuperação de senha.",
    "public name description": "Seu nome de usuário será exibido quando você compartilhar arquivos com pessoas ou convidá-las para eventos.",
    "domain name for urls and email": "O nome de domínos é usado para conectar ao seu Cozy de qualquer dispositivo e criar URLs de compartlhamento.",
    "account timezone field description": "Seu fusa horário ajuda a exibir corretamente seu calendário.",
    "save": "Salvar",
    "saved": "Salvo",
    "error": "Erro",
    "error proper email": "E-mail informado incorreto",
    "error email empty": "E-mail informado vazio",
    "account language field description": "Escolha a língua que deseja ver:",
    "account background selection": "Selecione seu plano de fundo para seu Início Cozy:",
    "account localization": "Localização",
    "account identifiers": "Conta",
    "account personalization": "Customização",
    "account password": "Senha",
    "account two factors auth": "Identificação por dois fatores",
    "account 2fa strategy": "Estratégia de identificação",
    "account 2fa hotp": "HOTP (baseado num contador)",
    "account 2fa totp": "TOTP (baseado num relógio)",
    "enable 2fa": "Ativar a identificação por dois fatores",
    "disable 2fa": "Desativar a identificação por dois fatores",
    "reset 2fa tokens": "Atualize seus tokens de recuperação. ",
    "account 2fa enabled": "A identificação por dois fatores foi ativada. A página vai recarregar agora.",
    "account 2fa disabled": "A identificação por dois fatores foi desativada. A página vai recarregar agora.",
    "account 2fa error": "Algo errado ocorreu ativando a identificação por dois fatores. Por favor, tente de novo em alguns minutos ou entre em contato com suporte.",
    "account 2fa token explanation": "A identificação por dois fatores é ativada no seu Cozy. Para usar com seu aplicativo ou seu aparelho favorito, precisa entrar esse código quando configurar a conta:",
    "account 2fa qrcode explanation": "Também pode escanear esse código QR se for suportado pelo aplicativo.",
    "account 2fa rectokens": "Abaixo estão seus tokens de recuperação. Certifique-se de copiá-los para algum lugar seguro (fora do Cozy) para que você não fique trancado fora do seu Cozy. ",
    "2fa strategy hotp": "Autenticação de dois fatores é habilitada no Cozy usando a estratégia HOTP (counter-based).",
    "2fa strategy totp": "Autenticação de dois fatores é habilitada no Cozy usando a estratégia TOTP (timer-based).",
    "account 2fa hotp reset explanation": "Se você trocar um aparelho ou aplicativo de identificação por um outro, você precisa zerar o contador HOTP para não se trancar fora do seu Cozy.",
    "2fa reset hotp": "Zerar o contador HOTP.",
    "account 2fa reset": "O contador HOTP foi zerado.",
    "account 2fa disable explanation": "Pode desativar a identificação por dois fatores quando você quiser:",
    "2fa if yubikey": "Se você estiver usando Yubikey para se autenticar, use a chave abaixo como sua \"Secret Key\".",
    "french": "Francês",
    "english": "Inglês",
    "german": "Alemão",
    "spanish": "Espanhol",
    "korean": "Coreano",
    "japanese": "Japonés",
    "portuguese": "Português",
    "russian": "Russo",
    "change password procedure": "Passos para alterar sua senha",
    "current password": "senha atual",
    "new password": "nova senha",
    "confirm your new password": "confirme sua nova senha",
    "save your new password": "Salvar nova senha",
    "do you want assistance": "Precisa de ajuda?",
    "help email title": "E-mail",
    "help twitter title": "Twitter",
    "help forum title": "Fórum",
    "help IRC title": "IRC",
    "help github title": "Github",
    "Visit the project website and learn to build your app:": "Visite o website do projeto:",
    "your own application": "seu próprio aplicativo",
    "installed": "instalado",
    "updated": "atualizado",
    "updating": "atualizando",
    "update all": "Atualizar o Stack e os aplicativos",
    "show home logs": "Mostrar registros do Home",
    "show data system logs": "Mostrar registros do Data System",
    "show proxy logs": "Mostrar registros do Proxy",
    "show logs": "Mostrar Registros",
    "update stack": "Atualizar a plataforma",
    "reboot stack waiting message": "Espere por favor, vários minutos são necessários para reiniciar.",
    "update stack waiting message": "Espere por favor, alguns minutos são necessários para atualizar.",
    "status no device": "Nenhum dispositivo está conectado a seu Cozy.",
    "download apk": "Baixar .APK",
    "mobile app promo": "Faça uma cópia de segurança dos seus fotos e sincronize seus contatos e seus calendários com seu celular utilizando o aplicativo destinado:",
    "desktop app promo": "Você pode também baixar o cliente cozy-desktop para sincronizar seus arquivos em seu laptop/desktop:",
    "download desktop linux": "Baixe o cozy desktop para GNU/Linux",
    "update stack modal title": "Atualizando seu Cozy",
    "update stack modal content": "Você está prestes a atualizar a plataforma. Seu Cozy não vai estar disponível durante alguns minutos. Está bom para você?",
    "update stack modal confirm": "Atualizar",
    "update stack success": "Seus aplicativos estão atualizados, a página vai atualizar.",
    "update stack error": "Um erro ocorreu durante a atualização. Seu Cozy pode virar instável. Se você perceber qualquer problema, deveria contatar seu fornecedor de alojamento. Quando você vai clicar o botão OK, a janela atual será atualizada.",
    "applications broken": "Aplicativos quebrados",
    "cozy platform": "Plataforma",
    "navbar back button title": "Voltar no Início",
    "navbar notifications": "Notificações",
    "or:": "ou:",
    "reboot stack": "Reiniciar",
    "update error": "Um erro ocorreu durante a atualização do aplicativo.",
    "update failed": "A atualização falhou",
    "error update uninstalled app": "Você não pode atualizar um aplicativo que não é instalado.",
    "notification open application": "Abrir o aplicativo",
    "notification update stack": "Atualizar a plataforma",
    "notification update application": "Atualizar agora",
    "broken": "quebrado",
    "start this app": "Iniciar este aplicativo",
    "stopped": "parado",
    "retry to install": "Tentar a instalação de novo",
    "cozy account title": "Cozy - Configurações",
    "cozy app store title": "Cozy - Loja",
    "cozy home title": "Cozy - Início",
    "cozy applications title": "Cozy - Estado",
    "running": "em execução",
    "cozy help title": "Cozy - Ajuda",
    "help support title": "Suporte Oficial",
    "help community title": "Suporte da Comunidade",
    "help direct title": "Mensagem direta",
    "help documentation title": "Documentação",
    "changing locale requires reload": "É necessário recarregar a página para mudar de localização.",
    "cancel": "cancelar",
    "abort": "abortar",
    "Once updated, this application will require the following permissions:": "Uma vez atualizado, este aplicativo vai precisar das permissões seguintes:",
    "confirm update": "confirmar atualização",
    "confirm install": "confirmar instalação",
    "no specific permissions needed": "Esta aplicativo não precisa de nenhuma permissão",
    "removed": "removido",
    "removing": "removindo",
    "required permissions": "Permissões necessárias",
    "finish layout edition": "Salvar",
    "reset customization": "Reiniciar",
    "use icon": "Utilizar ícone",
    "home section favorites": "Favoritos",
    "home section leave": "Importar",
    "home section main": "Diário",
    "home section productivity": "Produtividade",
    "home section data management": "Dados",
    "home section personal watch": "Observar",
    "home section misc": "Diverso",
    "home section platform": "Plataforma",
    "app status": "Estado",
    "settings": "Configurações",
    "help": "Ajuda",
    "change layout": "Mudar o layout",
    "market app install": "Instalando...",
    "install your app": "Instalar um aplicativo do repositório Github dele",
    "market install your app": "Só copie/cole o URL do Git dele no campo abaixo:",
    "market install your app tutorial": "Para saber mais sobre como construir seu próprio aplicativo, sinta-se livre para ler nosso",
    "market app tutorial": "tutorial",
    "help send message title": "Escrever diretamente ao time Cozy",
    "help send message action": "Enviar",
    "help send logs": "Envie registros do servidor para facilitar a eliminação dos erros.",
    "send message success": "Mensagem enviada com sucesso!",
    "send message error": "Um erro ocorreu enviando sua mensagem para o suporte. Tente envia-lo utilizando um cliente e-mail a support@cozycloud.cc",
    "account change password success": "A senha foi alterada com sucesso.",
    "account change password short": "A nova senha está muito curta.",
    "account change password difference": "A confirmação da senha não corresponde a nova senha.",
    "account change password error": "Algo não funcionou quando mudou sua senha. Verifique que sua senha anterior está correta.",
    "account background add": "Adicionar fundo",
    "introduction market": "Bem-vindo á Loja Cozy!\nAqui você pode instalar\naplicativos fornecidas por Cozy Cloud, pela comunidade ou por você mesmo!",
    "error connectivity issue": "Um erro ocorreu recuperando os dados.<br />Tente de novo mais tarde por favor.",
    "package.json not found": "Não pode ir buscar package.json. Verifique a URL do seu repositorio.",
    "unknown provider": "No momento, só pode instalar aplicativos do Github ou da Loja Cozy.",
    "please wait data retrieval": "Espere por favor, está recuperando os dados...",
    "revoke device confirmation message": "Depois isso, seu aparelho não terá acesso ao seu Cozy. Você tem certeza?",
    "dashboard": "Painel de controle",
    "calendars description": "Administre seus eventos e sincronize-os com seu smartphone.",
    "contacts description": "Administre seus contatos e sincronize-os com seu smartphone.",
    "emails description": "Leia, envie e faça uma cópia de segurança dos seus emails.",
    "files description": "Seu sistema de arquivo online, sincronizado com seus dispositivos.",
    "photos description": "Organize suas fotos e compartilhe-as com seus amigos.",
    "sync description": "A ferramenta necessária para sincronizar seus contatos e calendário com seu celular.",
    "quickmarks description": "Salve e administre seus favoritos.",
    "cozic description": "Um tocador áudio para escutar sua música no seu browser.",
    "databrowser description": "Navegue e visualize todos seus dados (dados brutos).",
    "zero-feeds description": "Agregue seus feeds e salve seus links favoritos.",
    "kyou description": "Melhore sua saúde e sua felicidade se quantificando.",
    "konnectors description": "Importe dados de serviços exteriores (Twitter, Jawbone...).",
    "kresus description": "Ferramentas adicionais para seu administrador personal de finanças.",
    "nirc description": "Acesse seus canais IRC favoritos do seu Cozy.",
    "shout description": "Acesse seus canais IRC favoritos do seu Cozy com o aplicativo Shout Web.",
    "notes description": "Organize e escreva notas espertas.",
    "owm description": "Conheça o tempo de qualquer lugar no mundo.",
    "remote storage description": "Uma ferramenta Remote Storage para armazenar dados dos seus aplicativos Unhosted.",
    "tasky description": "Administrador de tarefas super rápido e simples.",
    "todos description": "Escreva suas tarefas, ordene-as e complete-as eficientemente.",
    "term description": "Um aplicativo de terminal para seu Cozy.",
    "ghost description": "Compartilhe suas histórias com o mundo com esse aplicativo baseado sobre a plataforma Ghost Blogging.",
    "leave google description": "Um aplicativo para importar seus dados atuais da sua conta Google.",
    "mstsc.js description": "Administre remotamente sua área de trabalho Windows a traves do protocolo RDP.",
    "hastebin description": "Um pastebin simples, uma ferramenta para compartlhar textos facilmente.",
    "polybios description": "Administre suas chaves PGP no seu browser.",
    "frost description": "Construir suas lembranças do internet arquivando paginas web no seu Cozy.",
    "tiddlywiki description": "Um caderno web pessoal e não linear.",
    "hari description": "Diário pessoal cifrado.",
    "map description": "Open Street Map no seu Cozy",
    "moi description": "A new experience to visualize your data",
    "warning unofficial app": "Esse aplicativo é um aplicativo da comunidade e a manutenção dele não é feito pela equipe Cozy.\nPara reportar um erro, abre por favor uma discussão no <a href='https://forum.cozy.io'>nosso forum</a>.",
    "update available notification": "Uma nova versão de %{appName} é disponível.",
    "stack update available notification": "Uma nova versão da plataforma é disponível.",
    "app broken title": "Aplicativo quebrado",
    "app broken": "Esse aplicativo está quebrado. Pode tentar instalar-o de novo por favor:",
    "reinstall broken app": "instala-o de novo.",
    "error git": "Não podemos recuperar o código fonte.",
    "error github repo": "O repositório do aplicativo parece indisponível.",
    "error github": "Github parece indisponível. Você pode verificar o estado dele em https://status.github.com/.",
    "error npm": "Não podemos instalar as dependencias do aplicativo.",
    "error user linux": "Não podemos criar um usuário específico para esse aplicativo.",
    "error start": "O aplicativo não inicia. Pode achar mais detalhes no registro do aplicativo.",
    "app msg": "Se o erro permanece, você pode nos contatar no contact@cozycloud.cc ou no IRC #cozycloud no irc.freenode.net.",
    "more details": "Mais detalhes",
    "noapps": {
        "customize your cozy": "Você pode também <a href=\"%{account}\">abrir suas configurações</a> e personalizar seu Cozy,\nou <a href=\"%{appstore}\">dar uma olhada na Loja Cozy</a> para instalar seu primeiro aplicativo."
    },
    "pick from files": "Escolha uma foto",
    "Crop the photo": "Corte a imagem",
    "chooseAgain": "escolha uma outra foto",
    "modal ok": "OK",
    "modal cancel": "Cancelar",
    "no image": "Não tem nenhuma imagem no seu Cozy",
    "ObjPicker upload btn": "Transfira um arquivo local",
    "or": "ou",
    "drop a file": "Arraste e solte um arquivo ou",
    "url of an image": "Cole o URL duma imagem do web",
    "you have no album": "<p>Você não tem nenhum álbum foto<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:-(</p><p>Crie um no <a href='/#applications' target='_blank'>aplicativo Foto</a><br>e utilize as fotos tomadas no seu celular com o <a href='https://play.google.com/store/apps/details?id=io.cozy.files_client&hl=en' target='_blank'>aplicativo para dispositivo móvel!</a><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:-)</p>",
    "state app installing": "Esse aplicativo está sendo instalado. Espere um pouco",
    "state app stopped error": "Esse aplicativo não inicia",
    "stack updating block message": "Seu Cozy está sendo atualizado, não pode utiliza-o antes da atualização acabar.",
    "update apps error title": "Um erro aconteceu atualizando os aplicativos",
    "update apps error": "Um ou vários aplicativos falharam. Aplicativos afetados estão marcados como quebrados. Você precisará provavelmente desinstalar e instalar de novo esses aplicativos.",
    "update apps error list title": "Aplicativos quebrados",
    "update stack error title": "Um erro aconteceu atualizando seu Cozy",
    "update stack permission changes": "Aplicativos enumerados abaixo não foram atualizados por causa de mudanças de permissões. Por favor atualize-os individualmente para escolher se você aceita as novas permissões.",
    "update stack warning": "Aviso",
    "reboot stack error": "Um erro aconteceu reiniciando seu Cozy. O Cozy poderia virar instável. Contate seu fornecedor de alojamento se seu Cozy não funcionar mais."
};
});

require.register("locales/ro", function(exports, require, module) {
module.exports = {
    "home": "Acasă",
    "apps": "Aplicații",
    "account": "Cont",
    "email": "Email",
    "timezone": "Fus orar",
    "domain": "Domeniu",
    "no domain set": "no.domain.set",
    "locale": "Locale",
    "change password": "Schimbă parola",
    "input your current password": "Enter your current password:",
    "enter a new password": "Enter your new password:",
    "confirm new password": "Confirm your new password:",
    "send changes": "Salvează",
    "manage": "Gestioneaza",
    "total": "Total",
    "memory consumption": "Memorie folosită",
    "disk consumption": "Spațiu disc folosit",
    "you have no notifications": "<span>Hello %{name}</span><br>You have currently no notification.",
    "dismiss all": "Anulează tot",
    "add application": "Adaug aplicație?",
    "install": "Instalare",
    "github": "Github",
    "website": "Website",
    "your app": "Aplicația ta!",
    "community contribution": "Contribuția comunității",
    "official application": "Developed by Cozy",
    "application description": "Descrierea Aplicației",
    "downloading description": "Downloadez descriere…",
    "downloading permissions": "Downloadez permisiuni…",
    "Cancel": "Anulare",
    "ok": "Ok",
    "applications permissions": "Permisiunile aplicației",
    "confirm": "Confirm",
    "installing": "Instalez",
    "remove": "Remove",
    "update": "Update",
    "config application unmark favorite": "unmark as favorite",
    "config application mark favorite": "mark as favorite",
    "started": "pornit",
    "notifications": "Notificări",
    "questions and help forum": "Forum pentru întrebări și ajutor",
    "sign out": "Delogare",
    "open in a new tab": "Deschide în tab nou",
    "always on": "mereu pornit",
    "keep always on": "păstreaza mereu pornit",
    "stop this app": "Stop this app",
    "update required": "Actualizare disponibilă",
    "navbar faq": "Frequently Asked Questions",
    "application is installing": "O aplicație deja se instalează.\nAșteaptă să se termine și incearcă din nou.",
    "no app message": "You currently have no app installed on your Cozy.\nGo to the <a href=\"#applications\">Cozy store</a> and install new apps!",
    "welcome to app store": "Welcome to your Cozy store, install your own app from here\nor add one from the available list.",
    "installed everything": "Deja ai instalat tot!",
    "already similarly named app": "Deja ai o aplicație cu același nume.",
    "your app list": "Acceseaza aplicațiile tale",
    "customize your cozy": "Customizează-ti propriul format",
    "manage your apps": "Applications",
    "choose your apps": "Alege-ți aplicațiile",
    "configure your cozy": "Configurează-ti Cozy",
    "ask for assistance": "Cere ajutor",
    "logout": "Sign out",
    "navbar logout": "Sign out",
    "welcome to your cozy": "Bine ai venit in Cozy al tău!",
    "you have no apps": "Nu ai aplicații",
    "app management": "Manageriere aplicații",
    "app store": "Store",
    "configuration": "Configurare",
    "assistance": "Asistență",
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
    "synchronized": "sincronizat",
    "revoke device access": "Revoke device",
    "no application installed": "Nu este nicio aplicație instalată.",
    "your parameters": "Setările tale",
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
    "account two factors auth": "Two-factor authentication",
    "account 2fa strategy": "Authentication strategy",
    "account 2fa hotp": "HOTP (based on a counter)",
    "account 2fa totp": "TOTP (based on a timer)",
    "enable 2fa": "Enable two-factor authentication",
    "disable 2fa": "Disable two-factor authentication",
    "reset 2fa tokens": "Reset your recovery tokens",
    "account 2fa enabled": "Two-factor authentication has been enabled. Page will now reload.",
    "account 2fa disabled": "Two-factor authentication has been disabled. Page will now reload.",
    "account 2fa error": "There was something wrong while enabling two-factor authentication. Please try again in a few minutes or contact the support.",
    "account 2fa token explanation": "Two-factor authentication is enabled on Cozy. To use it with your favourite app or device, you have to enter the following key when setting up the account:",
    "account 2fa qrcode explanation": "You can also scan the QR code below if your app supports it.",
    "account 2fa rectokens": "Below are your recovery tokens. Make sure to copy them somewhere safe (not on Cozy) so you won't get locked outside of your Cozy.",
    "2fa strategy hotp": "Two-factor authentication is enabled on Cozy with the HOTP strategy (counter-based).",
    "2fa strategy totp": "Two-factor authentication is enabled on Cozy with the TOTP strategy (timer-based).",
    "account 2fa hotp reset explanation": "If you're changing from one authentication app or device to another, you must reset the HOTP counter in order to not get locked outside of your Cozy.",
    "2fa reset hotp": "Reset the HOTP counter",
    "account 2fa reset": "The HOTP counter has been successfully reset.",
    "account 2fa disable explanation": "You can disable the two-factor authentication at any time:",
    "2fa if yubikey": "If you are using a Yubikey to authenticate, use the key below as your Secret Key.",
    "french": "Franceză",
    "english": "Engleză",
    "german": "Germană",
    "spanish": "Spanish",
    "korean": "Korean",
    "japanese": "Japanese",
    "portuguese": "Portugheză",
    "russian": "Russian",
    "change password procedure": "Pași pentru a-ți schimba parola",
    "current password": "parola curentă",
    "new password": "noua parolă",
    "confirm your new password": "confirmă noua parolă",
    "save your new password": "Save new password",
    "do you want assistance": "Ai nevoie de niște ajutor?",
    "help email title": "Email",
    "help twitter title": "Twitter",
    "help forum title": "Forum",
    "help IRC title": "IRC",
    "help github title": "Github",
    "Visit the project website and learn to build your app:": "Visit the project website:",
    "your own application": "propria ta aplicație",
    "installed": "instalat",
    "updated": "actualizat",
    "updating": "se actualizează",
    "update all": "Actualizează tot",
    "show home logs": "Show Home Logs",
    "show data system logs": "Show Data System Logs",
    "show proxy logs": "Show Proxy Logs",
    "show logs": "Show Logs",
    "update stack": "Actualizează",
    "reboot stack waiting message": "Wait please, rebooting takes several minutes.",
    "update stack waiting message": "Wait please, updating takes several minutes.",
    "status no device": "There is no device connected to your Cozy.",
    "download apk": "Download .APK",
    "mobile app promo": "Backup you photos and synchronize your contacts and calendars with your mobile via the dedicated mobile app:",
    "desktop app promo": "You can also download the cozy-desktop client to synchronize your files on your laptop/desktop:",
    "download desktop linux": "Download cozy desktop for Linux",
    "update stack modal title": "Cozy se actualizează",
    "update stack modal content": "Ești pe cale sa actualizezi platforma. Cozy va fi indisponibil cateva minute. Este OK?",
    "update stack modal confirm": "Actuazez",
    "update stack success": "Aplicațiile sunt actualizate. Pagina se va reîncărca.",
    "update stack error": "An error occurred during the update. Your Cozy may become unstable. If you notice any troubles, you should contact your hosting provider. When you will click on the OK button, the current window will be refreshed.",
    "applications broken": "Aplicații stricate",
    "cozy platform": "Platformă",
    "navbar back button title": "Back Home",
    "navbar notifications": "Notifications",
    "or:": "or:",
    "reboot stack": "Repornire",
    "update error": "An error occurred while updating the app",
    "update failed": "Update failed",
    "error update uninstalled app": "You can't update an app that is not installed.",
    "notification open application": "Open application",
    "notification update stack": "Update the platform",
    "notification update application": "Update now",
    "broken": "stricat",
    "start this app": "Start this app",
    "stopped": "oprit",
    "retry to install": "Retry installation",
    "cozy account title": "Cozy - Settings",
    "cozy app store title": "Cozy - Store",
    "cozy home title": "Cozy - Acasă",
    "cozy applications title": "Cozy - Status",
    "running": "rulează",
    "cozy help title": "Cozy - Ajutor",
    "help support title": "Official Support",
    "help community title": "Community Support",
    "help direct title": "Direct Message",
    "help documentation title": "Documentation",
    "changing locale requires reload": "Schimbarea setărilor locale necesită reîncărcarea paginii.",
    "cancel": "anulează",
    "abort": "anulează tot procesul",
    "Once updated, this application will require the following permissions:": "Odata actualizată, această aplicație va necesita următoarele permisiuni:",
    "confirm update": "confirmă actualizarea",
    "confirm install": "confirmă instalarea",
    "no specific permissions needed": "Această aplicație nu necesită permisiuni",
    "removed": "înlăturat",
    "removing": "înlătur",
    "required permissions": "Permisiuni necesare",
    "finish layout edition": "Salvez",
    "reset customization": "Revin la setări inițiale",
    "use icon": "Folosește iconița",
    "home section favorites": "Favorites",
    "home section leave": "Import",
    "home section main": "Daily",
    "home section productivity": "Productivity",
    "home section data management": "Data",
    "home section personal watch": "Watch",
    "home section misc": "Misc",
    "home section platform": "Platform",
    "app status": "Status",
    "settings": "Settings",
    "help": "Help",
    "change layout": "Schimbă formatul de afișare",
    "market app install": "Installing...",
    "install your app": "Install an app from its Git Repository",
    "market install your app": "Just copy/paste its Git URL in the field below:",
    "market install your app tutorial": "To know more about how to build your own app, feel free to read our",
    "market app tutorial": "tutorial",
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
    "error connectivity issue": "O eroare a apărut in timpul preluării informației.<br />Te rog, incearcă mai târziu.",
    "package.json not found": "Nu pot prelua package.json. Verifică URL-ul sursă.",
    "unknown provider": "For now, applications can only be installed from Github or CozyCloud Market",
    "please wait data retrieval": "Te rog, asteaptă preluarea informației…",
    "revoke device confirmation message": "Aceasta va preveni dispozitivul să acceseze Cozy-ul tău. Ești sigur?",
    "dashboard": "Panou",
    "calendars description": "Manageriază-ți evenimentele si sincronizează-le cu telefonul.",
    "contacts description": "Manageriază-ți contactele si sincronizează-le cu telefonul.",
    "emails description": "Citește, trimite si fă o copie emailurilor.",
    "files description": "Sistemul tău de fișiere, sincronizat cu dispozitivele tale.",
    "photos description": "Organizează-ti pozele si împartele cu prietenii.",
    "sync description": "Această unealtă necesită sincronizarea contactelor si a calendarului cu telefonul tău.",
    "quickmarks description": "Save and manage your bookmarks.",
    "cozic description": "Un player audio pentru a asculta muzica ta, din browser.",
    "databrowser description": "Vizualizează datele tale in formatul brut.",
    "zero-feeds description": "Aggregate your feeds and save your favorite links as bookmarks.",
    "kyou description": "Îmbunătățește-ți sănătatea si fericirea prin a te evalua.",
    "konnectors description": "Importă-ți datele din servicii externe (Twitter, Jawbone…).",
    "kresus description": "Unelte adiționale pentru propriul tău manager financiar.",
    "nirc description": "Accesează canalele tale preferate de IRC din Cozy-ul tău.",
    "shout description": "Access to your favorite IRC channels from your Cozy with the Shout Web application",
    "notes description": "Organizează si scrie notițe.",
    "owm description": "Poți afla vremea oriunde in lume.",
    "remote storage description": "O modalitate de a stoca datele tale din aplicațiile Unhosted pe storage adiacent.",
    "tasky description": "Adiministrator de sarcini, super rapid si simplu, bazat pe etichete.",
    "todos description": "Scrie-ți sarcinile, ordonează-le si completează-le eficient.",
    "term description": "O aplicație de tip terminal pentru Cozy-ul tău.",
    "ghost description": "Share your stories with the world with this app based on the Ghost Blogging Platform.",
    "leave google description": "An app to import your current data from your Google account.",
    "mstsc.js description": "Manage your Windows Desktop remotely through the RDP protocol.",
    "hastebin description": "A simple pastebin, a tool to easily share texts.",
    "polybios description": "Manage your PGP keys from your browser.",
    "frost description": "Build your internet memories by archiving web pages into your Cozy.",
    "tiddlywiki description": "A non-linear personal web notebook.",
    "hari description": "Encrypted personal diary.",
    "map description": "Open Street Map in your Cozy",
    "moi description": "A new experience to visualize your data",
    "warning unofficial app": "Această aplicație este făcută de comunitate si nu este actualizată de echipa Cozy.\nPentru a raporta un bug, te rog completeaza pe <a href='https://forum.cozy.io'>forumul nostru</a>.",
    "update available notification": "Este disponibilă o versiune nouă a aplicației %{appName}.",
    "stack update available notification": "Este disponibilă o versiune nouă a platformei.",
    "app broken title": "Broken application",
    "app broken": "This application is broken. Can you try to install it again:",
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
        "customize your cozy": "De asemenea <a href=\\\"%{account}\\\">du-te la setări</a> si customizează-ți Cozy-ul,\nsau <a href=\\\"%{appstore}\\\">aruncă o privire la Magazin</a> pentru a-ți instala prima aplicație."
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
    "you have no album": "<p>You've haven't got any photo album<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:-(</p><p>Create one from the <a href='/#applications' target='_blank'>the Photo app</a><br>and use photos taken from your smartphone with the <a href='https://play.google.com/store/apps/details?id=io.cozy.files_client&hl=en' target='_blank'>mobile app!</a><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:-)</p>",
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
};
});

require.register("locales/ro_RO", function(exports, require, module) {
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
    "config application unmark favorite": "unmark as favorite",
    "config application mark favorite": "mark as favorite",
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
    "welcome to app store": "Welcome to your Cozy store, install your own app from here\nor add one from the available list.",
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
    "app store": "Store",
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
    "account two factors auth": "Two-factor authentication",
    "account 2fa strategy": "Authentication strategy",
    "account 2fa hotp": "HOTP (based on a counter)",
    "account 2fa totp": "TOTP (based on a timer)",
    "enable 2fa": "Enable two-factor authentication",
    "disable 2fa": "Disable two-factor authentication",
    "reset 2fa tokens": "Reset your recovery tokens",
    "account 2fa enabled": "Two-factor authentication has been enabled. Page will now reload.",
    "account 2fa disabled": "Two-factor authentication has been disabled. Page will now reload.",
    "account 2fa error": "There was something wrong while enabling two-factor authentication. Please try again in a few minutes or contact the support.",
    "account 2fa token explanation": "Two-factor authentication is enabled on Cozy. To use it with your favourite app or device, you have to enter the following key when setting up the account:",
    "account 2fa qrcode explanation": "You can also scan the QR code below if your app supports it.",
    "account 2fa rectokens": "Below are your recovery tokens. Make sure to copy them somewhere safe (not on Cozy) so you won't get locked outside of your Cozy.",
    "2fa strategy hotp": "Two-factor authentication is enabled on Cozy with the HOTP strategy (counter-based).",
    "2fa strategy totp": "Two-factor authentication is enabled on Cozy with the TOTP strategy (timer-based).",
    "account 2fa hotp reset explanation": "If you're changing from one authentication app or device to another, you must reset the HOTP counter in order to not get locked outside of your Cozy.",
    "2fa reset hotp": "Reset the HOTP counter",
    "account 2fa reset": "The HOTP counter has been successfully reset.",
    "account 2fa disable explanation": "You can disable the two-factor authentication at any time:",
    "2fa if yubikey": "If you are using a Yubikey to authenticate, use the key below as your Secret Key.",
    "french": "French",
    "english": "English",
    "german": "German",
    "spanish": "Spanish",
    "korean": "Korean",
    "japanese": "Japanese",
    "portuguese": "Portuguese",
    "russian": "Russian",
    "change password procedure": "Steps to change your password",
    "current password": "current password",
    "new password": "new password",
    "confirm your new password": "confirm your new password",
    "save your new password": "Save new password",
    "do you want assistance": "Do you need some help?",
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
    "update all": "Update all",
    "show home logs": "Show Home Logs",
    "show data system logs": "Show Data System Logs",
    "show proxy logs": "Show Proxy Logs",
    "show logs": "Show Logs",
    "update stack": "Update",
    "reboot stack waiting message": "Wait please, rebooting takes several minutes.",
    "update stack waiting message": "Wait please, updating takes several minutes.",
    "status no device": "There is no device connected to your Cozy.",
    "download apk": "Download .APK",
    "mobile app promo": "Backup you photos and synchronize your contacts and calendars with your mobile via the dedicated mobile app:",
    "desktop app promo": "You can also download the cozy-desktop client to synchronize your files on your laptop/desktop:",
    "download desktop linux": "Download cozy desktop for Linux",
    "update stack modal title": "Updating your Cozy",
    "update stack modal content": "You are about to update the platform. Your Cozy will be unavailable a few minutes. Is that OK?",
    "update stack modal confirm": "Update",
    "update stack success": "Your applications are updated, page will refresh.",
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
    "app status": "Status",
    "settings": "Settings",
    "help": "Help",
    "change layout": "Change the layout",
    "market app install": "Installing...",
    "install your app": "Install an app from its Git Repository",
    "market install your app": "Just copy/paste its Git URL in the field below:",
    "market install your app tutorial": "To know more about how to build your own app, feel free to read our",
    "market app tutorial": "tutorial",
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
    "map description": "Open Street Map in your Cozy",
    "moi description": "A new experience to visualize your data",
    "warning unofficial app": "This app is a community app and isn't maintained by the Cozy team.\nTo report a bug, please file an issue in <a href='https://forum.cozy.io'>our forum</a>.",
    "update available notification": "A new version of %{appName} is available.",
    "stack update available notification": "A new version of the platform is available.",
    "app broken title": "Broken application",
    "app broken": "This application is broken. Can you try to install it again:",
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
    "you have no album": "<p>You've haven't got any photo album<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:-(</p><p>Create one from the <a href='/#applications' target='_blank'>the Photo app</a><br>and use photos taken from your smartphone with the <a href='https://play.google.com/store/apps/details?id=io.cozy.files_client&hl=en' target='_blank'>mobile app!</a><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:-)</p>",
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
};
});

require.register("locales/ru", function(exports, require, module) {
module.exports = {
    "home": "Главная",
    "apps": "Приложения",
    "account": "Аккаунт",
    "email": "Email",
    "timezone": "Часовой пояс",
    "domain": "Домен",
    "no domain set": "Домен не задан",
    "locale": "Язык",
    "change password": "Изменить пароль",
    "input your current password": "Ваш текущий пароль:",
    "enter a new password": "Новый пароль:",
    "confirm new password": "Подтвердите новый пароль:",
    "send changes": "Сохранить",
    "manage": "Управление",
    "total": "Всего",
    "memory consumption": "Использование памяти",
    "disk consumption": "Использование диска",
    "you have no notifications": "<span>Привет %{name}</span><br>Нет новых уведомлений.",
    "dismiss all": "Отклонить все",
    "add application": "Добавить приложение?",
    "install": "Установить",
    "github": "Github",
    "website": "Website",
    "your app": "Ваше приложение!",
    "community contribution": "Вклад сообщества",
    "official application": "Разработано Cozy",
    "application description": "Описание приложения",
    "downloading description": "Загрузка описания...",
    "downloading permissions": "Загрузка прав...",
    "Cancel": "Отмена",
    "ok": "Ок",
    "applications permissions": "Права приложения",
    "confirm": "Подтвердить",
    "installing": "Установка",
    "remove": "Удалить",
    "update": "Обновить",
    "config application unmark favorite": "убрать из избранного",
    "config application mark favorite": "добавить в избранное",
    "started": "начато",
    "notifications": "Уведомления",
    "questions and help forum": "Вопросы и форум помощи",
    "sign out": "Выйти",
    "open in a new tab": "Открыть в новой вкладке",
    "always on": "всегда включено",
    "keep always on": "держать всегда включенным",
    "stop this app": "Остановить это приложение",
    "update required": "Доступно обновление",
    "navbar faq": "Часто задаваемые вопросы",
    "application is installing": "Приложение уже устанавливается.\nДождитесь завершения, затем повторите попытку.",
    "no app message": "Приложения не установлены.\nПерейдите в <a href=\"#applications\">магазин приложений Cozy</a> и выберите приложения для установки!",
    "welcome to app store": "Добро пожаловать в магазин приложений Cozy.",
    "installed everything": "Вы уже все установили!",
    "already similarly named app": "У вас уже есть приложение с таким именем.",
    "your app list": "Доступ к приложениям",
    "customize your cozy": "Настройте свой макет",
    "manage your apps": "Приложения",
    "choose your apps": "Выберите приложения",
    "configure your cozy": "Настройте ваш cozy",
    "ask for assistance": "Попросить о помощи",
    "logout": "Выход",
    "navbar logout": "Выход",
    "welcome to your cozy": "Добро пожаловать в ваш Cozy!",
    "you have no apps": "У вас нет приложений.",
    "app management": "Управление приложением",
    "app store": "Магазин",
    "configuration": "Конфигурация",
    "assistance": "Помощь",
    "hardware consumption": "Аппаратные средства",
    "gigabytes": "Гигобайт",
    "megabytes": "Мегабайт",
    "terabyte": "Мб.",
    "G": "Гб.",
    "M": "Мб.",
    "T": "Мб.",
    "disk unit": "Гб",
    "memory unit": "Мб",
    "status hard drive label": "Дисковое пространство",
    "status memory label": "Память",
    "manage your applications": "Приложения",
    "manage your devices": "Устройства",
    "synchronized": "синхронизировано",
    "revoke device access": "Отозвать доступ устройства",
    "no application installed": "Нет установленных приложений.",
    "your parameters": "Настройки",
    "alerts and password recovery email": "Ваш e-mail используется для уведомлений или восстановления пароля.",
    "public name description": "Ваше никнейм будет показан при расшаривании файлов или в приглашениях на события календаря.",
    "domain name for urls and email": "Домен используется для The domain name is used to connect to your Cozy from any devices and build sharing URLs.",
    "account timezone field description": "Ваш Часовой пояс позволяет правильно отображать календарь.",
    "save": "Сохранить",
    "saved": "Сохранено",
    "error": "Ошибка",
    "error proper email": "Указанный e-mail некорректен",
    "error email empty": "Указанный e-mail пустой",
    "account language field description": "Выберите язык, который вы хотите видеть:",
    "account background selection": "Выберите фон для Cozy Home:",
    "account localization": "Локализация",
    "account identifiers": "Аккаунт",
    "account personalization": "Настройка",
    "account password": "Password",
    "account two factors auth": "Двухфакторная аутентификация",
    "account 2fa strategy": "Стратегия Аутентификации",
    "account 2fa hotp": "HOTP (основана на счетчике)",
    "account 2fa totp": "TOTP (основана на таймере)",
    "enable 2fa": "Включить двухфакторную аутентификацию",
    "disable 2fa": "Отключить двухфакторную аутентификацию",
    "reset 2fa tokens": "Сброс ваших токенов восстановления",
    "account 2fa enabled": "Двухфакторная аутентификация была включена. Страница будет обновлена.",
    "account 2fa disabled": "Двухфакторная аутентификация была отключена. Страница будет обновлена.",
    "account 2fa error": "Что-то пошло не так при включении двухфакторной аутентификации. Попробуйте повторить попытку через несколько минут или обратитесь в поддержку.",
    "account 2fa token explanation": "Двухфакторная аутентификация включена в Cozy. Чтобы использовать её с вашим любимым приложением или устройством вам нужно ввести следующий ключ при настройке учетной записи:",
    "account 2fa qrcode explanation": "Вы также можете сканировать QR-код ниже, если приложение поддерживает эту функцию.",
    "account 2fa rectokens": "Ниже приведены токены восстановления. Убедитесь в том, чтобы скопировали их в безопасное место( не в Cozy), чтобы не остаться без доступа к Cozy.",
    "2fa strategy hotp": "Двухфакторная аутентификация с HOTP(по точкам) схемой включена.",
    "2fa strategy totp": "Двухфакторная аутентификация с TOTP(по времени) схемой включена.",
    "account 2fa hotp reset explanation": "Если вы меняете одну программу аутентификации или девайс на другие, вы должны сбросить HOTP счетчик, чтобы не потерять доступ к вашему Cozy.",
    "2fa reset hotp": "Сброс HOTP счетчик",
    "account 2fa reset": "Счетчик HOTP успешно сброшен.",
    "account 2fa disable explanation": "Вы можете отключить двухфакторную аутентификацию в любое время:",
    "2fa if yubikey": "Если вы используете Yubikey для аутентификации, используйте ключ ниже, как свой секретный ключ.",
    "french": "Французский",
    "english": "Английский",
    "german": "Немецкий",
    "spanish": "Spanish",
    "korean": "Корейский",
    "japanese": "Японский",
    "portuguese": "Португальский",
    "russian": "Русский",
    "change password procedure": "Этап изменения пароля",
    "current password": "Текущий пароль",
    "new password": "Новый пароль",
    "confirm your new password": "Подтвердите новый пароль",
    "save your new password": "Сохранить новый пароль",
    "do you want assistance": "Вам помочь?",
    "help email title": "Email",
    "help twitter title": "Twitter",
    "help forum title": "Форму",
    "help IRC title": "IRC",
    "help github title": "Github",
    "Visit the project website and learn to build your app:": "Посетите сайт проекта:",
    "your own application": "ваше собственное приложение",
    "installed": "установлено",
    "updated": "обновлено",
    "updating": "обновление",
    "update all": "Обновить все",
    "show home logs": "Показать Home Logs",
    "show data system logs": "Показать Data System Logs",
    "show proxy logs": "Показать Proxy Logs",
    "show logs": "Показать Логи",
    "update stack": "Обновить",
    "reboot stack waiting message": "Пожалуйста, подождите, обновление занимает несколько минут.",
    "update stack waiting message": "Пожалуйста, подождите, обновление занимает несколько минут.",
    "status no device": "Нет устройств подключенных к вашему Cozy.",
    "download apk": "Загрузить .APK",
    "mobile app promo": "Через специальное приложение доступна синхронизация контактов, календаря и резервное копирование фотографий с телефона:",
    "desktop app promo": "Вы можете скачать десктоп клиент Cozy для синхронизации ваших файлов на ноутбуке/ПК:",
    "download desktop linux": "Загрузить Cozy десктоп на Linux",
    "update stack modal title": "Обновление вашего Cozy",
    "update stack modal content": "Вы собираетесь обновить платформу. Ваш Cozy будет недоступен несколько минут. Хорошо?",
    "update stack modal confirm": "Обновить",
    "update stack success": "Ваши приложения будут обновлены, страница будет перезагружена.",
    "update stack error": "Произошла ошибка во время обновления. Ваш Cozy может работать нестабильно. Если Вы заметите какие-либо проблемы, вам следует связаться с вашим хостинг-провайдером. Когда Вы нажмете на кнопку OK, текущее окно будет обновлено.",
    "applications broken": "Приложения сломаны",
    "cozy platform": "Платформа",
    "navbar back button title": "Главная",
    "navbar notifications": "Уведомления",
    "or:": "или:",
    "reboot stack": "Перезагрузить",
    "update error": "Произошла ошибка при обновлении приложения",
    "update failed": "Обновление прервано",
    "error update uninstalled app": "Вы не можете обновить приложение, которое не установлено.",
    "notification open application": "Открыть приложение",
    "notification update stack": "Обновить платформу",
    "notification update application": "Обновить",
    "broken": "сломано",
    "start this app": "Запустить приложение",
    "stopped": "остановлено",
    "retry to install": "Попробовать еще раз",
    "cozy account title": "Cozy - Настройки",
    "cozy app store title": "Cozy - Магазин",
    "cozy home title": "Cozy - Главная",
    "cozy applications title": "Cozy - Состояние",
    "running": "работает",
    "cozy help title": "Cozy - Помощь",
    "help support title": "Официальная поддержка",
    "help community title": "Поддержка сообщества",
    "help direct title": "Прямое Сообщение",
    "help documentation title": "Документация",
    "changing locale requires reload": "Изменение языка требует перезагрузки страницы.",
    "cancel": "отмена",
    "abort": "отменить",
    "Once updated, this application will require the following permissions:": "После обновления этому приложению потребуются следующие разрешения:",
    "confirm update": "подтвердить обновление",
    "confirm install": "подтвердить установку",
    "no specific permissions needed": "Это приложение не требует никаких разрешений",
    "removed": "удалено",
    "removing": "удалить",
    "required permissions": "Требуемые разрешения",
    "finish layout edition": "Сохранить",
    "reset customization": "Сбросить",
    "use icon": "Использовать иконку",
    "home section favorites": "Избранное",
    "home section leave": "Импорт",
    "home section main": "Ежедневно",
    "home section productivity": "Продуктивность",
    "home section data management": "Данные",
    "home section personal watch": "Смотреть",
    "home section misc": "Misc",
    "home section platform": "Платформа",
    "app status": "Мои приложения",
    "settings": "Настройки",
    "help": "Помощь",
    "change layout": "Сменить макет",
    "market app install": "Установка...",
    "install your app": "Установить приложение из репозитария GitHub",
    "market install your app": "Просто скопируйте/вставьте его Git URL в поле ниже:",
    "market install your app tutorial": "Чтобы узнать больше о том, как создавать ваши собственные приложения, не стесняйтесь читать наши",
    "market app tutorial": "руководство",
    "help send message title": "Написать напрямую Cozy Team",
    "help send message action": "Отправить",
    "help send logs": "Отправить логи сервера для ускорения решения проблемы",
    "send message success": "Сообщение успешно отправлено!",
    "send message error": "Произошла ошибка при отправке сообщения в техподдержку. Попробуйте отправить его через клиент электронной почты на адрес support@cozycloud.cc",
    "account change password success": "Пароль успешно изменен.",
    "account change password short": "Новый пароль слишком короткий.",
    "account change password difference": "Подтверждение пароля не совпадает с новым паролем.",
    "account change password error": "Что-то не так при смене пароля. Убедитесь, что ваш предыдущий пароль введен верно.",
    "account background add": "Добавить фоновое изображение",
    "introduction market": "Приветствуем в магазине приложений Cozy!\nЗдесь вы можете установить\nприложения созданные нашей командой, приложения сообщества или приложения созданные вами!!!",
    "error connectivity issue": "Произошла ошибка при извлечении данных.<br />Повторите попытку позднее.",
    "package.json not found": "Невозможно получить package.json. Проверьте URL-адрес репозитория.",
    "unknown provider": "Сейчас приложения могуть быть установлены из Github или CozyCloud Market",
    "please wait data retrieval": "Пожалуйста, дождитесь получения данных…",
    "revoke device confirmation message": "Это предохранит устройство от доступа к вашему Cozy. Вы уверены?",
    "dashboard": "Dashboard",
    "calendars description": "Редактируйте события календаря и синхронизируйте их с вашим смартфоном.",
    "contacts description": "Редактируйте ваши контакты и синхронизируйте их с вашим смартфоном.",
    "emails description": "Читайте, отправляйте и сохраняйте ваши письма.",
    "files description": "Онлайн файловая система с функцией синхронизации с вашими устройствами.",
    "photos description": "Упорядочите ваши фотографии и делитесь ими с друзьями.",
    "sync description": "Инструмент необходимый для синхронизации контактов и календаря со смартфоном.",
    "quickmarks description": "Сохраняйте и управляйте вашими закладками.",
    "cozic description": "Аудио плеер для прослушивания музыки прямо в браузере.",
    "databrowser description": "Обзор и отображение всех ваших файлов (в исходном формате).",
    "zero-feeds description": "Собирайте интересные вам новости и сохраняйте избранное в закладках.",
    "kyou description": "Улучшить свое здоровье и счастье путем количественной оценки себя.",
    "konnectors description": "Загрузка данных из внешних сервисов (Twitter, Jawbone…).",
    "kresus description": "Дополнительные инструменты для управления вашими финансами.",
    "nirc description": "Получите доступ к вашим любимым IRC каналам из Cozy.",
    "shout description": "Получите доступ к вашим любимым IRC каналам из Cozy с помощью веб-приложения.",
    "notes description": "Пишите и систематизируйте заметки.",
    "owm description": "Узнайте погоду в любом месте мира.",
    "remote storage description": "Удаленное хранение данных  для приложение поддерживающих функцию Remote Storage.",
    "tasky description": "Быстрый и простой менеджер задач с системой тегов.",
    "todos description": "Пишите ваши задачи, меняйте их приоритет и эффективно их выполняйте.",
    "term description": "Встроенный терминал в вашем Cozy.",
    "ghost description": "Поделитесь с миром вашими историями через это приложение построенное на Ghost Blogging Platform.",
    "leave google description": "Приложение для загрузки ваших данных из аккаунта Google.",
    "mstsc.js description": "Управляйте вашим ПК на Windows через RDP протокол.",
    "hastebin description": "Простая pastebin, инструмент для быстрого расшаривания текста.",
    "polybios description": "Управляйте вашими PGP ключами прямо в браузере.",
    "frost description": "Сохраните ваши интернет воспоминания архивируя веб страницы в вашем Cozy.",
    "tiddlywiki description": "Персональный нелинейный веб блокнот.",
    "hari description": "Зашифрованный личный дневник",
    "map description": "Открыть Street Map в вашем Cozy",
    "moi description": "A new experience to visualize your data",
    "warning unofficial app": "Это приложение разработано сообществом и не поддержвиется командой разработчиком Cozy.\nЧтобы сообщить о проблеме, задайте вопрос на  <a href='https://forum.cozy.io'>нашем форуме</a>.",
    "update available notification": "Доступна новая версия %{appName}.",
    "stack update available notification": "Доступна новая версия платформы.",
    "app broken title": "Неисправное приложение",
    "app broken": "Это приложение неисправно. Вы можете попробовать установить его снова:",
    "reinstall broken app": "переустановить.",
    "error git": "Мы не можем получить исходный код.",
    "error github repo": "Хранилище приложений недоступно.",
    "error github": "Github недоступен. Вы можете проверить его статус на https://status.github.com/.",
    "error npm": "Мы не можем установить зависимости приложения.",
    "error user linux": "Мы не можем создать отдельного пользователя в Linux для этого приложения.",
    "error start": "Приложение не может запуститься. Дополнительные сведения можно найти в журнале приложений.",
    "app msg": "Если ошибка не устранилась, вы можете связаться с нами по contact@cozycloud.cc или в IRC #cozycloud на irc.freenode.net.",
    "more details": "Подробнее",
    "noapps": {
        "customize your cozy": "Теперь вы можете  <a href=\"%{account}\">перейти к настройкам</a> и настроить ваш Cozy или <a href=\"%{appstore}\">зайти в Магазин</a> для установки вашего первого приложения."
    },
    "pick from files": "Выбрать фото",
    "Crop the photo": "Обрезка изображения",
    "chooseAgain": "выбрать другое фото",
    "modal ok": "OK",
    "modal cancel": "Отмена",
    "no image": "Нет изображения для Cozy",
    "ObjPicker upload btn": "Загрузить файл",
    "or": "или",
    "drop a file": "Перетащите файл или",
    "url of an image": "Вставьте URL-адрес изображения из интернета",
    "you have no album": "<p>У вас нету фотоальбомов<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:-(</p><p>Создать один из<a href='/#applications' target='_blank'>Приложение Фотографий</a><br>и использовать фотографии полученные со смартфона из <a href='https://play.google.com/store/apps/details?id=io.cozy.files_client&hl=en' target='_blank'>мобильного приложения!</a><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:-)</p>",
    "state app installing": "Это приложение устанавливается. Подождите немного",
    "state app stopped error": "Это приложение не запускается",
    "stack updating block message": "Ваш Cozy обновляется, вы не сможете использовать его до окончания обновления.",
    "update apps error title": "Произошла ошибка при обновлении приложения",
    "update apps error": "Одно или несколько приложений не отвечают. Затронутые приложения отмечены как неисправные. Вам, вероятно, придется удалить и переустановить эти приложения.",
    "update apps error list title": "Неисправные приложения",
    "update stack error title": "Произошла ошибка при обновлении Cozy",
    "update stack permission changes": "Приложения, перечисленные ниже не были обновлены из-за изменения необходимых разрешений. Пожалуйста, обновите их вручную,  чтобы выбрать, хотите ли вы принять нового разрешения.",
    "update stack warning": "Внимание",
    "reboot stack error": "Произошла ошибка при перезагрузки Cozy. Cozy может работать нестабильно. Свяжитесь с вашим хостинг-провайдером, если Cozy не работает."
};
});

require.register("locales/sq", function(exports, require, module) {
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
    "config application unmark favorite": "unmark as favorite",
    "config application mark favorite": "mark as favorite",
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
    "app store": "Store",
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
    "account two factors auth": "Two-factor authentication",
    "account 2fa strategy": "Authentication strategy",
    "account 2fa hotp": "HOTP (based on a counter)",
    "account 2fa totp": "TOTP (based on a timer)",
    "enable 2fa": "Enable two-factor authentication",
    "disable 2fa": "Disable two-factor authentication",
    "reset 2fa tokens": "Reset your recovery tokens",
    "account 2fa enabled": "Two-factor authentication has been enabled. Page will now reload.",
    "account 2fa disabled": "Two-factor authentication has been disabled. Page will now reload.",
    "account 2fa error": "There was something wrong while enabling two-factor authentication. Please try again in a few minutes or contact the support.",
    "account 2fa token explanation": "Two-factor authentication is enabled on Cozy. To use it with your favourite app or device, you have to enter the following key when setting up the account:",
    "account 2fa qrcode explanation": "You can also scan the QR code below if your app supports it.",
    "account 2fa rectokens": "Below are your recovery tokens. Make sure to copy them somewhere safe (not on Cozy) so you won't get locked outside of your Cozy.",
    "2fa strategy hotp": "Two-factor authentication is enabled on Cozy with the HOTP strategy (counter-based).",
    "2fa strategy totp": "Two-factor authentication is enabled on Cozy with the TOTP strategy (timer-based).",
    "account 2fa hotp reset explanation": "If you're changing from one authentication app or device to another, you must reset the HOTP counter in order to not get locked outside of your Cozy.",
    "2fa reset hotp": "Reset the HOTP counter",
    "account 2fa reset": "The HOTP counter has been successfully reset.",
    "account 2fa disable explanation": "You can disable the two-factor authentication at any time:",
    "2fa if yubikey": "If you are using a Yubikey to authenticate, use the key below as your Secret Key.",
    "french": "French",
    "english": "English",
    "german": "German",
    "spanish": "Spanish",
    "korean": "Korean",
    "japanese": "Japanese",
    "portuguese": "Portuguese",
    "russian": "Russian",
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
    "desktop app promo": "You can also download the cozy-desktop client to synchronize your files on your laptop/desktop:",
    "download desktop linux": "Download cozy desktop for Linux",
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
    "settings": "Settings",
    "help": "Help",
    "change layout": "Change the layout",
    "market app install": "Installing...",
    "install your app": "Install an app from its Git Repository",
    "market install your app": "Just copy/paste its Git URL in the field below:",
    "market install your app tutorial": "To know more about how to build your own app, feel free to read our",
    "market app tutorial": "tutorial",
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
    "map description": "Open Street Map in your Cozy",
    "moi description": "A new experience to visualize your data",
    "warning unofficial app": "This app is a community app and isn't maintained by the Cozy team.\nTo report a bug, please file an issue in <a href='https://forum.cozy.io'>our forum</a>.",
    "update available notification": "A new version of %{appName} is available.",
    "stack update available notification": "A new version of the platform is available.",
    "app broken title": "Broken application",
    "app broken": "This application is broken. Can you try to install it again:",
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
};
});

require.register("locales/sq_AL", function(exports, require, module) {
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
    "config application unmark favorite": "unmark as favorite",
    "config application mark favorite": "mark as favorite",
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
    "app store": "Store",
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
    "account two factors auth": "Two-factor authentication",
    "account 2fa strategy": "Authentication strategy",
    "account 2fa hotp": "HOTP (based on a counter)",
    "account 2fa totp": "TOTP (based on a timer)",
    "enable 2fa": "Enable two-factor authentication",
    "disable 2fa": "Disable two-factor authentication",
    "reset 2fa tokens": "Reset your recovery tokens",
    "account 2fa enabled": "Two-factor authentication has been enabled. Page will now reload.",
    "account 2fa disabled": "Two-factor authentication has been disabled. Page will now reload.",
    "account 2fa error": "There was something wrong while enabling two-factor authentication. Please try again in a few minutes or contact the support.",
    "account 2fa token explanation": "Two-factor authentication is enabled on Cozy. To use it with your favourite app or device, you have to enter the following key when setting up the account:",
    "account 2fa qrcode explanation": "You can also scan the QR code below if your app supports it.",
    "account 2fa rectokens": "Below are your recovery tokens. Make sure to copy them somewhere safe (not on Cozy) so you won't get locked outside of your Cozy.",
    "2fa strategy hotp": "Two-factor authentication is enabled on Cozy with the HOTP strategy (counter-based).",
    "2fa strategy totp": "Two-factor authentication is enabled on Cozy with the TOTP strategy (timer-based).",
    "account 2fa hotp reset explanation": "If you're changing from one authentication app or device to another, you must reset the HOTP counter in order to not get locked outside of your Cozy.",
    "2fa reset hotp": "Reset the HOTP counter",
    "account 2fa reset": "The HOTP counter has been successfully reset.",
    "account 2fa disable explanation": "You can disable the two-factor authentication at any time:",
    "2fa if yubikey": "If you are using a Yubikey to authenticate, use the key below as your Secret Key.",
    "french": "French",
    "english": "English",
    "german": "German",
    "spanish": "Spanish",
    "korean": "Korean",
    "japanese": "Japanese",
    "portuguese": "Portuguese",
    "russian": "Russian",
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
    "desktop app promo": "You can also download the cozy-desktop client to synchronize your files on your laptop/desktop:",
    "download desktop linux": "Download cozy desktop for Linux",
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
    "settings": "Settings",
    "help": "Help",
    "change layout": "Change the layout",
    "market app install": "Installing...",
    "install your app": "Install an app from its Git Repository",
    "market install your app": "Just copy/paste its Git URL in the field below:",
    "market install your app tutorial": "To know more about how to build your own app, feel free to read our",
    "market app tutorial": "tutorial",
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
    "map description": "Open Street Map in your Cozy",
    "moi description": "A new experience to visualize your data",
    "warning unofficial app": "This app is a community app and isn't maintained by the Cozy team.\nTo report a bug, please file an issue in <a href='https://forum.cozy.io'>our forum</a>.",
    "update available notification": "A new version of %{appName} is available.",
    "stack update available notification": "A new version of the platform is available.",
    "app broken title": "Broken application",
    "app broken": "This application is broken. Can you try to install it again:",
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
};
});

require.register("locales/tr", function(exports, require, module) {
module.exports = {
    "home": "Ana Sayfa",
    "apps": "Uygulamalar",
    "account": "Hesap",
    "email": "Eposta",
    "timezone": "Time zone",
    "domain": "Domain",
    "no domain set": "no.domain.set",
    "locale": "Yerel",
    "change password": "Şifre Değiştir",
    "input your current password": "Geçerli şifrenizi giriniz:",
    "enter a new password": "Yeni şifreyi giriniz : ",
    "confirm new password": "Yeni şifreyi tekrar giriniz:",
    "send changes": "Kaydet",
    "manage": "Yönet",
    "total": "Toplam",
    "memory consumption": "Bellek Kullanımı",
    "disk consumption": "Disk Kullanımı",
    "you have no notifications": "<span>Hello %{name}</span><br>You have currently no notification.",
    "dismiss all": "Dismiss all",
    "add application": "Add app?",
    "install": "Kur",
    "github": "Github",
    "website": "Website",
    "your app": "Your app!",
    "community contribution": "Community contribution",
    "official application": "Cozy tarafından geliştirildi",
    "application description": "Uygulama Açıklaması",
    "downloading description": "Downloading description…",
    "downloading permissions": "Downloading permissions…",
    "Cancel": "İptal",
    "ok": "Tamam",
    "applications permissions": "Uygulama yetkileri",
    "confirm": "Onay",
    "installing": "Kuruluyor",
    "remove": "Kaldır",
    "update": "Güncelle",
    "config application unmark favorite": "unmark as favorite",
    "config application mark favorite": "mark as favorite",
    "started": "başladı",
    "notifications": "Bildirimler",
    "questions and help forum": "Questions and help forum",
    "sign out": "Çıkış",
    "open in a new tab": "Yeni sekmede aç",
    "always on": "always on",
    "keep always on": "keep always on",
    "stop this app": "Bu uygulamayı durdur",
    "update required": "Update available",
    "navbar faq": "Sıkça Sorulan Sorular",
    "application is installing": "An app is already installing.\nWait for it to finish, then try again.",
    "no app message": "You currently have no app installed on your Cozy.\nGo to the <a href=\"#applications\">Cozy store</a> and install new apps!",
    "welcome to app store": "Welcome to your Cozy store, install your own app from here\nor add one from the list of available ones.",
    "installed everything": "You have already installed everything!",
    "already similarly named app": "You already have an app with a similar name.",
    "your app list": "Access your apps",
    "customize your cozy": "Customize your layout",
    "manage your apps": "Uygulamalar",
    "choose your apps": "Choose your apps",
    "configure your cozy": "Configure your cozy",
    "ask for assistance": "Ask for help",
    "logout": "Çıkış",
    "navbar logout": "Çıkış",
    "welcome to your cozy": "Welcome to your Cozy!",
    "you have no apps": "You have no apps.",
    "app management": "App management",
    "app store": "Mağaza",
    "configuration": "Konfigürasyon",
    "assistance": "Assistance",
    "hardware consumption": "Donanım",
    "gigabytes": "GB",
    "megabytes": "MB",
    "terabyte": "MB",
    "G": "GB",
    "M": "MB",
    "T": "MB",
    "disk unit": "GB",
    "memory unit": "MB",
    "status hard drive label": "Storage",
    "status memory label": "Bellek",
    "manage your applications": "Uygulamalar",
    "manage your devices": "Bağlı cihazlar",
    "synchronized": "synchronized",
    "revoke device access": "Revoke device",
    "no application installed": "There is no app installed.",
    "your parameters": "Ayarlarınız",
    "alerts and password recovery email": "Your email is used for notifications or password recovery.",
    "public name description": "Your username will be displayed when you share files with people or invite them to events.",
    "domain name for urls and email": "The domain name is used to connect to your Cozy from any devices and build sharing URLs.",
    "account timezone field description": "Your time zone helps to properly display your calendar.",
    "save": "Kaydet",
    "saved": "Kaydedildi",
    "error": "Hata",
    "error proper email": "Given email is not correct",
    "error email empty": "Given email is empty",
    "account language field description": "Choose the language you want to see:",
    "account background selection": "Select your background for your Cozy Home:",
    "account localization": "Localization",
    "account identifiers": "Hesap",
    "account personalization": "Özelleştirme",
    "account password": "Şifre",
    "account two factors auth": "Two-factor authentication",
    "account 2fa strategy": "Authentication strategy",
    "account 2fa hotp": "HOTP (based on a counter)",
    "account 2fa totp": "TOTP (based on a timer)",
    "enable 2fa": "Enable two-factor authentication",
    "disable 2fa": "Disable two-factor authentication",
    "reset 2fa tokens": "Reset your recovery tokens",
    "account 2fa enabled": "Two-factor authentication has been enabled. Page will now reload.",
    "account 2fa disabled": "Two-factor authentication has been disabled. Page will now reload.",
    "account 2fa error": "There was something wrong while enabling two-factor authentication. Please try again in a few minutes or contact the support.",
    "account 2fa token explanation": "Two-factor authentication is enabled on Cozy. To use it with your favourite app or device, you have to enter the following key when setting up the account:",
    "account 2fa qrcode explanation": "You can also scan the QR code below if your app supports it.",
    "account 2fa rectokens": "Below are your recovery tokens. Make sure to copy them somewhere safe (not on Cozy) so you won't get locked outside of your Cozy.",
    "2fa strategy hotp": "Two-factor authentication is enabled on Cozy with the HOTP strategy (counter-based).",
    "2fa strategy totp": "Two-factor authentication is enabled on Cozy with the TOTP strategy (timer-based).",
    "account 2fa hotp reset explanation": "If you're changing from one authentication app or device to another, you must reset the HOTP counter in order to not get locked outside of your Cozy.",
    "2fa reset hotp": "Reset the HOTP counter",
    "account 2fa reset": "The HOTP counter has been successfully reset.",
    "account 2fa disable explanation": "You can disable the two-factor authentication at any time:",
    "2fa if yubikey": "If you are using a Yubikey to authenticate, use the key below as your Secret Key.",
    "french": "Fransızsa",
    "english": "İngilizce",
    "german": "Almanca",
    "spanish": "İspanyolca",
    "korean": "Korece",
    "japanese": "Japonca",
    "portuguese": "Portekizce",
    "russian": "Rusça",
    "change password procedure": "Steps to change your password",
    "current password": "geçerli şifre",
    "new password": "yeni şifre",
    "confirm your new password": "confirm your new password",
    "save your new password": "Save new password",
    "do you want assistance": "Do you need any help?",
    "help email title": "Eposta",
    "help twitter title": "Twitter",
    "help forum title": "Forum",
    "help IRC title": "IRC",
    "help github title": "Github",
    "Visit the project website and learn to build your app:": "Visit the project website:",
    "your own application": "your own app",
    "installed": "kuruldu",
    "updated": "güncellendi",
    "updating": "günceleniyor",
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
    "desktop app promo": "You can also download the cozy-desktop client to synchronize your files on your laptop/desktop:",
    "download desktop linux": "Download cozy desktop for Linux",
    "update stack modal title": "Updating your Cozy",
    "update stack modal content": "You are about to update the platform. Your Cozy will be unavailable a few minutes. Is that OK?",
    "update stack modal confirm": "Güncelle",
    "update stack success": "Your applications are updated. To finalize the update, it requires that you click on the OK button. It will refresh the current window.",
    "update stack error": "An error occurred during the update. Your Cozy may become unstable. If you notice any troubles, you should contact your hosting provider. When you will click on the OK button, the current window will be refreshed.",
    "applications broken": "Applications broken",
    "cozy platform": "Platform",
    "navbar back button title": "Back Home",
    "navbar notifications": "Bildirimler",
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
    "settings": "Settings",
    "help": "Help",
    "change layout": "Change the layout",
    "market app install": "Installing...",
    "install your app": "Install an app from its Git Repository",
    "market install your app": "Just copy/paste its Git URL in the field below:",
    "market install your app tutorial": "To know more about how to build your own app, feel free to read our",
    "market app tutorial": "tutorial",
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
    "map description": "Open Street Map in your Cozy",
    "moi description": "A new experience to visualize your data",
    "warning unofficial app": "This app is a community app and isn't maintained by the Cozy team.\nTo report a bug, please file an issue in <a href='https://forum.cozy.io'>our forum</a>.",
    "update available notification": "A new version of %{appName} is available.",
    "stack update available notification": "A new version of the platform is available.",
    "app broken title": "Broken application",
    "app broken": "This application is broken. Can you try to install it again:",
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
    "modal ok": "Tamam",
    "modal cancel": "İptal",
    "no image": "There is no image on your Cozy",
    "ObjPicker upload btn": "Upload a local file",
    "or": "or",
    "drop a file": "Drag & drop a file or",
    "url of an image": "Paste URL of an image from the web",
    "you have no album": "<p>You haven't got any photo album<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:-(</p><p>Create one from the <a href='/#applications' target='_blank'>the Photo app</a><br>and use photos taken from your smartphone with the <a href='https://play.google.com/store/apps/details?id=io.cozy.files_client&hl=en' target='_blank'>mobile app!</a><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:-)</p>",
    "state app installing": "This app is being installed. Wait a little",
    "state app stopped error": "This app cannot start",
    "stack updating block message": "Your Cozy is currently updating, you cannot use it until the update is finished.",
    "update apps error title": "An error occurred while updating apps",
    "update apps error": "One or several applications failed. Concerned applications are marked as broken. You will probably have to uninstall and reinstall these applications.",
    "update apps error list title": "Broken applications",
    "update stack error title": "An error occurred while updating your Cozy",
    "update stack permission changes": "Applications listed below were not updated due to permission changes. Please, update them individually to choose whether or not you accept the new permissions.",
    "update stack warning": "Uyarı",
    "reboot stack error": "An error occurred while rebooting your Cozy. The Cozy may become unstable. Contact your hosting provider if your Cozy doesn't work anymore."
};
});

require.register("locales/uk_UA", function(exports, require, module) {
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
    "config application unmark favorite": "unmark as favorite",
    "config application mark favorite": "mark as favorite",
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
    "app store": "Store",
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
    "account two factors auth": "Two-factor authentication",
    "account 2fa strategy": "Authentication strategy",
    "account 2fa hotp": "HOTP (based on a counter)",
    "account 2fa totp": "TOTP (based on a timer)",
    "enable 2fa": "Enable two-factor authentication",
    "disable 2fa": "Disable two-factor authentication",
    "reset 2fa tokens": "Reset your recovery tokens",
    "account 2fa enabled": "Two-factor authentication has been enabled. Page will now reload.",
    "account 2fa disabled": "Two-factor authentication has been disabled. Page will now reload.",
    "account 2fa error": "There was something wrong while enabling two-factor authentication. Please try again in a few minutes or contact the support.",
    "account 2fa token explanation": "Two-factor authentication is enabled on Cozy. To use it with your favourite app or device, you have to enter the following key when setting up the account:",
    "account 2fa qrcode explanation": "You can also scan the QR code below if your app supports it.",
    "account 2fa rectokens": "Below are your recovery tokens. Make sure to copy them somewhere safe (not on Cozy) so you won't get locked outside of your Cozy.",
    "2fa strategy hotp": "Two-factor authentication is enabled on Cozy with the HOTP strategy (counter-based).",
    "2fa strategy totp": "Two-factor authentication is enabled on Cozy with the TOTP strategy (timer-based).",
    "account 2fa hotp reset explanation": "If you're changing from one authentication app or device to another, you must reset the HOTP counter in order to not get locked outside of your Cozy.",
    "2fa reset hotp": "Reset the HOTP counter",
    "account 2fa reset": "The HOTP counter has been successfully reset.",
    "account 2fa disable explanation": "You can disable the two-factor authentication at any time:",
    "2fa if yubikey": "If you are using a Yubikey to authenticate, use the key below as your Secret Key.",
    "french": "French",
    "english": "English",
    "german": "German",
    "spanish": "Spanish",
    "korean": "Korean",
    "japanese": "Japanese",
    "portuguese": "Portuguese",
    "russian": "Russian",
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
    "desktop app promo": "You can also download the cozy-desktop client to synchronize your files on your laptop/desktop:",
    "download desktop linux": "Download cozy desktop for Linux",
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
    "settings": "Settings",
    "help": "Help",
    "change layout": "Change the layout",
    "market app install": "Installing...",
    "install your app": "Install an app from its Git Repository",
    "market install your app": "Just copy/paste its Git URL in the field below:",
    "market install your app tutorial": "To know more about how to build your own app, feel free to read our",
    "market app tutorial": "tutorial",
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
    "map description": "Open Street Map in your Cozy",
    "moi description": "A new experience to visualize your data",
    "warning unofficial app": "This app is a community app and isn't maintained by the Cozy team.\nTo report a bug, please file an issue in <a href='https://forum.cozy.io'>our forum</a>.",
    "update available notification": "A new version of %{appName} is available.",
    "stack update available notification": "A new version of the platform is available.",
    "app broken title": "Broken application",
    "app broken": "This application is broken. Can you try to install it again:",
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
};
});

require.register("locales/zh_CN", function(exports, require, module) {
module.exports = {
    "home": "主页",
    "apps": "应用",
    "account": "帐户",
    "email": "邮箱",
    "timezone": "时区",
    "domain": "域名",
    "no domain set": "域名未设置",
    "locale": "语言环境（本地化）",
    "change password": "更改密码",
    "input your current password": "输入当前密码",
    "enter a new password": "输入新密码",
    "confirm new password": "确认新密码",
    "send changes": "保存",
    "manage": "管理",
    "total": "总计",
    "memory consumption": "内存占用",
    "disk consumption": "磁盘占用",
    "you have no notifications": "<span>您好，%{name}</span><br>当前尚无通知.",
    "dismiss all": "忽略所有",
    "add application": "添加应用？",
    "install": "安装",
    "github": "Github",
    "website": "网站",
    "your app": "你的应用！",
    "community contribution": "社区贡献",
    "official application": "由 Cozy 开发",
    "application description": "应用描述",
    "downloading description": "载入描述中…",
    "downloading permissions": "载入权限中…",
    "Cancel": "取消",
    "ok": "确定",
    "applications permissions": "应用权限",
    "confirm": "确认",
    "installing": "安装中",
    "remove": "删除",
    "update": "更新",
    "config application unmark favorite": "取消标记为收藏",
    "config application mark favorite": "标记为收藏",
    "started": "已开始",
    "notifications": "通知",
    "questions and help forum": "问题与帮助论坛",
    "sign out": "退出",
    "open in a new tab": "在新标签页中打开",
    "always on": "总是打开",
    "keep always on": "保持总是打开",
    "stop this app": "停止此应用",
    "update required": "更新可用",
    "navbar faq": "常见问题",
    "application is installing": "应用正在安装中.\n请等待完成后重试.",
    "no app message": "当前Cozy上没有安装任何应用.\n前往 <a href=\"#applications\">Cozy 应用商店</a> 安装新应用.",
    "welcome to app store": "欢迎来到 Cozy 应用商店，你可以从这里安装你自己的应用\n或者选择列表中已有的应用进行安装.",
    "installed everything": "您已经安装了所有应用！",
    "already similarly named app": "您已有一个名字类似的应用.",
    "your app list": "访问你的应用",
    "customize your cozy": "自定义布局",
    "manage your apps": "应用",
    "choose your apps": "选择您的应用",
    "configure your cozy": "配置你的 Cozy",
    "ask for assistance": "寻求帮助",
    "logout": "退出",
    "navbar logout": "退出",
    "welcome to your cozy": "欢迎来到你的 Cozy ！",
    "you have no apps": "你尚无应用.",
    "app management": "应用管理",
    "app store": "应用商店",
    "configuration": "配置",
    "assistance": "协助",
    "hardware consumption": "硬件配置",
    "gigabytes": "GB",
    "megabytes": "MB",
    "terabyte": "MB",
    "G": "GB",
    "M": "MB",
    "T": "MB",
    "disk unit": "GB",
    "memory unit": "MB",
    "status hard drive label": "存储空间",
    "status memory label": "内存",
    "manage your applications": "应用",
    "manage your devices": "已连接的设备",
    "synchronized": "已同步",
    "revoke device access": "解除设备连接",
    "no application installed": "尚无已安装的应用",
    "your parameters": "你的设置",
    "alerts and password recovery email": "邮箱用来接收通知和恢复密码.",
    "public name description": "用户名将在与他人分享文件或邀请他们加入日程时显示.",
    "domain name for urls and email": "域名用来访问你的 Cozy 和生成分享链接.",
    "account timezone field description": "时区用来正确地显示你的日程表.",
    "save": "保存",
    "saved": "已保存",
    "error": "错误",
    "error proper email": "填写的邮箱不正确",
    "error email empty": "填写的邮箱为空",
    "account language field description": "选择你想使用的语言：",
    "account background selection": "选择 Cozy 主页的背景：",
    "account localization": "本地化",
    "account identifiers": "帐户",
    "account personalization": "自定义",
    "account password": "密码",
    "account two factors auth": "两步验证",
    "account 2fa strategy": "验证策略",
    "account 2fa hotp": "HOTP (基于计数器)",
    "account 2fa totp": "TOTP (基于计时器)",
    "enable 2fa": "启用两步验证",
    "disable 2fa": "禁用两步验证",
    "reset 2fa tokens": "重置您的 recovery tokens",
    "account 2fa enabled": "两步验证已启用.页面将重新载入.",
    "account 2fa disabled": "两步验证已禁用.页面将重新载入.",
    "account 2fa error": "启用两步验证时出错.请过会儿重试或联系支持人员.",
    "account 2fa token explanation": "两步验证已在 Cozy 上启用.你需要在你的验证应用或设备上输入以下密钥以正确配置.",
    "account 2fa qrcode explanation": "如果应用支持，你也可以扫描二维码.",
    "account 2fa rectokens": "Below are your recovery tokens. Make sure to copy them somewhere safe (not on Cozy) so you won't get locked outside of your Cozy.",
    "2fa strategy hotp": "Two-factor authentication is enabled on Cozy with the HOTP strategy (counter-based).",
    "2fa strategy totp": "Two-factor authentication is enabled on Cozy with the TOTP strategy (timer-based).",
    "account 2fa hotp reset explanation": "如果你要更换验证应用或设备，你必须重置 HOTP 计数器以防止不能登陆 Cozy.",
    "2fa reset hotp": "重置 HOTP 计数器",
    "account 2fa reset": "HOTP 计数器已重置.",
    "account 2fa disable explanation": "你可以随时禁用两步验证.",
    "2fa if yubikey": "如果您用Yubikey 验证权限, use the key below as your Secret Key.",
    "french": "法语",
    "english": "英语",
    "german": "德语",
    "spanish": "西班牙语",
    "korean": "韩语",
    "japanese": "日语",
    "portuguese": "葡萄牙语",
    "russian": "俄罗斯语",
    "change password procedure": "更改密码的步骤",
    "current password": "当前密码",
    "new password": "新密码",
    "confirm your new password": "确认新密码",
    "save your new password": "保存新密码",
    "do you want assistance": "你需要帮助吗？",
    "help email title": "邮箱",
    "help twitter title": "Twitter",
    "help forum title": "论坛",
    "help IRC title": "IRC",
    "help github title": "Github",
    "Visit the project website and learn to build your app:": "访问项目网站：",
    "your own application": "你自己的应用",
    "installed": "已安装",
    "updated": "已更新",
    "updating": "更新中",
    "update all": "更新Stack和应用",
    "show home logs": "显示主页日志",
    "show data system logs": "显示数据系统日志",
    "show proxy logs": "显示代理日志",
    "show logs": "显示日志",
    "update stack": "更新平台",
    "reboot stack waiting message": "请稍候，需要几分钟以重启 Cozy.",
    "update stack waiting message": "请稍候，需要几分钟以更新 Cozy.",
    "status no device": "没有设备连接到 Cozy.",
    "download apk": "下载 APK",
    "mobile app promo": "在你的手机上通过独立应用来备份照片和同步联系人与日程表.",
    "desktop app promo": "您也通过您的桌面设备下载cozy-desktop客户端来同步您的文件。",
    "download desktop linux": "下载Cozy Desktop的Linux版本",
    "update stack modal title": "更新 Cozy 中",
    "update stack modal content": "你正要更新平台… Cozy 将在几分钟内不可用.确定吗？",
    "update stack modal confirm": "更新",
    "update stack success": "你的应用已更新.点击确认后将最终完成，这将刷新当前页面.",
    "update stack error": "更新时出错. Cozy 可能变得不稳定.如果遇到任何问题，你应当联系你的空间提供商.点击确认后，当前页面将刷新.",
    "applications broken": "应用损坏",
    "cozy platform": "平台",
    "navbar back button title": "返回主页",
    "navbar notifications": "通知",
    "or:": "或：",
    "reboot stack": "重启",
    "update error": "更新应用时出错",
    "update failed": "更新失败",
    "error update uninstalled app": "你不能更新一个未安装的应用.",
    "notification open application": "打开应用",
    "notification update stack": "更新平台",
    "notification update application": "立即更新",
    "broken": "损坏",
    "start this app": "启动此应用",
    "stopped": "已停止",
    "retry to install": "重试安装",
    "cozy account title": "Cozy - 设置",
    "cozy app store title": "Cozy - 应用商店",
    "cozy home title": "Cozy - 主页",
    "cozy applications title": "Cozy - 状态",
    "running": "运行中",
    "cozy help title": "Cozy - 帮助",
    "help support title": "官方支持",
    "help community title": "社区支持",
    "help direct title": "私信",
    "help documentation title": "文档",
    "changing locale requires reload": "更改语言环境需要重新载入页面.",
    "cancel": "取消",
    "abort": "中止",
    "Once updated, this application will require the following permissions:": "一旦更新，此应用将需要以下权限：",
    "confirm update": "确认更新",
    "confirm install": "确认安装",
    "no specific permissions needed": "此应用不需要任何权限",
    "removed": "已删除",
    "removing": "删除中",
    "required permissions": "已获取的权限",
    "finish layout edition": "保存",
    "reset customization": "重置",
    "use icon": "使用图标",
    "home section favorites": "收藏",
    "home section leave": "导入",
    "home section main": "日常",
    "home section productivity": "生产力",
    "home section data management": "数据",
    "home section personal watch": "观看",
    "home section misc": "杂项",
    "home section platform": "平台",
    "app status": "我的应用",
    "settings": "设置",
    "help": "帮助",
    "change layout": "更改布局",
    "market app install": "安装中…",
    "install your app": "从 Git 库安装应用",
    "market install your app": "粘贴 Git 地址至以下区域",
    "market install your app tutorial": "想要了解更多如何开发你自己的应用，请查看我们的",
    "market app tutorial": "教程",
    "help send message title": "直接与 Cozy 团队沟通",
    "help send message action": "发送",
    "help send logs": "发送服务器日志以便于排除故障",
    "send message success": "消息已成功发送",
    "send message error": "发送支持消息时出错.尝试通过邮件发送到 support@cozycloud.cc",
    "account change password success": "密码已更改.",
    "account change password short": "新密码太短.",
    "account change password difference": "密码不匹配.",
    "account change password error": "更改密码时出错.请确认当前密码是否正确.",
    "account background add": "添加背景",
    "introduction market": "欢迎来到 Cozy 应用商店\n在这里，你可以安装\nCozy Cloud或社区或你自己提供的应用！",
    "error connectivity issue": "接收数据时出错.<br />请稍后重试.",
    "package.json not found": "未能获取 package.json. 请检查你的 Git 地址.",
    "unknown provider": "从现在开始，应用只能从 Github 或 CozyCloud 市场安装.",
    "please wait data retrieval": "请稍候，数据接收中…",
    "revoke device confirmation message": "这将防止设备访问你的 Cozy. 确定吗？",
    "dashboard": "仪表盘",
    "calendars description": "管理你的日程并和手机保持同步",
    "contacts description": "管理你的联系人并和手机保持同步",
    "emails description": "阅读，发送和备份你的邮件.",
    "files description": "你的在线文件系统并与你的设备保持同步.",
    "photos description": "组织你的照片并和朋友们分享",
    "sync description": "需要此工具来与手机同步联系人和日程表.",
    "quickmarks description": "保存并管理你的书签.",
    "cozic description": "在线收听你的音乐.",
    "databrowser description": "浏览并可视化你的所有数据(原始格式).",
    "zero-feeds description": "聚合你的RSS订阅并将你收藏的链接保存为书签.",
    "kyou description": "通过量化你自己提升健康和心情,",
    "konnectors description": "从外部服务(Twitter, Jawbone…)导入数据",
    "kresus description": "管理你个人金融数据的工具",
    "nirc description": "连接到你喜欢的IRC频道",
    "shout description": "通过 Shout 网页应用连接到你喜欢的IRC频道",
    "notes description": "组织和撰写智能笔记",
    "owm description": "了解世界各地的天气",
    "remote storage description": "远程存储应用允许你把未支持应用的数据保存到Cozy.",
    "tasky description": "超级快且简单的基于标签的任务管理工具.",
    "todos description": "记录你的任务，排序并有效率地完成它们.",
    "term description": "Cozy 上的终端应用",
    "ghost description": "通过 Ghost 博客平台上的此应用与全世界分享你的故事.",
    "leave google description": "从你的 Google 帐户导入数据",
    "mstsc.js description": "通过 RDP 协议管理你的 Windows 远程桌面.",
    "hastebin description": "简单的 pastebin 应用使你能快速地分享文字.",
    "polybios description": "从你的浏览器中管理 PGP 密钥.",
    "frost description": "通过把网页存档到 Cozy 来记录你的互联网记忆.",
    "tiddlywiki description": "一个非线性的个人网页笔记本.",
    "hari description": "加密的个人日记.",
    "map description": "在 Cozy 中打开街景.",
    "moi description": "A new experience to visualize your data",
    "warning unofficial app": "这是一个不由 Cozy 团队维护的社区应用.\n请在 <a href='https://forum.cozy.io'>我们的论坛</a>反馈.",
    "update available notification": "%{appName} 的新版本可用.",
    "stack update available notification": "平台的新版本可用.",
    "app broken title": "损坏的应用",
    "app broken": "此应用已损坏.你要尝试再次安装吗：",
    "reinstall broken app": "重新安装",
    "error git": "我们未能接收源码.",
    "error github repo": "应用仓库似乎不可用.",
    "error github": "Github 似乎不可用. 你可以在 https://status.github.com/ 查看它的状态.",
    "error npm": "我们未能安装应用依赖.",
    "error user linux": "我们未能创建此应用专属的 Linux 用户.",
    "error start": "应用未能启动. 你可以在日志应用中获取详情.",
    "app msg": "如果错误持续发生，你可以通过 contact@cozycloud.cc 或 IRC 频道 #cozycloud@ irc.freenode.net 联系我们.",
    "more details": "详情",
    "noapps": {
        "customize your cozy": "你也可以 <a href=\"%{account}\">前往设置</a> 并自定义你的 Cozy,\n或者 <a href=\"%{appstore}\">查看应用商店</a> 来安装你的第一个应用."
    },
    "pick from files": "挑选图片",
    "Crop the photo": "裁剪图像",
    "chooseAgain": "选择另一个图片",
    "modal ok": "确认",
    "modal cancel": "取消",
    "no image": "没有图片在你的 Cozy 上",
    "ObjPicker upload btn": "上传本地文件",
    "or": "或者",
    "drop a file": "拖放文件 或者",
    "url of an image": "粘贴网络图片链接",
    "you have no album": "<p>你还没有任何相册<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:-(</p><p>在 <a href='/#applications' target='_blank'>图片</a><br>创建相册并通过<a href='https://play.google.com/store/apps/details?id=io.cozy.files_client&hl=en' target='_blank'>手机应用</a>使用拍摄的照片<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:-)</p>",
    "state app installing": "此应用正在安装，请稍候",
    "state app stopped error": "此应用未能启动",
    "stack updating block message": "Cozy 正在更新，你不能使用直到更新完成.",
    "update apps error title": "更新应用时出错",
    "update apps error": "一个或若干个应用出错. 相关应用已标记为损坏. 你可能需要删除并重新安装这些应用.",
    "update apps error list title": "损坏的应用",
    "update stack error title": "更新 Cozy 时出错",
    "update stack permission changes": "下列应用由于权限改变未能更新. 请单独更新它们以决定是否接受新的权限.",
    "update stack warning": "警告",
    "reboot stack error": "重启 Cozy 时出错. Cozy 可能变得不稳定. 如果 Cozy 不能正常运行，请联系你的空间提供商."
};
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
    } else if (name === 'kresus' || name === 'kyou' || name === 'databrowser' || name === 'import-from-google') {
      section = 'data';
    } else if (name === 'todos' || name === 'notes' || name === 'tasky' || name === 'tiddlywiki') {
      section = 'productivity';
    } else if (name === 'sync' || name === 'konnectors') {
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
var MainRouter, ObjectPickerCroper, Token, client, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ObjectPickerCroper = require('../views/object_picker');

Token = require("../models/token");

client = require('../helpers/client');

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
    "*path": "default",
    '*notFound': 'default'
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
              var source;
              source = null;
              if ($(window).width() <= 640) {
                source = event.source;
              }
              return app.mainView.displayToken(data.token, slug, source);
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

  MainRouter.prototype["default"] = function(hash) {
    return this.navigate('home', true);
  };

  MainRouter.prototype.navigate = function(hash, trigger) {
    if (client.getSAMEORIGINError(hash)) {
      hash = '';
      trigger = true;
    }
    return MainRouter.__super__.navigate.call(this, hash, trigger);
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
    if (hash == null) {
      hash = '';
    }
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
buf.push('</option><option value="ja">');
var __val__ = t('japanese')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</option><option value="ko">');
var __val__ = t('korean')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</option><option value="ru">');
var __val__ = t('russian')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</option><option value="nl">');
var __val__ = t('dutch')
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
buf.push('/></div><div class="account-field"><p><button id="account-form-button" class="full-width">');
var __val__ = t('save your new password')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></p><p class="loading-indicator">&nbsp;</p><div id="account-info" class="alert main-alert alert-success hide"><div id="account-info-text">');
var __val__ = t('account change password success')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div></div><div id="account-error" class="alert alert-error main-alert hide"><div id="account-form-error-text">');
var __val__ = t('account change password error')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div></div></div></div><h4>');
var __val__ = t('account two factors auth')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h4><div id="2fa-form"><div class="account-field"><p>');
var __val__ = t('account 2fa strategy')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><select id="account-2fa-field"><option value="totp">');
var __val__ = t('account 2fa totp')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</option><option value="hotp">');
var __val__ = t('account 2fa hotp')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</option></select></div><div class="account-field"><p></p><button id="account-2fa-button" class="full-width">');
var __val__ = t('enable 2fa')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button><p class="loading-indicator">&nbsp;</p><div class="account-2fa-info alert main-alert alert-success hide"><div class="account-info-text">');
var __val__ = t('account 2fa enabled')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div></div><div class="account-2fa-error alert alert-error main-alert hide"><div class="account-form-error-text">');
var __val__ = t('account 2fa error')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div></div></div></div><div id="2fa-infos" class="account-field"><p id="2fa-strategy"></p><p class="bold">');
var __val__ = t('account 2fa rectokens')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><p id="2fa-recovery-tokens" class="bold"></p><p><button id="account-2fa-reset-tokens" class="full-width">');
var __val__ = t('reset 2fa tokens')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></p><p class="full-width">');
var __val__ = t('account 2fa token explanation')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><p id="2fa-token" class="token bold center">&nbsp;</p><p>');
var __val__ = t('account 2fa qrcode explanation')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><p class="center"><img id="qrcode"/></p><div id="2fa-hotp-yubikey" class="hidden"><p>');
var __val__ = t('2fa if yubikey')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><p id="2fa-raw-key" class="bold center">&nbsp;</p></div><div id="2fa-hotp-reset" class="hidden"><p>');
var __val__ = t('account 2fa hotp reset explanation')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><div class="account-field"><p></p><button id="account-2fa-reset-button" class="full-width">');
var __val__ = t('2fa reset hotp')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></div></div><p>');
var __val__ = t('account 2fa disable explanation')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><div class="account-field"><p></p><button id="account-2fa-off-button" class="full-width">');
var __val__ = t('disable 2fa')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button><p class="loading-indicator">&nbsp;</p><div class="account-2fa-info alert main-alert alert-success hide"><div id="account-info-text">');
var __val__ = t('account 2fa disabled')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div></div><div class="account-2fa-error alert alert-error main-alert hide"><div id="account-form-error-text">');
var __val__ = t('account 2fa error')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div></div></div></div></div></div></div>');
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
buf.push(attrs({ 'src':("" + (source) + ""), 'id':("" + (id) + "") }, {"src":true,"id":true}));
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
buf.push('</span></a><a target="_blank" href="https://play.google.com/store/apps/details?id=io.cozy.files_client"><img src="img/en-play-badge.png"/></a><p>');
var __val__ = t('desktop app promo')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><a role="button" target="_blank" href="https://docs.cozy.io/en/mobile/desktop.html" class="linux"><img src="img/linux.svg"/><span>');
var __val__ = t('download desktop linux')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></a></div></section></div></div></div>');
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
buf.push('</h2><div class="application-container"><div class="application mod w360-33 w640-25 full-20 left platform-app"><div class="application-inner store"><a href="#applications"><img src="img/apps/store.svg" class="icon"/><p class="app-title">');
var __val__ = t('app store')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p></a></div></div><div class="application mod w360-33 w640-25 full-20 left platform-app"><div class="application-inner myapps"><a href="#config-applications"><img src="img/apps/my-apps.svg" class="icon svg"/><p class="app-title">');
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
buf.push('<a href="https://dev.cozy.io/" target="_blank">');
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
buf.push('</span></a><div id="menu-applications-container"></div>');
 var qwantMode = parent.urlArguments && parent.urlArguments.modes && parent.urlArguments.modes.indexOf('qwant_search') !== -1;
if ( ((parent.DEV_ENV || qwantMode || parent.ENABLE_QWANT_SEARCH) && parent.qwantInstalled) || parent.BEN_DEMO)
{
buf.push('<div class="search"><input id="search-bar" type="text"/></div>');
}
buf.push('</div>');
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

require.register("templates/object_picker_search", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="search-tab-container"><input');
buf.push(attrs({ 'placeholder':("" + (t('What are you looking for?')) + ""), 'value':(""), "class": ('modal-search-input') }, {"placeholder":true,"value":true}));
buf.push('/><div class="subsection">Powered by <img src="img/qwant-logo.jpg" alt="Qwant logo"/></div></div>');
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
var Background, BackgroundList, BaseView, Instance, ObjectPicker, request, timezones, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

Background = require('../models/background');

timezones = require('helpers/timezone').timezones;

request = require('lib/request');

BackgroundList = require('views/background_list');

Instance = require('models/instance');

ObjectPicker = require('./object_picker');

module.exports = exports.AccountView = (function(_super) {
  __extends(AccountView, _super);

  function AccountView() {
    this.onBackgroundChanged = __bind(this.onBackgroundChanged, this);
    this.on2faError = __bind(this.on2faError, this);
    this.on2faStatusChangeSuccess = __bind(this.on2faStatusChangeSuccess, this);
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
    this.info2faAlert = this.$('.account-2fa-info');
    this.info2faAlert.hide();
    this.error2faAlert = this.$('.account-2fa-error');
    this.error2faAlert.hide();
    this.twoFactorInfo = this.$('#2fa-infos');
    this.twoFactorToken = this.$('#2fa-token');
    this.twoFactorRecToken = this.$('#2fa-recovery-tokens');
    this.changePasswordForm = this.$('#change-password-form');
    this.twoFactorForm = this.$('#2fa-form');
    this.accountSubmitButton = this.$('#account-form-button');
    this.twoFactorSubmitButton = this.$('#account-2fa-button');
    this.twoFactorOffButton = this.$('#account-2fa-off-button');
    this.twoFactorStrategy = this.$('#2fa-strategy');
    this.twoFactorResetForm = this.$('#2fa-hotp-reset');
    this.twoFactorResetButton = this.$('#account-2fa-reset-button');
    this.twoFactorResetTokensButton = this.$('#account-2fa-reset-tokens');
    this.twoFactorYubikeyBlock = this.$('#2fa-hotp-yubikey');
    this.twoFactorRawKey = this.$('#2fa-raw-key');
    this.twoFactorQrCode = this.$('#qrcode');
    this.accountSubmitButton.click(function(event) {
      event.preventDefault();
      return _this.onNewPasswordSubmit();
    });
    this.twoFactorSubmitButton.click(function(event) {
      event.preventDefault();
      return _this.on2faEnableSubmit();
    });
    this.twoFactorOffButton.click(function(event) {
      event.preventDefault();
      return _this.on2faDisableSubmit();
    });
    this.twoFactorResetButton.click(function(event) {
      event.preventDefault();
      return _this.on2faResetSubmit();
    });
    this.twoFactorResetTokensButton.click(function(event) {
      event.preventDefault();
      return _this.on2faResetTokens();
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

  AccountView.prototype.onNewPasswordSubmit = function() {
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

  AccountView.prototype.on2faStatusChangeSuccess = function(message) {
    var hideFunc;
    this.info2faAlert.html(t(message));
    this.info2faAlert.fadeIn();
    clearTimeout(hideFunc);
    return hideFunc = setTimeout(function() {
      return window.location.reload();
    }, 2000);
  };

  AccountView.prototype.on2faError = function(error) {
    var _this = this;
    console.error(error);
    this.error2faAlert.fadeIn();
    return setTimeout(function() {
      return _this.error2faAlert.fadeOut();
    }, 5000);
  };

  AccountView.prototype.on2faEnableSubmit = function() {
    var authType, form,
      _this = this;
    authType = this.twoFactorField.val();
    form = {
      authType: authType,
      encryptedOtpKey: this.getOtpKey(),
      hotpCounter: authType === 'hotp' ? 0 : void 0,
      recoveryCodes: this.getRecoveryTokens()
    };
    this.twoFactorSubmitButton.spin(true);
    return request.post('api/user', form, function(err, data) {
      _this.twoFactorSubmitButton.spin(false);
      if (err) {
        return _this.on2faError();
      } else {
        if (data.success) {
          return _this.on2faStatusChangeSuccess('account 2fa enabled');
        } else {
          return _this.on2faError();
        }
      }
    });
  };

  AccountView.prototype.on2faDisableSubmit = function() {
    var form,
      _this = this;
    form = {
      authType: null
    };
    this.twoFactorSubmitButton.spin(true);
    return request.post('api/user', form, function(err, data) {
      _this.twoFactorSubmitButton.spin(false);
      if (err) {
        return _this.on2faError();
      } else {
        if (data.success) {
          return _this.on2faStatusChangeSuccess('account 2fa disabled');
        } else {
          return _this.on2faError();
        }
      }
    });
  };

  AccountView.prototype.on2faResetSubmit = function() {
    var form,
      _this = this;
    form = {
      authType: 'hotp',
      hotpCounter: 0
    };
    return request.post('api/user', form, function(err, data) {
      var hideFunc;
      _this.twoFactorSubmitButton.spin(false);
      if (err) {
        return _this.on2faError();
      } else {
        if (data.success) {
          _this.info2faAlert.html(t('account 2fa reset'));
          _this.info2faAlert.fadeIn();
          clearTimeout(hideFunc);
          return hideFunc = setTimeout(function() {
            return _this.info2faAlert.fadeOut();
          }, 5000);
        } else {
          return _this.on2faError();
        }
      }
    });
  };

  AccountView.prototype.on2faResetTokens = function() {
    var form,
      _this = this;
    form = {
      recoveryCodes: this.getRecoveryTokens()
    };
    return request.post('api/user', form, function(err, data) {
      _this.twoFactorSubmitButton.spin(false);
      if (err) {
        return _this.on2faError();
      } else {
        if (data.success) {
          return _this.on2faStatusChangeSuccess('account 2fa enabled');
        } else {
          return _this.on2faError();
        }
      }
    });
  };

  AccountView.prototype.getOtpKey = function() {
    var PRNG;
    PRNG = new Uint32Array(5);
    window.crypto.getRandomValues(PRNG);
    return PRNG.reduce(function(key, subkey) {
      return key += ('0000' + subkey.toString(16)).slice(-8);
    }, '');
  };

  AccountView.prototype.getRecoveryTokens = function() {
    return (function() {
      var _i, _results;
      _results = [];
      for (_i = 0; _i <= 9; _i++) {
        _results.push(Math.floor(Math.random() * 100000000));
      }
      return _results;
    })();
  };

  AccountView.prototype.getUserToken = function(next) {
    return request.get('api/user/2fa', function(err, data) {
      if (err) {
        return next(err);
      } else {
        return next(null, data.token, data.key);
      }
    });
  };

  AccountView.prototype.get2faQRCodeString = function(data, token) {
    return ("otpauth://" + data.authType + "/Cozy:" + data.email) + ("?secret=" + token + "&issuer=Cozy");
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
    var codes, domain, err, instance, locale, saveDomain, saveEmail, saveLocale, savePublicName, saveTimezone, tokensStr, userData,
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
    this.password2Field.keyup(function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        return _this.onNewPasswordSubmit();
      }
    });
    if (userData.authType) {
      this.twoFactorForm.hide();
      this.twoFactorInfo.show();
      this.twoFactorStrategy.html(t('2fa strategy ' + userData.authType));
      tokensStr = '';
      try {
        codes = JSON.parse(userData.encryptedRecoveryCodes);
        tokensStr = codes.join(', ');
      } catch (_error) {
        err = _error;
        tokensStr = t("error problem 2fa codes");
      }
      this.twoFactorRecToken.html(tokensStr);
      if (userData.authType === 'hotp') {
        this.twoFactorResetForm.show();
        this.twoFactorYubikeyBlock.show();
      }
      return this.getUserToken(function(err, token, key) {
        var data;
        if (err) {
          return console.error(err);
        } else if (token) {
          _this.twoFactorToken.html(token);
          _this.twoFactorRawKey.html(key);
          data = qr.toDataURL({
            mime: 'image/png',
            size: 10,
            level: 'H',
            value: _this.get2faQRCodeString(userData, token)
          });
          return _this.twoFactorQrCode.attr('src', data);
        } else {
          return _this.twoFactorToken.html(t('cant find token'));
        }
      });
    } else {
      this.twoFactorForm.show();
      this.twoFactorInfo.hide();
      return this.twoFactorField = this.$('#account-2fa-field');
    }
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
          error: function() {
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
      gitName = gitName.replace(/\.git$/, '');
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
    if (((this.model.get("branch") == null) || (this.model.get('branch') === 'master')) && !(this.model.get('needsUpdate'))) {
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
      this.updateBtn.show();
      return this.updateBtn.removeAttr('disable');
    } else {
      this.updateBtn.hide();
      return this.updateBtn.attr('disable', true);
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
        diskUsed = _this.toGigabytes(data.usedDiskSpace, data.usedUnit);
        diskTotal = _this.toGigabytes(data.totalDiskSpace, data.totalUnit);
        _this.displayMemory(data.freeMem, data.totalMem);
        return _this.displayDiskSpace(diskUsed, diskTotal);
      }
    });
  };

  ConfigApplicationsView.prototype.toGigabytes = function(value, unit) {
    switch (unit) {
      case 'T':
        return value * 1000;
      case 'G':
        return value;
      case 'M':
        return value / 1000;
      default:
        return 0;
    }
  };

  ConfigApplicationsView.prototype.displayMemory = function(amount, total) {
    this.memoryFree.find('.amount').html(Math.floor((total - amount) / 1000));
    return this.memoryFree.find('.total').html(Math.floor(total / 1000));
  };

  ConfigApplicationsView.prototype.displayDiskSpace = function(amount, total) {
    this.diskSpace.find('.amount').html("" + amount + " ");
    return this.diskSpace.find('.total').html("" + total + " ");
  };

  ConfigApplicationsView.prototype.onAppStateChanged = function() {
    return setTimeout(this.fetch, 10000);
  };

  ConfigApplicationsView.prototype.onUpdateClicked = function(event) {
    var isDisabled;
    if (!(isDisabled = this.updateBtn.attr('disable'))) {
      this.updateBtn.attr('disable', true);
      return this.showUpdateStackDialog();
    }
  };

  ConfigApplicationsView.prototype.showUpdateStackDialog = function() {
    var _this = this;
    if (this.popover != null) {
      this.popover.remove();
    }
    this.popover = new UpdateStackModal({
      confirm: function(model) {
        return _this.runFullUpdate(function(err, changes) {
          if (err) {
            return _this.popover.onError(err, changes);
          } else {
            return _this.popover.onSuccess(changes);
          }
        });
      },
      cancel: function(model) {
        _this.popover.remove();
        return _this.render();
      }
    });
    $("#config-applications-view").append(this.popover.$el);
    return this.popover.show();
  };

  ConfigApplicationsView.prototype.runFullUpdate = function(callback) {
    var _this = this;
    Backbone.Mediator.pub('update-stack:start');
    return this.applications.updateAll(function(err, changes) {
      var _ref;
      if (err) {
        return callback(err, (_ref = err.data) != null ? _ref.changes : void 0);
      }
      return _this.stackApplications.updateStack(function(err) {
        Backbone.Mediator.pub('update-stack:end');
        return callback(err, changes);
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
    var myApps_app, section, sectionName, section_apps;
    sectionName = view.model.getSection();
    section = this.$("section#apps-" + sectionName);
    section_apps = this.$("section#apps-" + sectionName + " .application-container");
    if (view.id === "app-btn-konnectors") {
      myApps_app = this.$("#apps-platform .application-container div:nth-child(2)");
      myApps_app.after(view.$el);
    } else {
      section_apps.append(view.$el);
    }
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
    this.onAppChanged();
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
        if (this.model.previous('state') !== 'stopped') {
          return $("#" + (this.model.get('slug')) + "-frame").remove();
        }
        break;
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
        if ((errorcode != null) && errorcode[0] === '4') {
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
var AccountView, AppCollection, ApplicationsListView, BaseView, ConfigApplicationsView, DeviceCollection, HomeView, IntentManager, MarketView, NavbarView, NotificationCollection, SocketListener, StackAppCollection, User, appIframeTemplate, client,
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

client = require('helpers/client');

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
    this.navigate('config-applications');
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
    this.navigate('config-applications');
    return setTimeout(function() {
      return _this.configApplications.onUpdateClicked();
    }, 500);
  };

  HomeView.prototype.displayApplication = function(slug, hash) {
    var frame, iframeID, onLoad, _base, _base1,
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
      iframeID = this.getAppFrameID(slug);
      frame = this.$("#" + iframeID);
      onLoad = function() {
        var app, name;
        _this.frames.css('top', '0');
        _this.frames.css('left', '0');
        _this.frames.css('position', 'inherit');
        _this.frames.show();
        _this.content.hide();
        _this.backButton.show();
        _this.$('#app-frames').find('iframe').hide();
        _this.$("#" + iframeID).show();
        _this.selectedApp = slug;
        app = _this.apps.get(slug);
        name = (app != null ? app.get('displayName') : void 0) || (app != null ? app.get('name') : void 0) || '';
        if (name.length > 0) {
          name = name.replace(/^./, name[0].toUpperCase());
        }
        window.document.title = "Cozy - " + name;
        $("#current-application").html(name);
        _this.$("#app-btn-" + slug + " .spinner").hide();
        return _this.$("#app-btn-" + slug + " .icon").show();
      };
      if (!frame.length) {
        this.createApplicationIframe(slug, hash, {
          id: iframeID
        });
        this.frames.show();
        this.frames.css('top', '-9999px');
        this.frames.css('left', '-9999px');
        this.frames.css('position', 'absolute');
        return $("#" + iframeID).prop('contentWindow').addEventListener('load', onLoad);
      } else if (hash) {
        this.navigate({
          slug: slug,
          hash: hash
        });
        return onLoad();
      } else if (frame.is(':visible')) {
        this.navigate('');
        return onLoad();
      } else {
        return onLoad();
      }
    }
  };

  HomeView.prototype.createApplicationIframe = function(slug, hash) {
    var id, iframe$, iframeHTML, iframeWindow, source,
      _this = this;
    if (hash == null) {
      hash = "";
    }
    if ((hash != null ? hash.length : void 0) > 0) {
      hash = "#" + hash;
    }
    id = this.getAppFrameID(slug);
    source = this.getIframeLocation({
      hash: hash,
      slug: slug
    });
    iframeHTML = appIframeTemplate({
      id: id,
      source: source
    });
    iframe$ = $(iframeHTML).appendTo(this.frames);
    iframeWindow = this.$("#" + id).prop('contentWindow');
    iframeWindow.onhashchange = function() {
      var newhash;
      newhash = iframeWindow.location.hash.replace('#', '');
      return _this.onAppHashChanged(slug, newhash);
    };
    this.forceIframeRendering();
    return this.intentManager.registerIframe(iframe$[0], '*');
  };

  HomeView.prototype.onAppHashChanged = function(slug, newhash) {
    var currentHash;
    if (slug === this.selectedApp) {
      currentHash = location.hash.substring(("#apps/" + slug + "/").length);
      if (currentHash !== newhash) {
        this.navigate(slug, newhash);
      }
      return this.forceIframeRendering();
    }
  };

  HomeView.prototype.onAppStateChanged = function(appState) {
    var iframeID, _ref;
    if ((_ref = appState.status) === 'updating' || _ref === 'broken' || _ref === 'uninstalled') {
      iframeID = this.getAppFrameID(appState.slug);
      $("#" + iframeID).off('load');
      return $("#" + iframeID).remove();
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

  HomeView.prototype.getAppFrameID = function(slug) {
    return "" + slug + "-frame";
  };

  HomeView.prototype.displayToken = function(token, slug, source) {
    var iframeID, iframeWin;
    iframeID = this.getAppFrameID(slug);
    iframeWin = this.$("#" + iframeID).prop('contentWindow');
    return iframeWin.postMessage({
      token: token,
      appName: slug
    }, '*');
  };

  HomeView.prototype.getIframeLocation = function(data) {
    var hash, slug, value;
    value = '/';
    if (_.isObject(data)) {
      slug = data.slug, hash = data.hash;
      value += "apps/" + slug + "/" + hash;
    } else {
      value += data.toString();
    }
    return value;
  };

  HomeView.prototype.navigate = function(hash) {
    var iframeHash, _ref, _ref1, _ref2;
    iframeHash = this.getIframeLocation(hash);
    if (!(client.getSAMEORIGINError(iframeHash))) {
      return typeof window !== "undefined" && window !== null ? (_ref = window.app) != null ? (_ref1 = _ref.routers) != null ? (_ref2 = _ref1.main) != null ? _ref2.navigate(iframeHash, false) : void 0 : void 0 : void 0 : void 0;
    }
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
    if (url.lastIndexOf('/') === url.length - 1) {
      url = url.slice(0, url.length - 1);
    }
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
var AppsMenu, BaseView, HelpView, NavbarView, NotificationsView, SearchBarMix, appButtonTemplate,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

appButtonTemplate = require("templates/navbar_app_btn");

NotificationsView = require('./notifications_view');

HelpView = require('./help');

SearchBarMix = require('./search_bar_mix');

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
    this.appMenu = new AppsMenu(this.apps);
    return this.searchBar = new SearchBarMix();
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
var MARGIN_BETWEEN_IMG_AND_CROPED, Modal, ObjectPickerAlbum, ObjectPickerImage, ObjectPickerPhotoURL, ObjectPickerSearch, ObjectPickerUpload, PhotoPickerCroper, THUMB_HEIGHT, THUMB_WIDTH, tabControler, template, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Modal = require('../views/modal');

template = require('../templates/object_picker');

ObjectPickerPhotoURL = require('./object_picker_photourl');

ObjectPickerSearch = require('./object_picker_search');

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
    var body, previewTops, qwantMode, tab;
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
    qwantMode = window.urlArguments && window.urlArguments.modes && window.urlArguments.modes.indexOf('qwant_search' !== -1);
    if ((window.DEV_ENV || qwantMode || window.ENABLE_QWANT_SEARCH) && window.qwantInstalled) {
      this.imagePanel = new ObjectPickerImage();
      tabControler.addTab(this.objectPickerCont, this.tablist, this.imagePanel);
      this.panelsControlers[this.imagePanel.name] = this.imagePanel;
      this.albumPanel = new ObjectPickerAlbum();
      tabControler.addTab(this.objectPickerCont, this.tablist, this.albumPanel);
      this.panelsControlers[this.albumPanel.name] = this.albumPanel;
      this.imagesSearchPanel = new ObjectPickerSearch();
      tabControler.addTab(this.objectPickerCont, this.tablist, this.imagesSearchPanel);
      this.panelsControlers[this.imagesSearchPanel.name] = this.imagesSearchPanel;
    }
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
    this.name = 'thumbPicker';
    this.tabLabel = 'image';
    this.tab = $("<div class='fa fa-photo'>" + this.tabLabel + "</div>")[0];
    this.panel = this.el;
    return this.longList = new LongList(this.panel, this.modal);
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

;require.register("views/object_picker_search", function(exports, require, module) {
var BaseView, ObjectPickerSearch, client, proxyclient, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

proxyclient = require('lib/proxyclient');

BaseView = require('lib/base_view');

client = require('../lib/request');

module.exports = ObjectPickerSearch = (function(_super) {
  __extends(ObjectPickerSearch, _super);

  function ObjectPickerSearch() {
    _ref = ObjectPickerSearch.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ObjectPickerSearch.prototype.template = require('../templates/object_picker_search');

  ObjectPickerSearch.prototype.tagName = 'section';

  ObjectPickerSearch.prototype.initialize = function() {
    this.render();
    this.name = 'imagesSearch';
    this.tabLabel = 'search';
    this.tab = $("<div class='fa fa-search'>" + this.tabLabel + "</div>")[0];
    this.panel = this.el;
    this.blocContainer = this.panel.querySelector('.search-tab-container');
    this.input = this.panel.querySelector('.modal-search-input');
    this.selectedUrl = this.selectedUrl;
    this.selectedImage = {};
    this.input.addEventListener('keyup', this._inputOnChange);
    this.input.getImages = this._getQwantImages;
    return this.input.container = this.blocContainer;
  };

  ObjectPickerSearch.prototype.getObject = function() {
    var _ref1;
    this.selectedUrl = (_ref1 = $('div.selected img')[0]) != null ? _ref1.data : void 0;
    if (this.selectedUrl) {
      this.selectedUrl = "api/proxy/?url=" + this.selectedUrl;
      return {
        urlToFetch: this.selectedUrl
      };
    } else {
      return false;
    }
  };

  ObjectPickerSearch.prototype.setFocusIfExpected = function() {
    this.input.focus();
    this.input.select();
    return true;
  };

  ObjectPickerSearch.prototype.keyHandler = function(e) {
    return false;
  };

  ObjectPickerSearch.prototype._inputOnChange = _.debounce(function(e) {
    var newQuery;
    newQuery = this.value;
    if (newQuery.trim() !== '' && newQuery !== this.query) {
      this.query = newQuery;
      return this.getImages();
    }
  }, 500);

  ObjectPickerSearch.prototype._getQwantImages = function() {
    var container,
      _this = this;
    container = $('.search-tab-container');
    container.children('.results').remove();
    container.children('.error').remove();
    if (!$('.search-tab-container .spinner').length) {
      container.append($("<img src='/img/spinner.svg' class='spinner'/>"));
    }
    return client.get("apps/qwant/imagesSearch?q=" + this.query + "&count=50", function(err, res) {
      var currentImage, imagesArray, index, item$, results$, thumb$, _ref1, _ref2, _ref3, _ref4;
      container.children('.spinner').remove();
      if (err) {
        container.append($("<div class='error'>" + (t('a server error occured')) + "</div>"));
        console.error(err);
        return;
      }
      if ((res != null ? (_ref1 = res.data) != null ? (_ref2 = _ref1.result) != null ? _ref2.items.length : void 0 : void 0 : void 0) === 0) {
        container.append($("<div class='error notFound'>" + (t('qwant results not found')) + "</div>"));
        return;
      }
      if (res != null ? (_ref3 = res.data) != null ? (_ref4 = _ref3.result) != null ? _ref4.items : void 0 : void 0 : void 0) {
        results$ = $("<div class='results'></div>");
        imagesArray = res.data.result.items;
        for (index in imagesArray) {
          item$ = $("<div class='searchItem'></div>");
          currentImage = imagesArray[index];
          thumb$ = new Image();
          thumb$.src = currentImage.thumbnail;
          thumb$.data = currentImage.media;
          thumb$.style.height = currentImage.thumb_height + 'px';
          thumb$.style.width = currentImage.thumb_width + 'px';
          thumb$.onerror = function() {
            return $(this).parent().hide();
          };
          thumb$.onclick = function() {
            $('.searchItem').removeClass('selected');
            return $(this).parent().addClass('selected');
          };
          item$.append(thumb$);
          results$.append(item$);
        }
        return container.append(results$);
      }
    });
  };

  return ObjectPickerSearch;

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
    this.confirmCallback = _.once(options.confirm);
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
    var description, docType, drawFilterType, filterTag, filterType, filtersType, hasFilter, headerDiv, isShared, localeDesc, localeKey, permission, permissions, permissionsDiv, sharedClass, sharedTag, _ref1, _ref2;
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
      if (window.BEN_DEMO) {
        this.body.append("<h4>" + (t('required permissions')) + "</h4>");
        headerDiv = $("<div class='permissionsLine header flag-ben-demo'>                        <div class='fake-checkbox checked'><div class='circle'></div></div>                        <div class='doctype-name'>Doctype</div>                        <div class='doctype-filter'>Filtre</div>                        <div class='doctype-use'>Usage</div>");
        this.body.append(headerDiv);
        filtersType = ['Accès restreint aux documents possédant le tag "Travail".', 'Accès restreint aux documents possédant le tag "Personnel".', 'Accès restreint aux documents possédant le tag "Vacances".', 'Accès restreint aux documents créés il y a plus de deux semaines.', 'Accès restreint aux documents créé il y a plus de deux semaines.'];
        _ref1 = this.model.get("permissions");
        for (docType in _ref1) {
          permission = _ref1[docType];
          hasFilter = (Math.round(Math.random() * 100) + 1) <= 50;
          isShared = (Math.round(Math.random() * 100) + 1) <= 50;
          if (hasFilter) {
            filterTag = "&nbsp;";
          } else {
            drawFilterType = Math.round(Math.random() * filtersType.length);
            filterType = filtersType[drawFilterType];
            filterTag = "<i class='fa fa-filter'></i>                                     <div class='tooltip'>" + filterType + "</div>";
          }
          if (isShared) {
            sharedClass = "";
            sharedTag = "Local <div class='tooltip'>Cette donnée ne sera utilisée qu'en local et ne sortira pas de Cozy.</div>";
          } else {
            sharedClass = "shared";
            sharedTag = "Partagé <div class='tooltip'>L'application demande l'autorisation d'envoyer cette donnée à l'extérieur. En savoir plus…</div>";
          }
          permissionsDiv = $("<div class='permissionsLine flag-ben-demo'>                            <div class='fake-checkbox checked'><div class='circle'></div></div>                            <div class='doctype-name'>" + docType + "</div>                            <div class='doctype-filter'>" + filterTag + "</div>                            <div class='doctype-use " + sharedClass + "'>" + sharedTag + "</div>");
          this.body.append(permissionsDiv);
        }
      } else {
        this.body.append("<h5>" + (t('required permissions')) + "</h5>");
        _ref2 = this.model.get("permissions");
        for (docType in _ref2) {
          permission = _ref2[docType];
          permissionsDiv = $("<div class='permissionsLine'>\n  <strong> " + docType + " </strong>\n  <p> " + permission.description + " </p>\n</div>");
          this.body.append(permissionsDiv);
        }
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

;require.register("views/search_bar_mix", function(exports, require, module) {
var BaseView, SearchBarView,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

module.exports = SearchBarView = (function(_super) {
  __extends(SearchBarView, _super);

  SearchBarView.prototype.el = '.navbar';

  SearchBarView.prototype.regExpHistory = {};

  SearchBarView.prototype.onSearchClick = function(e) {
    return e.target.select();
  };

  SearchBarView.prototype.searchWebQwant = function(e) {
    var intent, query;
    if (e.keyCode && e.keyCode === 13) {
      query = encodeURIComponent(e.target.value);
      intent = {
        action: 'goto',
        params: "qwant/search/web/" + query
      };
      return window.postMessage(intent, window.location.origin);
    }
  };

  SearchBarView.prototype.handleSubmit = function(e) {
    return this.searchWebQwant(e);
  };

  function SearchBarView() {
    var highlightItem, qwantDisplay, qwantMode, qwantSearchDataset, qwantSource, states, substringMatcher, trackCharsToHighlight, typeah,
      _this = this;
    qwantMode = window.urlArguments && window.urlArguments.modes && window.urlArguments.modes.indexOf('qwant_search' !== -1);
    this.qwantEnable = (window.DEV_ENV || qwantMode || window.ENABLE_QWANT_SEARCH) && window.qwantInstalled;
    this.BEN_DEMO = window.BEN_DEMO;
    if (this.qwantEnable && this.BEN_DEMO) {
      qwantSearchDataset = ["web", 'images'];
      qwantSource = function(items) {
        return function(query, cb) {
          return cb(["QwantWeb-" + query, "QwantImages-" + query]);
        };
      };
      qwantDisplay = function(query) {
        if (query.indexOf('QwantWeb-') >= 0) {
          query = query.replace("QwantWeb-", "");
          return "Qwant web for " + query;
        }
        if (query.indexOf('QwantImages-') >= 0) {
          query = query.replace("QwantImages-", "");
          return "Qwant images for " + query;
        }
      };
      substringMatcher = function(items) {
        return function(query, cb) {
          var item, itemMatched, matches, queryWords, reg, regExp, regExpList, word, _i, _j, _k, _len, _len1, _len2;
          matches = [];
          if (query.length <= 3) {
            cb([]);
          }
          queryWords = query.toLowerCase().trim().split(' ');
          regExpList = [];
          for (_i = 0, _len = queryWords.length; _i < _len; _i++) {
            word = queryWords[_i];
            if (!(reg = _this.regExpHistory[word])) {
              reg = new RegExp(word.split('').join('.*?'), 'g');
              _this.regExpHistory[word] = reg;
            }
            regExpList.push(reg);
          }
          for (_j = 0, _len1 = items.length; _j < _len1; _j++) {
            item = items[_j];
            itemMatched = true;
            for (_k = 0, _len2 = regExpList.length; _k < _len2; _k++) {
              regExp = regExpList[_k];
              if (!regExp.test(item.toLowerCase())) {
                itemMatched = false;
                break;
              }
              regExp.lastIndex = 0;
            }
            if (itemMatched) {
              matches.push(item);
            }
          }
          return cb(matches);
        };
      };
      states = ["/Administratif", "/Administratif/Bank statements", "/Administratif/Bank statements/Bank Of America", "/Administratif/Bank statements/Deutsche Bank", "/Administratif/Bank statements/Société Générale", "/Administratif/CPAM", "/Administratif/EDF", "/Administratif/EDF/Contrat", "/Administratif/EDF/Factures", "/Administratif/Emploi", "/Administratif/Impôts", "/Administratif/Logement", "/Administratif/Logement/Loyer 158 rue de Verdun", "/Administratif/Orange", "/Administratif/Pièces identité", "/Administratif/Pièces identité/Carte identité", "/Administratif/Pièces identité/Passeport", "/Administratif/Pièces identité/Permis de conduire", "/Appareils photo", "/Boulot", "/Cours ISEN", "/Cours ISEN/CIR", "/Cours ISEN/CIR/LINUX", "/Cours ISEN/CIR/MICROCONTROLEUR", "/Cours ISEN/CIR/RESEAUX", "/Cours ISEN/CIR/TRAITEMENT_SIGNAL", "/Divers photo", "/Divers photo/wallpapers", "/Films", "/Notes", "/Notes/Communication", "/Notes/Notes techniques", "/Notes/Recrutement", "/Projet appartement à Lyon", "/Vacances Périgord"];
      trackCharsToHighlight = function(item, charsToHighlight, startIndex, word) {
        var char, charIndex, nChars, wordIndex;
        charsToHighlight[startIndex] = true;
        nChars = item.length;
        charIndex = startIndex;
        wordIndex = 1;
        while (charIndex < nChars) {
          char = item[charIndex];
          if (char === word[wordIndex]) {
            charsToHighlight[charIndex] = true;
            if (++wordIndex >= word.length) {
              return;
            }
          }
          charIndex++;
        }
      };
      highlightItem = function(item, charsToHighlight) {
        var isToHighlight, n, previousWasToHighlight, res, _i, _len;
        res = '<p>';
        previousWasToHighlight = void 0;
        for (n = _i = 0, _len = charsToHighlight.length; _i < _len; n = ++_i) {
          isToHighlight = charsToHighlight[n];
          if (isToHighlight === previousWasToHighlight) {
            res += item[n];
          } else {
            if (previousWasToHighlight) {
              res += '</strong>' + item[n];
            } else {
              res += '<strong class="tt-highlight">' + item[n];
            }
          }
          previousWasToHighlight = isToHighlight;
        }
        if (previousWasToHighlight) {
          return res += '</strong></p>';
        } else {
          return res += '</p>';
        }
      };
      typeah = $('#search-bar');
      typeah.typeahead({
        hint: true,
        highlight: true,
        minLength: 1,
        limit: 8
      }, {
        name: 'qwant',
        source: qwantSource(qwantSearchDataset),
        display: qwantDisplay,
        templates: {
          header: function() {
            return "<p class='sourceTitle'>Search in application Qwant</p>";
          }
        }
      }, {
        name: 'states',
        source: substringMatcher(states),
        templates: {
          header: function() {
            return "<p class='sourceTitle'>Search in application Files</p>";
          },
          suggestion: function(item) {
            var fullWordMatch_N, fullWordsToHighlight, fuzzyWordsToHighlight, html, isToHighlight, itemLC, match, n, queryWords, word, wordRegexp, _i, _j, _len, _len1;
            queryWords = typeah.typeahead('val').toLowerCase().trim().split(' ');
            itemLC = item.toLowerCase();
            fullWordsToHighlight = Array(item.length);
            for (_i = 0, _len = queryWords.length; _i < _len; _i++) {
              word = queryWords[_i];
              wordRegexp = _this.regExpHistory[word];
              wordRegexp.lastIndex = 0;
              fullWordMatch_N = 0;
              fuzzyWordsToHighlight = Array(item.length);
              while (match = wordRegexp.exec(itemLC)) {
                if (match[0].length === word.length) {
                  fullWordMatch_N++;
                  trackCharsToHighlight(itemLC, fullWordsToHighlight, match.index, word);
                } else if (fullWordMatch_N === 0) {
                  trackCharsToHighlight(itemLC, fuzzyWordsToHighlight, match.index, word);
                }
              }
              if (fullWordMatch_N === 0) {
                for (n = _j = 0, _len1 = fuzzyWordsToHighlight.length; _j < _len1; n = ++_j) {
                  isToHighlight = fuzzyWordsToHighlight[n];
                  if (isToHighlight) {
                    fullWordsToHighlight[n] = true;
                  }
                }
              }
            }
            return html = highlightItem(item, fullWordsToHighlight);
          }
        }
      });
      $('.twitter-typeahead').bind('typeahead:select', function(ev, suggestion) {
        var intent, query;
        console.log('Selection: ', suggestion, ev);
        if (suggestion && suggestion.indexOf('QwantWeb-') >= 0) {
          suggestion = suggestion.replace("QwantWeb-", "");
          typeah.typeahead('val', '');
          query = encodeURIComponent(suggestion);
          intent = {
            action: 'goto',
            params: "qwant/search/web/" + query
          };
          return window.postMessage(intent, window.location.origin);
        } else if (suggestion && suggestion.indexOf('QwantImages-') >= 0) {
          suggestion = suggestion.replace("QwantImages-", "");
          typeah.typeahead('val', '');
          query = encodeURIComponent(suggestion);
          intent = {
            action: 'goto',
            params: "qwant/search/images/" + query
          };
          return window.postMessage(intent, window.location.origin);
        } else {
          window.app.routers.main.navigate("apps/files/folders/be2639a48e5ee0775d5b34bebf2e6b60", true);
          return typeah.typeahead('val', '');
        }
      });
      $('.twitter-typeahead').bind('typeahead:cursorchange', function(ev, suggestion) {
        if (suggestion && suggestion.indexOf('QwantWeb-') >= 0) {
          suggestion = suggestion.replace("QwantWeb-", "");
          typeah.typeahead('val', suggestion);
        }
        if (suggestion && suggestion.indexOf('QwantImages-') >= 0) {
          suggestion = suggestion.replace("QwantImages-", "");
          return typeah.typeahead('val', suggestion);
        }
      });
    } else if (this.BEN_DEMO) {
      substringMatcher = function(items) {
        return function(query, cb) {
          var item, itemMatched, matches, queryWords, reg, regExp, regExpList, word, _i, _j, _k, _len, _len1, _len2;
          matches = [];
          queryWords = query.toLowerCase().trim().split(' ');
          regExpList = [];
          for (_i = 0, _len = queryWords.length; _i < _len; _i++) {
            word = queryWords[_i];
            if (!(reg = _this.regExpHistory[word])) {
              reg = new RegExp(word.split('').join('.*?'), 'g');
              _this.regExpHistory[word] = reg;
            }
            regExpList.push(reg);
          }
          for (_j = 0, _len1 = items.length; _j < _len1; _j++) {
            item = items[_j];
            itemMatched = true;
            for (_k = 0, _len2 = regExpList.length; _k < _len2; _k++) {
              regExp = regExpList[_k];
              if (!regExp.test(item.toLowerCase())) {
                itemMatched = false;
                break;
              }
              regExp.lastIndex = 0;
            }
            if (itemMatched) {
              matches.push(item);
            }
          }
          return cb(matches);
        };
      };
      states = ["/Administratif", "/Administratif/Bank statements", "/Administratif/Bank statements/Bank Of America", "/Administratif/Bank statements/Deutsche Bank", "/Administratif/Bank statements/Société Générale", "/Administratif/CPAM", "/Administratif/EDF", "/Administratif/EDF/Contrat", "/Administratif/EDF/Factures", "/Administratif/Emploi", "/Administratif/Impôts", "/Administratif/Logement", "/Administratif/Logement/Loyer 158 rue de Verdun", "/Administratif/Orange", "/Administratif/Pièces identité", "/Administratif/Pièces identité/Carte identité", "/Administratif/Pièces identité/Passeport", "/Administratif/Pièces identité/Permis de conduire", "/Appareils photo", "/Boulot", "/Cours ISEN", "/Cours ISEN/CIR", "/Cours ISEN/CIR/LINUX", "/Cours ISEN/CIR/MICROCONTROLEUR", "/Cours ISEN/CIR/RESEAUX", "/Cours ISEN/CIR/TRAITEMENT_SIGNAL", "/Divers photo", "/Divers photo/wallpapers", "/Films", "/Notes", "/Notes/Communication", "/Notes/Notes techniques", "/Notes/Recrutement", "/Projet appartement à Lyon", "/Vacances Périgord"];
      trackCharsToHighlight = function(item, charsToHighlight, startIndex, word) {
        var char, charIndex, nChars, wordIndex;
        charsToHighlight[startIndex] = true;
        nChars = item.length;
        charIndex = startIndex;
        wordIndex = 1;
        while (charIndex < nChars) {
          char = item[charIndex];
          if (char === word[wordIndex]) {
            charsToHighlight[charIndex] = true;
            if (++wordIndex >= word.length) {
              return;
            }
          }
          charIndex++;
        }
      };
      highlightItem = function(item, charsToHighlight) {
        var isToHighlight, n, previousWasToHighlight, res, _i, _len;
        res = '<p>';
        previousWasToHighlight = void 0;
        for (n = _i = 0, _len = charsToHighlight.length; _i < _len; n = ++_i) {
          isToHighlight = charsToHighlight[n];
          if (isToHighlight === previousWasToHighlight) {
            res += item[n];
          } else {
            if (previousWasToHighlight) {
              res += '</strong>' + item[n];
            } else {
              res += '<strong class="tt-highlight">' + item[n];
            }
          }
          previousWasToHighlight = isToHighlight;
        }
        if (previousWasToHighlight) {
          return res += '</strong></p>';
        } else {
          return res += '</p>';
        }
      };
      typeah = $('#search-bar');
      typeah.typeahead({
        hint: true,
        highlight: true,
        minLength: 1,
        limit: 8
      }, {
        name: 'states',
        source: substringMatcher(states),
        templates: {
          suggestion: function(item) {
            var fullWordMatch_N, fullWordsToHighlight, fuzzyWordsToHighlight, html, isToHighlight, itemLC, match, n, queryWords, word, wordRegexp, _i, _j, _len, _len1;
            queryWords = typeah.typeahead('val').toLowerCase().trim().split(' ');
            itemLC = item.toLowerCase();
            fullWordsToHighlight = Array(item.length);
            for (_i = 0, _len = queryWords.length; _i < _len; _i++) {
              word = queryWords[_i];
              wordRegexp = _this.regExpHistory[word];
              wordRegexp.lastIndex = 0;
              fullWordMatch_N = 0;
              fuzzyWordsToHighlight = Array(item.length);
              while (match = wordRegexp.exec(itemLC)) {
                if (match[0].length === word.length) {
                  fullWordMatch_N++;
                  trackCharsToHighlight(itemLC, fullWordsToHighlight, match.index, word);
                } else if (fullWordMatch_N === 0) {
                  trackCharsToHighlight(itemLC, fuzzyWordsToHighlight, match.index, word);
                }
              }
              if (fullWordMatch_N === 0) {
                for (n = _j = 0, _len1 = fuzzyWordsToHighlight.length; _j < _len1; n = ++_j) {
                  isToHighlight = fuzzyWordsToHighlight[n];
                  if (isToHighlight) {
                    fullWordsToHighlight[n] = true;
                  }
                }
              }
            }
            return html = highlightItem(item, fullWordsToHighlight);
          }
        }
      });
      $('.twitter-typeahead').bind('typeahead:select', function(ev, suggestion) {
        console.log('Selection: ', suggestion, ev);
        window.app.routers.main.navigate("apps/files/folders/be2639a48e5ee0775d5b34bebf2e6b60", true);
        return typeah.typeahead('val', '');
      });
    } else if (this.qwantEnable) {
      this.events = {
        "keyup #search-bar": "handleSubmit",
        'click #search-bar': "onSearchClick"
      };
    }
    SearchBarView.__super__.constructor.apply(this, arguments);
  }

  SearchBarView.prototype.appendView = function(view) {};

  return SearchBarView;

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
    return this.cancelCallback = options.cancel;
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

  UpdateStackModal.prototype.displaySuccessChanges = function(changes) {
    this.$('.step2').hide();
    this.$('.success').show();
    this.$('#ok').show();
    this.$('#confirmbtn').hide();
    return this.showPermissionsChanged(changes);
  };

  UpdateStackModal.prototype.onSuccess = function(changes) {
    return this.displaySuccessChanges(changes);
  };

  UpdateStackModal.prototype.onError = function(err, changes) {
    var app, html, infos, _ref1;
    this.blocked = false;
    this.displaySuccessChanges(changes);
    if ((((_ref1 = err.data) != null ? _ref1.message : void 0) != null) && typeof err.data.message === 'object') {
      infos = err.data.message;
      if (Object.keys(infos).length > 0) {
        this.$(".stack-error").hide();
        html = "<ul>";
        for (app in infos) {
          html += "<li class='app-broken'>" + app + "</li>";
        }
        html += "</ul>";
        return this.body.append(html);
      }
    } else {
      return this.$('.apps-error').hide();
    }
  };

  UpdateStackModal.prototype.showPermissionsChanged = function(changes) {
    var app, html;
    if ((changes != null) && Object.keys(changes).length > 0) {
      html = "<ul>";
      for (app in changes) {
        html += "<li class='app-changed'>" + app + "</li>";
      }
      html += "</ul>";
      this.$('.permission-changes').append(html);
      return this.$('.permission-changes').show();
    }
  };

  UpdateStackModal.prototype.onClose = function() {
    this.hide();
    return this.cancelCallback();
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