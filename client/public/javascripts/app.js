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
  (function() {
    var Application, ApplicationCollection, BaseCollection,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    BaseCollection = require('lib/base_collection');

    Application = require('models/application');

    module.exports = ApplicationCollection = (function(_super) {

      __extends(ApplicationCollection, _super);

      function ApplicationCollection() {
        this.fetchFromMarket = __bind(this.fetchFromMarket, this);
        ApplicationCollection.__super__.constructor.apply(this, arguments);
      }

      ApplicationCollection.prototype.model = Application;

      ApplicationCollection.prototype.url = 'api/applications/';

      ApplicationCollection.prototype.fetchFromMarket = function(callback) {
        var apps;
        apps = [
          {
            icon: "img/bookmarks-icon.png",
            name: "bookmarks",
            slug: "bookmarks",
            git: "https://github.com/Piour/cozy-bookmarks.git",
            comment: "community contribution",
            description: "Manage your bookmark easily"
          }, {
            icon: "img/feeds-icon.png",
            name: "feeds",
            slug: "feeds",
            git: "https://github.com/Piour/cozy-feeds.git",
            comment: "community contribution",
            description: "Aggregate your feeds and save your favorite links in bookmarks."
          }, {
            icon: "img/notes-icon.png",
            name: "notes",
            slug: "notes",
            git: "https://github.com/mycozycloud/cozy-notes.git",
            comment: "official application",
            description: "Store all your notes and files."
          }, {
            icon: "img/todos-icon.png",
            name: "todos",
            slug: "todos",
            git: "https://github.com/mycozycloud/cozy-todos.git",
            comment: "official application",
            description: "Write your tasks, order them and execute them efficiently."
          }, {
            icon: "img/mails-icon.png",
            name: "mails",
            slug: "mails",
            git: "https://github.com/mycozycloud/cozy-mails.git",
            comment: "official application",
            description: "Backup your inbox and browse them from your cozy."
          }, {
            icon: "img/boonk-icon.png",
            name: "boonk",
            slug: "boonk",
            git: "https://github.com/frankrousseau/boonk.git",
            comment: "community contribution",
            description: "Aggregate your bank account data (for French citizen only)."
          }
        ];
        this.reset(apps);
        if (callback != null) return callback(null, apps);
      };

      return ApplicationCollection;

    })(BaseCollection);

  }).call(this);
  
});
window.require.register("helpers", function(exports, require, module) {
  (function() {

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
              length: 4,
              width: 3,
              radius: 5
            },
            large: {
              lines: 10,
              length: 8,
              width: 4,
              radius: 8
            },
            extralarge: {
              lines: 10,
              length: 30,
              width: 12,
              radius: 30,
              top: 30,
              left: 60
            }
          };
          if (Spinner) {
            return this.each(function() {
              var $this, spinner;
              $this = $(this);
              spinner = $this.data("spinner");
              console.log($this.data());
              console.log(spinner);
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
                  if (color) opts.color = color;
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

  }).call(this);
  
});
window.require.register("helpers/client", function(exports, require, module) {
  (function() {

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

  }).call(this);
  
});
window.require.register("helpers/timezone", function(exports, require, module) {
  (function() {

    exports.timezones = ["Africa/Abidjan", "Africa/Accra", "Africa/Addis_Ababa", "Africa/Algiers", "Africa/Asmara", "Africa/Bamako", "Africa/Bangui", "Africa/Banjul", "Africa/Bissau", "Africa/Blantyre", "Africa/Brazzaville", "Africa/Bujumbura", "Africa/Cairo", "Africa/Casablanca", "Africa/Ceuta", "Africa/Conakry", "Africa/Dakar", "Africa/Dar_es_Salaam", "Africa/Djibouti", "Africa/Douala", "Africa/El_Aaiun", "Africa/Freetown", "Africa/Gaborone", "Africa/Harare", "Africa/Johannesburg", "Africa/Kampala", "Africa/Khartoum", "Africa/Kigali", "Africa/Kinshasa", "Africa/Lagos", "Africa/Libreville", "Africa/Lome", "Africa/Luanda", "Africa/Lubumbashi", "Africa/Lusaka", "Africa/Malabo", "Africa/Maputo", "Africa/Maseru", "Africa/Mbabane", "Africa/Mogadishu", "Africa/Monrovia", "Africa/Nairobi", "Africa/Ndjamena", "Africa/Niamey", "Africa/Nouakchott", "Africa/Ouagadougou", "Africa/Porto-Novo", "Africa/Sao_Tome", "Africa/Tripoli", "Africa/Tunis", "Africa/Windhoek", "America/Adak", "America/Anchorage", "America/Anguilla", "America/Antigua", "America/Araguaina", "America/Argentina/Buenos_Aires", "America/Argentina/Catamarca", "America/Argentina/Cordoba", "America/Argentina/Jujuy", "America/Argentina/La_Rioja", "America/Argentina/Mendoza", "America/Argentina/Rio_Gallegos", "America/Argentina/Salta", "America/Argentina/San_Juan", "America/Argentina/San_Luis", "America/Argentina/Tucuman", "America/Argentina/Ushuaia", "America/Aruba", "America/Asuncion", "America/Atikokan", "America/Bahia", "America/Barbados", "America/Belem", "America/Belize", "America/Blanc-Sablon", "America/Boa_Vista", "America/Bogota", "America/Boise", "America/Cambridge_Bay", "America/Campo_Grande", "America/Cancun", "America/Caracas", "America/Cayenne", "America/Cayman", "America/Chicago", "America/Chihuahua", "America/Costa_Rica", "America/Cuiaba", "America/Curacao", "America/Danmarkshavn", "America/Dawson", "America/Dawson_Creek", "America/Denver", "America/Detroit", "America/Dominica", "America/Edmonton", "America/Eirunepe", "America/El_Salvador", "America/Fortaleza", "America/Glace_Bay", "America/Godthab", "America/Goose_Bay", "America/Grand_Turk", "America/Grenada", "America/Guadeloupe", "America/Guatemala", "America/Guayaquil", "America/Guyana", "America/Halifax", "America/Havana", "America/Hermosillo", "America/Indiana/Indianapolis", "America/Indiana/Knox", "America/Indiana/Marengo", "America/Indiana/Petersburg", "America/Indiana/Tell_City", "America/Indiana/Vevay", "America/Indiana/Vincennes", "America/Indiana/Winamac", "America/Inuvik", "America/Iqaluit", "America/Jamaica", "America/Juneau", "America/Kentucky/Louisville", "America/Kentucky/Monticello", "America/La_Paz", "America/Lima", "America/Los_Angeles", "America/Maceio", "America/Managua", "America/Manaus", "America/Martinique", "America/Matamoros", "America/Mazatlan", "America/Menominee", "America/Merida", "America/Mexico_City", "America/Miquelon", "America/Moncton", "America/Monterrey", "America/Montevideo", "America/Montreal", "America/Montserrat", "America/Nassau", "America/New_York", "America/Nipigon", "America/Nome", "America/Noronha", "America/North_Dakota/Center", "America/North_Dakota/New_Salem", "America/Ojinaga", "America/Panama", "America/Pangnirtung", "America/Paramaribo", "America/Phoenix", "America/Port-au-Prince", "America/Port_of_Spain", "America/Porto_Velho", "America/Puerto_Rico", "America/Rainy_River", "America/Rankin_Inlet", "America/Recife", "America/Regina", "America/Resolute", "America/Rio_Branco", "America/Santa_Isabel", "America/Santarem", "America/Santiago", "America/Santo_Domingo", "America/Sao_Paulo", "America/Scoresbysund", "America/St_Johns", "America/St_Kitts", "America/St_Lucia", "America/St_Thomas", "America/St_Vincent", "America/Swift_Current", "America/Tegucigalpa", "America/Thule", "America/Thunder_Bay", "America/Tijuana", "America/Toronto", "America/Tortola", "America/Vancouver", "America/Whitehorse", "America/Winnipeg", "America/Yakutat", "America/Yellowknife", "Antarctica/Casey", "Antarctica/Davis", "Antarctica/DumontDUrville", "Antarctica/Mawson", "Antarctica/McMurdo", "Antarctica/Palmer", "Antarctica/Rothera", "Antarctica/Syowa", "Antarctica/Vostok", "Asia/Aden", "Asia/Almaty", "Asia/Amman", "Asia/Anadyr", "Asia/Aqtau", "Asia/Aqtobe", "Asia/Ashgabat", "Asia/Baghdad", "Asia/Bahrain", "Asia/Baku", "Asia/Bangkok", "Asia/Beirut", "Asia/Bishkek", "Asia/Brunei", "Asia/Choibalsan", "Asia/Chongqing", "Asia/Colombo", "Asia/Damascus", "Asia/Dhaka", "Asia/Dili", "Asia/Dubai", "Asia/Dushanbe", "Asia/Gaza", "Asia/Harbin", "Asia/Ho_Chi_Minh", "Asia/Hong_Kong", "Asia/Hovd", "Asia/Irkutsk", "Asia/Jakarta", "Asia/Jayapura", "Asia/Jerusalem", "Asia/Kabul", "Asia/Kamchatka", "Asia/Karachi", "Asia/Kashgar", "Asia/Kathmandu", "Asia/Kolkata", "Asia/Krasnoyarsk", "Asia/Kuala_Lumpur", "Asia/Kuching", "Asia/Kuwait", "Asia/Macau", "Asia/Magadan", "Asia/Makassar", "Asia/Manila", "Asia/Muscat", "Asia/Nicosia", "Asia/Novokuznetsk", "Asia/Novosibirsk", "Asia/Omsk", "Asia/Oral", "Asia/Phnom_Penh", "Asia/Pontianak", "Asia/Pyongyang", "Asia/Qatar", "Asia/Qyzylorda", "Asia/Rangoon", "Asia/Riyadh", "Asia/Sakhalin", "Asia/Samarkand", "Asia/Seoul", "Asia/Shanghai", "Asia/Singapore", "Asia/Taipei", "Asia/Tashkent", "Asia/Tbilisi", "Asia/Tehran", "Asia/Thimphu", "Asia/Tokyo", "Asia/Ulaanbaatar", "Asia/Urumqi", "Asia/Vientiane", "Asia/Vladivostok", "Asia/Yakutsk", "Asia/Yekaterinburg", "Asia/Yerevan", "Atlantic/Azores", "Atlantic/Bermuda", "Atlantic/Canary", "Atlantic/Cape_Verde", "Atlantic/Faroe", "Atlantic/Madeira", "Atlantic/Reykjavik", "Atlantic/South_Georgia", "Atlantic/St_Helena", "Atlantic/Stanley", "Australia/Adelaide", "Australia/Brisbane", "Australia/Broken_Hill", "Australia/Currie", "Australia/Darwin", "Australia/Eucla", "Australia/Hobart", "Australia/Lindeman", "Australia/Lord_Howe", "Australia/Melbourne", "Australia/Perth", "Australia/Sydney", "Canada/Atlantic", "Canada/Central", "Canada/Eastern", "Canada/Mountain", "Canada/Newfoundland", "Canada/Pacific", "Europe/Amsterdam", "Europe/Andorra", "Europe/Athens", "Europe/Belgrade", "Europe/Berlin", "Europe/Brussels", "Europe/Bucharest", "Europe/Budapest", "Europe/Chisinau", "Europe/Copenhagen", "Europe/Dublin", "Europe/Gibraltar", "Europe/Helsinki", "Europe/Istanbul", "Europe/Kaliningrad", "Europe/Kiev", "Europe/Lisbon", "Europe/London", "Europe/Luxembourg", "Europe/Madrid", "Europe/Malta", "Europe/Minsk", "Europe/Monaco", "Europe/Moscow", "Europe/Oslo", "Europe/Paris", "Europe/Prague", "Europe/Riga", "Europe/Rome", "Europe/Samara", "Europe/Simferopol", "Europe/Sofia", "Europe/Stockholm", "Europe/Tallinn", "Europe/Tirane", "Europe/Uzhgorod", "Europe/Vaduz", "Europe/Vienna", "Europe/Vilnius", "Europe/Volgograd", "Europe/Warsaw", "Europe/Zaporozhye", "Europe/Zurich", "GMT", "Indian/Antananarivo", "Indian/Chagos", "Indian/Christmas", "Indian/Cocos", "Indian/Comoro", "Indian/Kerguelen", "Indian/Mahe", "Indian/Maldives", "Indian/Mauritius", "Indian/Mayotte", "Indian/Reunion", "Pacific/Apia", "Pacific/Auckland", "Pacific/Chatham", "Pacific/Easter", "Pacific/Efate", "Pacific/Enderbury", "Pacific/Fakaofo", "Pacific/Fiji", "Pacific/Funafuti", "Pacific/Galapagos", "Pacific/Gambier", "Pacific/Guadalcanal", "Pacific/Guam", "Pacific/Honolulu", "Pacific/Johnston", "Pacific/Kiritimati", "Pacific/Kosrae", "Pacific/Kwajalein", "Pacific/Majuro", "Pacific/Marquesas", "Pacific/Midway", "Pacific/Nauru", "Pacific/Niue", "Pacific/Norfolk", "Pacific/Noumea", "Pacific/Pago_Pago", "Pacific/Palau", "Pacific/Pitcairn", "Pacific/Ponape", "Pacific/Port_Moresby", "Pacific/Rarotonga", "Pacific/Saipan", "Pacific/Tahiti", "Pacific/Tarawa", "Pacific/Tongatapu", "Pacific/Truk", "Pacific/Wake", "Pacific/Wallis", "US/Alaska", "US/Arizona", "US/Central", "US/Eastern", "US/Hawaii", "US/Mountain", "US/Pacific", "UTC"];

  }).call(this);
  
});
window.require.register("initialize", function(exports, require, module) {
  (function() {
    var BrunchApplication, HomeView, MainRouter,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    BrunchApplication = require('./helpers').BrunchApplication;

    MainRouter = require('routers/main_router');

    HomeView = require('views/main');

    exports.Application = (function(_super) {

      __extends(Application, _super);

      function Application() {
        Application.__super__.constructor.apply(this, arguments);
      }

      Application.prototype.initialize = function() {
        this.initializeJQueryExtensions();
        this.routers = {};
        this.mainView = new HomeView();
        this.routers.main = new MainRouter();
        window.app = this;
        Backbone.history.start();
        if (Backbone.history.getFragment() === '') {
          return this.routers.main.navigate('home', true);
        }
      };

      return Application;

    })(BrunchApplication);

    new exports.Application;

  }).call(this);
  
});
window.require.register("lib/base_collection", function(exports, require, module) {
  (function() {
    var BaseCollection,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    module.exports = BaseCollection = (function(_super) {

      __extends(BaseCollection, _super);

      function BaseCollection() {
        BaseCollection.__super__.constructor.apply(this, arguments);
      }

      BaseCollection.prototype.parse = function(response) {
        return response.rows;
      };

      return BaseCollection;

    })(Backbone.Collection);

  }).call(this);
  
});
window.require.register("lib/base_model", function(exports, require, module) {
  (function() {
    var __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    exports.BaseModel = (function(_super) {

      __extends(BaseModel, _super);

      function BaseModel() {
        BaseModel.__super__.constructor.apply(this, arguments);
      }

      BaseModel.prototype.isNew = function() {
        return this.id === void 0;
      };

      return BaseModel;

    })(Backbone.Model);

  }).call(this);
  
});
window.require.register("lib/base_view", function(exports, require, module) {
  (function() {
    var BaseView,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    module.exports = BaseView = (function(_super) {

      __extends(BaseView, _super);

      function BaseView() {
        BaseView.__super__.constructor.apply(this, arguments);
      }

      BaseView.prototype.tagName = 'section';

      BaseView.prototype.template = function() {};

      BaseView.prototype.initialize = function() {
        return this.render();
      };

      BaseView.prototype.getRenderData = function() {
        var _ref;
        return {
          model: (_ref = this.model) != null ? _ref.toJSON() : void 0
        };
      };

      BaseView.prototype.render = function() {
        this.beforeRender();
        this.$el.html(this.template({}));
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

  }).call(this);
  
});
window.require.register("models/application", function(exports, require, module) {
  (function() {
    var Application, client,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    client = require("../helpers/client");

    module.exports = Application = (function(_super) {

      __extends(Application, _super);

      function Application() {
        this.uninstall = __bind(this.uninstall, this);
        Application.__super__.constructor.apply(this, arguments);
      }

      Application.prototype.url = '/api/applications/';

      Application.prototype.idAttribute = 'slug';

      Application.prototype.isRunning = function() {
        return this.get('state') === 'installed';
      };

      Application.prototype.isBroken = function() {
        return this.get('state') === 'broken';
      };

      Application.prototype.install = function(callbacks) {
        var _this = this;
        return client.post('/api/applications/install', this.attributes, {
          success: function(data) {
            _this.set(data.app);
            return callbacks.success(data);
          },
          error: callbacks.error
        });
      };

      Application.prototype.uninstall = function(callbacks) {
        var _this = this;
        return client.del("/api/applications/" + this.id + "/uninstall", {
          success: function(data) {
            _this.trigger('destroy', _this, _this.collection);
            return callbacks.success(data);
          },
          error: callbacks.error
        });
      };

      Application.prototype.updateApp = function(callbacks) {
        var _this = this;
        return client.put("/api/applications/" + this.id + "/update", {}, {
          success: function(data) {
            _this.set(data.app);
            return callbacks.success(data);
          },
          error: callbacks.error
        });
      };

      Application.prototype.start = function(callbacks) {
        var _this = this;
        if (this.isRunning()) return null;
        if (!(callbacks != null)) {
          callbacks = {
            success: function() {},
            error: function() {}
          };
        }
        return client.post("/api/applications/" + this.id + "/start", {}, {
          success: function(data) {
            _this.set(data.app);
            return callbacks.success(data);
          },
          error: callbacks.error
        });
      };

      Application.prototype.stop = function(callbacks) {
        var _this = this;
        if (!this.isRunning()) return null;
        if (!(callbacks != null)) {
          callbacks = {
            success: function() {},
            error: function() {}
          };
        }
        return client.post("/api/applications/" + this.id + "/stop", {}, {
          success: function(data) {
            _this.set(data.app);
            return callbacks.success(data);
          },
          error: callbacks.error
        });
      };

      return Application;

    })(Backbone.Model);

  }).call(this);
  
});
window.require.register("models/user", function(exports, require, module) {
  (function() {
    var BaseModel, User, client,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

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

  }).call(this);
  
});
window.require.register("routers/main_router", function(exports, require, module) {
  (function() {
    var MainRouter,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    module.exports = MainRouter = (function(_super) {

      __extends(MainRouter, _super);

      function MainRouter() {
        MainRouter.__super__.constructor.apply(this, arguments);
      }

      MainRouter.prototype.routes = {
        "home": "applicationList",
        "applications": "market",
        "account": "account",
        "logout": "logout",
        "apps/:slug": "application",
        "apps/:slug/*hash": "application"
      };

      MainRouter.prototype.market = function() {
        return app.mainView.displayMarket();
      };

      MainRouter.prototype.account = function() {
        return app.mainView.displayAccount();
      };

      MainRouter.prototype.applicationList = function() {
        return app.mainView.displayApplicationsList();
      };

      MainRouter.prototype.application = function(slug, hash) {
        return app.mainView.displayApplication(slug, hash);
      };

      MainRouter.prototype.logout = function() {
        return app.mainView.logout();
      };

      return MainRouter;

    })(Backbone.Router);

  }).call(this);
  
});
window.require.register("templates/account", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow) {
  var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div');
  buf.push(attrs({ 'id':('account-form'), "class": ('well') }));
  buf.push('><p>email</p><p');
  buf.push(attrs({ "class": ('field') }));
  buf.push('><a');
  buf.push(attrs({ 'id':('account-email-field') }));
  buf.push('></a></p><p>timezone</p><p');
  buf.push(attrs({ "class": ('field') }));
  buf.push('><a');
  buf.push(attrs({ 'id':('account-timezone-field') }));
  buf.push('></a></p><p>domain</p><p');
  buf.push(attrs({ "class": ('field') }));
  buf.push('><a');
  buf.push(attrs({ 'id':('account-domain-field') }));
  buf.push('></a></p><p><button');
  buf.push(attrs({ 'id':('change-password-button'), "class": ('btn') }));
  buf.push('>Change password</button></p><div');
  buf.push(attrs({ 'id':('change-password-form') }));
  buf.push('><p>Change password</p><p><label>input your current password</label><input');
  buf.push(attrs({ 'id':('account-password0-field'), 'type':("password") }));
  buf.push('/></p><p><label>fill this field to set a new password</label><input');
  buf.push(attrs({ 'id':('account-password1-field'), 'type':("password") }));
  buf.push('/></p><p><label>confirm new password</label><input');
  buf.push(attrs({ 'id':('account-password2-field'), 'type':("password") }));
  buf.push('/></p><p><button');
  buf.push(attrs({ 'id':('account-form-button'), "class": ("btn") }));
  buf.push('>Send changes</button><p');
  buf.push(attrs({ "class": ('loading-indicator') }));
  buf.push('>&nbsp;</p><div');
  buf.push(attrs({ 'id':('account-info'), "class": ('alert') + ' ' + ('main-alert') + ' ' + ('alert-success') + ' ' + ('hide') }));
  buf.push('><div');
  buf.push(attrs({ 'id':('account-info-text') }));
  buf.push('></div></div><div');
  buf.push(attrs({ 'id':('account-error'), "class": ('alert') + ' ' + ('alert-error') + ' ' + ('main-alert') + ' ' + ('hide') }));
  buf.push('><div');
  buf.push(attrs({ 'id':('account-form-error-text') }));
  buf.push('></div></div></p></div></div>');
  }
  return buf.join("");
  };
});
window.require.register("templates/application_iframe", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow) {
  var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<iframe');
  buf.push(attrs({ 'src':("apps/" + (id) + "/#" + (hash) + ""), 'id':("" + (id) + "-frame") }));
  buf.push('></iframe>');
  }
  return buf.join("");
  };
});
window.require.register("templates/home", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow) {
  var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div');
  buf.push(attrs({ 'id':('no-app-message'), "class": ('center') + ' ' + ('hidden') }));
  buf.push('><p>You have actually no application installed on your Cozy Cloud</p></div><div');
  buf.push(attrs({ 'id':('app-list') }));
  buf.push('></div><div');
  buf.push(attrs({ "class": ('app-tools') }));
  buf.push('><div');
  buf.push(attrs({ "class": ('machine-infos') }));
  buf.push('><div');
  buf.push(attrs({ "class": ('memory') }));
  buf.push('><div>Memory consumption\n(Total: <span class="total"></span>)\n</div><div');
  buf.push(attrs({ "class": ('progress') }));
  buf.push('><div');
  buf.push(attrs({ "class": ('bar') }));
  buf.push('></div></div></div><div');
  buf.push(attrs({ "class": ('disk') }));
  buf.push('><div>Disk consumption \n(total: <span class="total"></span>)\n</div><div');
  buf.push(attrs({ "class": ('progress') }));
  buf.push('><div');
  buf.push(attrs({ "class": ('bar') }));
  buf.push('></div></div></div></div><div');
  buf.push(attrs({ "class": ('btn-group') }));
  buf.push('><button');
  buf.push(attrs({ 'id':('manage-app-button'), "class": ('btn') }));
  buf.push('>manage\n</button></div></div>');
  }
  return buf.join("");
  };
});
window.require.register("templates/home_application", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow) {
  var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<a');
  buf.push(attrs({ 'href':("#apps/" + (app.slug) + "/") }));
  buf.push('><div');
  buf.push(attrs({ "class": ('application-inner') }));
  buf.push('><p><img');
  buf.push(attrs({ 'src':("") }));
  buf.push('/></p><p');
  buf.push(attrs({ "class": ('app-title') }));
  buf.push('>' + escape((interp = app.name) == null ? '' : interp) + '</p><p');
  buf.push(attrs({ "class": ('broken-notifier') }));
  buf.push('>broken app</p></div></a><div');
  buf.push(attrs({ "class": ('application-outer') + ' ' + ('center') }));
  buf.push('><div');
  buf.push(attrs({ "class": ('btn-group') }));
  buf.push('><button');
  buf.push(attrs({ "class": ('btn') + ' ' + ('remove-app') }));
  buf.push('>remove</button><button');
  buf.push(attrs({ "class": ('btn') + ' ' + ('update-app') }));
  buf.push('>update</button></div><div><button');
  buf.push(attrs({ "class": ('btn') + ' ' + ('btn-large') + ' ' + ('start-stop-btn') }));
  buf.push('>started</button></div></div>');
  }
  return buf.join("");
  };
});
window.require.register("templates/layout", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow) {
  var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<header');
  buf.push(attrs({ 'id':('header'), "class": ('navbar') }));
  buf.push('></header><div');
  buf.push(attrs({ "class": ('home-body') }));
  buf.push('><div');
  buf.push(attrs({ 'id':('app-frames') }));
  buf.push('></div><div');
  buf.push(attrs({ 'id':('content') }));
  buf.push('></div></div>');
  }
  return buf.join("");
  };
});
window.require.register("templates/market", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow) {
  var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div');
  buf.push(attrs({ 'id':('your-app') }));
  buf.push('><p>Install \n<a');
  buf.push(attrs({ 'href':("https://cozycloud.cc/make/"), 'target':("_blank") }));
  buf.push('>your app</a></p><p><label>Git URL</label><input');
  buf.push(attrs({ 'type':("text"), 'id':("app-git-field"), 'placeholder':("https://github.com/username/repository.git@branch"), "class": ("span3") }));
  buf.push('/></p><div');
  buf.push(attrs({ "class": ('error') + ' ' + ('alert') + ' ' + ('alert-error') + ' ' + ('main-alert') }));
  buf.push('></div><div');
  buf.push(attrs({ "class": ('info') + ' ' + ('alert') + ' ' + ('main-alert') }));
  buf.push('></div><button');
  buf.push(attrs({ 'id':('add-app-submit'), "class": ('btn') + ' ' + ('btn-orange') }));
  buf.push('>install</button></div><div');
  buf.push(attrs({ 'id':('app-market-list') }));
  buf.push('><div');
  buf.push(attrs({ 'id':('no-app-message'), "class": ('cozy-app') }));
  buf.push('>You have already installed everything !\n</div></div>');
  }
  return buf.join("");
  };
});
window.require.register("templates/market_application", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow) {
  var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<img');
  buf.push(attrs({ 'src':("" + (app.icon) + ""), "class": ('pull-left') }));
  buf.push('/><button');
  buf.push(attrs({ 'id':("add-" + (app.slug) + "-install"), "class": ('btn') + ' ' + ('btn-orange') }));
  buf.push('>install</button><h3>' + escape((interp = app.name) == null ? '' : interp) + '</h3><span');
  buf.push(attrs({ "class": ('comment') }));
  buf.push('>' + escape((interp = app.comment) == null ? '' : interp) + '</span><p>' + escape((interp = app.description) == null ? '' : interp) + '</p>');
  }
  return buf.join("");
  };
});
window.require.register("templates/navbar", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow) {
  var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div');
  buf.push(attrs({ "class": ('navbar-inner') + ' ' + ('clearfix') }));
  buf.push('><h2');
  buf.push(attrs({ 'id':('header-title') }));
  buf.push('><a');
  buf.push(attrs({ 'href':("http://cozycloud.cc/"), 'target':("_blank"), 'title':("home") }));
  buf.push('><img');
  buf.push(attrs({ 'src':("img/grey-logo.png"), 'alt':("Cozy Cloud Symbol") }));
  buf.push('/></a></h2><div');
  buf.push(attrs({ 'id':('buttons') }));
  buf.push('><ul');
  buf.push(attrs({ "class": ('nav') }));
  buf.push('><li');
  buf.push(attrs({ "class": ('active') }));
  buf.push('><a');
  buf.push(attrs({ 'id':('home-button'), 'href':("#home") }));
  buf.push('><i');
  buf.push(attrs({ "class": ('icon-home') }));
  buf.push('></i><span>&nbsp;Home</span></a></li><li><a');
  buf.push(attrs({ 'id':('market-button'), 'href':("#applications") }));
  buf.push('><i');
  buf.push(attrs({ "class": ('icon-plus') }));
  buf.push('></i><span>&nbsp;Apps</span></a></li><li><a');
  buf.push(attrs({ 'id':('account-button'), 'href':("#account") }));
  buf.push('><i');
  buf.push(attrs({ "class": ('icon-user') }));
  buf.push('></i><span>&nbsp;Account</span></a></li><li><a');
  buf.push(attrs({ 'id':('help-button'), 'href':("https://forum.cozycloud.cc/"), 'target':("_blank") }));
  buf.push('><i');
  buf.push(attrs({ "class": ('icon-help') }));
  buf.push('>&nbsp;</i></a></li><li><a');
  buf.push(attrs({ 'id':('logout-button'), 'href':("#logout") }));
  buf.push('><i');
  buf.push(attrs({ "class": ('icon-arrow-right') }));
  buf.push('></i></a></li></ul></div></div>');
  }
  return buf.join("");
  };
});
window.require.register("templates/navbar_app_btn", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow) {
  var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<li');
  buf.push(attrs({ "class": ('app-button') }));
  buf.push('><a');
  buf.push(attrs({ 'id':("" + (app.slug) + ""), 'href':("#apps/" + (app.slug) + "") }));
  buf.push('><img');
  buf.push(attrs({ 'src':("/apps/" + (app.slug) + "/favicon.ico") }));
  buf.push('/></a></li>');
  }
  return buf.join("");
  };
});
window.require.register("views/account", function(exports, require, module) {
  (function() {
    var BaseView, timezones,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    BaseView = require('lib/base_view');

    timezones = require('helpers/timezone').timezones;

    module.exports = exports.AccountView = (function(_super) {

      __extends(AccountView, _super);

      AccountView.prototype.id = 'account-view';

      AccountView.prototype.template = require('templates/account');

      /* Constructor
      */

      function AccountView() {
        this.displayErrors = __bind(this.displayErrors, this);
        this.onDataSubmit = __bind(this.onDataSubmit, this);
        this.closePasswordForm = __bind(this.closePasswordForm, this);
        this.onChangePasswordClicked = __bind(this.onChangePasswordClicked, this);      AccountView.__super__.constructor.call(this);
      }

      AccountView.prototype.onChangePasswordClicked = function() {
        var _this = this;
        return this.changePasswordButton.fadeOut(function() {
          return _this.changePasswordForm.fadeIn(function() {
            return _this.password1Field.focus();
          });
        });
      };

      AccountView.prototype.closePasswordForm = function() {
        var _this = this;
        return this.changePasswordForm.fadeOut(function() {
          return _this.changePasswordButton.fadeIn();
        });
      };

      AccountView.prototype.onDataSubmit = function(event) {
        var form,
          _this = this;
        this.loadingIndicator.spin();
        form = {
          password0: $("#account-password0-field").val(),
          password1: $("#account-password1-field").val(),
          password2: $("#account-password2-field").val()
        };
        this.infoAlert.hide();
        this.errorAlert.hide();
        return $.ajax({
          type: 'POST',
          url: "api/user/",
          data: form,
          success: function(data) {
            if (data.success) {
              _this.infoAlert.html(data.msg);
              _this.infoAlert.show();
              $("#account-password0-field").val(null);
              $("#account-password1-field").val(null);
              $("#account-password2-field").val(null);
            } else {
              _this.displayErrors(JSON.parse(data.responseText).msg);
            }
            return _this.loadingIndicator.spin();
          },
          error: function(data) {
            $("#account-password0-field").val(null);
            _this.displayErrors(JSON.parse(data.responseText).msg);
            return _this.loadingIndicator.spin();
          }
        });
      };

      AccountView.prototype.submitData = function(form, url) {
        var _this = this;
        if (url == null) url = 'api/user/';
        return $.ajax({
          type: 'POST',
          url: url,
          data: form,
          success: function(data) {
            var d;
            if (!data.success) {
              d = new $.Deferred;
              return d.reject(JSON.parse(data.responseText).msg);
            }
          },
          error: function(data) {
            var d;
            d = new $.Deferred;
            return d.reject(JSON.parse(data.responseText).msg);
          }
        });
      };

      /* Functions
      */

      AccountView.prototype.displayErrors = function(msgs) {
        var errorString, msg, _i, _len;
        errorString = "";
        for (_i = 0, _len = msgs.length; _i < _len; _i++) {
          msg = msgs[_i];
          errorString += msg + "<br />";
        }
        this.errorAlert.html(errorString);
        return this.errorAlert.show();
      };

      AccountView.prototype.fetchData = function() {
        var _this = this;
        return $.get("api/users/", function(data) {
          var timezone, timezoneData, timezoneIndex, _i, _len;
          _this.emailField.html(data.rows[0].email);
          timezoneIndex = {};
          _this.timezoneField.html(data.rows[0].timezone);
          timezoneData = [];
          for (_i = 0, _len = timezones.length; _i < _len; _i++) {
            timezone = timezones[_i];
            timezoneData.push({
              value: timezone,
              text: timezone
            });
          }
          _this.emailField.editable({
            url: function(params) {
              return _this.submitData({
                email: params.value
              });
            },
            type: 'text',
            send: 'always',
            value: data.rows[0].email
          });
          _this.timezoneField.editable({
            url: function(params) {
              return _this.submitData({
                timezone: params.value
              });
            },
            type: 'select',
            send: 'always',
            source: timezoneData,
            value: data.rows[0].timezone
          });
          return $.get("api/instances/", function(data) {
            var domain;
            if ((data.rows != null) && data.rows.length > 0) {
              domain = data.rows[0].domain;
            } else {
              domain = 'no.domain.set';
            }
            _this.domainField.html(domain);
            return _this.domainField.editable({
              url: function(params) {
                return _this.submitData({
                  domain: params.value
                }, 'api/instance/');
              },
              type: 'text',
              send: 'always',
              value: domain
            });
          });
        });
      };

      /* Configuration
      */

      AccountView.prototype.afterRender = function() {
        var _this = this;
        this.emailField = this.$('#account-email-field');
        this.timezoneField = this.$('#account-timezone-field');
        this.domainField = this.$('#account-domain-field');
        this.infoAlert = this.$('#account-info');
        this.infoAlert.hide();
        this.errorAlert = this.$('#account-error');
        this.errorAlert.hide();
        this.changePasswordForm = this.$('#change-password-form');
        this.changePasswordForm.hide();
        this.changePasswordButton = this.$('#change-password-button');
        this.changePasswordButton.click(this.onChangePasswordClicked);
        this.accountSubmitButton = this.$('#account-form-button');
        this.password1Field = $('#account-password1-field');
        this.password2Field = $('#account-password2-field');
        this.password1Field.keyup(function(event) {
          if (event.which === 13) return _this.password2Field.focus();
        });
        this.password2Field.keyup(function(event) {
          if (event.which === 13) return _this.onDataSubmit();
        });
        this.accountSubmitButton.click(function(event) {
          event.preventDefault();
          return _this.onDataSubmit();
        });
        this.installInfo = this.$('#add-app-modal .loading-indicator');
        this.errorAlert.hide();
        this.infoAlert.hide();
        this.addApplicationCloseCross = this.$('#add-app-modal .close');
        this.addApplicationCloseCross.click(this.onCloseAddAppClicked);
        this.loadingIndicator = this.$('.loading-indicator');
        return this.fetchData();
      };

      return AccountView;

    })(BaseView);

  }).call(this);
  
});
window.require.register("views/home", function(exports, require, module) {
  (function() {
    var ApplicationRow, ApplicationsListView, BaseView, client,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    BaseView = require('lib/base_view');

    client = require('helpers/client');

    ApplicationRow = require('views/home_application');

    String.prototype.startsWith = function(prefix) {
      return this.indexOf(prefix, 0) === 0;
    };

    String.prototype.endsWith = function(suffix) {
      return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };

    module.exports = ApplicationsListView = (function(_super) {

      __extends(ApplicationsListView, _super);

      ApplicationsListView.prototype.id = 'applications-view';

      ApplicationsListView.prototype.template = require('templates/home');

      ApplicationsListView.prototype.events = {
        'click #add-app-button': 'onAddClicked',
        'click #manage-app-button': 'onManageAppsClicked'
      };

      /* Constructor
      */

      function ApplicationsListView(apps) {
        this.onManageAppsClicked = __bind(this.onManageAppsClicked, this);
        this.onAddClicked = __bind(this.onAddClicked, this);
        this.onAppRemoved = __bind(this.onAppRemoved, this);
        this.addApplication = __bind(this.addApplication, this);
        this.onApplicationListReady = __bind(this.onApplicationListReady, this);
        this.afterRender = __bind(this.afterRender, this);      this.apps = apps;
        this.isManaging = false;
        ApplicationsListView.__super__.constructor.call(this);
      }

      ApplicationsListView.prototype.afterRender = function() {
        this.appList = this.$("#app-list");
        this.manageAppsButton = this.$("#manage-app-button");
        this.addApplicationButton = this.$("#add-app-button");
        this.infoAlert = this.$("#add-app-form .info");
        this.errorAlert = this.$("#add-app-form .error");
        this.machineInfos = this.$(".machine-infos");
        this.machineInfos.hide();
        this.noAppMessage = this.$('#no-app-message');
        if (this.apps.length > 0) onApplicationListReady(this.apps);
        this.apps.bind('reset', this.onApplicationListReady);
        this.apps.bind('add', this.addApplication);
        return this.apps.bind('remove', this.onAppRemoved);
      };

      /* Collection Listeners
      */

      ApplicationsListView.prototype.onApplicationListReady = function(apps) {
        this.appList.html(null);
        if (apps.length === 0) {
          return this.noAppMessage.show();
        } else {
          return apps.forEach(this.addApplication);
        }
      };

      ApplicationsListView.prototype.addApplication = function(application) {
        var appButton, row;
        row = new ApplicationRow(application);
        this.appList.append(row.el);
        appButton = this.$(row.el);
        appButton.hide().fadeIn();
        if (this.isManaging) {
          appButton.find(".application-outer").css('display', 'block');
        }
        return this.noAppMessage.hide();
      };

      ApplicationsListView.prototype.onAppRemoved = function(slug) {
        if (this.apps.length === 0) return this.noAppMessage.show();
      };

      /* Listeners
      */

      ApplicationsListView.prototype.onAddClicked = function(event) {
        event.preventDefault();
        return typeof app !== "undefined" && app !== null ? app.routers.main.navigate('market', true) : void 0;
      };

      ApplicationsListView.prototype.onManageAppsClicked = function(event) {
        var _this = this;
        event.preventDefault();
        if (!this.machineInfos.is(':visible')) {
          this.$('.application-outer').show();
          this.machineInfos.find('.progress').spin();
          this.manageAppsButton.addClass('pressed');
          client.get('api/sys-data', {
            success: function(data) {
              _this.machineInfos.find('.progress').spin();
              _this.displayMemory(data.freeMem, data.totalMem);
              return _this.displayDiskSpace(data.usedDiskSpace, data.totalDiskSpace);
            },
            error: function() {
              _this.machineInfos.find('.progress').spin();
              return alert('Server error occured, infos cannot be displayed.');
            }
          });
        } else {
          this.$('.application-outer').hide();
          this.manageAppsButton.removeClass('pressed');
        }
        this.machineInfos.toggle();
        return this.isManaging = !this.isManaging;
      };

      ApplicationsListView.prototype.displayMemory = function(freeMem, totalMem) {
        var total, usedMemory;
        total = Math.floor(totalMem / 1024) + "Mo";
        this.machineInfos.find('.memory .total').html(total);
        usedMemory = ((totalMem - freeMem) / totalMem) * 100;
        return this.machineInfos.find('.memory .bar').css('width', usedMemory + '%');
      };

      ApplicationsListView.prototype.displayDiskSpace = function(usedSpace, totalSpace) {
        this.machineInfos.find('.disk .total').html(totalSpace + "Go");
        return this.machineInfos.find('.disk .bar').css('width', usedSpace + '%');
      };

      return ApplicationsListView;

    })(BaseView);

  }).call(this);
  
});
window.require.register("views/home_application", function(exports, require, module) {
  (function() {
    var ApplicationRow, BaseView, ColorButton,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    BaseView = require('lib/base_view');

    ColorButton = require('widgets/install_button');

    module.exports = ApplicationRow = (function(_super) {

      __extends(ApplicationRow, _super);

      ApplicationRow.prototype.className = "application";

      ApplicationRow.prototype.tagName = "div";

      ApplicationRow.prototype.template = function() {
        return require('templates/home_application')({
          'app': this.app.attributes
        });
      };

      ApplicationRow.prototype.events = {
        "click .application-inner": "onAppClicked",
        "click .remove-app": "onRemoveClicked",
        "click .update-app": "onUpdateClicked",
        "click .start-stop-btn": "onStartStopClicked"
      };

      /* Constructor
      */

      function ApplicationRow(app) {
        this.app = app;
        this.launchApp = __bind(this.launchApp, this);
        this.onStartStopClicked = __bind(this.onStartStopClicked, this);
        this.onUpdateClicked = __bind(this.onUpdateClicked, this);
        this.onRemoveClicked = __bind(this.onRemoveClicked, this);
        this.onAppClicked = __bind(this.onAppClicked, this);
        this.onAppChanged = __bind(this.onAppChanged, this);
        this.remove = __bind(this.remove, this);
        this.afterRender = __bind(this.afterRender, this);
        this.id = "app-btn-" + this.app.id;
        ApplicationRow.__super__.constructor.call(this);
      }

      ApplicationRow.prototype.afterRender = function() {
        this.el.id = this.app.id;
        this.updateButton = new ColorButton(this.$(".update-app"));
        this.removeButton = new ColorButton(this.$(".remove-app"));
        this.startStopBtn = new ColorButton(this.$(".start-stop-btn"));
        this.app.on('change', this.onAppChanged);
        return this.onAppChanged(this.app);
      };

      ApplicationRow.prototype.remove = function() {
        this.app.unbind('change');
        return ApplicationRow.__super__.remove.call(this);
      };

      /* Listener
      */

      ApplicationRow.prototype.onAppChanged = function(app) {
        if (app.isBroken()) {
          this.$el.addClass("broken");
          return this.startStopBtn.hide();
        } else if (app.isRunning()) {
          this.$('img').attr('src', "apps/" + app.id + "/icons/main_icon.png");
          return this.startStopBtn.displayGrey('stop this app');
        } else {
          this.$('img').attr('src', "img/stopped.png");
          return this.startStopBtn.displayGrey('start this app');
        }
      };

      ApplicationRow.prototype.onAppClicked = function(event) {
        event.preventDefault();
        if (this.app.isRunning()) {
          return this.launchApp();
        } else {
          return this.app.start({
            success: this.launchApp
          });
        }
      };

      ApplicationRow.prototype.onRemoveClicked = function(event) {
        event.preventDefault();
        return this.removeApp();
      };

      ApplicationRow.prototype.onUpdateClicked = function(event) {
        event.preventDefault();
        return this.updateApp();
      };

      ApplicationRow.prototype.onStartStopClicked = function(event) {
        var _this = this;
        event.preventDefault();
        this.startStopBtn.spin();
        if (this.app.isRunning()) {
          return this.app.stop({
            success: function() {
              return _this.startStopBtn.spin();
            },
            error: function() {
              return _this.startStopBtn.spin();
            }
          });
        } else {
          return this.app.start({
            success: function() {
              return _this.startStopBtn.spin();
            },
            error: function() {
              return _this.startStopBtn.spin();
            }
          });
        }
      };

      /* Functions
      */

      ApplicationRow.prototype.launchApp = function() {
        return window.app.routers.main.navigate("apps/" + this.app.id, true);
      };

      ApplicationRow.prototype.removeApp = function() {
        var _this = this;
        this.removeButton.displayGrey("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
        this.removeButton.spin("small");
        return this.app.uninstall({
          success: function() {
            _this.removeButton.displayGreen("Removed");
            return setTimeout(function() {
              return _this.$el.fadeOut(function() {
                return _this.remove();
              });
            }, 1000);
          },
          error: function() {
            return _this.removeButton.displayRed("failed");
          }
        });
      };

      ApplicationRow.prototype.updateApp = function() {
        var _this = this;
        this.updateButton.displayGrey("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
        this.updateButton.spin();
        return this.app.updateApp({
          success: function() {
            return _this.updateButton.displayGreen("Updated");
          },
          error: function() {
            return _this.updateButton.displayRed("failed");
          }
        });
      };

      return ApplicationRow;

    })(BaseView);

  }).call(this);
  
});
window.require.register("views/main", function(exports, require, module) {
  (function() {
    var AccountView, AppCollection, ApplicationsListView, BaseView, HomeView, MarketView, NavbarView, User, appIframeTemplate,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    BaseView = require('lib/base_view');

    appIframeTemplate = require('templates/application_iframe');

    AppCollection = require('collections/application');

    NavbarView = require('views/navbar');

    AccountView = require('views/account');

    MarketView = require('views/market');

    ApplicationsListView = require('views/home');

    User = require('models/user');

    module.exports = HomeView = (function(_super) {

      __extends(HomeView, _super);

      HomeView.prototype.el = 'body';

      HomeView.prototype.template = require('templates/layout');

      function HomeView() {
        this.resetLayoutSizes = __bind(this.resetLayoutSizes, this);
        this.onAppHashChanged = __bind(this.onAppHashChanged, this);
        this.displayAccount = __bind(this.displayAccount, this);
        this.displayMarket = __bind(this.displayMarket, this);
        this.displayApplicationsList = __bind(this.displayApplicationsList, this);
        this.displayView = __bind(this.displayView, this);
        this.logout = __bind(this.logout, this);
        this.afterRender = __bind(this.afterRender, this);      this.apps = new AppCollection();
        HomeView.__super__.constructor.call(this);
      }

      HomeView.prototype.afterRender = function() {
        this.navbar = new NavbarView(this.apps);
        this.applicationListView = new ApplicationsListView(this.apps);
        this.accountView = new AccountView();
        this.marketView = new MarketView(this.apps);
        this.frames = this.$('#app-frames');
        this.content = this.$('#content');
        this.favicon = this.$('fav1');
        this.favicon2 = this.$('fav2');
        this.resetLayoutSizes();
        $(window).resize(this.resetLayoutSizes);
        this.apps.fetch();
        return this.resetLayoutSizes();
      };

      /* Functions
      */

      HomeView.prototype.logout = function(event) {
        var user,
          _this = this;
        user = new User();
        user.logout({
          success: function(data) {
            return window.location.reload();
          },
          error: function() {
            return alert("Server error occured, logout failed.");
          }
        });
        return event.preventDefault();
      };

      HomeView.prototype.displayView = function(view) {
        if (this.currentView != null) this.currentView.$el.detach();
        this.content.show();
        this.frames.hide();
        this.content.append(view.$el);
        this.currentView = view;
        return this.changeFavicon("favicon.ico");
      };

      HomeView.prototype.displayApplicationsList = function() {
        this.displayView(this.applicationListView);
        this.navbar.selectButton("home-button");
        return window.document.title = "Cozy - Home";
      };

      HomeView.prototype.displayMarket = function() {
        this.displayView(this.marketView);
        this.navbar.selectButton("market-button");
        return window.document.title = "Cozy - Market";
      };

      HomeView.prototype.displayAccount = function() {
        this.displayView(this.accountView);
        this.navbar.selectButton("account-button");
        return window.document.title = "Cozy - Account";
      };

      HomeView.prototype.displayApplication = function(slug, hash) {
        var frame, name, once,
          _this = this;
        if (this.apps.length === 0) {
          once = function() {
            _this.apps.off('reset', once);
            return _this.displayApplication(slug, hash);
          };
          this.apps.on('reset', once);
          return null;
        }
        this.frames.show();
        this.content.hide();
        frame = this.$("#" + slug + "-frame");
        if (frame.length === 0) frame = this.createApplicationIframe(slug, hash);
        this.$("#app-frames").find("iframe").hide();
        frame.show();
        this.navbar.selectButton(slug);
        this.selectedApp = slug;
        name = this.apps.get(slug).get('name');
        if (!(name != null)) name = '';
        window.document.title = "Cozy - " + name;
        return this.changeFavicon("/apps/" + slug + "/favicon.ico");
      };

      HomeView.prototype.createApplicationIframe = function(slug, hash) {
        var frame,
          _this = this;
        if (hash == null) hash = "";
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
        return frame;
      };

      HomeView.prototype.onAppHashChanged = function(slug, newhash) {
        if (slug === this.selectedApp) {
          return typeof app !== "undefined" && app !== null ? app.routers.main.navigate("/apps/" + slug + "/" + newhash, false) : void 0;
        }
      };

      HomeView.prototype.changeFavicon = function(url) {
        var newfav, _ref, _ref2;
        if ((_ref = this.favicon) != null) _ref.remove();
        if ((_ref2 = this.favicon2) != null) _ref2.remove();
        newfav = '<link rel="icon" type="image/x-icon" href="' + url + '" />"';
        this.favicon = $(newfav);
        this.favicon2 = this.favicon.clone().attr('rel', 'shortcut icon');
        return $('head').append(this.favicon, this.favicon2);
      };

      /* Configuration
      */

      HomeView.prototype.resetLayoutSizes = function() {
        var header;
        header = this.$("#header");
        this.frames.height($(window).height() - header.height());
        return this.content.height($(window).height() - header.height());
      };

      return HomeView;

    })(BaseView);

  }).call(this);
  
});
window.require.register("views/market", function(exports, require, module) {
  (function() {
    var AppCollection, Application, ApplicationRow, BaseView, ColorButton, MarketView, REPOREGEX, slugify,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    BaseView = require('lib/base_view');

    ApplicationRow = require('views/market_application');

    ColorButton = require('widgets/install_button');

    AppCollection = require('collections/application');

    Application = require('models/application');

    slugify = require('helpers').slugify;

    REPOREGEX = /^(https?:\/\/)?([\da-z\.-]+\.[a-z\.]{2,6})([\/\w\.-]*)*(?:\.git)?(@[\da-z\/-]+)?$/;

    module.exports = MarketView = (function(_super) {

      __extends(MarketView, _super);

      MarketView.prototype.id = 'market-view';

      MarketView.prototype.template = require('templates/market');

      MarketView.prototype.events = {
        'keyup #app-git-field': 'onEnterPressed',
        'click #add-app-submit': 'onInstallClicked'
      };

      /* Constructor
      */

      function MarketView(installedApps) {
        this.resetForm = __bind(this.resetForm, this);
        this.hideError = __bind(this.hideError, this);
        this.displayError = __bind(this.displayError, this);
        this.displayInfo = __bind(this.displayInfo, this);
        this.runInstallation = __bind(this.runInstallation, this);
        this.onInstallClicked = __bind(this.onInstallClicked, this);
        this.onEnterPressed = __bind(this.onEnterPressed, this);
        this.addApplication = __bind(this.addApplication, this);
        this.onAppListsChanged = __bind(this.onAppListsChanged, this);
        this.afterRender = __bind(this.afterRender, this);      this.isInstalling = false;
        this.marketApps = new AppCollection();
        this.displayApps = new AppCollection();
        this.installedApps = installedApps;
        MarketView.__super__.constructor.call(this);
      }

      MarketView.prototype.afterRender = function() {
        this.appList = this.$('#app-market-list');
        this.appGitField = this.$("#app-git-field");
        this.installInfo = this.$("#add-app-modal .loading-indicator");
        this.infoAlert = this.$("#your-app .info");
        this.infoAlert.hide();
        this.errorAlert = this.$("#your-app .error");
        this.errorAlert.hide();
        this.noAppMessage = this.$('#no-app-message');
        this.installAppButton = new ColorButton(this.$("#add-app-submit"));
        this.installedApps.bind('reset', this.onAppListsChanged);
        this.installedApps.bind('add', this.onAppListsChanged);
        this.installedApps.bind('remove', this.onAppListsChanged);
        this.marketApps.bind('reset', this.onAppListsChanged);
        return this.marketApps.fetchFromMarket();
      };

      MarketView.prototype.onAppListsChanged = function() {
        var noApp,
          _this = this;
        this.appList.html(null);
        noApp = true;
        this.marketApps.each(function(marketApp) {
          if (_this.installedApps.pluck('slug').indexOf(marketApp.get('slug')) === -1) {
            noApp = false;
            return _this.addApplication(marketApp);
          }
        });
        return this.noAppMessage.toggle(!noApp);
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
        if (event.which === 13) return this.onInstallClicked();
      };

      MarketView.prototype.onInstallClicked = function(event) {
        var data;
        data = {
          git: this.$("#app-git-field").val()
        };
        this.runInstallation(data, this.installAppButton);
        event.preventDefault();
        return false;
      };

      MarketView.prototype.runInstallation = function(appDescriptor, button) {
        var parsed, toInstall,
          _this = this;
        if (this.isInstalling) return true;
        if (button.isGreen()) return true;
        this.isInstalling = true;
        this.hideError();
        button.displayOrange("install");
        parsed = this.parseGitUrl(appDescriptor.git);
        if (!parsed.error) {
          this.errorAlert.hide();
          button.button.html("&nbsp;&nbsp;&nbsp;&nbsp;");
          button.spin();
          toInstall = new Application(parsed);
          return toInstall.install({
            success: function(data) {
              if (((data.state != null) === "broken") || !data.success) {
                _this.installedApps.add(toInstall);
                button.spin();
                button.displayRed("Install failed");
                return _this.isInstalling = false;
              } else {
                _this.installedApps.add(toInstall);
                button.spin();
                button.displayGreen("Install succeeded!");
                _this.isInstalling = false;
                _this.resetForm();
                return typeof app !== "undefined" && app !== null ? app.routers.main.navigate('home', true) : void 0;
              }
            },
            error: function(data) {
              _this.isInstalling = false;
              button.displayRed("Install failed");
              return button.spin();
            }
          });
        } else {
          this.isInstalling = false;
          return this.displayError(parsed.msg);
        }
      };

      MarketView.prototype.parseGitUrl = function(url) {
        var branch, domain, error, git, name, out, parsed, parts, path, proto, slug;
        url = url.replace('git@github.com:', 'https://github.com/');
        url = url.replace('git://', 'https://');
        parsed = REPOREGEX.exec(url);
        if (parsed == null) {
          error = {
            error: true,
            msg: "Git url should be of form https://.../my-repo.git"
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
        if (branch != null) branch = branch.substring(1);
        out = {
          git: git,
          name: name,
          slug: slug
        };
        if (branch != null) out.branch = branch;
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
        this.installAppButton.displayOrange("install");
        return this.appGitField.val('');
      };

      return MarketView;

    })(BaseView);

  }).call(this);
  
});
window.require.register("views/market_application", function(exports, require, module) {
  (function() {
    var ApplicationRow, BaseView, ColorButton,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    BaseView = require('lib/base_view');

    ColorButton = require('widgets/install_button');

    module.exports = ApplicationRow = (function(_super) {

      __extends(ApplicationRow, _super);

      ApplicationRow.prototype.tagName = "div";

      ApplicationRow.prototype.className = "cozy-app";

      ApplicationRow.prototype.template = function() {
        return require('templates/market_application')({
          app: this.app.attributes
        });
      };

      function ApplicationRow(app, marketView) {
        this.app = app;
        this.marketView = marketView;
        this.onInstallClicked = __bind(this.onInstallClicked, this);
        this.afterRender = __bind(this.afterRender, this);
        this.events = {};
        this.events["click #add-" + this.app.id + "-install"] = 'onInstallClicked';
        ApplicationRow.__super__.constructor.call(this);
      }

      ApplicationRow.prototype.afterRender = function() {
        return this.installButton = new ColorButton(this.$("#add-" + this.app.id + "-install"));
      };

      ApplicationRow.prototype.onInstallClicked = function() {
        return this.marketView.runInstallation(this.app.attributes, this.installButton);
      };

      return ApplicationRow;

    })(BaseView);

  }).call(this);
  
});
window.require.register("views/navbar", function(exports, require, module) {
  (function() {
    var BaseView, NavbarView, appButtonTemplate,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    BaseView = require('lib/base_view');

    appButtonTemplate = require("templates/navbar_app_btn");

    module.exports = NavbarView = (function(_super) {

      __extends(NavbarView, _super);

      NavbarView.prototype.el = '#header';

      NavbarView.prototype.template = require('templates/navbar');

      function NavbarView(apps) {
        this.onAppRemoved = __bind(this.onAppRemoved, this);
        this.addApplication = __bind(this.addApplication, this);
        this.onApplicationChanged = __bind(this.onApplicationChanged, this);
        this.onApplicationListReady = __bind(this.onApplicationListReady, this);
        this.afterRender = __bind(this.afterRender, this);      this.apps = apps;
        NavbarView.__super__.constructor.call(this);
      }

      NavbarView.prototype.afterRender = function() {
        this.buttons = this.$('#buttons');
        this.$('#help-button').tooltip({
          placement: 'bottom',
          title: 'Questions and help forum'
        });
        this.$('#logout-button').tooltip({
          placement: 'bottom',
          title: 'Sign out'
        });
        if (this.apps.length > 0) onApplicationListReady(this.apps);
        this.apps.bind('reset', this.onApplicationListReady);
        this.apps.bind('change', this.onApplicationChanged);
        this.apps.bind('add', this.addApplication);
        return this.apps.bind('remove', this.onAppRemoved);
      };

      NavbarView.prototype.onApplicationListReady = function(apps) {
        this.$(".app-button").remove();
        return apps.forEach(this.onApplicationChanged);
      };

      NavbarView.prototype.onApplicationChanged = function(app) {
        if (app.isRunning()) {
          if (!this.buttons.find("#" + app.id).length) {
            return this.addApplication(app);
          }
        } else {
          return this.onAppRemoved(app);
        }
      };

      NavbarView.prototype.addApplication = function(app) {
        var button;
        this.buttons.find(".nav:last").prepend(appButtonTemplate({
          app: app.attributes
        }));
        button = this.buttons.find("#" + app.id);
        return button.tooltip({
          placement: 'bottom',
          title: '<a target="' + app.id + '" href="/apps/' + app.id + '/">open in a new tab</a>',
          delay: {
            show: 500,
            hide: 1000
          }
        });
      };

      NavbarView.prototype.onAppRemoved = function(app) {
        return this.buttons.find("#" + app.id).remove();
      };

      NavbarView.prototype.selectButton = function(button) {
        button = this.$("#" + button);
        this.buttons.find("li").removeClass("active");
        return button.parent().addClass("active");
      };

      return NavbarView;

    })(BaseView);

  }).call(this);
  
});
window.require.register("widgets/install_button", function(exports, require, module) {
  (function() {
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

      ColorButton.prototype.isGreen = function() {
        return this.button.hasClass("btn-green");
      };

      ColorButton.prototype.spin = function() {
        return this.button.spin("small");
      };

      ColorButton.prototype.isHidden = function() {
        return !this.button.is(":visible");
      };

      return ColorButton;

    })();

  }).call(this);
  
});
