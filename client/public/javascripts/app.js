(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
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
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
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

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
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

  ApplicationCollection.prototype.fetchFromMarket = function() {
    var apps;
    apps = [
      {
        icon: "img/calendar-icon.png",
        name: "calendar",
        displayName: "Calendar",
        slug: "calendar",
        git: "https://github.com/cozy/cozy-calendar.git",
        comment: "official application",
        description: "calendars description"
      }, {
        icon: "img/contacts-icon.png",
        name: "contacts",
        displayName: "Contacts",
        slug: "contacts",
        git: "https://github.com/cozy/cozy-contacts.git",
        comment: "official application",
        description: "contacts description"
      }, {
        icon: "img/emails-icon.png",
        name: "emails",
        displayName: "Emails",
        slug: "emails",
        git: "https://github.com/cozy/cozy-emails.git",
        comment: "official application",
        description: "emails description"
      }, {
        icon: "img/files-icon.png",
        name: "files",
        displayName: "Files",
        slug: "files",
        git: "https://github.com/cozy/cozy-files.git",
        comment: "official application",
        description: "files description"
      }, {
        icon: "img/photos-icon.png",
        name: "photos",
        displayName: "Photos",
        slug: "photos",
        git: "https://github.com/cozy/cozy-photos.git",
        comment: "official application",
        description: "photos description"
      }, {
        icon: "img/sync-icon.png",
        name: "sync",
        displayName: "Sync",
        slug: "sync",
        git: "https://github.com/cozy/cozy-sync.git",
        comment: "official application",
        description: "sync description"
      }, {
        icon: "img/bookmarks-icon.png",
        name: "bookmarks",
        displayName: "Bookmarks",
        slug: "bookmarks",
        git: "https://github.com/Piour/cozy-bookmarks.git",
        comment: "community contribution",
        description: "bookmark description"
      }, {
        icon: "img/cozy-music.png",
        name: "cozic",
        displayName: "Cozic",
        slug: "cozic",
        git: "https://github.com/rdubigny/cozy-music.git",
        comment: "community contribution",
        description: "cozic description"
      }, {
        icon: "img/databrowser-icon.png",
        name: "databrowser",
        displayName: "Data Browser",
        slug: "databrowser",
        git: "https://github.com/n-a-n/cozy-databrowser.git",
        comment: "community contribution",
        description: "databrowser description"
      }, {
        icon: "img/feeds-icon.png",
        name: "feeds",
        displayName: "Feeds",
        slug: "feeds",
        git: "https://github.com/Piour/cozy-feeds.git",
        comment: "community contribution",
        description: "feeds description"
      }, {
        icon: "img/kyou.png",
        name: "kyou",
        displayName: "KYou",
        slug: "kyou",
        git: "https://github.com/frankrousseau/kyou.git",
        comment: "community contribution",
        description: "kyou description",
        website: "http://frankrousseau.github.io/kyou"
      }, {
        icon: "img/konnectors-icon.png",
        name: "konnectors",
        displayName: "Konnectors",
        slug: "konnectors",
        git: "https://github.com/frankrousseau/konnectors.git",
        comment: "community contribution",
        description: "konnectors description"
      }, {
        icon: "img/kresus-icon.png",
        name: "kresus",
        displayName: "Kresus",
        slug: "kresus",
        git: "https://github.com/bnjbvr/kresus.git",
        comment: "community contribution",
        description: "kresus description"
      }, {
        icon: "img/nirc-icon.png",
        name: "nirc",
        displayName: "nIRC",
        slug: "nirc",
        git: "https://github.com/frankrousseau/cozy-nirc.git",
        comment: "community contribution",
        description: "nirc description"
      }, {
        icon: "img/notes-icon.png",
        name: "notes",
        displayName: "Note",
        slug: "notes",
        git: "https://github.com/cozy/notes.git",
        comment: "community contribution",
        description: "notes description"
      }, {
        icon: "img/owm.png",
        name: "owm",
        displayName: "OWM",
        slug: "owm",
        git: "https://github.com/Piour/piour-cozy-owm.git",
        comment: "community contribution",
        description: "owm description"
      }, {
        icon: "img/pfm.png",
        name: "mes comptes",
        displayName: "Mes Comptes",
        slug: "pfm",
        git: "https://github.com/seeker89/cozy-pfm.git",
        comment: "community contribution",
        description: "pfm description"
      }, {
        icon: "img/remotestorage-icon.png",
        name: "remotestorage",
        displayName: "Remote Storage",
        slug: "remotestorage",
        git: "https://github.com/aenario/cozy-remotestorage.git",
        comment: "community contribution",
        description: "remote storage description"
      }, {
        icon: "img/tasky-icon.png",
        name: "tasky",
        displayName: "Tasky",
        slug: "tasky",
        git: "https://github.com/jsilvestre/tasky.git",
        comment: "community contribution",
        description: "tasky description"
      }, {
        icon: "img/todos-icon.png",
        name: "todos",
        displayName: "Todos",
        slug: "todos",
        git: "https://github.com/cozy/todos.git",
        comment: "community contribution",
        description: "todos description"
      }, {
        icon: "img/term-icon.png",
        name: "term",
        displayName: "Term",
        slug: "term",
        git: "https://github.com/alpha14/cozy-term.git",
        comment: "community contribution",
        description: "term description"
      }
    ];
    return this.reset(apps);
  };

  return ApplicationCollection;

})(BaseCollection);
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

;require.register("helpers", function(exports, require, module) {
exports.BrunchApplication = (function() {
  function BrunchApplication() {
    var _this = this;
    $(function() {
      return _this.initialize(_this);
    });
  }

  BrunchApplication.prototype.initializeJQueryExtensions = function() {
    var oldAST, oldGST;
    $.fn.spin = function(opts, color) {
      var presets;
      presets = {
        tiny: {
          lines: 8,
          length: 2,
          width: 2,
          radius: 3
        },
        small: {
          lines: 8,
          length: 1,
          width: 2,
          radius: 4
        },
        medium: {
          lines: 10,
          length: 4,
          width: 3,
          radius: 6
        },
        large: {
          lines: 10,
          length: 8,
          width: 4,
          radius: 8
        },
        extralarge: {
          lines: 8,
          length: 3,
          width: 10,
          radius: 20,
          top: 30,
          left: 50
        }
      };
      if (typeof Spinner !== "undefined" && Spinner !== null) {
        return this.each(function() {
          var $this, spinner;
          $this = $(this);
          spinner = $this.data("spinner");
          if (spinner != null) {
            spinner.stop();
            return $this.data("spinner", null);
          } else if (opts !== false) {
            if (typeof opts === "string") {
              if (opts in presets) {
                opts = presets[opts];
              } else {
                opts = {};
              }
              if (color) {
                opts.color = color;
              }
            }
            spinner = new Spinner(opts);
            spinner.spin(this);
            return $this.data("spinner", spinner);
          }
        });
      } else {
        throw "Spinner class not available.";
        return null;
      }
    };
    oldAST = $.Gridster.add_style_tag;
    $.Gridster.add_style_tag = function(css) {
      var tag, _i, _len, _ref, _ref1;
      _ref = this.$style_tags;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tag = _ref[_i];
        if ((_ref1 = tag.parentNode) != null) {
          _ref1.removeChild(tag);
        }
      }
      this.$style_tags = $([]);
      return oldAST.apply(this, arguments);
    };
    oldGST = $.Gridster.generate_stylesheets;
    $.Gridster.generate_stylesheets = function() {
      $.Gridster.generated_stylesheets = [];
      return oldGST.apply(this, arguments);
    };
    return $.Gridster.resize_widget_dimensions = function(options) {
      var serializedGrid,
        _this = this;
      if (options.width) {
        this.drag_api.$container.width(options.width);
        this.container_width = options.width;
        this.options.container_width = options.width;
      }
      if (options.colsNb) {
        this.options.min_cols = options.colsNb;
        this.options.max_cols = options.colsNb;
      }
      if (options.widget_margins) {
        this.options.widget_margins = options.widget_margins;
      }
      if (options.widget_base_dimensions) {
        this.options.widget_base_dimensions = options.widget_base_dimensions;
      }
      this.min_widget_width = (this.options.widget_margins[0] * 2) + this.options.widget_base_dimensions[0];
      this.min_widget_height = (this.options.widget_margins[1] * 2) + this.options.widget_base_dimensions[1];
      serializedGrid = this.serialize();
      this.$widgets.each($.proxy(function(i, widget) {
        var data;
        data = serializedGrid[i];
        return _this.resize_widget($(widget), data.sizex, data.sizey);
      }));
      this.generate_grid_and_stylesheet();
      this.get_widgets_from_DOM();
      this.generate_stylesheet(options.styles_for);
      return false;
    };
  };

  BrunchApplication.prototype.initialize = function() {};

  return BrunchApplication;

})();

exports.selectAll = function(input) {
  return input.setSelection(0, input.val().length);
};

exports.slugify = function(string) {
  var _slugify_hyphenate_re, _slugify_strip_re;
  _slugify_strip_re = /[^\w\s-]/g;
  _slugify_hyphenate_re = /[-\s]+/g;
  string = string.replace(_slugify_strip_re, '').trim().toLowerCase();
  string = string.replace(_slugify_hyphenate_re, '-');
  return string;
};

exports.getPathRegExp = function(path) {
  var slashReg;
  slashReg = new RegExp("/", "g");
  return "^" + (path.replace(slashReg, "\/"));
};
});

;require.register("helpers/client", function(exports, require, module) {
exports.request = function(type, url, data, callbacks) {
  return $.ajax({
    type: type,
    url: url,
    data: data,
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
});

;require.register("helpers/locales", function(exports, require, module) {
exports.locales = {
  'en': 'English',
  'fr': 'Français'
};
});

;require.register("helpers/timezone", function(exports, require, module) {
exports.timezones = ["Africa/Abidjan", "Africa/Accra", "Africa/Addis_Ababa", "Africa/Algiers", "Africa/Asmara", "Africa/Bamako", "Africa/Bangui", "Africa/Banjul", "Africa/Bissau", "Africa/Blantyre", "Africa/Brazzaville", "Africa/Bujumbura", "Africa/Cairo", "Africa/Casablanca", "Africa/Ceuta", "Africa/Conakry", "Africa/Dakar", "Africa/Dar_es_Salaam", "Africa/Djibouti", "Africa/Douala", "Africa/El_Aaiun", "Africa/Freetown", "Africa/Gaborone", "Africa/Harare", "Africa/Johannesburg", "Africa/Kampala", "Africa/Khartoum", "Africa/Kigali", "Africa/Kinshasa", "Africa/Lagos", "Africa/Libreville", "Africa/Lome", "Africa/Luanda", "Africa/Lubumbashi", "Africa/Lusaka", "Africa/Malabo", "Africa/Maputo", "Africa/Maseru", "Africa/Mbabane", "Africa/Mogadishu", "Africa/Monrovia", "Africa/Nairobi", "Africa/Ndjamena", "Africa/Niamey", "Africa/Nouakchott", "Africa/Ouagadougou", "Africa/Porto-Novo", "Africa/Sao_Tome", "Africa/Tripoli", "Africa/Tunis", "Africa/Windhoek", "America/Adak", "America/Anchorage", "America/Anguilla", "America/Antigua", "America/Araguaina", "America/Argentina/Buenos_Aires", "America/Argentina/Catamarca", "America/Argentina/Cordoba", "America/Argentina/Jujuy", "America/Argentina/La_Rioja", "America/Argentina/Mendoza", "America/Argentina/Rio_Gallegos", "America/Argentina/Salta", "America/Argentina/San_Juan", "America/Argentina/San_Luis", "America/Argentina/Tucuman", "America/Argentina/Ushuaia", "America/Aruba", "America/Asuncion", "America/Atikokan", "America/Bahia", "America/Barbados", "America/Belem", "America/Belize", "America/Blanc-Sablon", "America/Boa_Vista", "America/Bogota", "America/Boise", "America/Cambridge_Bay", "America/Campo_Grande", "America/Cancun", "America/Caracas", "America/Cayenne", "America/Cayman", "America/Chicago", "America/Chihuahua", "America/Costa_Rica", "America/Cuiaba", "America/Curacao", "America/Danmarkshavn", "America/Dawson", "America/Dawson_Creek", "America/Denver", "America/Detroit", "America/Dominica", "America/Edmonton", "America/Eirunepe", "America/El_Salvador", "America/Fortaleza", "America/Glace_Bay", "America/Godthab", "America/Goose_Bay", "America/Grand_Turk", "America/Grenada", "America/Guadeloupe", "America/Guatemala", "America/Guayaquil", "America/Guyana", "America/Halifax", "America/Havana", "America/Hermosillo", "America/Indiana/Indianapolis", "America/Indiana/Knox", "America/Indiana/Marengo", "America/Indiana/Petersburg", "America/Indiana/Tell_City", "America/Indiana/Vevay", "America/Indiana/Vincennes", "America/Indiana/Winamac", "America/Inuvik", "America/Iqaluit", "America/Jamaica", "America/Juneau", "America/Kentucky/Louisville", "America/Kentucky/Monticello", "America/La_Paz", "America/Lima", "America/Los_Angeles", "America/Maceio", "America/Managua", "America/Manaus", "America/Martinique", "America/Matamoros", "America/Mazatlan", "America/Menominee", "America/Merida", "America/Mexico_City", "America/Miquelon", "America/Moncton", "America/Monterrey", "America/Montevideo", "America/Montreal", "America/Montserrat", "America/Nassau", "America/New_York", "America/Nipigon", "America/Nome", "America/Noronha", "America/North_Dakota/Center", "America/North_Dakota/New_Salem", "America/Ojinaga", "America/Panama", "America/Pangnirtung", "America/Paramaribo", "America/Phoenix", "America/Port-au-Prince", "America/Port_of_Spain", "America/Porto_Velho", "America/Puerto_Rico", "America/Rainy_River", "America/Rankin_Inlet", "America/Recife", "America/Regina", "America/Resolute", "America/Rio_Branco", "America/Santa_Isabel", "America/Santarem", "America/Santiago", "America/Santo_Domingo", "America/Sao_Paulo", "America/Scoresbysund", "America/St_Johns", "America/St_Kitts", "America/St_Lucia", "America/St_Thomas", "America/St_Vincent", "America/Swift_Current", "America/Tegucigalpa", "America/Thule", "America/Thunder_Bay", "America/Tijuana", "America/Toronto", "America/Tortola", "America/Vancouver", "America/Whitehorse", "America/Winnipeg", "America/Yakutat", "America/Yellowknife", "Antarctica/Casey", "Antarctica/Davis", "Antarctica/DumontDUrville", "Antarctica/Mawson", "Antarctica/McMurdo", "Antarctica/Palmer", "Antarctica/Rothera", "Antarctica/Syowa", "Antarctica/Vostok", "Asia/Aden", "Asia/Almaty", "Asia/Amman", "Asia/Anadyr", "Asia/Aqtau", "Asia/Aqtobe", "Asia/Ashgabat", "Asia/Baghdad", "Asia/Bahrain", "Asia/Baku", "Asia/Bangkok", "Asia/Beirut", "Asia/Bishkek", "Asia/Brunei", "Asia/Choibalsan", "Asia/Chongqing", "Asia/Colombo", "Asia/Damascus", "Asia/Dhaka", "Asia/Dili", "Asia/Dubai", "Asia/Dushanbe", "Asia/Gaza", "Asia/Harbin", "Asia/Ho_Chi_Minh", "Asia/Hong_Kong", "Asia/Hovd", "Asia/Irkutsk", "Asia/Jakarta", "Asia/Jayapura", "Asia/Jerusalem", "Asia/Kabul", "Asia/Kamchatka", "Asia/Karachi", "Asia/Kashgar", "Asia/Kathmandu", "Asia/Kolkata", "Asia/Krasnoyarsk", "Asia/Kuala_Lumpur", "Asia/Kuching", "Asia/Kuwait", "Asia/Macau", "Asia/Magadan", "Asia/Makassar", "Asia/Manila", "Asia/Muscat", "Asia/Nicosia", "Asia/Novokuznetsk", "Asia/Novosibirsk", "Asia/Omsk", "Asia/Oral", "Asia/Phnom_Penh", "Asia/Pontianak", "Asia/Pyongyang", "Asia/Qatar", "Asia/Qyzylorda", "Asia/Rangoon", "Asia/Riyadh", "Asia/Sakhalin", "Asia/Samarkand", "Asia/Seoul", "Asia/Shanghai", "Asia/Singapore", "Asia/Taipei", "Asia/Tashkent", "Asia/Tbilisi", "Asia/Tehran", "Asia/Thimphu", "Asia/Tokyo", "Asia/Ulaanbaatar", "Asia/Urumqi", "Asia/Vientiane", "Asia/Vladivostok", "Asia/Yakutsk", "Asia/Yekaterinburg", "Asia/Yerevan", "Atlantic/Azores", "Atlantic/Bermuda", "Atlantic/Canary", "Atlantic/Cape_Verde", "Atlantic/Faroe", "Atlantic/Madeira", "Atlantic/Reykjavik", "Atlantic/South_Georgia", "Atlantic/St_Helena", "Atlantic/Stanley", "Australia/Adelaide", "Australia/Brisbane", "Australia/Broken_Hill", "Australia/Currie", "Australia/Darwin", "Australia/Eucla", "Australia/Hobart", "Australia/Lindeman", "Australia/Lord_Howe", "Australia/Melbourne", "Australia/Perth", "Australia/Sydney", "Canada/Atlantic", "Canada/Central", "Canada/Eastern", "Canada/Mountain", "Canada/Newfoundland", "Canada/Pacific", "Europe/Amsterdam", "Europe/Andorra", "Europe/Athens", "Europe/Belgrade", "Europe/Berlin", "Europe/Brussels", "Europe/Bucharest", "Europe/Budapest", "Europe/Chisinau", "Europe/Copenhagen", "Europe/Dublin", "Europe/Gibraltar", "Europe/Helsinki", "Europe/Istanbul", "Europe/Kaliningrad", "Europe/Kiev", "Europe/Lisbon", "Europe/London", "Europe/Luxembourg", "Europe/Madrid", "Europe/Malta", "Europe/Minsk", "Europe/Monaco", "Europe/Moscow", "Europe/Oslo", "Europe/Paris", "Europe/Prague", "Europe/Riga", "Europe/Rome", "Europe/Samara", "Europe/Simferopol", "Europe/Sofia", "Europe/Stockholm", "Europe/Tallinn", "Europe/Tirane", "Europe/Uzhgorod", "Europe/Vaduz", "Europe/Vienna", "Europe/Vilnius", "Europe/Volgograd", "Europe/Warsaw", "Europe/Zaporozhye", "Europe/Zurich", "GMT", "Indian/Antananarivo", "Indian/Chagos", "Indian/Christmas", "Indian/Cocos", "Indian/Comoro", "Indian/Kerguelen", "Indian/Mahe", "Indian/Maldives", "Indian/Mauritius", "Indian/Mayotte", "Indian/Reunion", "Pacific/Apia", "Pacific/Auckland", "Pacific/Chatham", "Pacific/Easter", "Pacific/Efate", "Pacific/Enderbury", "Pacific/Fakaofo", "Pacific/Fiji", "Pacific/Funafuti", "Pacific/Galapagos", "Pacific/Gambier", "Pacific/Guadalcanal", "Pacific/Guam", "Pacific/Honolulu", "Pacific/Johnston", "Pacific/Kiritimati", "Pacific/Kosrae", "Pacific/Kwajalein", "Pacific/Majuro", "Pacific/Marquesas", "Pacific/Midway", "Pacific/Nauru", "Pacific/Niue", "Pacific/Norfolk", "Pacific/Noumea", "Pacific/Pago_Pago", "Pacific/Palau", "Pacific/Pitcairn", "Pacific/Ponape", "Pacific/Port_Moresby", "Pacific/Rarotonga", "Pacific/Saipan", "Pacific/Tahiti", "Pacific/Tarawa", "Pacific/Tongatapu", "Pacific/Truk", "Pacific/Wake", "Pacific/Wallis", "US/Alaska", "US/Arizona", "US/Central", "US/Eastern", "US/Hawaii", "US/Mountain", "US/Pacific", "UTC"];
});

;require.register("initialize", function(exports, require, module) {
var BrunchApplication, MainRouter, MainView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BrunchApplication = require('./helpers').BrunchApplication;

MainRouter = require('routers/main_router');

MainView = require('views/main');

exports.Application = (function(_super) {
  __extends(Application, _super);

  function Application() {
    _ref = Application.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Application.prototype.initialize = function() {
    var _this = this;
    this.initializeJQueryExtensions();
    return $.ajax('/api/instances/').done(function(instances) {
      var _ref1, _ref2;
      _this.instance = instances != null ? (_ref1 = instances.rows) != null ? _ref1[0] : void 0 : void 0;
      _this.locale = ((_ref2 = _this.instance) != null ? _ref2.locale : void 0) || 'en';
      return _this.initialize2();
    }).fail(function() {
      _this.locale = 'en';
      return _this.initialize2();
    });
  };

  Application.prototype.initialize2 = function() {
    var err, locales, pathToSocketIO, socket, url;
    try {
      locales = require('locales/' + this.locale);
    } catch (_error) {
      err = _error;
      locales = require('locales/en');
    }
    window.app = this;
    this.polyglot = new Polyglot();
    this.polyglot.extend(locales);
    window.t = this.polyglot.t.bind(this.polyglot);
    this.routers = {};
    this.mainView = new MainView();
    this.routers.main = new MainRouter();
    Backbone.history.start();
    if (Backbone.history.getFragment() === '') {
      this.routers.main.navigate('home', true);
    }
    url = window.location.origin;
    pathToSocketIO = "" + (window.location.pathname.substring(1)) + "socket.io";
    socket = io.connect(url, {
      resource: pathToSocketIO
    });
    return socket.on('installerror', function(err) {
      console.log("An error occured while attempting to install app");
      return console.log(err);
    });
  };

  return Application;

})(BrunchApplication);

new exports.Application;
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

;require.register("lib/request", function(exports, require, module) {
exports.request = function(type, url, data, callback) {
  return $.ajax({
    type: type,
    url: url,
    data: data != null ? JSON.stringify(data) : null,
    contentType: "application/json",
    dataType: "json",
    success: function(data) {
      if (callback != null) {
        return callback(null, data);
      }
    },
    error: function(data) {
      if (data != null) {
        data = JSON.parse(data.responseText);
        if ((data.msg != null) && (callback != null)) {
          return callback(new Error(data.msg, data));
        } else if ((data.error != null) && (callback != null)) {
          data.msg = data.error;
          return callback(new Error(data.msg, data));
        }
      } else if (callback != null) {
        return callback(new Error("Server error occured", data));
      }
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
  "timezone": "Timezone",
  "domain": "Domain",
  "no domain set": "no.domain.set",
  "locale": "Locale",
  "change password": "Change password",
  "input your current password": "input your current password",
  "enter a new password": "fill this field to set a new password",
  "confirm new password": "confirm new password",
  "send changes": "Send Changes",
  "manage": "Manage",
  "total": "Total",
  "memory consumption": "Memory consumption",
  "disk consumption": "Disk consumption",
  "you have no notifications": "You have no notifications",
  "dismiss all": "Dismiss all",
  "add application": "add application ?",
  "install": "Install",
  "your app": "your app!",
  "community contribution": "community contribution",
  "official application": "official application",
  "application description": "Application Description",
  "downloading description": "Downloading description ...",
  "downloading permissions": "Download permissions ...",
  "Cancel": "Cancel",
  "ok": "Ok",
  "applications permissions": "Applications Permissions",
  "confirm": "Confirm",
  "installing": "Installing",
  "remove": "remove",
  "update": "update",
  "started": "started",
  "notifications": "Notifications",
  "questions and help forum": "Questions and help forum",
  "sign out": "Sign out",
  "open in a new tab": "open in a new tab",
  "disk unit": "GB",
  "memory unit": "MB",
  "always on": "always on",
  "keep always on": "keep always on",
  "stop this app": "stop this app",
  "update required": "Update available",
  "application is installing": "An application is already installing.\nWait for it to finish, then run your installation again.",
  "no app message": "You have actually no application installed on your Cozy.\nGo to the <a href=\"#applications\">app store</a> to install a new one!",
  "welcome to app store": "Welcome to your cozy app store, install your own application from there\nor add an existing one from the list.",
  "installed everything": "You have already installed everything !",
  "already similarly named app": "There is already an app with similar name.",
  "your app list": "Access to your apps",
  "customize your cozy": "Customize your layout",
  "manage your apps": "Manage your apps",
  "choose your apps": "Choose your apps",
  "configure your cozy": "Configure your cozy",
  "ask for assistance": "Ask for assistance",
  "logout": "logout",
  "welcome to your cozy": "Welcome to your Cozy!",
  "you have no apps": "You have no application installed. You should",
  "configure": "configure ",
  "app management": "App management",
  "app store": "App store",
  "configuration": "Configuration",
  "assistance": "Assistance",
  "hardware consumption": "Hardware",
  "hard drive gigabytes": "&nbsp;GB (Hard Drive)",
  "memory megabytes": "&nbsp;MB (RAM)",
  "manage your applications": "Manage your applications",
  "manage your devices": "Manage your devices",
  "synchronized": "synchronized",
  "revoke device access": "Revoke device access",
  "no application installed": "There is no application installed.",
  "your parameters": " Your parameters",
  "alerts and password recovery email": "I need your email to send you alerts or for password recovering",
  "public name description": "Your public name will be used by your Cozy and its apps to communicate with you.",
  "your timezone is required": "Your timezone is required to display dates properly",
  "domain name for urls and email": "The domain name is used to build urls send via email to you or your contacts",
  "save": "save",
  "saved": "saved",
  "Chose the language you want I use to speak with you:": "Choose the language you want me to use to speak to you:",
  "french": "French",
  "english": "English",
  "portuguese": "Portuguese",
  "change password procedure": "Change password procedure",
  "current password": "current password",
  "new password": "new password",
  "confirm your new password": "confirm your new password",
  "save your new password": "save your new password",
  "do you want assistance": "Do you look for assistance?",
  "Write an email to our support team at:": "Write an email to our support team at:",
  "Register and post on our forum: ": "Register and post on our forum: ",
  "Ask your question on Twitter: ": "Ask your question on Twitter: ",
  "Chat with us on IRC:": "Chat with us on IRC:",
  "Visit the project website and learn to build your app:": "Visit the project website and learn to build your app:",
  "your own application": "your own application",
  "installed": "installed",
  "updated": "updated",
  "updating": "updating",
  "update all": "Update all",
  "update stack": "Update",
  "refresh page": "Wait please, page will refresh in several minutes.",
  "cozy platform": "Platform",
  "reboot stack": "Reboot",
  "update error": "An error occured while updating the application",
  "broken": "broken",
  "start this app": "start this app",
  "stopped": "stopped",
  "retry to install": "retry to install",
  "cozy account title": "Cozy - Account",
  "cozy app store title": "Cozy - App Store",
  "cozy home title": "Cozy - Home",
  "cozy applications title": "Cozy - Applications configuration",
  "running": "running",
  "cozy help title": "Cozy - Help",
  "changing locale requires reload": "Changing the locale requires to reload the page.",
  "cancel": "cancel",
  "abort": "abort",
  "Once updated, this application will require the following permissions:": "Once updated, this application will require the following permissions:",
  "confirm update": "confirm update",
  "confirm install": "confirm install",
  "no specific permissions needed": "This application does not need specific permissions",
  "menu description": "If it's your first time on Cozy here is a little guide\nabout all section available in your Cozy Home. All of them can be reached\nfrom the menu located on the top right corner.",
  "install your first app": "your Cozy then install your first application via the&nbsp;",
  "where you reach applications": "It is the place from where you can reach your applications",
  "There you can manage the state of your applications: start it, stop it, remove it...": "There you can manage the state of your applications: start it, stop it, remove it...",
  "app store contains applications": "In the app store, you will find new applications to install on your Cozy.",
  "set cozy parameters here": "To work properly your Cozy requires several parameters. Set them in this section.",
  "links to resources": "You will find here some links to assistance resources.",
  "The first place to find help is:": "The first place to find help is:",
  "removed": "removed",
  "required permissions": "Required Permissions",
  "finish layout edition": "Save",
  "reset customization": "Reset",
  "use widget": "Use widget",
  "use icon": "Use icon",
  "change layout": "Change the layout",
  "introduction market": "Welcome to the Cozy App Store. This is the place to customize your Cozy\nby adding applications.\nFrom there you can install the application you built or chose among the\napplications provided by Cozy Cloud and other developers.",
  "error connectivity issue": "An error occurred while retrieving the data.<br />Please, try again later.",
  "package.json not found": "Unable to fetch package.json. Check your repo url.",
  "please wait data retrieval": "Please wait while data are being retrieved...",
  "revoke device confirmation message": "This will prevent the related device to access your Cozy. Are you sure?",
  "dashboard": "Dashboard",
  "synchronization": "Synchronization",
  "synchronization description": "Cozy offers you synchronization capabilities for your files, your\ncontacts and your calendars. But it requires specific applications to\nachieve it.",
  "caldav cardav with davdroid": "For your contacts and events, we recommend you the\nBitfire <a href=\"http://davdroid.bitfire.at/what-is-davdroid\">DAVDroid</a>\napplication. Once you have installed the Sync\napp on your Cozy, you can configure your DAVDroid app to synchronize\nyour contacts and events on your phone. Then, you will be able to\naccess them from your native applications.",
  "files with cozy on android": "To access to all your files from your mobile, we recommend you to\ninstall the\n<a href=\"https://play.google.com/store/apps/details?id=io.cozy.files_client\">Cozy application</a>\nfrom the Android Play Store. Once done, just follow the instruction and\nbrowser your files directly from your phone.",
  "calendars description": "Manage your events and sync them with your mobile.",
  "contacts description": "Manage your contacts and sync them with your mobile.",
  "emails description": "Read, send and backup your emails.",
  "files description": "Your online filesystem synced with your devices.",
  "photos description": "Make photo album from you files and share them.",
  "sync description": "The tool required to sync your contact and your calendar with your mobile.",
  "bookmark description": "Save and manage your bookmarks.",
  "cozic description": "An audio player to play your music from your browser.",
  "databrowser description": "Browse and visualize all your data (raw format).",
  "feeds description": "Aggregate your feeds and save your favorite links in bookmarks.",
  "kyou description": "Improve your happiness and your health by quantifying you.",
  "konnectors description": "Import data from external services (Twitter, Jawbone...).",
  "kresus description": "Additional tools for your personal finance manager.",
  "nirc description": "Access to your favorite IRC channel from your Cozy.",
  "notes description": "Organize and write smart notes.",
  "owm description": "Know how is the weather anywhere in the world.",
  "pfm description": "Manage your bank accounts without logging each time (French Banks only).",
  "remote storage description": "A Remote Storage appliance to store data from your Unhosted applications.",
  "tasky description": "Super fast and simple tag-based task manager.",
  "todos description": "Write your tasks, order them and execute them efficiently.",
  "term description": "A terminal for your cozy.",
  "reminder title email": "Reminder",
  "reminder title email expanded": "Reminder: %{description} - %{date} (%{calendar})",
  "reminder message expanded": "Reminder: %{description}\nStart: %{start} (%{timezone})\nEnd: %{end} (%{timezone})\nPlace: %{place}\nDetails: %{details}",
  "reminder message": "Reminder: %{message}",
  "warning unofficial app": "Warning! This app is not maintained by the Cozy team.",
  "installation message failure": "%{appName}'s installation failed.",
  "update available notification": "A new version of %{appName} is available."
};
});

;require.register("locales/fr", function(exports, require, module) {
module.exports = {
  "home": "Bureau",
  "apps": "Apps",
  "account": "Réglages",
  "email": "Email",
  "timezone": "Fuseau horaire",
  "domain": "Nom de domaine",
  "no domain set": "pas.de.domaine.défini",
  "locale": "Langue",
  "change password": "Changer de mot de passe",
  "input your current password": "Mot de passe actuel",
  "enter a new password": "Nouveau mot de passe",
  "confirm new password": "Confirmer le nouveau mot de passe",
  "send changes": "Enregistrer",
  "manage": "Gestion",
  "total": "Total",
  "memory consumption": "Utilisation mémoire",
  "disk consumption": "Utilisation disque",
  "you have no notifications": "Vous n'avez aucune notification",
  "dismiss all": "Ignorer toutes",
  "add application": "Ajouter l'application ?",
  "install": "Installer",
  "your app": "Votre application !",
  "community contribution": "Développeur indépendant",
  "official application": "Application officielle",
  "application description": "Description de l'application",
  "downloading description": "Téléchargement de la description…",
  "downloading permissions": "Téléchargement des permissions…",
  "Cancel": "Annuler",
  "ok": "Ok",
  "applications permissions": "Permissions de l'Application",
  "confirm": "Confirmer",
  "installing": "Installation en cours",
  "remove": "enlever",
  "update": "m.à.j.",
  "started": "démarrée",
  "notifications": "Notifications",
  "questions and help forum": "Forum d'aide",
  "sign out": "Sortir",
  "open in a new tab": "Ouvrir dans un onglet",
  "disk unit": "Go",
  "memory unit": "Mo",
  "always on": "toujours démarrée",
  "keep always on": "garder toujours démarrée",
  "stop this app": "arrêter cet app",
  "update required": "Mise à jour disponible",
  "application is installing": "Une application est en cours d'installation.\nAttendez la fin de celle-ci avant d'en lancer une nouvelle.",
  "no app message": "Vous n'avez aucune application installée. Allez sur\nl'<a href=\"#applications\">app store</a> pour en installer au moins une !",
  "welcome to app store": "Bienvenue sur l'app store, vous pouvez installer votre propre application\nou ajouter une application existante dans la liste",
  "installed everything": "Vous avez déjà tout installé !",
  "already similarly named app": "Une application qui porte un nom similaire est déjà installée.",
  "your app list": "Accédez à vos apps",
  "customize your cozy": "Personnalisez la mise en page",
  "manage your apps": "Gérez vos apps",
  "choose your apps": "Choisissez vos apps",
  "configure your cozy": "Configurez votre cozy",
  "ask for assistance": "Demandez de l'aide",
  "logout": "déconnexion",
  "welcome to your cozy": "Bienvenue sur votre Cozy !",
  "you have no apps": "Vous n'avez pas encore d'applications, vous devriez",
  "configure": "configurer ",
  "app store": "App store",
  "configuration": "Configuration",
  "assistance": "Aide",
  "hardware consumption": "Matériel",
  "hard drive gigabytes": "&nbsp;Go (Disque Dur)",
  "memory megabytes": "&nbsp;Mo (RAM)",
  "manage your applications": "Gérez vos applications",
  "manage your devices": "Gérez vos appareils",
  "revoke device access": "Révoquer l'accès à l'appareil",
  "synchronized": "synchronisé",
  "no application installed": "Il n'y a pas d'applications installées.",
  "save": "sauver",
  "saved": "sauvé",
  "your parameters": " Vos paramètres",
  "alerts and password recovery email": "J'ai besoin de votre email pour la récupération de mot de passe ou\npour vous envoyer des alertes.",
  "public name description": "Votre nom public sera utilisé par votre Cozy et ses applications pour communiquer avec vous.",
  "your timezone is required": "Votre fuseau horaire est nécessaire pour vous afficher les dates correctement.",
  "domain name for urls and email": "Le nom de domaine est utilisé pour construire les URL\nenvoyées par mail à vos contacts.",
  "Chose the language you want I use to speak with you:": "Choisissez la langue que vous souhaitez que j'utilise pour vous parler.",
  "french": "Français",
  "english": "Anglais",
  "portuguese": "Portugais",
  "change password procedure": "Procédure de changement de mot de passe",
  "current password": "mot de passe actuel",
  "new password": "nouveau mot de passe",
  "confirm your new password": "confirmez votre nouveau mot de passe",
  "save your new password": "sauvegarder votre nouveau mot de passe",
  "do you want assistance": "Est-ce que vous cherchez de l'aide ?",
  "Write an email to our support team at:": "Ecrivez un email à notre équipe support :",
  "Register and post on our forum: ": "Postez un message sur notre forum : ",
  "Ask your question on Twitter: ": "Posez votre question sur Twitter : ",
  "Chat with us on IRC:": "Discutez avec nous sur IRC :",
  "Visit the project website and learn to build your app:": "Visitez le site du projet et apprenez à créer des applications.",
  "your own application": "votre propre application",
  "broken": "cassée",
  "installed": "installée",
  "updated": "m.à.j",
  "updating": "m.à.j en cours",
  "update all": "Mettre tout à jour",
  "update stack": "Mettre à jour",
  "refresh page": "Veuillez patienter, la page se rafraîchira d'ici quelques minutes.",
  "reboot stack": "Redémarrer",
  "cozy platform": "Plate-forme",
  "update error": "Une erreur est survenue pendant la mise à jour",
  "start this app": "démarrer cette application",
  "stopped": "stoppée",
  "retry to install": "nouvel essai d'installation",
  "cozy account title": "Cozy - Compte",
  "cozy app store title": "Cozy - App Store",
  "cozy home title": "Cozy - Home",
  "cozy applications title": "Cozy - Configuration d'applications",
  "running": "démarrée",
  "cozy help title": "Cozy - Aide",
  "changing locale requires reload": "Le changement de langue nécessite le rechargement de la page.",
  "cancel": "annuler",
  "abort": "interrompre",
  "Once updated, this application will require the following permissions:": "Une fois mise à jour l'application demandera les permissions suivantes :",
  "confirm update": "confirmez la mise à jour",
  "confirm install": "confirmez l'installation'",
  "no specific permissions needed": "Cette application n'a pas besoin d'informations spécifiques",
  "menu description": "Si c'est votre première fois sur Cozy, vous trouverez\ndans la suite un petit guide décrivant les sections de votre Cozy. Elles\npeuvent toutes être atteintes depuis le menu en haut à droite de l'accueil Cozy.",
  "install your first app": "votre Cozy puis installer votre première application via l'",
  "where you reach applications": "C'est ici que vous pouvez accéder à toutes vos applications.",
  "app management": "Gestion des applications",
  "There you can manage the state of your applications: start it, stop it, remove it...": "Ici vous pouvez gérer l'état de vos applications : les lancer, les interrompre, les supprimer…",
  "app store contains applications": "Dans l'app store, vous trouverez de nouvelles applications à installer sur votre Cozy.",
  "set cozy parameters here": "Pour fonctionner correctement, Cozy nécessite différents paramètres. Positionnez-les dans cette section.",
  "links to resources": "Vous trouverez ici toutes les ressources dont vous avez besoin.",
  "The first place to find help is:": "Le premier endroit où trouver de l'aide est :",
  "removed": "supprimée",
  "required permissions": "Permissions requises",
  "finish layout edition": "Enregistrer",
  "reset customization": "Remise à zéro",
  "use widget": "Mode widget",
  "use icon": "Mode icône",
  "change layout": "Modifier la disposition",
  "introduction market": "Bienvenue sur le marché d'application Cozy. C'est ici que vous pouvez\npersonnaliser votre Cozy en y ajoutant des applications.\nVous pouvez installer l'application que vous avez créée ou choisir parmi\ncelles proposées par Cozycloud ou d'autres développeurs.",
  "error connectivity issue": "Une erreur s'est produite lors de la récupération des données.<br />Merci de réessayer ultérieurement.",
  "package.json not found": "Impossible de récupérer le fichier package.json. Vérifiez l'url de votre dépôt git.",
  "please wait data retrieval": "Merci de bien vouloir patienter pendant la récupération des données...",
  "revoke device confirmation message": "Cette action empêchera l'appareil associé d'accéder à votre Cozy. Êtes-vous sûr ?",
  "dashboard": "Tableau de bord",
  "synchronization": "Synchronisation",
  "synchronization description": "Cozy vous permet de synchroniser vos fichiers, contact et calendriers\navec vos périphériques. Pour lancer la synchronisation, vous devez installer\ndes applications spécifiques.",
  "caldav cardav with davdroid": "Pour vos contacts et vos événements, nous vous recommandons\nl'application\n<a href=\"http://davdroid.bitfire.at/what-is-davdroid\">DAVDroid</a>\nde Bitfire. Une fois que vous aurez\ninstallé l'application Sync sur votre Cozy, vous pourrez\nconfigurer DAVDroid pour qu'il synchronise vos contacts et\ncalendriers. Ceux ci seront ensuite gérables via les\napplications natives du téléphone.",
  "files with cozy on android": "Pour accéder à vos fichiers depuis votre mobile nous vous proposons\nl'application <a href=\"https://play.google.com/store/apps/details?id=io.cozy.files_client\">Cozy</a>\ndisponible sur la place de marché Play Store pour Android. Une fois\nque vous l'aurez installée, suivez simplement les\ninstructions.  Vous pourrez ensuite naviguer dans vos fichiers\ndepuis votre mobile.",
  "calendars description": "Gérez vos événements et synchronisez-les avec votre mobile.",
  "contacts description": "Gérez vos contacts et synchronisez-les avec votre mobile.",
  "emails description": "Lisez, envoyez et sauvegardez vos emails.",
  "files description": "Gérez vos fichiers en ligne et synchronisez-les avec votre mobile.",
  "photos description": "Construisez un album photo depuis vos fichiers et partagez-le.",
  "sync description": "Cette application est nécessaire pour synchroniser vos contacts et vos événements.",
  "bookmark description": "Sauvegardez et gérez vos liens favoris.",
  "cozic description": "Un lecteur audio pour votre musique dans votre navigateur.",
  "databrowser description": "Naviguez dans vos données dans un format brut.",
  "feeds description": "Agrégez vos flux RSS et sauvegardez vos liens dans vos favoris.",
  "kyou description": "Améliorez  votre humeur et votre santé en vous quantifiant.",
  "konnectors description": "Importation de données depuis des services externes (Twitter, Jawbone…).",
  "kresus description": "Des outils supplémentaires pour gérer vos comptes.",
  "nirc description": "Accédez à votre canal IRC préféré depuis votre Cozy.",
  "notes description": "Écrivez et organisez des notes intelligentes.",
  "owm description": "Soyez au courant du temps qu'il fait partout dans le monde !",
  "pfm description": "Suivez vos comptes bancaires sans avoir à vous reconnecter à chaque fois. Votre mot de passe est chiffré avant d'être sauvegardé.",
  "remote storage description": "Un module Remote Storage pour vos applications Unhosted.",
  "tasky description": "Un gestionnaire de tâches, basé sur les tags, rapide et simple.",
  "todos description": "Écrivez et ordonnez vos tâches efficacement.",
  "term description": "Un terminal pour votre Cozy.",
  "reminder title email": "[Cozy-Calendar] Rappel",
  "reminder message": "Rappel : %{message}",
  "warning unofficial app": "Attention ! Cette application n'est pas maintenue par l'équipe de Cozy.",
  "installation message failure": "Échec de l'installation de %{appName}.",
  "update available notification": "Une nouvelle version de %{appName} est disponible."
};
});

;require.register("locales/pt", function(exports, require, module) {
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
  "you have no notifications": "Não tem notificações",
  "dismiss all": "Dispensar Tudo",
  "add application": "adicionar aplicação ?",
  "install": "Instalar",
  "your app": "a tua aplicação!",
  "community contribution": "contribuição da comunidade",
  "official application": "aplicação oficial",
  "application description": "Descrição da Aplicação",
  "downloading description": "A fazer download da descrição ...",
  "downloading permissions": "A fazer download das permissões ...",
  "Cancel": "Cancelar",
  "ok": "Ok",
  "applications permissions": "Permissões da Aplicação",
  "confirm": "Confirmar",
  "installing": "A instalar",
  "remove": "remover",
  "update": "actualizar",
  "started": "inicidada",
  "notifications": "Notificações",
  "questions and help forum": "Perguntas e fórum de ajuda",
  "sign out": "Sair",
  "open in a new tab": "Abrir numa nova janela",
  "disk unit": "GB",
  "memory unit": "MB",
  "always on": "sempre ligada",
  "keep always on": "manter sempre ligada",
  "stop this app": "parar esta aplicação",
  "update required": "Atualização disponível",
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
  "welcome to your cozy": "Ben vindo ao teu Cozy!",
  "you have no apps": "Não tens aplicações instaladas. Devias",
  "configure": "configurar ",
  "app management": "Gestão de aplicações",
  "app store": "Loja de aplicações",
  "configuration": "Configuração",
  "assistance": "Assistência",
  "hardware consumption": "Hardware",
  "hard drive gigabytes": "&nbsp;GB (Disco Rigido)",
  "memory megabytes": "&nbsp;MB (RAM)",
  "manage your applications": "Gere as tuas aplicações",
  "manage your devices": "Gere os teus dispositivos",
  "synchronized": "sincronizado",
  "revoke device access": "Revoke device access",
  "no application installed": "Não há aplicações instaladas.",
  "your parameters": " Os seus parâmetros",
  "alerts and password recovery email": "Necessito do seu email para enviar alertas ou email de recuperação de password.",
  "public name description": "O nome público será utilizado para o Cozy e as aplicações comunicarem consigo.",
  "your timezone is required": "O fuso horário é necessário para mostrar as datas correctamente.",
  "domain name for urls and email": "O dominio é usado para construir links para enviar para si ou para os seus contactos.",
  "save": "guardar",
  "saved": "saved",
  "Chose the language you want I use to speak with you:": "Escolha a lingua que quer que fale:",
  "french": "Francês",
  "english": "Inglês",
  "portuguese": "Português",
  "change password procedure": "Mudar procedimento de password",
  "current password": "password actual",
  "new password": "password nova",
  "confirm your new password": "confirme a sua nova pasword",
  "save your new password": "grave a sua nova password",
  "do you want assistance": "Procura ajuda ?",
  "Write an email to our support team at:": "Escreve um e-mail á equipa de suporte:",
  "Register and post on our forum: ": "Regista-te no nosso fórum: ",
  "Ask your question on Twitter: ": "Pergunta-nos no Twitter: ",
  "Chat with us on IRC:": "Chat with us on IRC:",
  "Visit the project website and learn to build your app:": "Visita o site do projecto para aprenderes a fazer a tua aplicação:",
  "your own application": "a tua aplicação",
  "installed": "instalada",
  "updated": "actualizada",
  "updating": "a actualizar",
  "update error": "Ocurreu um erro durante a actualização da aplicação",
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
  "changing locale requires reload": "Mudar o locale requer que faça refresh á página.",
  "cancel": "cancelar",
  "abort": "abortar",
  "Once updated, this application will require the following permissions:": "Depois de actualizada a aplicação irá requerer as seguintes permissões:",
  "confirm update": "confirmar actualização",
  "no specific permissions needed": "Esta aplicação necssita de permissões especificas",
  "menu description": "Se esta é a tua primeira vez no Cozy aqui tens um pequeno guia\nsobre todas as secções disponiveis. Todas elas podem ser escolhidas\nno menu localizado no teu lado superior direito.",
  "install your first app": "o teu Cozy, e depois instala a tua primeira aplicação na&nbsp;",
  "where you reach applications": "è o local onde podes escolher as aplicações",
  "There you can manage the state of your applications: start it, stop it, remove it...": "Ali podes gerar o estado das tuas aplicações: iniciar, parar ou remover...",
  "app store contains applications": "Na Loja de Aplicações podes econtrar aplicações para o teu Cozy.",
  "set cozy parameters here": "Para funcionar bem o teu Cozy precisa de vários parámetros. Coloca-os nesta seccção.",
  "links to resources": "Encontrarás aqui alguns links para recursos de ajuda.",
  "The first place to find help is:": "O primeiro local para encontrares ajuda é:",
  "removed": "removido",
  "required permissions": "Permissões necessárias:",
  "finish layout edition": "Guardar",
  "reset customization": "Repo",
  "use widget": "Usar widget",
  "use icon": "Usar icon",
  "change layout": "Mudar o layout",
  "introduction market": "Bem vindo á loja de aplicações do Cozy. Este é o sitio onde podes personalizar o teu Cozy\nao adicionar aplicações.\nApartir dai podes instalar a aplicação que construiste ou escolher entre\naplicações criadas pela Cozy Cloud e outros programadores.",
  "error connectivity issue": "Ocurreu um erro ao receber os teus dados.<br />Por favor tenta de novo.",
  "please wait data retrieval": "Por favor aguarda enquanto os teus dados são recebidos...",
  "revoke device confirmation message": "This will prevent the related device to access your Cozy. Are you sure?",
  "reminder title email": "[Cozy-Calendar] Reminder",
  "reminder message": "Reminder: %{message}",
  "warning unofficial app": "Warning! This app is not maintained by the Cozy team.",
  "installation message failure": "%{appName}'s installation failed.",
  "update available notification": "A new version of %{appName} is available."
};
});

;require.register("models/application", function(exports, require, module) {
var Application, client, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

client = require("../helpers/client");

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
        return _this.set(data.app);
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
    return client.post('/api/applications/install', params, callbacks);
  };

  Application.prototype.uninstall = function(callbacks) {
    var _this = this;
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

  Application.prototype.getHomePosition = function(cols) {
    var pos;
    pos = this.get('homeposition');
    return pos != null ? pos[cols] : void 0;
  };

  Application.prototype.saveHomePosition = function(cols, obj, options) {
    var pos;
    if (options == null) {
      options = {};
    }
    pos = this.get('homeposition') || {};
    pos[cols] = obj;
    options['patch'] = true;
    options['type'] = 'PUT';
    return this.save({
      homeposition: pos
    }, options);
  };

  Application.prototype.updateAll = function(callbacks) {
    this.prepareCallbacks(callbacks);
    return client.put("/api/applications/update/all", {}, callbacks);
  };

  return Application;

})(Backbone.Model);
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

;require.register("models/stack_application", function(exports, require, module) {
var StackApplication, client, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

client = require("../helpers/client");

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

  StackApplication.prototype.prepareCallbacks = function(callbacks, presuccess, preerror) {
    var error, success, _ref1,
      _this = this;
    _ref1 = callbacks || {}, success = _ref1.success, error = _ref1.error;
    if (presuccess == null) {
      presuccess = function(data) {
        return _this.set(data.app);
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

  StackApplication.prototype.waitReboot = function(step, total_step, callback) {
    var _this = this;
    return client.get("api/applications/stack", {
      success: function() {
        if (step === total_step) {
          return callback();
        } else {
          if (step === 1) {
            step += step;
          }
          return setTimeout(function() {
            return _this.waitReboot(step, total_step, callback);
          }, 500);
        }
      },
      error: function() {
        return setTimeout(function() {
          if (step === 0 || step === 2) {
            step = step + 1;
          }
          return _this.waitReboot(step, total_step, callback);
        }, 500);
      }
    });
  };

  StackApplication.prototype.updateStack = function(callbacks) {
    var _this = this;
    return client.put("/api/applications/update/stack", {}, {
      sucess: function() {
        return _this.waitReboot(0, 3, callbacks);
      },
      error: function() {
        return _this.waitReboot(0, 3, callbacks);
      }
    });
  };

  StackApplication.prototype.rebootStack = function(callbacks) {
    var _this = this;
    return client.put("/api/applications/reboot/stack", {}, {
      sucess: function() {
        return _this.waitReboot(0, 1, callbacks);
      },
      error: function() {
        return _this.waitReboot(0, 1, callbacks);
      }
    });
  };

  return StackApplication;

})(Backbone.Model);
});

;require.register("models/user", function(exports, require, module) {
var BaseModel, User, client,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseModel = require('lib/base_model').BaseModel;

client = require('helpers/client');

module.exports = User = (function(_super) {
  __extends(User, _super);

  function User(email, password) {
    this.email = email;
    this.password = password;
    User.__super__.constructor.call(this);
  }

  User.prototype.logout = function(callbacks) {
    return client.get("logout/", callbacks);
  };

  return User;

})(BaseModel);
});

;require.register("routers/main_router", function(exports, require, module) {
var MainRouter, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

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
    "help": "help",
    "logout": "logout",
    "apps/:slug": "application",
    "apps/:slug/*hash": "application",
    "*path": "applicationList",
    '*notFound': 'applicationList'
  };

  MainRouter.prototype.initialize = function() {
    var _this = this;
    return window.addEventListener('message', function(event) {
      var intent;
      if (event.origin !== window.location.origin) {
        return false;
      }
      intent = event.data;
      switch (intent.action) {
        case 'goto':
          return _this.navigate("apps/" + intent.params, true);
        default:
          return console.log("WEIRD INTENT", intent);
      }
    });
  };

  MainRouter.prototype.selectIcon = function(index) {
    if (index !== -1) {
      $('.menu-btn.active').removeClass('active');
      $($('.menu-btn').get(index)).addClass('active');
    } else {
      $('.menu-btn.active').removeClass('active');
    }
    if (index !== 3) {
      return app.mainView.applicationListView.setMode('view');
    }
  };

  MainRouter.prototype.applicationList = function() {
    app.mainView.displayApplicationsList();
    return this.selectIcon(0);
  };

  MainRouter.prototype.applicationListEdit = function() {
    app.mainView.displayApplicationsListEdit();
    return this.selectIcon(3);
  };

  MainRouter.prototype.configApplications = function() {
    app.mainView.displayConfigApplications();
    return this.selectIcon(2);
  };

  MainRouter.prototype.help = function() {
    app.mainView.displayHelp();
    return this.selectIcon(5);
  };

  MainRouter.prototype.market = function() {
    app.mainView.displayMarket();
    return this.selectIcon(1);
  };

  MainRouter.prototype.account = function() {
    app.mainView.displayAccount();
    return this.selectIcon(4);
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
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<!--.section-title.darkbg.bigger config--><h4 class="pa2 w600 biggest darkbg center">');
var __val__ = t('your parameters')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h4><div id="account-form" class="lightgrey w600 pa2"><div class="input"><p>');
var __val__ = t('alerts and password recovery email')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><input id="account-email-field"/><button class="btn">');
var __val__ = t('save')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></div><div class="input"><p>');
var __val__ = t('public name description')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><input id="account-public-name-field"/><button class="btn">');
var __val__ = t('save')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></div><div class="input"><p>');
var __val__ = t('your timezone is required')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><select id="account-timezone-field"></select><button class="btn">');
var __val__ = t('save')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></div><div class="input"><p>');
var __val__ = t('domain name for urls and email')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><input id="account-domain-field"/><button class="btn">');
var __val__ = t('save')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></div><div class="input"><p>');
var __val__ = t('Chose the language you want I use to speak with you:')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><select id="account-locale-field"><option value="fr">');
var __val__ = t('french')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</option><option value="en">');
var __val__ = t('english')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</option><option value="pt">');
var __val__ = t('portuguese')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</option></select><button class="btn">');
var __val__ = t('save')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></div><p><button id="change-password-button" class="btn">');
var __val__ = t('change password')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></p><div id="change-password-form"><p>');
var __val__ = t('change password procedure')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><p><label>');
var __val__ = t('input your current password')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</label></p><input');
buf.push(attrs({ 'id':('account-password0-field'), 'type':("password"), 'placeholder':("" + (t('current password')) + "") }, {"type":true,"placeholder":true}));
buf.push('/><p><label>');
var __val__ = t('enter a new password')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</label></p><input');
buf.push(attrs({ 'id':('account-password1-field'), 'type':("password"), 'placeholder':("" + (t('new password')) + "") }, {"type":true,"placeholder":true}));
buf.push('/><p><label>');
var __val__ = t('confirm your new password')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</label></p><input');
buf.push(attrs({ 'id':('account-password2-field'), 'type':("password"), 'placeholder':("" + (t('new password')) + "") }, {"type":true,"placeholder":true}));
buf.push('/><p><button id="account-form-button" class="btn">');
var __val__ = t('save your new password')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button><p class="loading-indicator">&nbsp;</p><div id="account-info" class="alert main-alert alert-success hide"><div id="account-info-text"></div></div><div id="account-error" class="alert alert-error main-alert hide"><div id="account-form-error-text"></div></div></p></div></div>');
}
return buf.join("");
};
});

;require.register("templates/application_iframe", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<iframe');
buf.push(attrs({ 'src':("apps/" + (id) + "/#" + (hash) + ""), 'id':("" + (id) + "-frame") }, {"src":true,"id":true}));
buf.push('></iframe>');
}
return buf.join("");
};
});

;require.register("templates/config_application", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="clearfix"><div class="mod"><strong>' + escape((interp = app.displayName) == null ? '' : interp) + '</strong>');
if ( app.version)
{
buf.push('<span>&nbsp;-&nbsp; ' + escape((interp = app.version) == null ? '' : interp) + '</span>');
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
if ( app.needsUpdate)
{
buf.push('<span>&nbsp;</span><img');
buf.push(attrs({ 'width':(16), 'src':("img/notification-orange.png"), 'title':("" + (t('update required')) + ""), 'alt':("" + (t('update required')) + ""), "class": ('update-notification-icon') }, {"width":true,"src":true,"title":true,"alt":true}));
buf.push('/>');
}
buf.push('</div><div class="buttons right"><div class="mod right"><button class="btn remove-app">');
var __val__ = t('remove')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></div><div class="mod right"><button class="btn update-app">');
var __val__ = t('update')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></div><div class="mod right"><button class="btn btn-large start-stop-btn">');
var __val__ = t('stop this app')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></div><div class="mod right smaller"><input type="checkbox" title="always on" checked="checked" name="app-stoppable" class="app-stoppable"/><label for="app-stoppable">auto stop</label></div></div></div>');
}
return buf.join("");
};
});

;require.register("templates/config_application_list", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
}
return buf.join("");
};
});

;require.register("templates/config_applications", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<!--.section-title.darkbg.bigger apps--><div class="txt-center"><div class="line w800"><div class="mod w33 left"><div class="sys-infos line"><div class="mod center-txt"><h4>');
var __val__ = t('hardware consumption')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h4><div class="disk-space mt2"><div class="line"><img src="img/hard-drive.png"/></div><div class="line"><span class="amount">0</span><span>&nbsp;/&nbsp;</span><span class="total">0</span><span>');
var __val__ = t('hard drive gigabytes')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></div></div><div class="memory-free mt2"><div class="line"><img src="img/ram.png"/></div><div class="line"><span class="amount">0</span><span>&nbsp;/&nbsp;</span><span class="total">0&nbsp;</span><span>');
var __val__ = t('memory megabytes')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></div></div><h4>');
var __val__ = t('cozy platform')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h4><div class="stack-app mt2"><div class="line"><span class="app">Data System: </span><span class="data-system">--</span></div><div class="line"><span class="app">Proxy: </span><span class="proxy">--</span></div><div class="line"><span class="app">Home: </span><span class="home">--</span></div><div class="line"><span class="app">Controller: </span><span class="controller">--</span></div><div class="line buttons"><button class="btn update-stack">');
var __val__ = t('update stack')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button><button class="btn reboot-stack">');
var __val__ = t('reboot stack')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></div><div class="line"><span class="refresh">');
var __val__ = t('refresh page')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></div></div></div></div></div><div class="mod w66 right"><div class="title-device h4 mb3">');
var __val__ = t('manage your devices')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div></div><div class="mod w66 left"><div class="title-app h4 mb3">');
var __val__ = t('manage your applications')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div><button class="btn update-all">');
var __val__ = t('update all')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></div></div></div>');
}
return buf.join("");
};
});

;require.register("templates/config_device", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="clearfix"><div class="mod"><strong>' + escape((interp = device.login) == null ? '' : interp) + '</strong><span>&nbsp;-&nbsp;</span><span class="state-label">');
var __val__ = t('synchronized')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></div><div class="buttons right"><button class="remove-device btn">');
var __val__ = t('revoke device access')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></div></div>');
}
return buf.join("");
};
});

;require.register("templates/config_device_list", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
}
return buf.join("");
};
});

;require.register("templates/help", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<!--.section-title.darkbg.bigger help--><div class="line w600 lightgrey"><h4 class="help-text darkbg pa2">');
var __val__ = t('do you want assistance')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h4><div class="line pa2"><p class="help-text mt2">');
var __val__ = t('Write an email to our support team at:')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><P class="help-text"> <a href="mailto:support@cozycloud.cc">support@cozycloud.cc</a></P><p class="help-text">');
var __val__ = t('Register and post on our forum: ')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><P class="help-text"> <a href="https://forum.cozy.io">forum.cozy.io</a></P><p class="help-text">');
var __val__ = t('Ask your question on Twitter: ')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><P class="help-text"> <a href="https://twitter.com/mycozycloud">@mycozycloud</a></P><p class="help-text">');
var __val__ = t('Chat with us on IRC:')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><P class="help-text"> <a href="https://webchat.freenode.net/?channels=cozycloud">#cozycloud on irc.freenode.net</a></P><p class="help-text">');
var __val__ = t('Visit the project website and learn to build your app:')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><P class="help-text"> <a href="https://cozy.io">cozy.io</a></P></div></div>');
}
return buf.join("");
};
});

;require.register("templates/help_url", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
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

;require.register("templates/home", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<!-- .section-title.darkbg.bigger home--><div id="home-edit-close" class="w600"><a href="#home" class="btn btn-large">');
var __val__ = t('finish layout edition')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a></div><div id="no-app-message" class="w600"><div id="start-title" class="darkbg clearfix"><a href="http://cozy.io"><img src="img/happycloud.png" class="logo"/></a><p class="biggest">');
var __val__ = t('welcome to your cozy')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p></div><div class="line"><p class="bigger pa2">');
var __val__ = t('you have no apps') + ' '
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('<a href="#account">');
var __val__ = t('configure')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a>');
var __val__ = ' ' + t ('install your first app')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('<a href="#applications">');
var __val__ = t('app store')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a>.</p><h4 class="pa2">');
var __val__ = t ('dashboard')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h4><p>');
var __val__ = t ('menu description')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><p><img src="/img/home-black.png"/><strong>');
var __val__ = t('home') + ': '
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</strong>');
var __val__ = t('where you reach applications')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><p><img src="/img/config-apps.png"/><strong>');
var __val__ = t('app management') + ': '
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</strong>');
var __val__ = t('There you can manage the state of your applications: start it, stop it, remove it...')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><p><img src="/img/apps.png"/><strong>');
var __val__ = t('app store') + ': '
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</strong>');
var __val__ = t('app store contains applications')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><p><img src="/img/configuration.png"/><strong>');
var __val__ = t('configuration') + ': '
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</strong>');
var __val__ = t('set cozy parameters here')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><p><img src="/img/help.png"/><strong>');
var __val__ = t('assistance') + ': '
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</strong>');
var __val__ = t('links to resources')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><h4 class="pa2">');
var __val__ = t ('synchronization')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h4><p>');
var __val__ = t ('synchronization description')
buf.push(null == __val__ ? "" : __val__);
buf.push('</p><p>');
var __val__ = t ('caldav cardav with davdroid')
buf.push(null == __val__ ? "" : __val__);
buf.push('</p><p>');
var __val__ = t ('files with cozy on android')
buf.push(null == __val__ ? "" : __val__);
buf.push('</p></div></div><div id="app-list" class="gridster"></div>');
}
return buf.join("");
};
});

;require.register("templates/home_application", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="mask"></div><div class="bottom-handle"></div><div class="bottom-right-handle"></div><div class="right-handle"></div><button class="btn use-widget">');
var __val__ = t('use widget')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button><div class="application-inner"><div class="vertical-aligner"><img src="" class="icon"/><p class="app-title">' + escape((interp = app.displayName) == null ? '' : interp) + '</p></div></div>');
}
return buf.join("");
};
});

;require.register("templates/home_application_widget", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="widget-mask"></div><iframe');
buf.push(attrs({ 'src':("" + (url) + ""), "class": ("widget-iframe") }, {"class":true,"src":true}));
buf.push('></iframe>');
}
return buf.join("");
};
});

;require.register("templates/layout", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<header id="header" class="navbar"></header><div class="home-body"><div id="app-frames"></div><div id="content"><div id="home-menu" class="mt3"><div class="txtright menu-btn home-icon"><a href="#home"><span>');
var __val__ = t('your app list')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span><img src="img/home-black.png"/></a></div><div class="txtright menu-btn"><a href="#applications"><span>');
var __val__ = t('choose your apps')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span><img src="img/store.png"/></a></div><div class="txtright menu-btn"><a href="#config-applications"><span>');
var __val__ = t('manage your apps')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span><img src="img/apps.png"/></a></div><div class="txtright menu-btn customize-icon"><a href="#customize"><span>');
var __val__ = t('customize your cozy')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span><img src="img/config-apps.png"/></a></div><div class="txtright menu-btn"><a href="#account"><span>');
var __val__ = t('configure your cozy')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span><img src="img/configuration.png"/></a></div><div class="txtright menu-btn help-icon"><a href="#help"><span>');
var __val__ = t('ask for assistance')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span><img src="img/help.png"/></a></div><div class="txtright menu-btn logout-menu-icon"><a href="#logout"><span>');
var __val__ = t('sign out')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span><img src="img/logout-black.png"/></a></div></div><div id="home-content"></div></div></div>');
}
return buf.join("");
};
});

;require.register("templates/market", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<!--.section-title.darkbg.bigger app store--><p class="mt2">' + escape((interp = t('introduction market')) == null ? '' : interp) + '</p><div id="app-market-list"><div id="market-applications-list" class="clearfix"><div id="no-app-message">');
var __val__ = t('installed everything')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div></div></div><div class="md-overlay"></div><div class="mt2 mb2"><div id="your-app" class="clearfix"><div class="text"><p>');
var __val__ = t('install')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('&nbsp;<a href="http://cozy.io/hack/getting-started/" target="_blank">');
var __val__ = t('your own application')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a></p><p><input type="text" id="app-git-field" placeholder="https://github.com/username/repository.git@branch" class="span3"/><button class="btn app-install-button">');
var __val__ = t('install')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></p><div class="error alert-error"></div><div class="info alert"></div></div></div></div>');
}
return buf.join("");
};
});

;require.register("templates/market_application", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="right"><a');
buf.push(attrs({ 'href':("" + (app.git) + "") }, {"href":true}));
buf.push('><img src="img/git.png" class="img-btn"/></a>');
if ( app.website !== undefined)
{
buf.push('<a');
buf.push(attrs({ 'href':("" + (app.website) + "") }, {"href":true}));
buf.push('><img src="img/link.png" class="img-btn"/></a>');
}
buf.push('</div><div class="app-img left"><img');
buf.push(attrs({ 'src':("" + (app.icon) + "") }, {"src":true}));
buf.push('/></div><div class="app-text"><h3>' + escape((interp = app.displayName) == null ? '' : interp) + '</h3><span class="comment">');
var __val__ = t(app.comment)
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span><p class="par2">');
var __val__ = t(app.description)
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p></div>');
}
return buf.join("");
};
});

;require.register("templates/menu_application", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
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

;require.register("templates/menu_applications", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<a id="menu-applications-toggle"><span id="current-application"></span></a><div class="clickcatcher"></div><div id="menu-applications"><div id="home-btn" class="menu-application"></div></div>');
}
return buf.join("");
};
});

;require.register("templates/navbar", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="navbar clearfix"><a href="#home" class="left"><img src="img/happycloud-small.png"/></a><div id="menu-applications-container" class="left"></div><a id="logout-button" href="#logout" class="right"><span>');
var __val__ = t('logout')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span><img src="img/logout-white.png"/></a><div id="notifications-container" class="right"></div></div>');
}
return buf.join("");
};
});

;require.register("templates/navbar_app_btn", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
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

;require.register("templates/notification", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<a class="doaction">' + escape((interp = model.text) == null ? '' : interp) + '</a><a class="dismiss">&times;</a>');
}
return buf.join("");
};
});

;require.register("templates/notifications", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<a id="notifications-toggle"><span class="backcolor"></span><img src="img/notification-white.png"/><span id="notifications-counter"></span></a><audio id="notification-sound" src="sounds/notification.wav" preload="preload"></audio><div id="clickcatcher"></div><ul id="notifications"><li id="no-notif-msg">');
var __val__ = t('you have no notifications')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</li><li id="dismiss-all" class="btn">');
var __val__ = t('dismiss all')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</li></ul>');
}
return buf.join("");
};
});

;require.register("templates/popover_description", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="md-content"><div class="md-header clearfix"><div class="line"><h3 class="left">' + escape((interp = model.name) == null ? '' : interp) + '</h3><div class="right"><a');
buf.push(attrs({ 'href':("" + (model.git) + ""), "class": ('repo-stars') }, {"href":true}));
buf.push('>&nbsp;</a><a');
buf.push(attrs({ 'href':("" + (model.git) + "") }, {"href":true}));
buf.push('><img src="img/star-white.png"/></a></div></div>');
if ( (model.comment !== 'official application'))
{
buf.push('<div class="line noncozy-warning">');
var __val__ = t('warning unofficial app')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div>');
}
buf.push('</div><div class="md-body"></div><div class="md-footer clearfix"><button id="confirmbtn" class="btn right">');
var __val__ = t('install')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button><button id="cancelbtn" class="btn light-btn right">');
var __val__ = t('cancel')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></div></div>');
}
return buf.join("");
};
});

;require.register("templates/popover_permissions", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="md-header mt2">');
var __val__ = t('Once updated, this application will require the following permissions:')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div><div class="md-body"><div>&nbsp;</div></div><div class="md-footer mt2">');
if ( model.state === 'broken')
{
buf.push('<a id="confirmbtn" class="btn right">');
var __val__ = t('confirm install')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a>');
}
else
{
buf.push('<a id="confirmbtn" class="btn right">');
var __val__ = t('confirm update')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a>');
}
buf.push('<a id="cancelbtn" class="btn light-btn right">');
var __val__ = t('cancel')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a></div>');
}
return buf.join("");
};
});

;require.register("views/account", function(exports, require, module) {
var BaseView, locales, request, timezones,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

timezones = require('helpers/timezone').timezones;

locales = require('helpers/locales').locales;

request = require('lib/request');

module.exports = exports.AccountView = (function(_super) {
  __extends(AccountView, _super);

  AccountView.prototype.id = 'account-view';

  AccountView.prototype.template = require('templates/account');

  /* Constructor*/


  function AccountView() {
    this.displayErrors = __bind(this.displayErrors, this);
    this.onNewPasswordSubmit = __bind(this.onNewPasswordSubmit, this);
    this.closePasswordForm = __bind(this.closePasswordForm, this);
    this.onChangePasswordClicked = __bind(this.onChangePasswordClicked, this);
    AccountView.__super__.constructor.call(this);
  }

  AccountView.prototype.onChangePasswordClicked = function() {
    var _this = this;
    return this.changePasswordButton.fadeOut(function() {
      return _this.changePasswordForm.fadeIn(function() {
        _this.password0Field.focus();
        return $(window).trigger('resize');
      });
    });
  };

  AccountView.prototype.closePasswordForm = function() {
    var _this = this;
    return this.changePasswordForm.fadeOut(function() {
      return _this.changePasswordButton.fadeIn();
    });
  };

  AccountView.prototype.onNewPasswordSubmit = function(event) {
    var form,
      _this = this;
    form = {
      password0: this.password0Field.val(),
      password1: this.password1Field.val(),
      password2: this.password2Field.val()
    };
    this.infoAlert.hide();
    this.errorAlert.hide();
    this.accountSubmitButton.spin('small');
    this.accountSubmitButton.css('color', 'transparent');
    return request.post('api/user', form, function(err, data) {
      if (err) {
        _this.password0Field.val(null);
        _this.password1Field.val(null);
        _this.password2Field.val(null);
        if (data != null) {
          _this.displayErrors(data.msg);
        } else {
          _this.displayErrors(err.message);
        }
      } else {
        if (data.success) {
          _this.infoAlert.html(data.msg);
          _this.infoAlert.show();
          _this.password0Field.val(null);
          _this.password1Field.val(null);
          _this.password2Field.val(null);
        } else {
          _this.displayErrors(data.msg);
        }
      }
      _this.accountSubmitButton.css('color', 'white');
      return _this.accountSubmitButton.spin();
    });
  };

  /* Functions*/


  AccountView.prototype.displayErrors = function(msgs) {
    var errorString, msg, _i, _len;
    errorString = "";
    if (typeof msgs === 'string') {
      msgs = msgs.split(',');
    }
    for (_i = 0, _len = msgs.length; _i < _len; _i++) {
      msg = msgs[_i];
      errorString += "" + msg + "<br />";
    }
    this.errorAlert.html(errorString);
    return this.errorAlert.show();
  };

  AccountView.prototype.getSaveFunction = function(fieldName, fieldWidget, path) {
    var saveButton, saveFunction;
    saveButton = fieldWidget.parent().find('.btn');
    saveFunction = function() {
      var data;
      saveButton.css('color', 'transparent');
      saveButton.spin('small', 'white');
      data = {};
      data[fieldName] = fieldWidget.val();
      return request.post("api/" + path, data, function(err) {
        saveButton.spin();
        saveButton.css('color', 'white');
        if (err) {
          saveButton.addClass('red');
          return saveButton.html('error');
        } else {
          saveButton.addClass('green');
          saveButton.html(t('saved'));
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
    var _this = this;
    $.get("api/users/", function(data) {
      var saveEmail, savePublicName, saveTimezone, timezoneData, userData;
      timezoneData = [];
      userData = data.rows[0];
      _this.emailField.val(userData.email);
      _this.publicNameField.val(userData.public_name);
      _this.timezoneField.val(userData.timezone);
      saveEmail = _this.getSaveFunction('email', _this.emailField, 'user');
      _this.emailField.on('keyup', function(event) {
        if (event.keyCode === 13 || event.which === 13) {
          return saveEmail();
        }
      });
      savePublicName = _this.getSaveFunction('public_name', _this.publicNameField, 'user');
      _this.emailField.on('keyup', function(event) {
        if (event.keyCode === 13 || event.which === 13) {
          return savePublicName();
        }
      });
      saveTimezone = _this.getSaveFunction('timezone', _this.timezoneField, 'user');
      return _this.timezoneField.change(saveTimezone);
    });
    return $.get("api/instances/", function(data) {
      var domain, instance, locale, saveDomain, saveLocale, _ref;
      instance = (_ref = data.rows) != null ? _ref[0] : void 0;
      domain = (instance != null ? instance.domain : void 0) || t('no domain set');
      locale = (instance != null ? instance.locale : void 0) || 'en';
      saveDomain = _this.getSaveFunction('domain', _this.domainField, 'instance');
      _this.domainField.on('keyup', function(event) {
        if (event.keyCode === 13 || event.which === 13) {
          return saveDomain();
        }
      });
      _this.domainField.val(domain);
      saveLocale = _this.getSaveFunction('locale', _this.localeField, 'instance');
      _this.localeField.change(saveLocale);
      _this.localeField.val(locale);
      _this.password0Field = _this.$('#account-password0-field');
      _this.password1Field = _this.$('#account-password1-field');
      _this.password2Field = _this.$('#account-password2-field');
      _this.password0Field.keyup(function(event) {
        if (event.keyCode === 13 || event.which === 13) {
          return _this.password1Field.focus();
        }
      });
      _this.password1Field.keyup(function(event) {
        if (event.keyCode === 13 || event.which === 13) {
          return _this.password2Field.focus();
        }
      });
      return _this.password2Field.keyup(function(event) {
        if (event.keyCode === 13 || event.which === 13) {
          return _this.onNewPasswordSubmit();
        }
      });
    });
  };

  /* Configuration*/


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
    this.changePasswordForm.hide();
    this.changePasswordButton = this.$('#change-password-button');
    this.changePasswordButton.click(this.onChangePasswordClicked);
    this.accountSubmitButton = this.$('#account-form-button');
    this.accountSubmitButton.click(function(event) {
      event.preventDefault();
      return _this.onNewPasswordSubmit();
    });
    for (_i = 0, _len = timezones.length; _i < _len; _i++) {
      timezone = timezones[_i];
      this.timezoneField.append("<option value=\"" + timezone + "\">" + timezone + "</option>");
    }
    return this.fetchData();
  };

  return AccountView;

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

  ApplicationRow.prototype.className = "line config-application clearfix";

  ApplicationRow.prototype.tagName = "div";

  ApplicationRow.prototype.template = require('templates/config_application');

  ApplicationRow.prototype.getRenderData = function() {
    return {
      app: this.model.attributes
    };
  };

  ApplicationRow.prototype.events = {
    "click .remove-app": "onRemoveClicked",
    "click .update-app": "onUpdateClicked",
    "click .start-stop-btn": "onStartStopClicked",
    "click .app-stoppable": "onStoppableClicked"
  };

  /* Constructor*/


  function ApplicationRow(options) {
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

  ApplicationRow.prototype.afterRender = function() {
    this.updateButton = new ColorButton(this.$(".update-app"));
    this.removeButton = new ColorButton(this.$(".remove-app"));
    this.startStopBtn = new ColorButton(this.$(".start-stop-btn"));
    this.stateLabel = this.$('.state-label');
    this.updateIcon = this.$('.update-notification-icon');
    this.appStoppable = this.$(".app-stoppable");
    this.listenTo(this.model, 'change', this.onAppChanged);
    return this.onAppChanged(this.model);
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
        this.startStopBtn.displayGrey(t('stop this app'));
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
        this.startStopBtn.displayGrey(t('start this app'));
    }
    this.updateIcon.toggle(this.model.get('needsUpdate'));
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
    this.removeButton.displayGrey("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
    this.removeButton.spin(true, '#ffffff');
    this.stateLabel.html(t('removing'));
    return this.model.uninstall({
      success: function() {
        _this.remove();
        return Backbone.Mediator.pub('app-state-changed', true);
      },
      error: function() {
        _this.removeButton.displayRed(t("retry to install"));
        return Backbone.Mediator.pub('app-state-changed', true);
      }
    });
  };

  ApplicationRow.prototype.onUpdateClicked = function(event) {
    var _this = this;
    if (app.mainView.marketView.isInstalling()) {
      alert(t('Cannot update application while an application is installing'));
      return false;
    } else {
      event.preventDefault();
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
    }
  };

  ApplicationRow.prototype.onStartStopClicked = function(event) {
    var _this = this;
    event.preventDefault();
    this.startStopBtn.displayGrey("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
    this.startStopBtn.spin(true, '#ffffff');
    if (this.model.isRunning()) {
      return this.model.stop({
        success: function() {
          _this.startStopBtn.spin(false);
          _this.stateLabel.html(t('stopped'));
          return Backbone.Mediator.pub('app-state-changed', true);
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
          return Backbone.Mediator.pub('app-state-changed', true);
        },
        error: function() {
          var errormsg, msg;
          _this.startStopBtn.spin(false);
          _this.stateLabel.html(t('stopped'));
          Backbone.Mediator.pub('app-state-changed', true);
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
    Backbone.Mediator.pub('app-state-changed', true);
    this.updateButton.displayGrey("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
    this.updateButton.spin('small', '#ffffff');
    if (this.model.get('state') !== 'broken') {
      this.stateLabel.html(t('updating'));
    } else {
      this.stateLabel.html(t("installing"));
    }
    return this.model.updateApp({
      success: function() {
        if (_this.model.get('state') === 'installed') {
          _this.updateButton.displayGreen(t("updated"));
          _this.stateLabel.html(t('started'));
          Backbone.Mediator.pub('app-state-changed', true);
        }
        if (_this.model.get('state') === 'stopped') {
          _this.updateButton.displayGreen(t("updated"));
          _this.stateLabel.html(t('stopped'));
          return Backbone.Mediator.pub('app-state-changed', true);
        }
      },
      error: function(jqXHR) {
        alert(t('update error'));
        _this.stateLabel.html(t('broken'));
        _this.updateButton.displayRed(t("update failed"));
        return Backbone.Mediator.pub('app-state-changed', true);
      }
    });
  };

  return ApplicationRow;

})(BaseView);
});

;require.register("views/config_application_list", function(exports, require, module) {
var ApplicationRow, ApplicationsListView, ViewCollection,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ViewCollection = require('lib/view_collection');

ApplicationRow = require('views/config_application');

module.exports = ApplicationsListView = (function(_super) {
  __extends(ApplicationsListView, _super);

  ApplicationsListView.prototype.id = 'config-application-list';

  ApplicationsListView.prototype.tagName = 'div';

  ApplicationsListView.prototype.template = require('templates/config_application_list');

  ApplicationsListView.prototype.itemView = require('views/config_application');

  function ApplicationsListView(apps) {
    this.afterRender = __bind(this.afterRender, this);
    this.apps = apps;
    ApplicationsListView.__super__.constructor.call(this, {
      collection: apps
    });
  }

  ApplicationsListView.prototype.afterRender = function() {
    return this.appList = this.$("#app-list");
  };

  return ApplicationsListView;

})(ViewCollection);
});

;require.register("views/config_applications", function(exports, require, module) {
var Application, BaseView, ColorButton, ConfigApplicationList, ConfigDeviceList, StackApplication, request,
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

module.exports = exports.ConfigApplicationsView = (function(_super) {
  __extends(ConfigApplicationsView, _super);

  ConfigApplicationsView.prototype.id = 'config-applications-view';

  ConfigApplicationsView.prototype.template = require('templates/config_applications');

  ConfigApplicationsView.prototype.subscriptions = {
    'app-state-changed': 'onAppStateChanged'
  };

  ConfigApplicationsView.prototype.events = {
    "click .update-all": "onUpdateClicked",
    "click .update-stack": "onUpdateStackClicked",
    "click .reboot-stack": "onRebootStackClicked"
  };

  function ConfigApplicationsView(apps, devices, stackApps) {
    this.apps = apps;
    this.devices = devices;
    this.stackApps = stackApps;
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
    this.updateBtn = new ColorButton(this.$('.update-all'));
    this.updateStackBtn = new ColorButton(this.$('.update-stack'));
    this.rebootStackBtn = new ColorButton(this.$('.reboot-stack'));
    this.fetch();
    this.applicationList = new ConfigApplicationList(this.apps);
    this.deviceList = new ConfigDeviceList(this.devices);
    this.$el.find('.title-app').append(this.applicationList.$el);
    this.applications = new Application();
    return this.stackApplications = new StackApplication();
  };

  ConfigApplicationsView.prototype.displayStackVersion = function() {
    var app, currentVersion, newVersion, _i, _len, _ref, _results;
    _ref = this.stackApps.models;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      app = _ref[_i];
      this.$("." + (app.get('name'))).html(app.get('version'));
      if ((app.get('version') != null) && app.get('lastVersion') && app.get('version') !== app.get('lastVersion')) {
        this.$("." + (app.get('name'))).css('font-weight', "bold");
        currentVersion = app.get('version').split('.');
        newVersion = app.get('lastVersion').split('.');
        if (currentVersion[0] !== newVersion[0]) {
          _results.push(this.$("." + (app.get('name'))).css('color', "Red"));
        } else if (currentVersion[1] !== newVersion[1]) {
          _results.push(this.$("." + (app.get('name'))).css('color', "OrangeRed"));
        } else if (currentVersion[2] !== newVersion[2]) {
          _results.push(this.$("." + (app.get('name'))).css('color', "Orange"));
        } else {
          _results.push(void 0);
        }
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  ConfigApplicationsView.prototype.displayDevices = function() {
    if (!(this.devices.length === 0)) {
      this.$el.find('.title-device').show();
      return this.$el.find('.title-device').append(this.deviceList.$el);
    }
  };

  ConfigApplicationsView.prototype.fetch = function() {
    var _this = this;
    this.$('.amount').html("--");
    this.$('.total').html("--");
    return request.get('api/sys-data', function(err, data) {
      if (err) {
        return alert(t('Server error occured, infos cannot be displayed.'));
      } else {
        _this.displayMemory(data.freeMem, data.totalMem);
        return _this.displayDiskSpace(data.usedDiskSpace, data.totalDiskSpace);
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
    var _this = this;
    this.updateBtn.displayGrey("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
    Backbone.Mediator.pub('app-state-changed', true);
    this.updateBtn.spin(true, '#ffffff');
    return this.applications.updateAll({
      success: function() {
        _this.updateBtn.displayGreen(t("update all"));
        return Backbone.Mediator.pub('app-state-changed', true);
      },
      error: function() {
        _this.updateBtn.displayGreen(t("error during updating"));
        return Backbone.Mediator.pub('app-state-changed', true);
      }
    });
  };

  ConfigApplicationsView.prototype.onUpdateStackClicked = function() {
    var _this = this;
    this.updateStackBtn.displayGrey("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
    this.updateStackBtn.spin(true, '#ffffff');
    this.spanRefresh.show();
    return this.stackApplications.updateStack(function() {
      return location.reload();
    });
  };

  ConfigApplicationsView.prototype.onRebootStackClicked = function() {
    var _this = this;
    this.rebootStackBtn.displayGrey("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
    this.rebootStackBtn.spin(true, '#ffffff');
    this.spanRefresh.show();
    return this.stackApplications.rebootStack(function() {
      return location.reload();
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

  DeviceRow.prototype.className = "line config-device clearfix";

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
      this.$('.remove-device').html('&nbsp;');
      $(event.currentTarget).spin('tiny', '#ffffff');
      return $.ajax("/api/devices/" + (this.model.get('id')), {
        type: "DELETE",
        success: function() {
          return _this.$el.fadeOut(function() {
            _this.model.destroy();
            return _this.destroy();
          });
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

;require.register("views/help", function(exports, require, module) {
var BaseView,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

module.exports = exports.AccountView = (function(_super) {
  __extends(AccountView, _super);

  AccountView.prototype.id = 'help-view';

  AccountView.prototype.template = require('templates/help');

  function AccountView() {
    AccountView.__super__.constructor.call(this);
  }

  AccountView.prototype.afterRender = function() {
    var _this = this;
    return $.get("api/instances/", function(data) {
      var helpUrl, instance, template, _ref;
      instance = (_ref = data.rows) != null ? _ref[0] : void 0;
      helpUrl = instance != null ? instance.helpUrl : void 0;
      if (helpUrl != null) {
        template = require('templates/help_url');
        return $(_this.$el.find('.line')[1]).prepend(template({
          helpUrl: helpUrl
        }));
      }
    });
  };

  return AccountView;

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

  /* Constructor*/


  ApplicationsListView.prototype.events = function() {
    var _this = this;
    return {
      'mouseenter .ui-resizable-handle': function() {
        return _this.gridster.disable();
      },
      'mouseleave .ui-resizable-handle': function() {
        if (_this.state === 'edit') {
          return _this.gridster.enable();
        }
      }
    };
  };

  function ApplicationsListView(apps) {
    this.saveChanges = __bind(this.saveChanges, this);
    this.doResize = __bind(this.doResize, this);
    this.resizeGridster = __bind(this.resizeGridster, this);
    this.onWindowResize = __bind(this.onWindowResize, this);
    this.afterRender = __bind(this.afterRender, this);
    this.initialize = __bind(this.initialize, this);
    this.apps = apps;
    this.state = 'view';
    this.isLoading = true;
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
    ApplicationsListView.__super__.initialize.apply(this, arguments);
    return $(window).on('resize', _.debounce(this.onWindowResize, 300));
  };

  ApplicationsListView.prototype.afterRender = function() {
    var cid, view, _ref, _results,
      _this = this;
    this.appList = this.$("#app-list");
    this.closeEditBtn = this.$('#home-edit-close');
    this.$("#no-app-message").hide();
    $(".menu-btn a").click(function(event) {
      $(".menu-btn").removeClass('active');
      return $(event.target).closest('.menu-btn').addClass('active');
    });
    this.initGridster();
    ApplicationsListView.__super__.afterRender.apply(this, arguments);
    if (this.state === 'view') {
      this.$('#home-edit-close').hide();
      this.gridster.disable();
      _ref = this.views;
      _results = [];
      for (cid in _ref) {
        view = _ref[cid];
        _results.push(this.view.enable());
      }
      return _results;
    }
  };

  ApplicationsListView.prototype.checkIfEmpty = function() {
    var displayHelp;
    displayHelp = this.apps.size() === 0 && !this.isLoading;
    return this.$("#no-app-message").toggle(displayHelp);
  };

  ApplicationsListView.prototype.computeGridDims = function() {
    var colsNb, grid_margin, grid_size, grid_step, max_grid_step, smallest_step, width;
    width = $(window).width();
    if (width > 640) {
      width = width - 100;
    } else {
      width = width - 65;
    }
    grid_margin = 8;
    smallest_step = 150 + 2 * grid_margin;
    colsNb = Math.floor(width / smallest_step);
    if (colsNb < 3) {
      colsNb = 3;
    }
    if ((5 <= colsNb && colsNb <= 7)) {
      colsNb = 6;
    }
    colsNb = colsNb - colsNb % 3;
    grid_step = width / colsNb;
    max_grid_step = 150;
    if (grid_step > max_grid_step) {
      grid_step = max_grid_step;
    }
    grid_size = grid_step - 2 * grid_margin;
    return {
      colsNb: colsNb,
      grid_size: grid_size,
      grid_margin: grid_margin,
      grid_step: grid_step
    };
  };

  ApplicationsListView.prototype.setMode = function(mode) {
    var cid, view, _ref, _ref1, _ref2, _ref3, _results, _results1;
    this.state = mode;
    if (this.state === 'edit') {
      if ((_ref = this.gridster) != null) {
        _ref.enable();
      }
      this.closeEditBtn.slideDown();
      _ref1 = this.views;
      _results = [];
      for (cid in _ref1) {
        view = _ref1[cid];
        _results.push(view.disable());
      }
      return _results;
    } else {
      if ((_ref2 = this.gridster) != null) {
        _ref2.disable();
      }
      this.closeEditBtn.slideUp();
      _ref3 = this.views;
      _results1 = [];
      for (cid in _ref3) {
        view = _ref3[cid];
        _results1.push(view.enable());
      }
      return _results1;
    }
  };

  ApplicationsListView.prototype.initGridster = function() {
    var _ref,
      _this = this;
    _ref = this.computeGridDims(), this.colsNb = _ref.colsNb, this.grid_size = _ref.grid_size, this.grid_margin = _ref.grid_margin, this.grid_step = _ref.grid_step;
    this.appList.gridster({
      min_cols: this.colsNb,
      max_cols: this.colsNb,
      max_size_x: this.colsNb,
      widget_selector: 'div.application',
      widget_margins: [this.grid_margin, this.grid_margin],
      widget_base_dimensions: [this.grid_size, this.grid_size],
      autogenerate_stylesheet: false,
      draggable: {
        stop: function() {
          return setTimeout(_this.saveChanges, 300);
        }
      },
      serialize_params: function(el, wgd) {
        return {
          slug: el.attr('id').replace('app-btn-', ''),
          col: wgd.col,
          row: wgd.row,
          sizex: wgd.size_x,
          sizey: wgd.size_y
        };
      }
    });
    this.gridster = this.appList.data('gridster');
    this.gridster.set_dom_grid_height();
    this.appList.width(this.colsNb * this.grid_step);
    return this.gridster.generate_stylesheet({
      cols: 16,
      rows: 16
    });
  };

  ApplicationsListView.prototype.onWindowResize = function() {
    var oldNb, _ref;
    oldNb = this.colsNb;
    _ref = this.computeGridDims(), this.colsNb = _ref.colsNb, this.grid_size = _ref.grid_size, this.grid_margin = _ref.grid_margin, this.grid_step = _ref.grid_step;
    if (oldNb === this.colsNb) {
      return this.resizeGridster();
    } else {
      this.onReset([]);
      this.gridster.$widgets = $([]);
      this.resizeGridster();
      return this.onReset(this.collection);
    }
  };

  ApplicationsListView.prototype.resizeGridster = function() {
    var _ref;
    return (_ref = this.gridster) != null ? _ref.resize_widget_dimensions({
      width: this.colsNb * this.grid_step,
      colsNb: this.colsNb,
      styles_for: {
        cols: 16,
        rows: 16
      },
      widget_margins: [this.grid_margin, this.grid_margin],
      widget_base_dimensions: [this.grid_size, this.grid_size]
    }) : void 0;
  };

  ApplicationsListView.prototype.appendView = function(view) {
    var pos,
      _this = this;
    pos = view.model.getHomePosition(this.colsNb);
    if (pos == null) {
      pos = {
        col: 0,
        row: 0,
        sizex: 1,
        sizey: 1
      };
    }
    view.$el.resizable({
      animate: false,
      stop: function(event, ui) {
        return _.delay(_this.doResize, 300, view.$el);
      },
      resize: function(event, ui) {
        var clip, dim, size, toobig, _i, _len, _ref, _results;
        _ref = ['width', 'height'];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          dim = _ref[_i];
          size = ui.size[dim];
          clip = _this.grid_size;
          while (clip < size) {
            clip += _this.grid_step;
          }
          toobig = clip - size > size - clip + _this.grid_step;
          if (toobig && clip !== _this.grid_size) {
            clip -= _this.grid_step;
          }
          _results.push(ui.element[dim](clip));
        }
        return _results;
      }
    });
    this.gridster.add_widget(view.$el, pos.sizex, pos.sizey, pos.col, pos.row);
    this.gridster.resize_widget(view.$el, pos.sizex, pos.sizey);
    if (this.state === 'view') {
      return view.enable();
    } else {
      return view.disable();
    }
  };

  ApplicationsListView.prototype.removeView = function(view) {
    this.gridster.remove_widget(view.$el, true);
    return ApplicationsListView.__super__.removeView.apply(this, arguments);
  };

  ApplicationsListView.prototype.doResize = function($el) {
    var grid_h, grid_w;
    grid_w = Math.ceil($el.width() / this.grid_step);
    grid_h = Math.ceil($el.height() / this.grid_step);
    this.gridster.resize_widget($el, grid_w, grid_h);
    this.gridster.set_dom_grid_height();
    $el.height('');
    $el.width('');
    $el.css('top', '');
    $el.css('left', '');
    return this.saveChanges();
  };

  ApplicationsListView.prototype.saveChanges = function() {
    var items, model, newpos, oldpos, properties, view, _i, _len, _results;
    properties = ['col', 'row', 'sizex', 'sizey'];
    items = this.gridster.serialize();
    _results = [];
    for (_i = 0, _len = items.length; _i < _len; _i++) {
      newpos = items[_i];
      model = this.apps.get(newpos.slug);
      delete newpos.slug;
      view = this.views[model.cid];
      oldpos = model.getHomePosition(this.colsNb);
      if (_.isEqual(oldpos, newpos)) {
        continue;
      }
      newpos.useWidget = (oldpos != null ? oldpos.useWidget : void 0) || false;
      _results.push(view.model.saveHomePosition(this.colsNb, newpos));
    }
    return _results;
  };

  return ApplicationsListView;

})(ViewCollection);
});

;require.register("views/home_application", function(exports, require, module) {
var ApplicationRow, BaseView, ColorButton, WidgetTemplate,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

ColorButton = require('widgets/install_button');

WidgetTemplate = require('templates/home_application_widget');

module.exports = ApplicationRow = (function(_super) {
  __extends(ApplicationRow, _super);

  ApplicationRow.prototype.className = "application";

  ApplicationRow.prototype.tagName = "div";

  ApplicationRow.prototype.template = require('templates/home_application');

  ApplicationRow.prototype.getRenderData = function() {
    return {
      app: this.model.attributes
    };
  };

  ApplicationRow.prototype.events = {
    "mouseup .application-inner": "onAppClicked",
    'click .use-widget': 'onUseWidgetClicked'
  };

  /* Constructor*/


  function ApplicationRow(options) {
    this.showSpinner = __bind(this.showSpinner, this);
    this.generateSpinner = __bind(this.generateSpinner, this);
    this.launchApp = __bind(this.launchApp, this);
    this.onUseWidgetClicked = __bind(this.onUseWidgetClicked, this);
    this.canUseWidget = __bind(this.canUseWidget, this);
    this.setUseWidget = __bind(this.setUseWidget, this);
    this.onAppClicked = __bind(this.onAppClicked, this);
    this.onAppChanged = __bind(this.onAppChanged, this);
    this.afterRender = __bind(this.afterRender, this);
    this.id = "app-btn-" + options.model.id;
    this.enabled = true;
    ApplicationRow.__super__.constructor.apply(this, arguments);
  }

  ApplicationRow.prototype.enable = function() {
    this.enabled = true;
    this.$el.resizable('disable');
    this.$('.widget-mask').hide();
    return this.$('.use-widget').hide();
  };

  ApplicationRow.prototype.disable = function() {
    this.enabled = false;
    if (this.$el.resizable('widget')) {
      this.$el.resizable('enable');
    }
    if (this.canUseWidget()) {
      this.$('.widget-mask').show();
      return this.$('.use-widget').show();
    }
  };

  ApplicationRow.prototype.afterRender = function() {
    this.icon = this.$('img');
    this.stateLabel = this.$('.state-label');
    this.title = this.$('.app-title');
    this.listenTo(this.model, 'change', this.onAppChanged);
    return this.onAppChanged(this.model);
  };

  /* Listener*/


  ApplicationRow.prototype.onAppChanged = function(app) {
    var useWidget, _ref;
    if (this.model.get('state') !== 'installed' || !this.canUseWidget()) {
      this.$('.use-widget').hide();
    }
    switch (this.model.get('state')) {
      case 'broken':
        this.hideSpinner();
        this.icon.show();
        this.icon.attr('src', "img/broken.png");
        return this.stateLabel.show().text(t('broken'));
      case 'installed':
        this.hideSpinner();
        this.icon.attr('src', "api/applications/" + app.id + ".png");
        this.icon.hide();
        this.icon.show();
        this.icon.removeClass('stopped');
        this.stateLabel.hide();
        useWidget = (_ref = this.model.getHomePosition(this.getNbCols())) != null ? _ref.useWidget : void 0;
        if (this.canUseWidget() && useWidget) {
          return this.setUseWidget(true);
        }
        break;
      case 'installing':
        this.icon.hide();
        this.showSpinner();
        return this.stateLabel.show().text('installing');
      case 'stopped':
        this.icon.attr('src', "api/applications/" + app.id + ".png");
        this.icon.addClass('stopped');
        this.hideSpinner();
        this.icon.show();
        return this.stateLabel.hide();
    }
  };

  ApplicationRow.prototype.onAppClicked = function(event) {
    var errormsg, msg,
      _this = this;
    event.preventDefault();
    if (!this.enabled) {
      return null;
    }
    switch (this.model.get('state')) {
      case 'broken':
        msg = 'This app is broken. Try install again.';
        errormsg = this.model.get('errormsg');
        if (errormsg) {
          msg += " Error was : " + errormsg;
        }
        return alert(msg);
      case 'installed':
        return this.launchApp(event);
      case 'installing':
        return alert(t('this app is being installed. Wait a little'));
      case 'stopped':
        this.icon.hide();
        this.showSpinner();
        return this.model.start({
          success: function() {
            _this.launchApp(event);
            _this.hideSpinner();
            return _this.icon.show();
          },
          error: function() {
            _this.hideSpinner();
            _this.icon.show();
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

  ApplicationRow.prototype.setUseWidget = function(widget) {
    var widgetUrl;
    if (widget == null) {
      widget = true;
    }
    widgetUrl = this.model.get('widget');
    if (widget) {
      this.$('.use-widget').text(t('use icon'));
      this.icon.detach();
      this.stateLabel.detach();
      this.title.detach();
      this.$('.application-inner').html(WidgetTemplate({
        url: widgetUrl
      }));
      return this.$('.application-inner').addClass('widget');
    } else {
      this.$('.use-widget').text(t('use widget'));
      this.$('.application-inner').empty();
      this.$('.application-inner').append(this.icon);
      this.$('.application-inner').append(this.title);
      this.$('.application-inner').append(this.stateLabel);
      return this.$('.application-inner').removeClass('widget');
    }
  };

  ApplicationRow.prototype.canUseWidget = function() {
    return false;
  };

  ApplicationRow.prototype.getNbCols = function() {
    return window.app.mainView.applicationListView.colsNb;
  };

  ApplicationRow.prototype.onUseWidgetClicked = function() {
    var homePosition, nbCols,
      _this = this;
    nbCols = this.getNbCols();
    homePosition = this.model.getHomePosition(nbCols);
    if (homePosition.useWidget == null) {
      homePosition.useWidget = false;
    }
    homePosition.useWidget = !homePosition.useWidget;
    return this.model.saveHomePosition(nbCols, homePosition, {
      success: function() {
        return _this.setUseWidget(homePosition.useWidget);
      }
    });
  };

  /* Functions*/


  ApplicationRow.prototype.launchApp = function(e) {
    if (e.which === 2 || e.ctrlKey || e.metaKey || $(window).width() <= 500) {
      return window.open("apps/" + this.model.id + "/", "_blank");
    } else if (e.which === 1) {
      return window.app.routers.main.navigate("apps/" + this.model.id + "/", true);
    }
  };

  ApplicationRow.prototype.generateSpinner = function() {
    this.spinner = new Sonic({
      width: 40,
      height: 40,
      padding: 20,
      strokeColor: '#363a46',
      pointDistance: .002,
      stepsPerFrame: 15,
      trailLength: .7,
      step: 'fader',
      setup: function() {
        return this._.lineWidth = 5;
      },
      path: [['arc', 20, 20, 20, 0, 360]]
    });
    return this.spinner.play();
  };

  ApplicationRow.prototype.showSpinner = function() {
    if (!this.spinner) {
      this.generateSpinner();
    }
    return this.$('.vertical-aligner').prepend(this.spinner.canvas);
  };

  ApplicationRow.prototype.hideSpinner = function() {
    return this.$('.vertical-aligner canvas').remove();
  };

  return ApplicationRow;

})(BaseView);
});

;require.register("views/main", function(exports, require, module) {
var AccountView, AppCollection, ApplicationsListView, BaseView, ConfigApplicationsView, DeviceCollection, HelpView, HomeView, MarketView, NavbarView, NotificationCollection, SocketListener, StackAppCollection, User, appIframeTemplate,
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

HelpView = require('views/help');

ConfigApplicationsView = require('views/config_applications');

MarketView = require('views/market');

ApplicationsListView = require('views/home');

SocketListener = require('lib/socket_listener');

User = require('models/user');

module.exports = HomeView = (function(_super) {
  __extends(HomeView, _super);

  HomeView.prototype.el = 'body';

  HomeView.prototype.template = require('templates/layout');

  function HomeView() {
    this.resetLayoutSizes = __bind(this.resetLayoutSizes, this);
    this.onAppHashChanged = __bind(this.onAppHashChanged, this);
    this.displayConfigApplications = __bind(this.displayConfigApplications, this);
    this.displayHelp = __bind(this.displayHelp, this);
    this.displayAccount = __bind(this.displayAccount, this);
    this.displayMarket = __bind(this.displayMarket, this);
    this.displayApplicationsListEdit = __bind(this.displayApplicationsListEdit, this);
    this.displayApplicationsList = __bind(this.displayApplicationsList, this);
    this.displayView = __bind(this.displayView, this);
    this.logout = __bind(this.logout, this);
    this.afterRender = __bind(this.afterRender, this);
    this.apps = new AppCollection();
    this.stackApps = new StackAppCollection();
    this.devices = new DeviceCollection();
    this.notifications = new NotificationCollection();
    SocketListener.watch(this.apps);
    SocketListener.watch(this.notifications);
    SocketListener.watch(this.devices);
    HomeView.__super__.constructor.apply(this, arguments);
  }

  HomeView.prototype.afterRender = function() {
    this.navbar = new NavbarView(this.apps, this.notifications);
    this.applicationListView = new ApplicationsListView(this.apps);
    this.configApplications = new ConfigApplicationsView(this.apps, this.devices, this.stackApps);
    this.accountView = new AccountView();
    this.helpView = new HelpView();
    this.marketView = new MarketView(this.apps);
    $("#content").niceScroll();
    this.frames = this.$('#app-frames');
    this.content = this.$('#content');
    $(window).resize(this.resetLayoutSizes);
    this.apps.fetch({
      reset: true
    });
    this.devices.fetch({
      reset: true
    });
    this.stackApps.fetch({
      reset: true
    });
    return this.resetLayoutSizes();
  };

  /* Functions*/


  HomeView.prototype.logout = function(event) {
    var user,
      _this = this;
    user = new User();
    return user.logout({
      success: function(data) {
        return window.location = window.location.origin + '/login/';
      },
      error: function() {
        return alert('Server error occured, logout failed.');
      }
    });
  };

  HomeView.prototype.displayView = function(view) {
    var displayView,
      _this = this;
    $("#current-application").html('home');
    displayView = function() {
      _this.frames.hide();
      view.$el.hide();
      _this.content.show();
      $('#home-content').append(view.$el);
      view.$el.fadeIn();
      _this.currentView = view;
      return _this.resetLayoutSizes();
    };
    if (this.currentView != null) {
      if (view === this.currentView) {
        this.frames.hide();
        this.content.show();
        this.resetLayoutSizes();
        return;
      }
      return this.currentView.$el.fadeOut(function() {
        _this.currentView.$el.detach();
        return displayView();
      });
    } else {
      return displayView();
    }
  };

  HomeView.prototype.displayApplicationsList = function() {
    this.displayView(this.applicationListView);
    this.applicationListView.setMode('view');
    return window.document.title = t("cozy home title");
  };

  HomeView.prototype.displayApplicationsListEdit = function() {
    this.displayView(this.applicationListView);
    this.applicationListView.setMode('edit');
    return window.document.title = t("cozy home title");
  };

  HomeView.prototype.displayMarket = function() {
    this.displayView(this.marketView);
    return window.document.title = t("cozy app store title");
  };

  HomeView.prototype.displayAccount = function() {
    this.displayView(this.accountView);
    return window.document.title = t('cozy account title');
  };

  HomeView.prototype.displayHelp = function() {
    this.displayView(this.helpView);
    return window.document.title = t("cozy help title");
  };

  HomeView.prototype.displayConfigApplications = function() {
    this.displayView(this.configApplications);
    return window.document.title = t("cozy applications title");
  };

  HomeView.prototype.displayApplication = function(slug, hash) {
    var frame, name,
      _this = this;
    if (this.apps.length === 0) {
      this.apps.once('reset', function() {
        return _this.displayApplication(slug, hash);
      });
      return null;
    }
    this.frames.show();
    this.content.hide();
    frame = this.$("#" + slug + "-frame");
    if (frame.length === 0) {
      frame = this.createApplicationIframe(slug, hash);
    }
    this.$('#app-frames').find('iframe').hide();
    frame.show();
    this.selectedApp = slug;
    name = this.apps.get(slug).get('name');
    if (name == null) {
      name = '';
    }
    window.document.title = "Cozy - " + name;
    $("#current-application").html(name);
    return this.resetLayoutSizes();
  };

  HomeView.prototype.createApplicationIframe = function(slug, hash) {
    var frame,
      _this = this;
    if (hash == null) {
      hash = "";
    }
    this.frames.append(appIframeTemplate({
      id: slug,
      hash: hash
    }));
    frame = this.$("#" + slug + "-frame");
    $(frame.prop('contentWindow')).on('hashchange', function() {
      var location, newhash;
      location = frame.prop('contentWindow').location;
      newhash = location.hash.replace('#', '');
      return _this.onAppHashChanged(slug, newhash);
    });
    this.resetLayoutSizes();
    return frame;
  };

  HomeView.prototype.onAppHashChanged = function(slug, newhash) {
    if (slug === this.selectedApp) {
      if (typeof app !== "undefined" && app !== null) {
        app.routers.main.navigate("/apps/" + slug + "/" + newhash, false);
      }
    }
    return this.resetLayoutSizes();
  };

  /* Configuration*/


  HomeView.prototype.resetLayoutSizes = function() {
    this.frames.height($(window).height() - 50);
    if ($(window).width() > 500) {
      return this.content.height($(window).height() - 48);
    } else {
      return this.content.height($(window).height());
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

slugify = require('helpers').slugify;

REPOREGEX = /^(https?:\/\/)?([\da-z\.-]+\.[a-z\.]{2,6})(:[0-9]{1,5})?([\/\w\.-]*)*(?:\.git)?(@[\da-zA-Z\/-]+)?$/;

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


  function MarketView(installedApps) {
    this.resetForm = __bind(this.resetForm, this);
    this.hideError = __bind(this.hideError, this);
    this.displayError = __bind(this.displayError, this);
    this.displayInfo = __bind(this.displayInfo, this);
    this.runInstallation = __bind(this.runInstallation, this);
    this.hideApplication = __bind(this.hideApplication, this);
    this.onInstallClicked = __bind(this.onInstallClicked, this);
    this.onEnterPressed = __bind(this.onEnterPressed, this);
    this.addApplication = __bind(this.addApplication, this);
    this.onAppListsChanged = __bind(this.onAppListsChanged, this);
    this.afterRender = __bind(this.afterRender, this);
    this.marketApps = new AppCollection();
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
    this.listenTo(this.installedApps, 'reset', this.onAppListsChanged);
    this.listenTo(this.installedApps, 'remove', this.onAppListsChanged);
    this.listenTo(this.marketApps, 'reset', this.onAppListsChanged);
    return this.marketApps.fetchFromMarket();
  };

  MarketView.prototype.onAppListsChanged = function() {
    var installeds,
      _this = this;
    this.$(".cozy-app").remove();
    this.noAppMessage.show();
    installeds = this.installedApps.pluck('slug');
    return this.marketApps.each(function(app) {
      var slug;
      slug = app.get('slug');
      if (installeds.indexOf(slug) === -1) {
        return _this.addApplication(app);
      }
    });
  };

  MarketView.prototype.addApplication = function(application) {
    var appButton, row;
    row = new ApplicationRow(application, this);
    this.noAppMessage.hide();
    this.appList.append(row.el);
    appButton = this.$(row.el);
    return appButton.hide().fadeIn();
  };

  MarketView.prototype.onEnterPressed = function(event) {
    var _ref, _ref1;
    if (event.which === 13 && !((_ref = this.popover) != null ? _ref.$el.is(':visible') : void 0)) {
      return this.onInstallClicked();
    } else if (event.which === 13) {
      return (_ref1 = this.popover) != null ? _ref1.confirmCallback() : void 0;
    }
  };

  MarketView.prototype.onInstallClicked = function(event) {
    var data;
    if (this.isInstalling()) {
      return alert(t("application is installing"));
    } else {
      data = {
        git: this.$("#app-git-field").val()
      };
      this.parsedGit(data);
      event.preventDefault();
      return false;
    }
  };

  MarketView.prototype.isInstalling = function() {
    return this.installedApps.where({
      state: 'installing'
    }).length !== 0;
  };

  MarketView.prototype.parsedGit = function(app) {
    var application, data, parsed;
    if (this.isInstalling()) {
      return alert(t("application is installing"));
    } else {
      parsed = this.parseGitUrl(app.git);
      if (parsed.error) {
        return this.displayError(parsed.msg);
      } else {
        this.hideError();
        application = new Application(parsed);
        data = {
          app: application
        };
        return this.showDescription(data);
      }
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
        return _this.hideApplication(appWidget, function() {
          return _this.runInstallation(appWidget.app);
        });
      },
      cancel: function(application) {
        _this.popover.hide();
        return _this.appList.show();
      }
    });
    this.$el.append(this.popover.$el);
    this.popover.show();
    if ($(window).width() <= 500) {
      return this.appList.hide();
    }
  };

  MarketView.prototype.hideApplication = function(appWidget, callback) {
    var _this = this;
    if (appWidget.$el != null) {
      return appWidget.$el.fadeOut(function() {
        return setTimeout(function() {
          return callback();
        }, 600);
      });
    } else {
      return callback();
    }
  };

  MarketView.prototype.runInstallation = function(application) {
    var _this = this;
    if (this.isInstalling()) {
      return true;
    }
    this.hideError();
    return application.install({
      ignoreMySocketNotification: true,
      success: function(data) {
        if (((data != null ? data.state : void 0) === "broken") || !data.success) {
          alert(data.message);
        } else {
          _this.resetForm();
        }
        _this.installedApps.add(application);
        return typeof app !== "undefined" && app !== null ? app.routers.main.navigate('home', true) : void 0;
      },
      error: function(jqXHR) {
        return alert(t(JSON.parse(jqXHR.responseText).message));
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
    path = path.replace('.git', '');
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
var ApplicationRow, BaseView, ColorButton,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

ColorButton = require('widgets/install_button');

module.exports = ApplicationRow = (function(_super) {
  __extends(ApplicationRow, _super);

  ApplicationRow.prototype.tagName = "div";

  ApplicationRow.prototype.className = "cozy-app";

  ApplicationRow.prototype.template = require('templates/market_application');

  ApplicationRow.prototype.events = {
    "click .btn": "onInstallClicked",
    "click": "onInstallClicked"
  };

  ApplicationRow.prototype.getRenderData = function() {
    return {
      app: this.app.attributes
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
    this.installButton = new ColorButton(this.$("#add-" + this.app.id + "-install"));
    if (this.app.get('comment') === 'official application') {
      return this.$el.addClass('official');
    }
  };

  ApplicationRow.prototype.onInstallClicked = function() {
    if (this.marketView.isInstalling()) {
      return alert(t("application is installing"));
    } else {
      return this.marketView.showDescription(this, this.installButton);
    }
  };

  return ApplicationRow;

})(BaseView);
});

;require.register("views/menu_application", function(exports, require, module) {
var ApplicationView, BaseView, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

module.exports = ApplicationView = (function(_super) {
  __extends(ApplicationView, _super);

  function ApplicationView() {
    this.onLinkClick = __bind(this.onLinkClick, this);
    _ref = ApplicationView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ApplicationView.prototype.tagName = 'div';

  ApplicationView.prototype.className = 'menu-application clearfix';

  ApplicationView.prototype.template = require('templates/menu_application');

  ApplicationView.prototype.events = {
    'click a': 'onLinkClick'
  };

  ApplicationView.prototype.onLinkClick = function() {
    return this.menu.hideAppList();
  };

  return ApplicationView;

})(BaseView);
});

;require.register("views/menu_applications", function(exports, require, module) {
var AppsMenu, ViewCollection,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ViewCollection = require('lib/view_collection');

module.exports = AppsMenu = (function(_super) {
  __extends(AppsMenu, _super);

  AppsMenu.prototype.el = '#menu-applications-container';

  AppsMenu.prototype.itemView = require('views/menu_application');

  AppsMenu.prototype.template = require('templates/menu_applications');

  AppsMenu.prototype.events = {
    "click #menu-applications-toggle": "showAppList",
    "click .clickcatcher": "hideAppList",
    "click #home-btn": "hideAppList"
  };

  function AppsMenu(collection) {
    this.collection = collection;
    this.hideAppList = __bind(this.hideAppList, this);
    this.showAppList = __bind(this.showAppList, this);
    this.windowClicked = __bind(this.windowClicked, this);
    this.remove = __bind(this.remove, this);
    this.afterRender = __bind(this.afterRender, this);
    AppsMenu.__super__.constructor.apply(this, arguments);
  }

  AppsMenu.prototype.appendView = function(view) {
    this.appList.append(view.$el);
    return view.menu = this;
  };

  AppsMenu.prototype.afterRender = function() {
    this.clickcatcher = this.$('.clickcatcher');
    this.clickcatcher.hide();
    this.appList = this.$('#menu-applications');
    AppsMenu.__super__.afterRender.apply(this, arguments);
    this.initializing = true;
    return $(window).on('click', this.windowClicked);
  };

  AppsMenu.prototype.remove = function() {
    $(window).off('click', this.hideAppList);
    return AppsMenu.__super__.remove.apply(this, arguments);
  };

  AppsMenu.prototype.windowClicked = function() {
    if ((typeof event !== "undefined" && event !== null) && this.$el.has($(event.target)).length === 0) {
      return this.hideAppList();
    }
  };

  AppsMenu.prototype.showAppList = function() {
    if (this.appList.is(':visible')) {
      this.appList.hide();
      this.clickcatcher.hide();
      return this.$el.removeClass('active');
    } else {
      if (this.collection.size() > 0) {
        this.$('#no-app-message').hide();
      } else {
        this.$('#no-app-message').show();
      }
      this.$el.addClass('active');
      this.appList.slideDown(100);
      return this.clickcatcher.show();
    }
  };

  AppsMenu.prototype.dismissAll = function() {
    return this.collection.removeAll();
  };

  AppsMenu.prototype.hideAppList = function(event) {
    this.appList.slideUp(100);
    this.clickcatcher.hide();
    return this.$el.removeClass('active');
  };

  return AppsMenu;

})(ViewCollection);
});

;require.register("views/navbar", function(exports, require, module) {
var AppsMenu, BaseView, NavbarView, NotificationsView, appButtonTemplate,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

appButtonTemplate = require("templates/navbar_app_btn");

NotificationsView = require('./notifications_view');

AppsMenu = require('./menu_applications');

module.exports = NavbarView = (function(_super) {
  __extends(NavbarView, _super);

  NavbarView.prototype.el = '#header';

  NavbarView.prototype.template = require('templates/navbar');

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
    return this.appMenu = new AppsMenu(this.apps);
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
    "click .doaction": "doaction",
    "click .dismiss": "dismiss"
  };

  NotificationView.prototype.initialize = function() {
    return this.listenTo(this.model, 'change', this.render);
  };

  NotificationView.prototype.doaction = function() {
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
    } else {
      url = null;
    }
    if (url) {
      window.app.routers.main.navigate(url, true);
    }
    if (this.model.get('type') === 'temporary') {
      return this.dismiss();
    }
  };

  NotificationView.prototype.dismiss = function(event) {
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
    this.hideNotifList = __bind(this.hideNotifList, this);
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
    "click #clickcatcher": "hideNotifList",
    "click #dismiss-all": "dismissAll"
  };

  NotificationsView.prototype.appendView = function(view) {
    this.notifList.prepend(view.el);
    if (!this.initializing) {
      this.sound.play();
    }
    this.$('#notifications-toggle img').attr('src', 'img/notification-orange.png');
    return this.$('#notifications-toggle').addClass('highlight');
  };

  NotificationsView.prototype.afterRender = function() {
    this.counter = this.$('#notifications-counter');
    this.counter.html('10');
    this.clickcatcher = this.$('#clickcatcher');
    this.clickcatcher.hide();
    this.noNotifMsg = this.$('#no-notif-msg');
    this.notifList = this.$('#notifications');
    this.sound = this.$('#notification-sound')[0];
    this.dismissButton = this.$("#dismiss-all");
    NotificationsView.__super__.afterRender.apply(this, arguments);
    this.initializing = true;
    this.collection.fetch().always(function() {
      return this.initializing = false;
    });
    return $(window).on('click', this.windowClicked);
  };

  NotificationsView.prototype.remove = function() {
    $(window).off('click', this.hideNotifList);
    return NotificationsView.__super__.remove.apply(this, arguments);
  };

  NotificationsView.prototype.checkIfEmpty = function() {
    var imgPath, newCount;
    newCount = this.collection.length;
    this.$('#no-notif-msg').toggle(newCount === 0);
    this.$('#dismiss-all').toggle(newCount !== 0);
    if (newCount === 0) {
      this.counter.html("");
      this.counter.hide();
      imgPath = 'img/notification-white.png';
      this.$('#notifications-toggle img').attr('src', imgPath);
      return this.$('#notifications-toggle').removeClass('highlight');
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
    if (this.notifList.is(':visible')) {
      this.notifList.hide();
      this.clickcatcher.hide();
      return this.$el.removeClass('active');
    } else {
      this.$el.addClass('active');
      this.notifList.slideDown(100);
      return this.clickcatcher.show();
    }
  };

  NotificationsView.prototype.dismissAll = function() {
    var _this = this;
    this.dismissButton.css('color', 'transparent');
    this.dismissButton.spin('small');
    return this.collection.removeAll({
      success: function() {
        _this.dismissButton.spin();
        return _this.dismissButton.css('color', '#333');
      },
      error: function() {
        _this.dismissButton.spin();
        return _this.dismissButton.css('color', '#333');
      }
    });
  };

  NotificationsView.prototype.hideNotifList = function(event) {
    this.notifList.slideUp(100);
    this.clickcatcher.hide();
    return this.$el.removeClass('active');
  };

  return NotificationsView;

})(ViewCollection);
});

;require.register("views/popover_description", function(exports, require, module) {
var ApplicationCollection, BaseView, PopoverDescriptionView, request, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

request = require('lib/request');

ApplicationCollection = require('../collections/application');

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

  PopoverDescriptionView.prototype.getRenderData = function() {
    var app, appsCollection;
    appsCollection = new ApplicationCollection().fetchFromMarket();
    app = appsCollection.get(this.model.get('slug'));
    this.model.set('comment', app.get('comment'));
    return PopoverDescriptionView.__super__.getRenderData.call(this);
  };

  PopoverDescriptionView.prototype.afterRender = function() {
    var _this = this;
    this.model.set("description", "");
    this.body = this.$(".md-body");
    this.header = this.$(".md-header h3");
    this.header.html(this.model.get('name'));
    this.body.addClass('loading');
    this.body.html(t('please wait data retrieval') + '<div class="spinner-container" />');
    this.body.find('.spinner-container').spin('small');
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
        } else {
          return _this.body.html(t('error connectivity issue'));
        }
      }
    });
    this.overlay = $('.md-overlay');
    return this.overlay.click(function() {
      return _this.hide();
    });
  };

  PopoverDescriptionView.prototype.renderDescription = function() {
    var description, docType, permission, permissionsDiv, _ref1;
    this.body.html("");
    this.$('.repo-stars').html(this.model.get('stars'));
    description = this.model.get("description");
    this.header.parent().append("<p class=\"line left\"> " + description + " </p>");
    if (Object.keys(this.model.get("permissions")).length === 0) {
      permissionsDiv = $("<div class='permissionsLine'>\n    <h4>" + (t('no specific permissions needed')) + " </h4>\n</div>");
      this.body.append(permissionsDiv);
    } else {
      this.body.append("<h4>" + (t('required permissions')) + "</h4>");
      _ref1 = this.model.get("permissions");
      for (docType in _ref1) {
        permission = _ref1[docType];
        permissionsDiv = $("<div class='permissionsLine'> <strong> " + docType + " </strong> <p> " + permission.description + " </p> </div>");
        this.body.append(permissionsDiv);
      }
    }
    this.handleContentHeight();
    this.body.slideDown();
    return this.body.niceScroll();
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
    $('#home-content').addClass('md-open');
    return setTimeout(function() {
      return _this.$('.md-content').addClass('md-show');
    }, 300);
  };

  PopoverDescriptionView.prototype.hide = function() {
    var _this = this;
    this.body.getNiceScroll().hide();
    $('.md-content').fadeOut(function() {
      _this.overlay.removeClass('md-show');
      _this.$el.removeClass('md-show');
      return _this.remove();
    });
    return $('#home-content').removeClass('md-open');
  };

  PopoverDescriptionView.prototype.onCancelClicked = function() {
    this.hide();
    return this.cancelCallback(this.model);
  };

  PopoverDescriptionView.prototype.onConfirmClicked = function() {
    return this.confirmCallback(this.model);
  };

  return PopoverDescriptionView;

})(BaseView);
});

;require.register("widgets/install_button", function(exports, require, module) {
var ColorButton;

module.exports = ColorButton = (function() {
  function ColorButton(button) {
    this.button = button;
  }

  ColorButton.prototype.displayGrey = function(text) {
    this.button.show();
    this.button.html(text);
    this.button.removeClass("btn-red");
    this.button.removeClass("btn-green");
    return this.button.removeClass("btn-orange");
  };

  ColorButton.prototype.displayOrange = function(text) {
    this.button.show();
    this.button.html(text);
    this.button.removeClass("btn-red");
    this.button.removeClass("btn-green");
    return this.button.addClass("btn-orange");
  };

  ColorButton.prototype.displayGreen = function(text) {
    this.button.show();
    this.button.html(text);
    this.button.addClass("btn-green");
    this.button.removeClass("btn-red");
    return this.button.removeClass("btn-orange");
  };

  ColorButton.prototype.displayRed = function(text) {
    this.button.show();
    this.button.html(text);
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

  ColorButton.prototype.spin = function(toggle, color) {
    if (toggle) {
      return this.button.spin("small", color);
    } else {
      return this.button.spin(false);
    }
  };

  ColorButton.prototype.isHidden = function() {
    return !this.button.is(":visible");
  };

  return ColorButton;

})();
});

;
//# sourceMappingURL=app.js.map