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
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
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

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.brunch = true;
})();

window.require.register("collections/application", function(exports, require, module) {
  var Application, ApplicationCollection, BaseCollection,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseCollection = require('lib/base_collection');

  Application = require('models/application');

  module.exports = ApplicationCollection = (function(_super) {

    __extends(ApplicationCollection, _super);

    function ApplicationCollection() {
      this.fetchFromMarket = __bind(this.fetchFromMarket, this);
      return ApplicationCollection.__super__.constructor.apply(this, arguments);
    }

    ApplicationCollection.prototype.model = Application;

    ApplicationCollection.prototype.url = 'api/applications/';

    ApplicationCollection.prototype.get = function(idorslug) {
      var app, out, _i, _len, _ref;
      out = ApplicationCollection.__super__.get.call(this, idorslug);
      if (out) {
        return out;
      }
      _ref = this.models;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        app = _ref[_i];
        if (idorslug === app.get('id')) {
          return app;
        }
      }
    };

    ApplicationCollection.prototype.fetchFromMarket = function(callback) {
      var apps;
      apps = [
        {
          icon: "img/bookmarks-icon.png",
          name: "bookmarks",
          slug: "bookmarks",
          git: "https://github.com/Piour/cozy-bookmarks.git",
          comment: "community contribution",
          description: "Manage your bookmarks easily"
        }, {
          icon: "img/agenda-icon.png",
          name: "calendar",
          slug: "agenda",
          git: "https://github.com/mycozycloud/cozy-agenda.git",
          comment: "official application",
          description: "Set up reminders and let cozy be your assistant"
        }, {
          icon: "img/contacts-icon.png",
          name: "contacts",
          slug: "contacts",
          git: "https://github.com/mycozycloud/cozy-contacts.git",
          comment: "official application",
          description: "Manage your contacts with custom informations"
        }, {
          icon: "img/cozy-music.png",
          name: "cozic",
          slug: "cozic",
          git: "https://github.com/rdubigny/cozy-music.git",
          comment: "community contribution",
          description: "An audio player to always keep your music with you"
        }, {
          icon: "img/feeds-icon.png",
          name: "feeds",
          slug: "feeds",
          git: "https://github.com/Piour/cozy-feeds.git",
          comment: "community contribution",
          description: "Aggregate your feeds and save your favorite links in bookmarks."
        }, {
          icon: "img/botmanager-icon.png",
          name: "irc bot",
          slug: "irc-botmanager",
          git: "https://github.com/jsilvestre/cozy-irc-botmanager.git",
          comment: "community contribution",
          description: "A friendly bot to help you manage an IRC channel"
        }, {
          icon: "img/kyou.png",
          name: "kyou",
          slug: "kyou",
          git: "https://github.com/frankrousseau/kyou.git",
          comment: "community contribution",
          description: "Quantify your for a better knowledge of yourself",
          website: "http://frankrousseau.github.io/kyou"
        }, {
          icon: "img/nirc-icon.png",
          name: "nirc",
          slug: "nirc",
          git: "https://github.com/frankrousseau/cozy-nirc.git",
          comment: "community contribution",
          description: "Access to your favorite IRC channel from your Cozy"
        }, {
          icon: "img/notes-icon.png",
          name: "notes",
          slug: "notes",
          git: "https://github.com/mycozycloud/cozy-notes.git",
          comment: "official application",
          description: "Store all your notes and files."
        }, {
          icon: "img/photos-icon.png",
          name: "photos",
          slug: "photos",
          git: "https://github.com/mycozycloud/cozy-photos.git",
          comment: "official application",
          description: "Share photos with your friends."
        }, {
          icon: "img/todos-icon.png",
          name: "todos",
          slug: "todos",
          git: "https://github.com/mycozycloud/cozy-todos.git",
          comment: "official application",
          description: "Write your tasks, order them and execute them efficiently."
        }, {
          icon: "img/webdav.png",
          name: "webdav",
          slug: "webdav",
          git: "https://github.com/aenario/cozy-webdav.git",
          comment: "community contribution",
          description: "Synchronize your contacts and your agenda with Cozy"
        }
      ];
      this.reset(apps);
      if (callback != null) {
        return callback(null, apps);
      }
    };

    return ApplicationCollection;

  })(BaseCollection);
  
});
window.require.register("collections/notifications", function(exports, require, module) {
  var BaseCollection, Notification, NotificationCollection,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseCollection = require('lib/base_collection');

  Notification = require('models/notification');

  module.exports = NotificationCollection = (function(_super) {

    __extends(NotificationCollection, _super);

    function NotificationCollection() {
      return NotificationCollection.__super__.constructor.apply(this, arguments);
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
window.require.register("helpers", function(exports, require, module) {
  
  exports.BrunchApplication = (function() {

    function BrunchApplication() {
      var _this = this;
      $(function() {
        return _this.initialize(_this);
      });
    }

    BrunchApplication.prototype.initializeJQueryExtensions = function() {
      return $.fn.spin = function(opts, color) {
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
        if (Spinner) {
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
              spinner = new Spinner($.extend({
                color: $this.css("color")
              }, opts));
              spinner.spin(this);
              return $this.data("spinner", spinner);
            }
          });
        } else {
          throw "Spinner class not available.";
          return null;
        }
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
window.require.register("helpers/client", function(exports, require, module) {
  
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
window.require.register("helpers/locales", function(exports, require, module) {
  
  exports.locales = {
    'en': 'English',
    'fr': 'Français'
  };
  
});
window.require.register("helpers/timezone", function(exports, require, module) {
  
  exports.timezones = ["Africa/Abidjan", "Africa/Accra", "Africa/Addis_Ababa", "Africa/Algiers", "Africa/Asmara", "Africa/Bamako", "Africa/Bangui", "Africa/Banjul", "Africa/Bissau", "Africa/Blantyre", "Africa/Brazzaville", "Africa/Bujumbura", "Africa/Cairo", "Africa/Casablanca", "Africa/Ceuta", "Africa/Conakry", "Africa/Dakar", "Africa/Dar_es_Salaam", "Africa/Djibouti", "Africa/Douala", "Africa/El_Aaiun", "Africa/Freetown", "Africa/Gaborone", "Africa/Harare", "Africa/Johannesburg", "Africa/Kampala", "Africa/Khartoum", "Africa/Kigali", "Africa/Kinshasa", "Africa/Lagos", "Africa/Libreville", "Africa/Lome", "Africa/Luanda", "Africa/Lubumbashi", "Africa/Lusaka", "Africa/Malabo", "Africa/Maputo", "Africa/Maseru", "Africa/Mbabane", "Africa/Mogadishu", "Africa/Monrovia", "Africa/Nairobi", "Africa/Ndjamena", "Africa/Niamey", "Africa/Nouakchott", "Africa/Ouagadougou", "Africa/Porto-Novo", "Africa/Sao_Tome", "Africa/Tripoli", "Africa/Tunis", "Africa/Windhoek", "America/Adak", "America/Anchorage", "America/Anguilla", "America/Antigua", "America/Araguaina", "America/Argentina/Buenos_Aires", "America/Argentina/Catamarca", "America/Argentina/Cordoba", "America/Argentina/Jujuy", "America/Argentina/La_Rioja", "America/Argentina/Mendoza", "America/Argentina/Rio_Gallegos", "America/Argentina/Salta", "America/Argentina/San_Juan", "America/Argentina/San_Luis", "America/Argentina/Tucuman", "America/Argentina/Ushuaia", "America/Aruba", "America/Asuncion", "America/Atikokan", "America/Bahia", "America/Barbados", "America/Belem", "America/Belize", "America/Blanc-Sablon", "America/Boa_Vista", "America/Bogota", "America/Boise", "America/Cambridge_Bay", "America/Campo_Grande", "America/Cancun", "America/Caracas", "America/Cayenne", "America/Cayman", "America/Chicago", "America/Chihuahua", "America/Costa_Rica", "America/Cuiaba", "America/Curacao", "America/Danmarkshavn", "America/Dawson", "America/Dawson_Creek", "America/Denver", "America/Detroit", "America/Dominica", "America/Edmonton", "America/Eirunepe", "America/El_Salvador", "America/Fortaleza", "America/Glace_Bay", "America/Godthab", "America/Goose_Bay", "America/Grand_Turk", "America/Grenada", "America/Guadeloupe", "America/Guatemala", "America/Guayaquil", "America/Guyana", "America/Halifax", "America/Havana", "America/Hermosillo", "America/Indiana/Indianapolis", "America/Indiana/Knox", "America/Indiana/Marengo", "America/Indiana/Petersburg", "America/Indiana/Tell_City", "America/Indiana/Vevay", "America/Indiana/Vincennes", "America/Indiana/Winamac", "America/Inuvik", "America/Iqaluit", "America/Jamaica", "America/Juneau", "America/Kentucky/Louisville", "America/Kentucky/Monticello", "America/La_Paz", "America/Lima", "America/Los_Angeles", "America/Maceio", "America/Managua", "America/Manaus", "America/Martinique", "America/Matamoros", "America/Mazatlan", "America/Menominee", "America/Merida", "America/Mexico_City", "America/Miquelon", "America/Moncton", "America/Monterrey", "America/Montevideo", "America/Montreal", "America/Montserrat", "America/Nassau", "America/New_York", "America/Nipigon", "America/Nome", "America/Noronha", "America/North_Dakota/Center", "America/North_Dakota/New_Salem", "America/Ojinaga", "America/Panama", "America/Pangnirtung", "America/Paramaribo", "America/Phoenix", "America/Port-au-Prince", "America/Port_of_Spain", "America/Porto_Velho", "America/Puerto_Rico", "America/Rainy_River", "America/Rankin_Inlet", "America/Recife", "America/Regina", "America/Resolute", "America/Rio_Branco", "America/Santa_Isabel", "America/Santarem", "America/Santiago", "America/Santo_Domingo", "America/Sao_Paulo", "America/Scoresbysund", "America/St_Johns", "America/St_Kitts", "America/St_Lucia", "America/St_Thomas", "America/St_Vincent", "America/Swift_Current", "America/Tegucigalpa", "America/Thule", "America/Thunder_Bay", "America/Tijuana", "America/Toronto", "America/Tortola", "America/Vancouver", "America/Whitehorse", "America/Winnipeg", "America/Yakutat", "America/Yellowknife", "Antarctica/Casey", "Antarctica/Davis", "Antarctica/DumontDUrville", "Antarctica/Mawson", "Antarctica/McMurdo", "Antarctica/Palmer", "Antarctica/Rothera", "Antarctica/Syowa", "Antarctica/Vostok", "Asia/Aden", "Asia/Almaty", "Asia/Amman", "Asia/Anadyr", "Asia/Aqtau", "Asia/Aqtobe", "Asia/Ashgabat", "Asia/Baghdad", "Asia/Bahrain", "Asia/Baku", "Asia/Bangkok", "Asia/Beirut", "Asia/Bishkek", "Asia/Brunei", "Asia/Choibalsan", "Asia/Chongqing", "Asia/Colombo", "Asia/Damascus", "Asia/Dhaka", "Asia/Dili", "Asia/Dubai", "Asia/Dushanbe", "Asia/Gaza", "Asia/Harbin", "Asia/Ho_Chi_Minh", "Asia/Hong_Kong", "Asia/Hovd", "Asia/Irkutsk", "Asia/Jakarta", "Asia/Jayapura", "Asia/Jerusalem", "Asia/Kabul", "Asia/Kamchatka", "Asia/Karachi", "Asia/Kashgar", "Asia/Kathmandu", "Asia/Kolkata", "Asia/Krasnoyarsk", "Asia/Kuala_Lumpur", "Asia/Kuching", "Asia/Kuwait", "Asia/Macau", "Asia/Magadan", "Asia/Makassar", "Asia/Manila", "Asia/Muscat", "Asia/Nicosia", "Asia/Novokuznetsk", "Asia/Novosibirsk", "Asia/Omsk", "Asia/Oral", "Asia/Phnom_Penh", "Asia/Pontianak", "Asia/Pyongyang", "Asia/Qatar", "Asia/Qyzylorda", "Asia/Rangoon", "Asia/Riyadh", "Asia/Sakhalin", "Asia/Samarkand", "Asia/Seoul", "Asia/Shanghai", "Asia/Singapore", "Asia/Taipei", "Asia/Tashkent", "Asia/Tbilisi", "Asia/Tehran", "Asia/Thimphu", "Asia/Tokyo", "Asia/Ulaanbaatar", "Asia/Urumqi", "Asia/Vientiane", "Asia/Vladivostok", "Asia/Yakutsk", "Asia/Yekaterinburg", "Asia/Yerevan", "Atlantic/Azores", "Atlantic/Bermuda", "Atlantic/Canary", "Atlantic/Cape_Verde", "Atlantic/Faroe", "Atlantic/Madeira", "Atlantic/Reykjavik", "Atlantic/South_Georgia", "Atlantic/St_Helena", "Atlantic/Stanley", "Australia/Adelaide", "Australia/Brisbane", "Australia/Broken_Hill", "Australia/Currie", "Australia/Darwin", "Australia/Eucla", "Australia/Hobart", "Australia/Lindeman", "Australia/Lord_Howe", "Australia/Melbourne", "Australia/Perth", "Australia/Sydney", "Canada/Atlantic", "Canada/Central", "Canada/Eastern", "Canada/Mountain", "Canada/Newfoundland", "Canada/Pacific", "Europe/Amsterdam", "Europe/Andorra", "Europe/Athens", "Europe/Belgrade", "Europe/Berlin", "Europe/Brussels", "Europe/Bucharest", "Europe/Budapest", "Europe/Chisinau", "Europe/Copenhagen", "Europe/Dublin", "Europe/Gibraltar", "Europe/Helsinki", "Europe/Istanbul", "Europe/Kaliningrad", "Europe/Kiev", "Europe/Lisbon", "Europe/London", "Europe/Luxembourg", "Europe/Madrid", "Europe/Malta", "Europe/Minsk", "Europe/Monaco", "Europe/Moscow", "Europe/Oslo", "Europe/Paris", "Europe/Prague", "Europe/Riga", "Europe/Rome", "Europe/Samara", "Europe/Simferopol", "Europe/Sofia", "Europe/Stockholm", "Europe/Tallinn", "Europe/Tirane", "Europe/Uzhgorod", "Europe/Vaduz", "Europe/Vienna", "Europe/Vilnius", "Europe/Volgograd", "Europe/Warsaw", "Europe/Zaporozhye", "Europe/Zurich", "GMT", "Indian/Antananarivo", "Indian/Chagos", "Indian/Christmas", "Indian/Cocos", "Indian/Comoro", "Indian/Kerguelen", "Indian/Mahe", "Indian/Maldives", "Indian/Mauritius", "Indian/Mayotte", "Indian/Reunion", "Pacific/Apia", "Pacific/Auckland", "Pacific/Chatham", "Pacific/Easter", "Pacific/Efate", "Pacific/Enderbury", "Pacific/Fakaofo", "Pacific/Fiji", "Pacific/Funafuti", "Pacific/Galapagos", "Pacific/Gambier", "Pacific/Guadalcanal", "Pacific/Guam", "Pacific/Honolulu", "Pacific/Johnston", "Pacific/Kiritimati", "Pacific/Kosrae", "Pacific/Kwajalein", "Pacific/Majuro", "Pacific/Marquesas", "Pacific/Midway", "Pacific/Nauru", "Pacific/Niue", "Pacific/Norfolk", "Pacific/Noumea", "Pacific/Pago_Pago", "Pacific/Palau", "Pacific/Pitcairn", "Pacific/Ponape", "Pacific/Port_Moresby", "Pacific/Rarotonga", "Pacific/Saipan", "Pacific/Tahiti", "Pacific/Tarawa", "Pacific/Tongatapu", "Pacific/Truk", "Pacific/Wake", "Pacific/Wallis", "US/Alaska", "US/Arizona", "US/Central", "US/Eastern", "US/Hawaii", "US/Mountain", "US/Pacific", "UTC"];
  
});
window.require.register("initialize", function(exports, require, module) {
  var BrunchApplication, MainRouter, MainView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BrunchApplication = require('./helpers').BrunchApplication;

  MainRouter = require('routers/main_router');

  MainView = require('views/main');

  exports.Application = (function(_super) {

    __extends(Application, _super);

    function Application() {
      return Application.__super__.constructor.apply(this, arguments);
    }

    Application.prototype.initialize = function() {
      var _this = this;
      this.initializeJQueryExtensions();
      return $.ajax('/api/instances/').done(function(instances) {
        var _ref, _ref1;
        _this.instance = instances != null ? (_ref = instances.rows) != null ? _ref[0] : void 0 : void 0;
        _this.locale = ((_ref1 = _this.instance) != null ? _ref1.locale : void 0) || 'en';
        return _this.initialize2();
      }).fail(function() {
        _this.locale = 'en';
        return _this.initialize2();
      });
    };

    Application.prototype.initialize2 = function() {
      var locales, pathToSocketIO, socket, url;
      try {
        locales = require('locales/' + this.locale);
      } catch (err) {
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
window.require.register("lib/base_collection", function(exports, require, module) {
  var BaseCollection,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = BaseCollection = (function(_super) {

    __extends(BaseCollection, _super);

    function BaseCollection() {
      return BaseCollection.__super__.constructor.apply(this, arguments);
    }

    BaseCollection.prototype.parse = function(response) {
      return response.rows;
    };

    return BaseCollection;

  })(Backbone.Collection);
  
});
window.require.register("lib/base_model", function(exports, require, module) {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  exports.BaseModel = (function(_super) {

    __extends(BaseModel, _super);

    function BaseModel() {
      return BaseModel.__super__.constructor.apply(this, arguments);
    }

    BaseModel.prototype.isNew = function() {
      return this.id === void 0;
    };

    return BaseModel;

  })(Backbone.Model);
  
});
window.require.register("lib/base_view", function(exports, require, module) {
  var BaseView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = BaseView = (function(_super) {

    __extends(BaseView, _super);

    function BaseView() {
      return BaseView.__super__.constructor.apply(this, arguments);
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
window.require.register("lib/request", function(exports, require, module) {
  
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
        console.log(data);
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
window.require.register("lib/socket_listener", function(exports, require, module) {
  var Application, Notification, SocketListener, application_idx, notification_idx,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Application = require('models/application');

  Notification = require('models/notification');

  application_idx = 0;

  notification_idx = 1;

  SocketListener = (function(_super) {

    __extends(SocketListener, _super);

    function SocketListener() {
      return SocketListener.__super__.constructor.apply(this, arguments);
    }

    SocketListener.prototype.models = {
      'notification': Notification,
      'application': Application
    };

    SocketListener.prototype.events = ['notification.create', 'notification.update', 'notification.delete', 'application.create', 'application.update', 'application.delete'];

    SocketListener.prototype.onRemoteCreate = function(model) {
      if (model instanceof Application) {
        return this.collections[application_idx].add(model);
      } else if (model instanceof Notification) {
        return this.collections[notification_idx].add(model);
      }
    };

    SocketListener.prototype.onRemoteDelete = function(model) {
      if (model instanceof Application) {
        return this.collections[application_idx].remove(model);
      } else if (model instanceof Notification) {
        return this.collections[notification_idx].remove(model);
      }
    };

    return SocketListener;

  })(CozySocketListener);

  module.exports = new SocketListener();
  
});
window.require.register("lib/view_collection", function(exports, require, module) {
  var BaseView, ViewCollection,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseView = require('lib/base_view');

  module.exports = ViewCollection = (function(_super) {

    __extends(ViewCollection, _super);

    function ViewCollection() {
      this.removeItem = __bind(this.removeItem, this);

      this.addItem = __bind(this.addItem, this);
      return ViewCollection.__super__.constructor.apply(this, arguments);
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

    ViewCollection.prototype.initialize = function() {
      ViewCollection.__super__.initialize.apply(this, arguments);
      this.views = {};
      this.listenTo(this.collection, "reset", this.onReset);
      this.listenTo(this.collection, "add", this.addItem);
      this.listenTo(this.collection, "remove", this.removeItem);
      return this.onReset(this.collection);
    };

    ViewCollection.prototype.render = function() {
      var id, view, _ref;
      _ref = this.views;
      for (id in _ref) {
        view = _ref[id];
        view.$el.detach();
      }
      return ViewCollection.__super__.render.apply(this, arguments);
    };

    ViewCollection.prototype.afterRender = function() {
      var id, view, _ref;
      _ref = this.views;
      for (id in _ref) {
        view = _ref[id];
        this.appendView(view);
      }
      return this.checkIfEmpty(this.views);
    };

    ViewCollection.prototype.remove = function() {
      this.onReset([]);
      return ViewCollection.__super__.remove.apply(this, arguments);
    };

    ViewCollection.prototype.onReset = function(newcollection) {
      var id, view, _ref;
      _ref = this.views;
      for (id in _ref) {
        view = _ref[id];
        view.remove();
      }
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
      this.views[model.cid].remove();
      delete this.views[model.cid];
      return this.checkIfEmpty(this.views);
    };

    return ViewCollection;

  })(BaseView);
  
});
window.require.register("locales/en", function(exports, require, module) {
  
  module.exports = {
    "Home": "Home",
    "Apps": "Apps",
    "Account": "Account",
    "email": "Email",
    "timezone": "Timezone",
    "domain": "Domain",
    "locale": "Locale",
    "Change password": "Change password",
    "input your current password": "input your current password",
    "fill this field to set a new password": "fill this field to set a new password",
    "confirm new password": "confirm new password",
    "Send Changes": "Send Changes",
    "manage": "Manage",
    "total": "Total",
    "Memory consumption": "Memory consumption",
    "Disk consumption": "Disk consumption",
    "You have no notifications": "You have no notifications",
    "Dismiss All": "Dismiss all",
    "add application ?": "add application ?",
    "Install": "Install",
    "your app!": "your app!",
    "community contribution": "community contribution",
    "official application": "official application",
    "Application Description": "Application Description",
    "downloading-description": "Downloading description ...",
    "downloading-permissions": "Download permissions ...",
    "Cancel": "Cancel",
    "Ok": "Ok",
    "Applications Permissions": "Applications Permissions",
    "Confirm": "Confirm",
    "Installing": "Installing",
    "remove": "remove",
    "update": "update",
    "started": "started",
    "Notifications": "Notifications",
    "Questions and help forum": "Questions and help forum",
    "Sign out": "Sign out",
    "open in a new tab": "open in a new tab",
    "Disc Unit": "GB",
    "Memory Unit": "MB",
    "always-on": "always on",
    "keep always on": "keep always on",
    "stop this app": "stop this app",
    "application-is-installing": "An application is already installing.\nWait for it to finish, then run your installation again.",
    "no-app-message": "You have actually no application installed on your Cozy.\nGo to the <a href=\"#applications\">app store</a> to install a new one!",
    "welcome-app-store": "Welcome to your cozy app store, install your own application from there\nor add an existing one from the list.",
    "installed-everything": "You have already installed everything !",
    "There is already an app with similar name": "There is already an app with similar name.",
    "your cozy home": "your cozy home",
    "manage your apps": "manage your app",
    "chose your apps": "chose your apps",
    "configure your cozy": "configure your cozy",
    "ask for assistance": "ask for assistance",
    "logout": "logout",
    "dismiss all": "dismiss all",
    "Welcome to your Cozy!": "Welcome to your Cozy!",
    "You have no application installed. You should": "You have no application installed. You should",
    "configure ": "configure ",
    "App management": "App management",
    "App store": "App store",
    "Configuration": "Configuration",
    "Assistance": "Assistance",
    "Hardware consumption": "Hardware consumption",
    "&nbsp;GB (Hard Drive)": "&nbsp;GB (Hard Drive)",
    "&nbsp;MB (RAM)": "&nbsp;MB (RAM)",
    "Manage your applications": "Manage your applications",
    "There is no application installed.": "There is no application installed.",
    " Your parameters": " Your parameters",
    "I need your email to send you alerts or for password recovering": "I need your email to send you alerts or for password recovering",
    "Your timezone is required to display dates properly": "Your timezone is required to display dates properly",
    "The domain name is used to build urls send via email to you or your contacts": "The domain name is used to build urls send via email to you or your contacts",
    "save": "save",
    "Chose the language you want I use to speak with you:": "Chose the language you want I use to speak with you:",
    "French": "French",
    "English": "English",
    "Change password procedure": "Change password procedure",
    "current password": "current password",
    "enter a new password": "enter a new password",
    "new password": "new password",
    "confirm your new password": "confirm your new password",
    "save your new password": "save your new password",
    "Do you look for assistance?": "Do you look for assistance?",
    "Write an email to our support team at:": "Write an email to our support team at:",
    "Register and post on our forum: ": "Register and post on our forum: ",
    "Ask your question on Twitter: ": "Ask your question on Twitter: ",
    "Visit the project website and learn to build your app:": "Visit the project website and learn to build your app:",
    "your own application": "your own application",
    "install": "install",
    "broken": "broken",
    "start this app": "start this app",
    "stopped": "stopped",
    "retry to install": "retry to install",
    "Cozy - Account": "Cozy - Account",
    "Cozy - App Store": "Cozy - App Store",
    "Cozy - Home": "Cozy - Home",
    "Cozy - Applications configuration": "Cozy - Applications configuration",
    "running": "running",
    "Cozy - Help": "Cozy - Help",
    "Changing the locale requires to reload the page.": "Changing the locale requires to reload the page.",
    "cancel": "cancel",
    "installing": "installing",
    "abort": "abort",
    "Once updated, this application will require the following permissions:": "Once updated, this application will require the following permissions:",
    "confirm update": "confirm update",
    "This application does not need specific permissions": "This application does not need specific permissions",
    "menu-descrtiption": "If it's your first time on Cozy here is a little guide\nabout all section available in your Cozy Home. All of them can be reached\nfrom the menu located on the top right corner.",
    "You have no application installed. You should ": "You have no application installed. You should ",
    "your Cozy then install your first application via the&nbsp;": "your Cozy then install your first application via the&nbsp;",
    "app store": "app store",
    "Home ": "Home ",
    "It is the place from where you can reach your applications": "It is the place from where you can reach your applications",
    "App management ": "App management ",
    "There you can manage the state of your applications: start it, stop it, remove it...": "There you can manage the state of your applications: start it, stop it, remove it...",
    "App store ": "App store ",
    "In the app store, you will find new applications to install on your Cozy.": "In the app store, you will find new applications to install on your Cozy.",
    "Configuration ": "Configuration ",
    "To work properly your Cozy requires several parameters. Set them in this section.": "To work properly your Cozy requires several parameters. Set them in this section.",
    "Assistance ": "Assistance ",
    "You will find here some links to assistance resources.": "You will find here some links to assistance resources.",
    "The first place to find help is:": "The first place to find help is:",
    "removed": "removed",
    "Required permissions": "Required Permissions"
  };
  
});
window.require.register("locales/fr", function(exports, require, module) {
  
  module.exports = {
    "Home": "Bureau",
    "Apps": "Apps",
    "Account": "Réglages",
    "email": "Email",
    "timezone": "Fuseau horaire",
    "domain": "Nom de domaine",
    "locale": "Langue",
    "Change password": "Changer de mot de passe",
    "input your current password": "Mot de passe actuel",
    "fill this field to set a new password": "Nouveau mot de passe",
    "confirm new password": "Confirmer le nouveau mot de passe",
    "Send Changes": "Enregistrer",
    "manage": "Gestion",
    "total": "Total",
    "Memory consumption": "Utilisation mémoire",
    "Disk consumption": "Utilisation disque",
    "You have no notifications": "Vous n'avez aucune notification",
    "Dismiss All": "Ignorer toutes",
    "add application ?": "Ajouter l'application ?",
    "Install": "Installer",
    "your app!": "Votre Application !",
    "community contribution": "Developpeur Indépendant",
    "official application": "Application Officielle",
    "Application Description": "Description de l'Application",
    "downloading-description": "Téléchargement de la description…",
    "downloading-permissions": "Téléchargement des permissions…",
    "Cancel": "Annuler",
    "Ok": "Ok",
    "Applications Permissions": "Permissions de l'Application",
    "Confirm": "Confirmer",
    "Installing": "Installation en cours",
    "remove": "enlever",
    "update": "m.à.j.",
    "started": "Démarrée",
    "Notifications": "Notifications",
    "Questions and help forum": "Forum d'aide",
    "Sign out": "Sortir",
    "open in a new tab": "Ouvrir dans un onglet",
    "Disc Unit": "Go",
    "Memory Unit": "Mo",
    "always-on": "toujours démarrée",
    "keep always on": "garder toujours démarrée",
    "stop this app": "arrêter cet app",
    "application-is-installing": "Une application est en cours d'installation.\nAttendez la fin de celle-ci avant d'en lancer une nouvelle.",
    "no-app-message": "Vous n'avez aucune application installée. Allez sur\nl'<a href=\"#applications\">app store</a> pour en installer une nouvelle !",
    "welcome-app-store": "Bienvenue sur l'app store, vous pouvez installer votre propre application\nou ajouter une application existante dans la liste",
    "installed-everything": "Vous avez déjà tout installé !",
    "There is already an app with similar name": "Il y a déjà une application installée avec un nom similaire.",
    "your cozy home": "votre accueil Cozy",
    "manage your apps": "gérer vos apps",
    "chose your apps": "choisissez vos apps",
    "configure your cozy": "configurer votre cozy",
    "ask for assistance": "demandez de l'aide",
    "logout": "déconnexion",
    "dismiss all": "tout enlever",
    "Welcome to your Cozy!": "Bienvenue sur votre Cozy!",
    "You have no application installed. You should": "Vous n'avez pas d'applications installées vous devriez",
    "configure ": "configurer ",
    "App management": "Gestion des apps",
    "App store": "App store",
    "Configuration": "Configuration",
    "Assistance": "Aide",
    "Hardware consumption": "Consommation Hardware",
    "&nbsp;GB (Hard Drive)": "&nbsp;Go (Disque Dur)",
    "&nbsp;MB (RAM)": "&nbsp;Mo (RAM)",
    "Manage your applications": "Gérez vos applications",
    "There is no application installed.": "Il n'y a pas d'applications installées.",
    "save": "sauver",
    " Your parameters": " Vos paramètres",
    "I need your email to send you alerts or for password recovering": "J'ai besoin de votre email pour la récupération de mot de passe ou\npour vous envoyer des alertes.",
    "Your timezone is required to display dates properly": "Votre timezone est require pour vous afficher les dates correctements.",
    "The domain name is used to build urls send via email to you or your contacts": "Le nom de domaine est utilisé pour construire les urls\nenvoyées par mail à vos contacts.",
    "Chose the language you want I use to speak with you:": "Choisissez la langue que vous voulez que j'utilise pour vous parler.",
    "French": "Français",
    "English": "Anglais",
    "Change password procedure": "Procédure de changement de mot de passe",
    "current password": "mot de passe actuel",
    "enter a new password": "entrez un nouveau mot de passe",
    "new password": "nouveau mot de passe",
    "confirm your new password": "confirmez votre nouveau mot de passe",
    "save your new password": "sauvegarder votre nouveau mot de passe",
    "Do you look for assistance?": "Est-ce que vous cherchez de l'aide ?",
    "Write an email to our support team at:": "Ecrivez un email à notre équipe support:",
    "Register and post on our forum: ": "Postez un message sur notre forum: ",
    "Ask your question on Twitter: ": "Posez votre question sur Twitter: ",
    "Visit the project website and learn to build your app:": "Visitez le site du projet et apprenez à construire des applications.",
    "your own application": "votre propre application",
    "install": "installation",
    "broken": "cassée",
    "start this app": "démarrer cette application",
    "stopped": "stoppée",
    "retry to install": "réessai d'installation",
    "Cozy - Account": "Cozy - Compte",
    "Cozy - App Store": "Cozy - App Store",
    "Cozy - Home": "Cozy - Home",
    "Cozy - Applications configuration": "Cozy - Configuration d'applications",
    "running": "démarrée",
    "Cozy - Help": "Cozy - Aide",
    "Changing the locale requires to reload the page.": "Le changement de langue nécessite le rechargement de la page.",
    "cancel": "cancel",
    "installing": "installing",
    "abort": "abort",
    "Once updated, this application will require the following permissions:": "Une fois mise à jour l'application requièra les permissions suivantes:",
    "confirm update": "confirmez la mise à jour",
    "This application does not need specific permissions": "Cette applicatiion n'a pas besoin d'informations spécifiques",
    "menu-descrtiption": "Si c'est votre première fois sur Cozy, vous trouverez\ndans la suite un petit guide décrivant les sections de votre Cozy. Elles\npeuvent tout être atteintes depuis le menu en haut à droite de l'acceuil Cozy.",
    "You have no application installed. You should ": "Vous n'avez pas d'applications installées vous devriez ",
    "your Cozy then install your first application via the&nbsp;": "votre Cozy puis installer votre première application via&nbsp;",
    "app store": "app store",
    "Home ": "Accueil ",
    "It is the place from where you can reach your applications": "C'est ici que vous pouvez accéder à toutes vos applications.",
    "App management ": "Gestion des applications ",
    "There you can manage the state of your applications: start it, stop it, remove it...": "Ici tu peux gérer l'état de tes applications: démarre, arrête et supprime les...",
    "App store ": "App store ",
    "In the app store, you will find new applications to install on your Cozy.": "Dans l'app store, vous trouverez de nouvelles applications pour installer Cozy.",
    "Configuration ": "Configuration ",
    "To work properly your Cozy requires several parameters. Set them in this section.": "Pour fonctionner correctement, Cozy requiert différents paramètres. Positionnez les dans cette section.",
    "Assistance ": "Aide ",
    "You will find here some links to assistance resources.": "Vous trouverez ici toutes les ressources dont vous avez besoin.",
    "The first place to find help is:": "Le premier endroit où trouver de l'aide est:",
    "removed": "supprimée",
    "Required permissions": "Permissions requises"
  };
  
});
window.require.register("models/application", function(exports, require, module) {
  var Application, client,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  client = require("../helpers/client");

  module.exports = Application = (function(_super) {

    __extends(Application, _super);

    function Application() {
      this.uninstall = __bind(this.uninstall, this);
      return Application.__super__.constructor.apply(this, arguments);
    }

    Application.prototype.idAttribute = 'slug';

    Application.prototype.url = function() {
      var base;
      base = "/api/applications/";
      if (this.get('id')) {
        return base + "byid/" + this.get('id');
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
      var error, success, _ref,
        _this = this;
      _ref = callbacks || {}, success = _ref.success, error = _ref.error;
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
      this.prepareCallbacks(callbacks);
      if (this.get('state') !== 'broken') {
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

    return Application;

  })(Backbone.Model);
  
});
window.require.register("models/notification", function(exports, require, module) {
  var BaseModel, Notification,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseModel = require('lib/base_model').BaseModel;

  module.exports = Notification = (function(_super) {

    __extends(Notification, _super);

    function Notification() {
      return Notification.__super__.constructor.apply(this, arguments);
    }

    Notification.prototype.urlRoot = 'api/notifications';

    return Notification;

  })(BaseModel);
  
});
window.require.register("models/user", function(exports, require, module) {
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
window.require.register("routers/main_router", function(exports, require, module) {
  var MainRouter,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = MainRouter = (function(_super) {

    __extends(MainRouter, _super);

    function MainRouter() {
      return MainRouter.__super__.constructor.apply(this, arguments);
    }

    MainRouter.prototype.routes = {
      "home": "applicationList",
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

    MainRouter.prototype.selectIcon = function(index) {
      $('.menu-btn').removeClass('active');
      return $($('.menu-btn').get(index)).addClass('active');
    };

    MainRouter.prototype.applicationList = function() {
      app.mainView.displayApplicationsList();
      return this.selectIcon(0);
    };

    MainRouter.prototype.configApplications = function() {
      app.mainView.displayConfigApplications();
      return this.selectIcon(1);
    };

    MainRouter.prototype.help = function() {
      app.mainView.displayHelp();
      return this.selectIcon(4);
    };

    MainRouter.prototype.market = function() {
      app.mainView.displayMarket();
      return this.selectIcon(2);
    };

    MainRouter.prototype.account = function() {
      app.mainView.displayAccount();
      return this.selectIcon(3);
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
window.require.register("templates/account", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<!--.section-title.darkbg.bigger config--><h4 class="pa2 w600 biggest darkbg center">');
  var __val__ = t(' Your parameters')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</h4><div id="account-form" class="lightgrey w600 pa2"><div class="input"><p>');
  var __val__ = t('I need your email to send you alerts or for password recovering')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</p><input id="account-email-field"/><button class="btn">');
  var __val__ = t('save')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</button></div><div class="input"><p>');
  var __val__ = t('Your timezone is required to display dates properly')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</p><select id="account-timezone-field"></select><button class="btn">');
  var __val__ = t('save')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</button></div><div class="input"><p>');
  var __val__ = t('The domain name is used to build urls send via email to you or your contacts')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</p><input id="account-domain-field"/><button class="btn">');
  var __val__ = t('save')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</button></div><div class="input"><p>');
  var __val__ = t('Chose the language you want I use to speak with you:')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</p><select id="account-locale-field"><option value="fr">');
  var __val__ = t('French')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</option><option value="en">');
  var __val__ = t('English')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</option></select><button class="btn">');
  var __val__ = t('save')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</button></div><p><button id="change-password-button" class="btn">');
  var __val__ = t('Change password')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</button></p><div id="change-password-form"><p>');
  var __val__ = t('Change password procedure')
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
window.require.register("templates/application_iframe", function(exports, require, module) {
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
window.require.register("templates/config_application", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div class="clearfix"><div class="mod"><strong>' + escape((interp = app.name) == null ? '' : interp) + '</strong><span>&nbsp;-&nbsp;</span>');
  if ( app.state === 'installed')
  {
  buf.push('<span class="state-label">');
  var __val__ = t('running')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</span>');
  }
  else
  {
  buf.push('<span class="state-label"> \n' + escape((interp = app.state) == null ? '' : interp) + '</span>');
  }
  buf.push('</div><div class="buttons"><div class="mod right"><button class="btn remove-app">');
  var __val__ = t('remove')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</button></div><div class="mod right"> <button class="btn update-app">');
  var __val__ = t('update')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</button></div><div class="mod right"><button class="btn btn-large start-stop-btn">');
  var __val__ = t('stop this app')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</button></div><div class="mod right smaller"><input type="checkbox" title="always-on" checked="checked" name="app-stoppable" class="app-stoppable"/><label for="app-stoppable">auto stop</label></div></div></div>');
  }
  return buf.join("");
  };
});
window.require.register("templates/config_application_list", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  }
  return buf.join("");
  };
});
window.require.register("templates/config_applications", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<!--.section-title.darkbg.bigger apps--><div class="txt-center"><div class="line w800"><div class="mod w33 left"><div class="sys-infos line"><div class="mod center-txt"><h4>');
  var __val__ = t('Hardware consumption')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</h4><div class="disk-space mt2"><div class="line"><img src="img/hard-drive.png"/></div><div class="line"><span class="amount">0</span><span>&nbsp;/&nbsp;</span><span class="total">0</span><span>');
  var __val__ = t('&nbsp;GB (Hard Drive)')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</span></div></div><div class="memory-free mt2"><div class="line"> <img src="img/ram.png"/></div><div class="lien"><span class="amount">0</span><span>&nbsp;/&nbsp;</span><span class="total">0&nbsp;</span><span>');
  var __val__ = t('&nbsp;MB (RAM)')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</span></div></div></div></div></div><div class="mod w66 left"><h4 class="mb3">');
  var __val__ = t('Manage your applications')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</h4></div></div></div>');
  }
  return buf.join("");
  };
});
window.require.register("templates/help", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<!--.section-title.darkbg.bigger help--><div class="line w600 lightgrey"><h4 class="help-text darkbg pa2">');
  var __val__ = t('Do you look for assistance?')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</h4><div class="line pa2"><p class="help-text mt2">');
  var __val__ = t('Write an email to our support team at:')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</p><P class="help-text"> <a href="mailto:support@cozycloud.cc">support@cozycloud.cc</a></P><p class="help-text">');
  var __val__ = t('Register and post on our forum: ')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</p><P class="help-text"> <a href="https://forum.cozycloud.cc/">https://forum.cozycloud.cc/</a></P><p class="help-text">');
  var __val__ = t('Ask your question on Twitter: ')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</p><P class="help-text"> <a href="https://twitter.com/mycozycloud">@mycozycloud</a></P><p class="help-text">');
  var __val__ = t('Visit the project website and learn to build your app:')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</p><P class="help-text"> <a href="http://cozy.io">cozy.io</a></P></div></div>');
  }
  return buf.join("");
  };
});
window.require.register("templates/help_url", function(exports, require, module) {
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
window.require.register("templates/home", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<!-- .section-title.darkbg.bigger home--><div id="no-app-message" class="w600"><div id="start-title" class="darkbg clearfix"><a href="http://cozy.io"><img src="img/happycloud.png" class="logo"/></a><p class="biggest">');
  var __val__ = t('Welcome to your Cozy!')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</p></div><div class="line"><p class="bigger pa2">');
  var __val__ = t('You have no application installed. You should ')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('<a href="#account">');
  var __val__ = t('configure ')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</a>');
  var __val__ = t ('your Cozy then install your first application via the&nbsp;')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('<a href="#applications">');
  var __val__ = t('app store')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</a>.</p><p class="mt2 pa2">');
  var __val__ = t ('menu-descrtiption')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</p><p><img src="/img/home-black.png"/><strong>');
  var __val__ = t('Home ')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</strong>');
  var __val__ = t('It is the place from where you can reach your applications')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</p><p><img src="/img/config-apps.png"/><strong>');
  var __val__ = t('App management ')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</strong>');
  var __val__ = t('There you can manage the state of your applications: start it, stop it, remove it...')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</p><p><img src="/img/apps.png"/><strong>');
  var __val__ = t('App store ')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</strong>');
  var __val__ = t('In the app store, you will find new applications to install on your Cozy.')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</p><p><img src="/img/configuration.png"/><strong>');
  var __val__ = t('Configuration ')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</strong>');
  var __val__ = t('To work properly your Cozy requires several parameters. Set them in this section.')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</p><p><img src="/img/help.png"/><strong>');
  var __val__ = t('Assistance ')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</strong>');
  var __val__ = t('You will find here some links to assistance resources.')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</p></div></div><div id="app-list"></div>');
  }
  return buf.join("");
  };
});
window.require.register("templates/home_application", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<a');
  buf.push(attrs({ 'href':("#apps/" + (app.slug) + "/") }, {"href":true}));
  buf.push('><div class="application-inner"><p><img src=""/></p><p class="app-title">' + escape((interp = app.name) == null ? '' : interp) + '</p></div></a>');
  }
  return buf.join("");
  };
});
window.require.register("templates/layout", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<header id="header" class="navbar"></header><div class="home-body"><div id="app-frames"></div><div id="content"><div id="home-menu" class="mt3"><div class="txtright menu-btn"><a href="#home"><span>');
  var __val__ = t('your cozy home')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</span><img src="img/apps.png"/></a></div><div class="txtright menu-btn"><a href="#config-applications"><span>');
  var __val__ = t('manage your apps')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</span><img src="img/config-apps.png"/></a></div><div class="txtright menu-btn"><a href="#applications"><span>');
  var __val__ = t('chose your apps')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</span><img src="img/store.png"/></a></div><div class="txtright menu-btn"><a href="#account"><span>');
  var __val__ = t('configure your cozy')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</span><img src="img/configuration.png"/></a></div><div class="txtright menu-btn"><a href="#help"><span>');
  var __val__ = t('ask for assistance')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</span><img src="img/help.png"/></a></div></div><div id="home-content"></div></div></div>');
  }
  return buf.join("");
  };
});
window.require.register("templates/market", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<!--.section-title.darkbg.bigger app store--><p class="mt2">Welcome to the Cozy App Store. This is the place to customize your Cozy\nby adding applications.\nFrom there you can install the application you built or chose among the \napplications provided by Cozy Cloud and other developers.</p><div id="app-market-list"><div id="your-app" class="clearfix"><div class="text"><p>');
  var __val__ = t('Install')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('&nbsp;<a href="https://cozycloud.cc/make/" target="_blank">');
  var __val__ = t('your own application')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</a></p><p><input type="text" id="app-git-field" placeholder="https://github.com/username/repository.git@branch" class="span3"/><button class="btn app-install-button">');
  var __val__ = t('install')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</button></p><div class="error alert-error"></div><div class="info alert"></div></div></div><div id="market-applications-list" class="clearfix"><div id="no-app-message">');
  var __val__ = t('installed-everything')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</div></div></div><div class="md-overlay"></div>');
  }
  return buf.join("");
  };
});
window.require.register("templates/market_application", function(exports, require, module) {
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
  buf.push('/></div><div class="app-text"><h3>' + escape((interp = app.name) == null ? '' : interp) + '</h3><span class="comment">');
  var __val__ = t(app.comment)
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</span><p class="par2">' + escape((interp = app.description) == null ? '' : interp) + '</p></div>');
  }
  return buf.join("");
  };
});
window.require.register("templates/menu_application", function(exports, require, module) {
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
window.require.register("templates/menu_applications", function(exports, require, module) {
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
window.require.register("templates/navbar", function(exports, require, module) {
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
window.require.register("templates/navbar_app_btn", function(exports, require, module) {
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
window.require.register("templates/notification", function(exports, require, module) {
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
window.require.register("templates/notifications", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<a id="notifications-toggle"><img src="img/notification-white.png"/></a><audio id="notification-sound" src="sounds/notification.wav" preload="preload"></audio><div id="clickcatcher"></div><ul id="notifications"><li id="no-notif-msg">');
  var __val__ = t('You have no notifications')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</li><li id="dismiss-all" class="btn">');
  var __val__ = t('dismiss all')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</li></ul>');
  }
  return buf.join("");
  };
});
window.require.register("templates/popover_description", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div class="md-content"><div class="md-header clearfix"><div class="line"><h3 class="left">' + escape((interp = model.name) == null ? '' : interp) + '</h3><div class="right"><a');
  buf.push(attrs({ 'href':("" + (model.git) + ""), "class": ('repo-stars') }, {"href":true}));
  buf.push('>&nbsp;</a><a');
  buf.push(attrs({ 'href':("" + (model.git) + "") }, {"href":true}));
  buf.push('><img src="img/star-white.png"/></a></div></div></div><div class="md-body"></div><div class="md-footer clearfix"><button id="confirmbtn" class="btn right">');
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
window.require.register("templates/popover_permissions", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div class="md-header mt2">');
  var __val__ = t('Once updated, this application will require the following permissions:')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</div><div class="md-body"><div>&nbsp;</div></div><div class="md-footer mt2"><a id="confirmbtn" class="btn right">');
  var __val__ = t('confirm update')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</a><a id="cancelbtn" class="btn light-btn right">');
  var __val__ = t('cancel')
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</a></div>');
  }
  return buf.join("");
  };
});
window.require.register("views/account", function(exports, require, module) {
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

    /* Constructor
    */


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

    /* Functions
    */


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
            saveButton.html('saved');
            if (fieldName === 'locale') {
              alert(t('Changing the locale requires to reload the page.'));
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
        var saveEmail, saveTimezone, timezoneData;
        timezoneData = [];
        _this.emailField.val(data.rows[0].email);
        _this.timezoneField.val(data.rows[0].timezone);
        saveEmail = _this.getSaveFunction('email', _this.emailField, 'user');
        _this.emailField.on('keyup', function(event) {
          if (event.keyCode === 13 || event.which === 13) {
            return saveEmail();
          }
        });
        saveTimezone = _this.getSaveFunction('timezone', _this.timezoneField, 'user');
        return _this.timezoneField.change(saveTimezone);
      });
      return $.get("api/instances/", function(data) {
        var domain, instance, locale, saveDomain, saveLocale, _ref;
        instance = (_ref = data.rows) != null ? _ref[0] : void 0;
        domain = (instance != null ? instance.domain : void 0) || t('no.domain.set');
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

    /* Configuration
    */


    AccountView.prototype.afterRender = function() {
      var timezone, _i, _len,
        _this = this;
      this.emailField = this.$('#account-email-field');
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
window.require.register("views/config_application", function(exports, require, module) {
  var ApplicationRow, BaseView, ColorButton, PopoverPermissionsView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseView = require('lib/base_view');

  ColorButton = require('widgets/install_button');

  PopoverPermissionsView = require('views/popover_permissions');

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

    /* Constructor
    */


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
      this.icon = this.$('img');
      this.updateButton = new ColorButton(this.$(".update-app"));
      this.removeButton = new ColorButton(this.$(".remove-app"));
      this.startStopBtn = new ColorButton(this.$(".start-stop-btn"));
      this.stateLabel = this.$('.state-label');
      this.appStoppable = this.$(".app-stoppable");
      this.listenTo(this.model, 'change', this.onAppChanged);
      return this.onAppChanged(this.model);
    };

    /* Listener
    */


    ApplicationRow.prototype.onAppChanged = function(app) {
      var bool;
      switch (this.model.get('state')) {
        case 'broken':
          this.icon.attr('src', "img/broken.png");
          this.stateLabel.show().text(t('broken'));
          this.removeButton.displayGrey(t('remove'));
          this.updateButton.displayGrey(t('retry to install'));
          this.appStoppable.hide();
          this.appStoppable.next().hide();
          this.startStopBtn.hide();
          break;
        case 'installed':
          this.icon.attr('src', "api/applications/" + app.id + ".png");
          this.icon.removeClass('stopped');
          this.removeButton.displayGrey(t('remove'));
          this.updateButton.displayGrey(t('update'));
          this.appStoppable.show();
          this.appStoppable.next().show();
          this.startStopBtn.displayGrey(t('stop this app'));
          break;
        case 'installing':
          this.icon.attr('src', "img/installing.gif");
          this.icon.removeClass('stopped');
          this.stateLabel.show().text(t('installing'));
          this.removeButton.displayGrey(t('abort'));
          this.updateButton.hide();
          this.appStoppable.hide();
          this.appStoppable.next().hide();
          this.startStopBtn.hide();
          break;
        case 'stopped':
          this.icon.attr('src', "api/applications/" + app.id + ".png");
          this.icon.addClass('stopped');
          this.removeButton.displayGrey(t('remove'));
          this.updateButton.hide();
          this.appStoppable.hide();
          this.appStoppable.next().hide();
          this.startStopBtn.displayGrey(t('start this app'));
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
      this.removeButton.displayGrey("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
      this.removeButton.spin(true);
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
      event.preventDefault();
      return this.showPopover();
    };

    ApplicationRow.prototype.showPopover = function() {
      var _this = this;
      this.popover = new PopoverPermissionsView({
        model: this.model,
        confirm: function(application) {
          _this.popover.remove();
          return _this.updateApp();
        },
        cancel: function(application) {
          return _this.popover.remove();
        }
      });
      return this.$el.append(this.popover.$el);
    };

    ApplicationRow.prototype.onStartStopClicked = function(event) {
      var _this = this;
      event.preventDefault();
      this.startStopBtn.displayGrey("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
      this.startStopBtn.spin(true);
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
            return _this.startStopBtn.spin(false);
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
      this.updateButton.displayRed(t("installing"));
      Backbone.Mediator.pub('app-state-changed', true);
      this.updateButton.displayGrey("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
      this.updateButton.spin(false);
      this.updateButton.spin(true);
      return this.model.updateApp({
        success: function() {
          _this.updateButton.displayGreen(t("updated"));
          return Backbone.Mediator.pub('app-state-changed', true);
        },
        error: function(jqXHR) {
          var error;
          error = JSON.parse(jqXHR.responseText);
          alert(error.message);
          _this.updateButton.displayRed(t("failed"));
          return Backbone.Mediator.pub('app-state-changed', true);
        }
      });
    };

    return ApplicationRow;

  })(BaseView);
  
});
window.require.register("views/config_application_list", function(exports, require, module) {
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
window.require.register("views/config_applications", function(exports, require, module) {
  var BaseView, ConfigApplicationList, request,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  request = require('lib/request');

  BaseView = require('lib/base_view');

  ConfigApplicationList = require('./config_application_list');

  module.exports = exports.ConfigApplicationsView = (function(_super) {

    __extends(ConfigApplicationsView, _super);

    ConfigApplicationsView.prototype.id = 'config-applications-view';

    ConfigApplicationsView.prototype.template = require('templates/config_applications');

    ConfigApplicationsView.prototype.subscriptions = {
      'app-state-changed': 'onAppStateChanged'
    };

    function ConfigApplicationsView(apps) {
      this.apps = apps;
      this.fetch = __bind(this.fetch, this);

      ConfigApplicationsView.__super__.constructor.call(this);
    }

    ConfigApplicationsView.prototype.afterRender = function() {
      this.memoryFree = this.$('.memory-free');
      this.diskSpace = this.$('.disk-space');
      this.fetch();
      this.applicationList = new ConfigApplicationList(this.apps);
      return this.$el.find('.w66').append(this.applicationList.$el);
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
      this.memoryFree.find('.amount').html(Math.floor(amount / 1000));
      return this.memoryFree.find('.total').html(Math.floor(total / 1000));
    };

    ConfigApplicationsView.prototype.displayDiskSpace = function(amount, total) {
      this.diskSpace.find('.amount').html(amount / 10);
      return this.diskSpace.find('.total').html(total);
    };

    ConfigApplicationsView.prototype.onAppStateChanged = function() {
      return setTimeout(this.fetch, 10000);
    };

    return ConfigApplicationsView;

  })(BaseView);
  
});
window.require.register("views/help", function(exports, require, module) {
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
window.require.register("views/home", function(exports, require, module) {
  var ApplicationRow, ApplicationsListView, ViewCollection, client,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ViewCollection = require('lib/view_collection');

  client = require('helpers/client');

  ApplicationRow = require('views/home_application');

  module.exports = ApplicationsListView = (function(_super) {

    __extends(ApplicationsListView, _super);

    ApplicationsListView.prototype.id = 'applications-view';

    ApplicationsListView.prototype.template = require('templates/home');

    ApplicationsListView.prototype.itemView = require('views/home_application');

    /* Constructor
    */


    function ApplicationsListView(apps) {
      this.appendView = __bind(this.appendView, this);

      this.afterRender = __bind(this.afterRender, this);
      this.apps = apps;
      ApplicationsListView.__super__.constructor.call(this, {
        collection: apps
      });
    }

    ApplicationsListView.prototype.afterRender = function() {
      var _this = this;
      this.appList = this.$("#app-list");
      this.machineInfos = this.$(".machine-infos").hide();
      this.$("#no-app-message").hide();
      return $(".menu-btn a").click(function(event) {
        var target;
        $(".menu-btn").removeClass('active');
        target = $(event.target);
        if (!target.hasClass('menu-btn')) {
          target = target.parent();
        }
        if (!target.hasClass('menu-btn')) {
          target = target.parent();
        }
        return target.addClass('active');
      });
    };

    ApplicationsListView.prototype.displayNoAppMessage = function() {
      if (this.apps.size() === 0) {
        return this.$("#no-app-message").show();
      } else {
        return this.$("#no-app-message").hide();
      }
    };

    ApplicationsListView.prototype.appendView = function(view) {
      this.appList.append(view.el);
      return view.$el.hide().fadeIn();
    };

    return ApplicationsListView;

  })(ViewCollection);
  
});
window.require.register("views/home_application", function(exports, require, module) {
  var ApplicationRow, BaseView, ColorButton, PopoverPermissionsView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseView = require('lib/base_view');

  ColorButton = require('widgets/install_button');

  PopoverPermissionsView = require('views/popover_permissions');

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
      "click .application-inner": "onAppClicked"
    };

    /* Constructor
    */


    function ApplicationRow(options) {
      this.launchApp = __bind(this.launchApp, this);

      this.onAppClicked = __bind(this.onAppClicked, this);

      this.onAppChanged = __bind(this.onAppChanged, this);

      this.afterRender = __bind(this.afterRender, this);
      this.id = "app-btn-" + options.model.id;
      ApplicationRow.__super__.constructor.apply(this, arguments);
    }

    ApplicationRow.prototype.afterRender = function() {
      this.icon = this.$('img');
      this.stateLabel = this.$('.state-label');
      this.listenTo(this.model, 'change', this.onAppChanged);
      return this.onAppChanged(this.model);
    };

    /* Listener
    */


    ApplicationRow.prototype.onAppChanged = function(app) {
      switch (this.model.get('state')) {
        case 'broken':
          this.icon.attr('src', "img/broken.png");
          return this.stateLabel.show().text(t('broken'));
        case 'installed':
          this.icon.attr('src', "api/applications/" + app.id + ".png");
          this.icon.removeClass('stopped');
          return this.stateLabel.hide();
        case 'installing':
          this.icon.attr('src', "img/installing.gif");
          this.icon.removeClass('stopped');
          return this.stateLabel.show().text('installing');
        case 'stopped':
          this.icon.attr('src', "api/applications/" + app.id + ".png");
          this.icon.addClass('stopped');
          return this.stateLabel.hide();
      }
    };

    ApplicationRow.prototype.onAppClicked = function(event) {
      var errormsg, msg;
      event.preventDefault();
      switch (this.model.get('state')) {
        case 'broken':
          msg = 'This app is broken. Try install again.';
          errormsg = this.model.get('errormsg');
          if (errormsg) {
            msg += " Error was : " + errormsg;
          }
          return alert(msg);
        case 'installed':
          return this.launchApp();
        case 'installing':
          return alert(t('this app is being installed. Wait a little'));
        case 'stopped':
          return this.model.start({
            success: this.launchApp
          });
      }
    };

    /* Functions
    */


    ApplicationRow.prototype.launchApp = function() {
      return window.app.routers.main.navigate("apps/" + this.model.id + "/", true);
    };

    return ApplicationRow;

  })(BaseView);
  
});
window.require.register("views/main", function(exports, require, module) {
  var AccountView, AppCollection, ApplicationsListView, BaseView, ConfigApplicationsView, HelpView, HomeView, MarketView, NavbarView, User, appIframeTemplate, socketListener,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseView = require('lib/base_view');

  appIframeTemplate = require('templates/application_iframe');

  AppCollection = require('collections/application');

  NavbarView = require('views/navbar');

  AccountView = require('views/account');

  HelpView = require('views/help');

  ConfigApplicationsView = require('views/config_applications');

  MarketView = require('views/market');

  ApplicationsListView = require('views/home');

  socketListener = require('lib/socket_listener');

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

      this.displayApplicationsList = __bind(this.displayApplicationsList, this);

      this.displayView = __bind(this.displayView, this);

      this.logout = __bind(this.logout, this);

      this.afterRender = __bind(this.afterRender, this);
      this.apps = new AppCollection();
      socketListener.watch(this.apps);
      HomeView.__super__.constructor.apply(this, arguments);
    }

    HomeView.prototype.afterRender = function() {
      var _this = this;
      this.navbar = new NavbarView(this.apps);
      this.applicationListView = new ApplicationsListView(this.apps);
      this.configApplications = new ConfigApplicationsView(this.apps);
      this.accountView = new AccountView();
      this.helpView = new HelpView();
      this.marketView = new MarketView(this.apps);
      $("#content").niceScroll();
      this.frames = this.$('#app-frames');
      this.content = this.$('#content');
      this.favicon = this.$('fav1');
      this.favicon2 = this.$('fav2');
      $(window).resize(this.resetLayoutSizes);
      this.apps.fetch({
        reset: true,
        success: function() {
          return _this.applicationListView.displayNoAppMessage();
        }
      });
      return this.resetLayoutSizes();
    };

    /* Functions
    */


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
        _this.changeFavicon("favicon.ico");
        return _this.resetLayoutSizes();
      };
      if (this.currentView != null) {
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
      return window.document.title = t("Cozy - Home");
    };

    HomeView.prototype.displayMarket = function() {
      this.displayView(this.marketView);
      return window.document.title = t("Cozy - App Store");
    };

    HomeView.prototype.displayAccount = function() {
      this.displayView(this.accountView);
      return window.document.title = t('Cozy - Account');
    };

    HomeView.prototype.displayHelp = function() {
      this.displayView(this.helpView);
      return window.document.title = t("Cozy - Help");
    };

    HomeView.prototype.displayConfigApplications = function() {
      this.displayView(this.configApplications);
      return window.document.title = t("Cozy - Applications configuration");
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
      if (!(name != null)) {
        name = '';
      }
      window.document.title = "Cozy - " + name;
      $("#current-application").html(name);
      this.changeFavicon("/apps/" + slug + "/favicon.ico");
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

    HomeView.prototype.changeFavicon = function(url) {
      var newfav, _ref, _ref1;
      if ((_ref = this.favicon) != null) {
        _ref.remove();
      }
      if ((_ref1 = this.favicon2) != null) {
        _ref1.remove();
      }
      newfav = '<link rel="icon" type="image/x-icon" href="' + url + '" />"';
      this.favicon = $(newfav);
      this.favicon2 = this.favicon.clone().attr('rel', 'shortcut icon');
      return $('head').append(this.favicon, this.favicon2);
    };

    /* Configuration
    */


    HomeView.prototype.resetLayoutSizes = function() {
      this.frames.height($(window).height() - 48);
      return this.content.height($(window).height() - 48);
    };

    return HomeView;

  })(BaseView);
  
});
window.require.register("views/market", function(exports, require, module) {
  var AppCollection, Application, ApplicationRow, BaseView, ColorButton, MarketView, PopoverDescriptionView, PopoverPermissionsView, REPOREGEX, slugify,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseView = require('lib/base_view');

  PopoverPermissionsView = require('views/popover_permissions');

  PopoverDescriptionView = require('views/popover_description');

  ApplicationRow = require('views/market_application');

  ColorButton = require('widgets/install_button');

  AppCollection = require('collections/application');

  Application = require('models/application');

  slugify = require('helpers').slugify;

  REPOREGEX = /^(https?:\/\/)?([\da-z\.-]+\.[a-z\.]{2,6})([\/\w\.-]*)*(?:\.git)?(@[\da-zA-Z\/-]+)?$/;

  module.exports = MarketView = (function(_super) {

    __extends(MarketView, _super);

    MarketView.prototype.id = 'market-view';

    MarketView.prototype.template = require('templates/market');

    MarketView.prototype.tagName = 'div';

    MarketView.prototype.events = {
      'keyup #app-git-field': 'onEnterPressed',
      "click #your-app .app-install-button": "onInstallClicked"
    };

    /* Constructor
    */


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
        return alert(t("application-is-installing"));
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
        return alert(t("application-is-installing"));
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
          return _this.hideApplication(appWidget, function() {
            return _this.runInstallation(appWidget.app);
          });
        },
        cancel: function(application) {
          return _this.popover.hide();
        }
      });
      this.$el.append(this.popover.$el);
      return this.popover.show();
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
          if (typeof app !== "undefined" && app !== null) {
            app.routers.main.navigate('home', true);
          }
          return typeof app !== "undefined" && app !== null ? app.mainView.applicationListView.displayNoAppMessage() : void 0;
        },
        error: function(jqXHR) {
          return alert(t(JSON.parse(jqXHR.responseText).message));
        }
      });
    };

    MarketView.prototype.parseGitUrl = function(url) {
      var branch, domain, error, git, name, out, parsed, parts, path, proto, slug;
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
      git = parsed[0], proto = parsed[1], domain = parsed[2], path = parsed[3], branch = parsed[4];
      path = path.replace('.git', '');
      parts = path.split("/");
      name = parts[parts.length - 1];
      name = name.replace(/-|_/g, " ");
      name = name.replace('cozy ', '');
      slug = slugify(name);
      git = proto + domain + path + '.git';
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
window.require.register("views/market_application", function(exports, require, module) {
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
        return alert(t("application-is-installing"));
      } else {
        return this.marketView.showDescription(this, this.installButton);
      }
    };

    return ApplicationRow;

  })(BaseView);
  
});
window.require.register("views/menu_application", function(exports, require, module) {
  var ApplicationView, BaseView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseView = require('lib/base_view');

  module.exports = ApplicationView = (function(_super) {

    __extends(ApplicationView, _super);

    function ApplicationView() {
      this.onLinkClick = __bind(this.onLinkClick, this);
      return ApplicationView.__super__.constructor.apply(this, arguments);
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
window.require.register("views/menu_applications", function(exports, require, module) {
  var AppsMenu, SocketListener, ViewCollection,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ViewCollection = require('lib/view_collection');

  SocketListener = require('lib/socket_listener');

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
window.require.register("views/navbar", function(exports, require, module) {
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

    function NavbarView(apps) {
      this.afterRender = __bind(this.afterRender, this);
      this.apps = apps;
      NavbarView.__super__.constructor.call(this);
    }

    NavbarView.prototype.afterRender = function() {
      this.notifications = new NotificationsView();
      return this.appMenu = new AppsMenu(this.apps);
    };

    return NavbarView;

  })(BaseView);
  
});
window.require.register("views/notification_view", function(exports, require, module) {
  var BaseView, NotificationView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseView = require('lib/base_view');

  module.exports = NotificationView = (function(_super) {

    __extends(NotificationView, _super);

    function NotificationView() {
      return NotificationView.__super__.constructor.apply(this, arguments);
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
window.require.register("views/notifications_view", function(exports, require, module) {
  var Notification, NotificationCollection, NotificationsView, SocketListener, ViewCollection,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ViewCollection = require('lib/view_collection');

  SocketListener = require('lib/socket_listener');

  NotificationCollection = require('collections/notifications');

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
      return NotificationsView.__super__.constructor.apply(this, arguments);
    }

    NotificationsView.prototype.el = '#notifications-container';

    NotificationsView.prototype.itemView = require('views/notification_view');

    NotificationsView.prototype.template = require('templates/notifications');

    NotificationsView.prototype.events = {
      "click #notifications-toggle": "showNotifList",
      "click #clickcatcher": "hideNotifList",
      "click #dismiss-all": "dismissAll"
    };

    NotificationsView.prototype.initialize = function() {
      var _ref;
      if ((_ref = this.collection) == null) {
        this.collection = new NotificationCollection();
      }
      SocketListener.watch(this.collection);
      return NotificationsView.__super__.initialize.apply(this, arguments);
    };

    NotificationsView.prototype.appendView = function(view) {
      this.notifList.prepend(view.el);
      if (!this.initializing) {
        this.sound.play();
      }
      this.$('#notifications-toggle img').attr('src', 'img/notification-orange.png');
      return this.$('#notifications-toggle').addClass('opaque');
    };

    NotificationsView.prototype.afterRender = function() {
      this.counter = this.$('#notifications-counter');
      this.clickcatcher = this.$('#clickcatcher');
      this.clickcatcher.hide();
      this.noNotifMsg = this.$('#no-notif-msg');
      this.notifList = this.$('#notifications');
      this.sound = this.$('#notification-sound')[0];
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
      var newCount;
      newCount = this.collection.length;
      this.$('#no-notif-msg').toggle(newCount === 0);
      this.$('#dismiss-all').toggle(newCount !== 0);
      if (newCount === 0) {
        newCount = "";
      }
      return this.counter.html(newCount);
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
      this.collection.removeAll();
      this.$('#notifications-toggle img').attr('src', 'img/notification-white.png');
      return this.$('#notifications-toggle').removeClass('opaque');
    };

    NotificationsView.prototype.hideNotifList = function(event) {
      this.notifList.slideUp(100);
      this.clickcatcher.hide();
      return this.$el.removeClass('active');
    };

    return NotificationsView;

  })(ViewCollection);
  
});
window.require.register("views/popover_description", function(exports, require, module) {
  var BaseView, PopoverDescriptionView, request,
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
      return PopoverDescriptionView.__super__.constructor.apply(this, arguments);
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
      return this.cancelCallback = options.cancel;
    };

    PopoverDescriptionView.prototype.afterRender = function() {
      var renderDesc,
        _this = this;
      this.model.set("description", "");
      this.body = this.$(".md-body");
      this.header = this.$(".md-header h3");
      this.header.html(this.model.get('name'));
      this.body.spin('small');
      renderDesc = function() {
        _this.body.spin();
        return _this.renderDescription();
      };
      this.model.getMetaData({
        success: renderDesc,
        error: renderDesc
      });
      this.overlay = $('.md-overlay');
      return this.overlay.click(function() {
        return _this.hide();
      });
    };

    PopoverDescriptionView.prototype.renderDescription = function() {
      var description, docType, permission, permissionsDiv, _ref;
      this.body.hide();
      this.body.html("");
      this.$('.repo-stars').html(this.model.get('stars'));
      description = this.model.get("description");
      this.header.parent().append("<p class=\"line left\"> " + description + " </p>");
      if (Object.keys(this.model.get("permissions")).length === 0) {
        permissionsDiv = $("<div class='permissionsLine'> <h4>" + (t('This application does not need specific permissions')) + " </h4> </div>");
        this.body.append(permissionsDiv);
      } else {
        this.body.append("<h4>" + (t('Required permissions')) + "</h4>");
        _ref = this.model.get("permissions");
        for (docType in _ref) {
          permission = _ref[docType];
          permissionsDiv = $("<div class='permissionsLine'> <strong> " + docType + " </strong> <p> " + permission.description + " </p> </div>");
          this.body.append(permissionsDiv);
        }
      }
      return this.body.slideDown();
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
window.require.register("views/popover_permissions", function(exports, require, module) {
  var BaseView, PopoverPermissionsView, REPOREGEX,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseView = require('lib/base_view');

  REPOREGEX = /^(https?:\/\/)?([\da-z\.-]+\.[a-z\.]{2,6})([\/\w\.-]*)*(?:\.git)?(@[\da-z\/-]+)?$/;

  module.exports = PopoverPermissionsView = (function(_super) {

    __extends(PopoverPermissionsView, _super);

    function PopoverPermissionsView() {
      this.onConfirmClicked = __bind(this.onConfirmClicked, this);

      this.onCancelClicked = __bind(this.onCancelClicked, this);

      this.renderPermissions = __bind(this.renderPermissions, this);
      return PopoverPermissionsView.__super__.constructor.apply(this, arguments);
    }

    PopoverPermissionsView.prototype.id = 'market-popover-view';

    PopoverPermissionsView.prototype.className = 'modal';

    PopoverPermissionsView.prototype.tagName = 'div';

    PopoverPermissionsView.prototype.template = require('templates/popover_permissions');

    PopoverPermissionsView.prototype.events = {
      'click #cancelbtn': 'onCancelClicked',
      'click #confirmbtn': 'onConfirmClicked'
    };

    PopoverPermissionsView.prototype.initialize = function(options) {
      PopoverPermissionsView.__super__.initialize.apply(this, arguments);
      this.confirmCallback = options.confirm;
      return this.cancelCallback = options.cancel;
    };

    PopoverPermissionsView.prototype.afterRender = function() {
      var _this = this;
      this.model.set("permissions", "");
      this.body = this.$(".md-body");
      this.body.spin('small');
      this.model.getPermissions({
        success: function(data) {
          if (!_this.model.hasChanged("permissions")) {
            return _this.confirmCallback(_this.model);
          }
        },
        error: function() {}
      });
      return this.listenTo(this.model, "change:permissions", this.renderPermissions);
    };

    PopoverPermissionsView.prototype.renderPermissions = function() {
      var docType, permission, permissionsDiv, _ref;
      this.body.hide();
      this.body.html('');
      if (Object.keys(this.model.get("permissions")).length === 0) {
        permissionsDiv = $("<div class='permissionsLine'> <strong>" + (t('This application does not need specific permissions')) + " </strong> </div>");
        this.body.append(permissionsDiv);
      } else {
        _ref = this.model.get("permissions");
        for (docType in _ref) {
          permission = _ref[docType];
          permissionsDiv = $("<div class='permissionsLine'> <strong> " + docType + " </strong> <p> " + permission.description + " </p> </div>");
          this.body.append(permissionsDiv);
        }
      }
      return this.body.slideDown();
    };

    PopoverPermissionsView.prototype.onCancelClicked = function() {
      var _this = this;
      return this.$el.slideUp(function() {
        return _this.cancelCallback(_this.model);
      });
    };

    PopoverPermissionsView.prototype.onConfirmClicked = function() {
      var _this = this;
      return this.$el.slideUp(function() {
        return _this.confirmCallback(_this.model);
      });
    };

    return PopoverPermissionsView;

  })(BaseView);
  
});
window.require.register("widgets/install_button", function(exports, require, module) {
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

    ColorButton.prototype.spin = function(toggle) {
      if (toggle) {
        return this.button.spin("small");
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
