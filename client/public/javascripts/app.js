(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return hasOwnProperty.call(object, name);
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
      return require(absolute);
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

  var define = function(bundle) {
    for (var key in bundle) {
      if (has(bundle, key)) {
        modules[key] = bundle[key];
      }
    }
  }

  globals.require = require;
  globals.require.define = define;
  globals.require.brunch = true;
})();

window.require.define({"collections/application": function(exports, require, module) {
  (function() {
    var Application, BaseCollection,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    BaseCollection = require("collections/collections").BaseCollection;

    Application = require("models/application").Application;

    exports.ApplicationCollection = (function(_super) {

      __extends(ApplicationCollection, _super);

      ApplicationCollection.prototype.model = Application;

      ApplicationCollection.prototype.url = 'api/applications/';

      function ApplicationCollection(view) {
        this.view = view;
        this.onAdd = __bind(this.onAdd, this);
        this.onReset = __bind(this.onReset, this);
        ApplicationCollection.__super__.constructor.call(this);
        this.bind('reset', this.onReset);
        this.bind('add', this.onAdd);
      }

      ApplicationCollection.prototype.onReset = function() {
        var _this = this;
        this.view.clearApps();
        return this.forEach(function(app) {
          return _this.view.addApplication(app);
        });
      };

      ApplicationCollection.prototype.onAdd = function(app) {
        return this.view.addApplication(app);
      };

      return ApplicationCollection;

    })(BaseCollection);

  }).call(this);
  
}});

window.require.define({"collections/collections": function(exports, require, module) {
  (function() {
    var __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    exports.BaseCollection = (function(_super) {

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
  
}});

window.require.define({"helpers": function(exports, require, module) {
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
  
}});

window.require.define({"helpers/client": function(exports, require, module) {
  (function() {

    exports.get = function(url, callbacks) {
      var _this = this;
      return $.ajax({
        type: 'GET',
        url: url,
        success: function(response) {
          if (response.success) {
            return callbacks.success(response);
          } else {
            return callbacks.error(response);
          }
        },
        error: function(response) {
          return callbacks.error(response);
        }
      });
    };

    exports.post = function(url, data, callbacks) {
      var _this = this;
      return $.ajax({
        type: 'POST',
        url: url,
        data: data,
        success: function(response) {
          if (response.success) {
            return callbacks.success(response);
          } else {
            return callbacks.error(response);
          }
        },
        error: function(response) {
          return callbacks.error(response);
        }
      });
    };

  }).call(this);
  
}});

window.require.define({"helpers/timezone": function(exports, require, module) {
  (function() {

    exports.timezones = ["Africa/Abidjan", "Africa/Accra", "Africa/Addis_Ababa", "Africa/Algiers", "Africa/Asmara", "Africa/Bamako", "Africa/Bangui", "Africa/Banjul", "Africa/Bissau", "Africa/Blantyre", "Africa/Brazzaville", "Africa/Bujumbura", "Africa/Cairo", "Africa/Casablanca", "Africa/Ceuta", "Africa/Conakry", "Africa/Dakar", "Africa/Dar_es_Salaam", "Africa/Djibouti", "Africa/Douala", "Africa/El_Aaiun", "Africa/Freetown", "Africa/Gaborone", "Africa/Harare", "Africa/Johannesburg", "Africa/Kampala", "Africa/Khartoum", "Africa/Kigali", "Africa/Kinshasa", "Africa/Lagos", "Africa/Libreville", "Africa/Lome", "Africa/Luanda", "Africa/Lubumbashi", "Africa/Lusaka", "Africa/Malabo", "Africa/Maputo", "Africa/Maseru", "Africa/Mbabane", "Africa/Mogadishu", "Africa/Monrovia", "Africa/Nairobi", "Africa/Ndjamena", "Africa/Niamey", "Africa/Nouakchott", "Africa/Ouagadougou", "Africa/Porto-Novo", "Africa/Sao_Tome", "Africa/Tripoli", "Africa/Tunis", "Africa/Windhoek", "America/Adak", "America/Anchorage", "America/Anguilla", "America/Antigua", "America/Araguaina", "America/Argentina/Buenos_Aires", "America/Argentina/Catamarca", "America/Argentina/Cordoba", "America/Argentina/Jujuy", "America/Argentina/La_Rioja", "America/Argentina/Mendoza", "America/Argentina/Rio_Gallegos", "America/Argentina/Salta", "America/Argentina/San_Juan", "America/Argentina/San_Luis", "America/Argentina/Tucuman", "America/Argentina/Ushuaia", "America/Aruba", "America/Asuncion", "America/Atikokan", "America/Bahia", "America/Barbados", "America/Belem", "America/Belize", "America/Blanc-Sablon", "America/Boa_Vista", "America/Bogota", "America/Boise", "America/Cambridge_Bay", "America/Campo_Grande", "America/Cancun", "America/Caracas", "America/Cayenne", "America/Cayman", "America/Chicago", "America/Chihuahua", "America/Costa_Rica", "America/Cuiaba", "America/Curacao", "America/Danmarkshavn", "America/Dawson", "America/Dawson_Creek", "America/Denver", "America/Detroit", "America/Dominica", "America/Edmonton", "America/Eirunepe", "America/El_Salvador", "America/Fortaleza", "America/Glace_Bay", "America/Godthab", "America/Goose_Bay", "America/Grand_Turk", "America/Grenada", "America/Guadeloupe", "America/Guatemala", "America/Guayaquil", "America/Guyana", "America/Halifax", "America/Havana", "America/Hermosillo", "America/Indiana/Indianapolis", "America/Indiana/Knox", "America/Indiana/Marengo", "America/Indiana/Petersburg", "America/Indiana/Tell_City", "America/Indiana/Vevay", "America/Indiana/Vincennes", "America/Indiana/Winamac", "America/Inuvik", "America/Iqaluit", "America/Jamaica", "America/Juneau", "America/Kentucky/Louisville", "America/Kentucky/Monticello", "America/La_Paz", "America/Lima", "America/Los_Angeles", "America/Maceio", "America/Managua", "America/Manaus", "America/Martinique", "America/Matamoros", "America/Mazatlan", "America/Menominee", "America/Merida", "America/Mexico_City", "America/Miquelon", "America/Moncton", "America/Monterrey", "America/Montevideo", "America/Montreal", "America/Montserrat", "America/Nassau", "America/New_York", "America/Nipigon", "America/Nome", "America/Noronha", "America/North_Dakota/Center", "America/North_Dakota/New_Salem", "America/Ojinaga", "America/Panama", "America/Pangnirtung", "America/Paramaribo", "America/Phoenix", "America/Port-au-Prince", "America/Port_of_Spain", "America/Porto_Velho", "America/Puerto_Rico", "America/Rainy_River", "America/Rankin_Inlet", "America/Recife", "America/Regina", "America/Resolute", "America/Rio_Branco", "America/Santa_Isabel", "America/Santarem", "America/Santiago", "America/Santo_Domingo", "America/Sao_Paulo", "America/Scoresbysund", "America/St_Johns", "America/St_Kitts", "America/St_Lucia", "America/St_Thomas", "America/St_Vincent", "America/Swift_Current", "America/Tegucigalpa", "America/Thule", "America/Thunder_Bay", "America/Tijuana", "America/Toronto", "America/Tortola", "America/Vancouver", "America/Whitehorse", "America/Winnipeg", "America/Yakutat", "America/Yellowknife", "Antarctica/Casey", "Antarctica/Davis", "Antarctica/DumontDUrville", "Antarctica/Mawson", "Antarctica/McMurdo", "Antarctica/Palmer", "Antarctica/Rothera", "Antarctica/Syowa", "Antarctica/Vostok", "Asia/Aden", "Asia/Almaty", "Asia/Amman", "Asia/Anadyr", "Asia/Aqtau", "Asia/Aqtobe", "Asia/Ashgabat", "Asia/Baghdad", "Asia/Bahrain", "Asia/Baku", "Asia/Bangkok", "Asia/Beirut", "Asia/Bishkek", "Asia/Brunei", "Asia/Choibalsan", "Asia/Chongqing", "Asia/Colombo", "Asia/Damascus", "Asia/Dhaka", "Asia/Dili", "Asia/Dubai", "Asia/Dushanbe", "Asia/Gaza", "Asia/Harbin", "Asia/Ho_Chi_Minh", "Asia/Hong_Kong", "Asia/Hovd", "Asia/Irkutsk", "Asia/Jakarta", "Asia/Jayapura", "Asia/Jerusalem", "Asia/Kabul", "Asia/Kamchatka", "Asia/Karachi", "Asia/Kashgar", "Asia/Kathmandu", "Asia/Kolkata", "Asia/Krasnoyarsk", "Asia/Kuala_Lumpur", "Asia/Kuching", "Asia/Kuwait", "Asia/Macau", "Asia/Magadan", "Asia/Makassar", "Asia/Manila", "Asia/Muscat", "Asia/Nicosia", "Asia/Novokuznetsk", "Asia/Novosibirsk", "Asia/Omsk", "Asia/Oral", "Asia/Phnom_Penh", "Asia/Pontianak", "Asia/Pyongyang", "Asia/Qatar", "Asia/Qyzylorda", "Asia/Rangoon", "Asia/Riyadh", "Asia/Sakhalin", "Asia/Samarkand", "Asia/Seoul", "Asia/Shanghai", "Asia/Singapore", "Asia/Taipei", "Asia/Tashkent", "Asia/Tbilisi", "Asia/Tehran", "Asia/Thimphu", "Asia/Tokyo", "Asia/Ulaanbaatar", "Asia/Urumqi", "Asia/Vientiane", "Asia/Vladivostok", "Asia/Yakutsk", "Asia/Yekaterinburg", "Asia/Yerevan", "Atlantic/Azores", "Atlantic/Bermuda", "Atlantic/Canary", "Atlantic/Cape_Verde", "Atlantic/Faroe", "Atlantic/Madeira", "Atlantic/Reykjavik", "Atlantic/South_Georgia", "Atlantic/St_Helena", "Atlantic/Stanley", "Australia/Adelaide", "Australia/Brisbane", "Australia/Broken_Hill", "Australia/Currie", "Australia/Darwin", "Australia/Eucla", "Australia/Hobart", "Australia/Lindeman", "Australia/Lord_Howe", "Australia/Melbourne", "Australia/Perth", "Australia/Sydney", "Canada/Atlantic", "Canada/Central", "Canada/Eastern", "Canada/Mountain", "Canada/Newfoundland", "Canada/Pacific", "Europe/Amsterdam", "Europe/Andorra", "Europe/Athens", "Europe/Belgrade", "Europe/Berlin", "Europe/Brussels", "Europe/Bucharest", "Europe/Budapest", "Europe/Chisinau", "Europe/Copenhagen", "Europe/Dublin", "Europe/Gibraltar", "Europe/Helsinki", "Europe/Istanbul", "Europe/Kaliningrad", "Europe/Kiev", "Europe/Lisbon", "Europe/London", "Europe/Luxembourg", "Europe/Madrid", "Europe/Malta", "Europe/Minsk", "Europe/Monaco", "Europe/Moscow", "Europe/Oslo", "Europe/Paris", "Europe/Prague", "Europe/Riga", "Europe/Rome", "Europe/Samara", "Europe/Simferopol", "Europe/Sofia", "Europe/Stockholm", "Europe/Tallinn", "Europe/Tirane", "Europe/Uzhgorod", "Europe/Vaduz", "Europe/Vienna", "Europe/Vilnius", "Europe/Volgograd", "Europe/Warsaw", "Europe/Zaporozhye", "Europe/Zurich", "GMT", "Indian/Antananarivo", "Indian/Chagos", "Indian/Christmas", "Indian/Cocos", "Indian/Comoro", "Indian/Kerguelen", "Indian/Mahe", "Indian/Maldives", "Indian/Mauritius", "Indian/Mayotte", "Indian/Reunion", "Pacific/Apia", "Pacific/Auckland", "Pacific/Chatham", "Pacific/Easter", "Pacific/Efate", "Pacific/Enderbury", "Pacific/Fakaofo", "Pacific/Fiji", "Pacific/Funafuti", "Pacific/Galapagos", "Pacific/Gambier", "Pacific/Guadalcanal", "Pacific/Guam", "Pacific/Honolulu", "Pacific/Johnston", "Pacific/Kiritimati", "Pacific/Kosrae", "Pacific/Kwajalein", "Pacific/Majuro", "Pacific/Marquesas", "Pacific/Midway", "Pacific/Nauru", "Pacific/Niue", "Pacific/Norfolk", "Pacific/Noumea", "Pacific/Pago_Pago", "Pacific/Palau", "Pacific/Pitcairn", "Pacific/Ponape", "Pacific/Port_Moresby", "Pacific/Rarotonga", "Pacific/Saipan", "Pacific/Tahiti", "Pacific/Tarawa", "Pacific/Tongatapu", "Pacific/Truk", "Pacific/Wake", "Pacific/Wallis", "US/Alaska", "US/Arizona", "US/Central", "US/Eastern", "US/Hawaii", "US/Mountain", "US/Pacific", "UTC"];

  }).call(this);
  
}});

window.require.define({"initialize": function(exports, require, module) {
  (function() {
    var AccountView, ApplicationsView, BrunchApplication, HomeView, MainRouter,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    BrunchApplication = require('helpers').BrunchApplication;

    MainRouter = require('routers/main_router').MainRouter;

    HomeView = require('views/home_view').HomeView;

    AccountView = require('views/account_view').AccountView;

    ApplicationsView = require('views/applications_view').ApplicationsView;

    exports.Application = (function(_super) {

      __extends(Application, _super);

      function Application() {
        Application.__super__.constructor.apply(this, arguments);
      }

      Application.prototype.initialize = function() {
        this.initializeJQueryExtensions();
        this.routers = {};
        this.views = {};
        this.routers.main = new MainRouter();
        this.views.home = new HomeView();
        this.views.account = new AccountView();
        this.views.applications = new ApplicationsView();
        $("body").html(this.views.home.render());
        this.views.home.setListeners();
        this.views.home.fetch();
        window.app = this;
        Backbone.history.start();
        if (Backbone.history.getFragment() === '') {
          return window.app.routers.main.navigate('home', true);
        }
      };

      return Application;

    })(BrunchApplication);

    new exports.Application;

  }).call(this);
  
}});

window.require.define({"lib/request": function(exports, require, module) {
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
  
}});

window.require.define({"models/application": function(exports, require, module) {
  (function() {
    var BaseModel, client,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    BaseModel = require("models/models").BaseModel;

    client = require("lib/request");

    exports.Application = (function(_super) {

      __extends(Application, _super);

      Application.prototype.url = '/api/applications/';

      function Application(app) {
        Application.__super__.constructor.call(this);
        this.slug = app.slug;
        this.name = app.name;
        this.description = app.description;
        this.icon = app.icon;
        this.git = app.git;
        this.state = app.state;
        this;
      }

      Application.prototype.install = function(callbacks) {
        var data,
          _this = this;
        data = {
          name: this.name,
          description: this.description,
          git: this.git
        };
        return client.post('/api/applications/install', data, {
          success: function(data) {
            _this.slug = data.app.slug;
            _this.state = data.app.state;
            return callbacks.success(data.app);
          },
          error: callbacks.error
        });
      };

      Application.prototype.uninstall = function(callbacks) {
        return client.del("/api/applications/" + this.slug + "/uninstall", callbacks);
      };

      return Application;

    })(BaseModel);

  }).call(this);
  
}});

window.require.define({"models/models": function(exports, require, module) {
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
  
}});

window.require.define({"models/user": function(exports, require, module) {
  (function() {
    var BaseModel, client,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    BaseModel = require("models/models").BaseModel;

    client = require('../helpers/client');

    exports.User = (function(_super) {

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
  
}});

window.require.define({"routers/main_router": function(exports, require, module) {
  (function() {
    var __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    exports.MainRouter = (function(_super) {

      __extends(MainRouter, _super);

      function MainRouter() {
        MainRouter.__super__.constructor.apply(this, arguments);
      }

      MainRouter.prototype.routes = {
        "home": "home",
        "applications": "applications",
        "account": "account",
        "apps/:slug": "application"
      };

      MainRouter.prototype.home = function() {
        return this.applications();
      };

      MainRouter.prototype.applications = function() {
        return this.loadView(app.views.applications);
      };

      MainRouter.prototype.application = function(slug) {
        return app.views.home.loadApp(slug);
      };

      MainRouter.prototype.account = function() {
        return this.loadView(app.views.account);
      };

      MainRouter.prototype.loadView = function(view) {
        $("#content").html(view.render());
        view.fetchData();
        return view.setListeners();
      };

      return MainRouter;

    })(Backbone.Router);

  }).call(this);
  
}});

window.require.define({"templates/account": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow) {
  var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<form');
  buf.push(attrs({ 'id':('account-form'), "class": ('well') }));
  buf.push('><p><label>email</label><input');
  buf.push(attrs({ 'id':('account-email-field'), 'type':("text") }));
  buf.push('/></p><p><label>timezone</label><select');
  buf.push(attrs({ 'id':('account-timezone-field'), 'type':("text") }));
  buf.push('></select></p><p><label>fill this field to set a new password</label><input');
  buf.push(attrs({ 'id':('account-password1-field'), 'type':("password") }));
  buf.push('/></p><p><label>confirm new password</label><input');
  buf.push(attrs({ 'id':('account-password2-field'), 'type':("password") }));
  buf.push('/></p><p><button');
  buf.push(attrs({ 'id':('account-form-button'), 'type':("submit"), "class": ("btn") }));
  buf.push('>Send changes</button><span');
  buf.push(attrs({ "class": ('loading-indicator') }));
  buf.push('></span><div');
  buf.push(attrs({ 'id':('account-info'), "class": ('alert') + ' ' + ('main-alert') + ' ' + ('hide') }));
  buf.push('><div');
  buf.push(attrs({ 'id':('account-info-text') }));
  buf.push('></div></div><div');
  buf.push(attrs({ 'id':('account-error'), "class": ('alert') + ' ' + ('alert-error') + ' ' + ('main-alert') + ' ' + ('hide') }));
  buf.push('><div');
  buf.push(attrs({ 'id':('account-form-error-text') }));
  buf.push('></div></div></p></form>');
  }
  return buf.join("");
  };
}});

window.require.define({"templates/application": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow) {
  var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<a');
  buf.push(attrs({ 'href':("apps/" + (app.slug) + "/"), 'target':("_blank") }));
  buf.push('><div');
  buf.push(attrs({ "class": ('application-inner') }));
  buf.push('><p><img');
  buf.push(attrs({ 'src':("apps/" + (app.slug) + "/icons/main_icon.png") }));
  buf.push('/></p><p');
  buf.push(attrs({ "class": ('app-title') }));
  buf.push('>' + escape((interp = app.name) == null ? '' : interp) + '</p><p');
  buf.push(attrs({ "class": ('info-text') }));
  buf.push('>' + escape((interp = app.description) == null ? '' : interp) + '</p></div><div');
  buf.push(attrs({ "class": ('application-outer') + ' ' + ('center') }));
  buf.push('><button');
  buf.push(attrs({ "class": ('btn') + ' ' + ('remove-app') }));
  buf.push('>uninstall</button></div></a>');
  }
  return buf.join("");
  };
}});

window.require.define({"templates/application_button": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow) {
  var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<li');
  buf.push(attrs({ "class": ('app-button') }));
  buf.push('><a');
  buf.push(attrs({ 'id':("" + (app.slug) + "") }));
  buf.push('>' + escape((interp = app.name) == null ? '' : interp) + '</a></li>');
  }
  return buf.join("");
  };
}});

window.require.define({"templates/application_iframe": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow) {
  var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<iframe');
  buf.push(attrs({ 'src':("apps/" + (id) + "/"), 'id':("" + (id) + "-frame") }));
  buf.push('></iframe>');
  }
  return buf.join("");
  };
}});

window.require.define({"templates/applications": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow) {
  var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div');
  buf.push(attrs({ 'id':('app-list'), "class": ('clearfix') + ' ' + ('well') }));
  buf.push('><div');
  buf.push(attrs({ "class": ('clearfix') }));
  buf.push('></div></div><div');
  buf.push(attrs({ "class": ('clearfix') }));
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
  buf.push(attrs({ 'id':('add-app-button'), "class": ('btn') }));
  buf.push('><i class="icon-plus"></i>\nadd a new application\n</button><button');
  buf.push(attrs({ 'id':('manage-app-button'), "class": ('btn') }));
  buf.push('>manage applications\n</button></div></div><div');
  buf.push(attrs({ 'id':('add-app-modal'), "class": ('modal') + ' ' + ('right') + ' ' + ('hide') }));
  buf.push('><div');
  buf.push(attrs({ "class": ('modal-header') }));
  buf.push('><button');
  buf.push(attrs({ 'type':("button"), 'data-dismiss':("modal"), 'aria-hidden':("true"), "class": ('close') }));
  buf.push('>&times;\n</button><h3>Application installer</h3></div><div');
  buf.push(attrs({ 'id':('add-app-form'), "class": ('modal-body') }));
  buf.push('><p><label>name</label><input');
  buf.push(attrs({ 'type':("text"), 'id':("app-name-field"), 'maxlength':("8"), "class": ("span3") }));
  buf.push('/></p><p><label>description</label><input');
  buf.push(attrs({ 'type':("text"), 'id':("app-description-field"), 'maxlength':("40"), "class": ("span3") }));
  buf.push('/></p><p><label>Git URL</label><input');
  buf.push(attrs({ 'type':("text"), 'id':("app-git-field"), "class": ("span3") }));
  buf.push('/></p><div');
  buf.push(attrs({ "class": ('error') + ' ' + ('alert') + ' ' + ('alert-error') + ' ' + ('main-alert') }));
  buf.push('></div><div');
  buf.push(attrs({ "class": ('info') + ' ' + ('alert') + ' ' + ('main-alert') }));
  buf.push('></div></div><div');
  buf.push(attrs({ "class": ('modal-footer') }));
  buf.push('><button');
  buf.push(attrs({ "class": ('pull-left') + ' ' + ('loading-indicator') }));
  buf.push('>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</button><button');
  buf.push(attrs({ 'id':('add-app-submit'), 'type':("submit"), "class": ('btn') + ' ' + ('btn-warning') }));
  buf.push('>install</button></div></div>');
  }
  return buf.join("");
  };
}});

window.require.define({"templates/home": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow) {
  var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<header');
  buf.push(attrs({ 'id':('header'), "class": ('navbar') }));
  buf.push('><div');
  buf.push(attrs({ "class": ('navbar-inner') + ' ' + ('clearfix') }));
  buf.push('><h2');
  buf.push(attrs({ 'id':('header-title') }));
  buf.push('><a');
  buf.push(attrs({ 'href':("http://www.mycozycloud.com/"), 'target':("_blank"), 'title':("home") }));
  buf.push('>Cozy Cloud\n</a></h2><div');
  buf.push(attrs({ 'id':('buttons') }));
  buf.push('><ul');
  buf.push(attrs({ "class": ('nav') }));
  buf.push('><li');
  buf.push(attrs({ "class": ('active') }));
  buf.push('><a');
  buf.push(attrs({ 'id':('home-button') }));
  buf.push('><i');
  buf.push(attrs({ "class": ('icon-home') }));
  buf.push('></i><span>&nbsp;Home</span></a></li><li><a');
  buf.push(attrs({ 'id':('account-button') }));
  buf.push('><i');
  buf.push(attrs({ "class": ('icon-user') }));
  buf.push('></i><span>&nbsp;Account</span></a></li><li><a');
  buf.push(attrs({ 'id':('logout-button') }));
  buf.push('><span>Sign out&nbsp;</span><i');
  buf.push(attrs({ "class": ('icon-arrow-right') }));
  buf.push('></i></a></li></ul><ul');
  buf.push(attrs({ "class": ('nav') }));
  buf.push('></ul></div></div></header><div');
  buf.push(attrs({ "class": ('home-body') }));
  buf.push('><div');
  buf.push(attrs({ 'id':('app-frames') }));
  buf.push('></div><div');
  buf.push(attrs({ 'id':('content') }));
  buf.push('></div></div>');
  }
  return buf.join("");
  };
}});

window.require.define({"templates/login": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow) {
  var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<h2>Sign in</h2><div');
  buf.push(attrs({ 'id':('login-form') }));
  buf.push('><p><input');
  buf.push(attrs({ 'id':('login-password'), 'type':("password"), 'placeholder':("enter your password...") }));
  buf.push('/></p><p><a');
  buf.push(attrs({ 'id':('forgot-password-button') }));
  buf.push('>forgot password ?</a></p><div');
  buf.push(attrs({ 'id':('login-info'), "class": ('alert') + ' ' + ('main-alert') }));
  buf.push('><div');
  buf.push(attrs({ 'id':('login-info-text') }));
  buf.push('></div></div><div');
  buf.push(attrs({ 'id':('login-error'), "class": ('alert') + ' ' + ('alert-error') + ' ' + ('main-alert') }));
  buf.push('><div');
  buf.push(attrs({ 'id':('login-form-error-text') }));
  buf.push('></div></div></div>');
  }
  return buf.join("");
  };
}});

window.require.define({"templates/market": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow) {
  var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<h1>Market Place</h1><h2>Select application you want in your browser.</h2><div');
  buf.push(attrs({ 'id':('app-list') }));
  buf.push('></div>');
  }
  return buf.join("");
  };
}});

window.require.define({"templates/register": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow) {
  var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<h2>Register to your Cozy</h2><div');
  buf.push(attrs({ 'id':('login-form') }));
  buf.push('><p><input');
  buf.push(attrs({ 'id':('register-email'), 'type':("text"), 'placeholder':("email") }));
  buf.push('/><input');
  buf.push(attrs({ 'id':('register-password'), 'type':("password"), 'placeholder':("password") }));
  buf.push('/><div');
  buf.push(attrs({ 'id':('register-error'), "class": ('alert') + ' ' + ('alert-error') + ' ' + ('main-alert') }));
  buf.push('><div');
  buf.push(attrs({ 'id':('register-error-text') }));
  buf.push('><wrong>data (wrong email or too short password).</wrong></div></div></p></div>');
  }
  return buf.join("");
  };
}});

window.require.define({"templates/reset": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow) {
  var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<h1>Reset Password</h1><div');
  buf.push(attrs({ "class": ('well') }));
  buf.push('><form');
  buf.push(attrs({ 'id':('reset-form') }));
  buf.push('><p><label>fill this field to set a new password:</label><input');
  buf.push(attrs({ 'id':('reset-password1-field'), 'type':("password") }));
  buf.push('/></p><p><label>confirm new password:</label><input');
  buf.push(attrs({ 'id':('reset-password2-field'), 'type':("password") }));
  buf.push('/></p><p><button');
  buf.push(attrs({ 'id':('reset-form-button'), 'type':("submit"), "class": ("btn") }));
  buf.push('>Send changes</button></p></form></div>');
  }
  return buf.join("");
  };
}});

window.require.define({"views/account_view": function(exports, require, module) {
  (function() {
    var template, timezones,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    template = require('../templates/account');

    timezones = require('../helpers/timezone').timezones;

    exports.AccountView = (function(_super) {

      __extends(AccountView, _super);

      AccountView.prototype.id = 'account-view';

      /* Constructor
      */

      function AccountView() {
        this.displayErrors = __bind(this.displayErrors, this);
        this.onDataSubmit = __bind(this.onDataSubmit, this);      AccountView.__super__.constructor.call(this);
      }

      AccountView.prototype.fetchData = function() {
        var _this = this;
        return $.get("api/users/", function(data) {
          _this.emailField.val(data.rows[0].email);
          return _this.timezoneField.val(data.rows[0].timezone);
        });
      };

      AccountView.prototype.onDataSubmit = function(event) {
        var form,
          _this = this;
        this.loadingIndicator.spin();
        form = {
          email: this.emailField.val(),
          timezone: this.timezoneField.val(),
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
            } else {
              _this.displayErrors(JSON.parse(data.responseText).msg);
            }
            return _this.loadingIndicator.spin();
          },
          error: function(data) {
            _this.displayErrors(JSON.parse(data.responseText).msg);
            return _this.loadingIndicator.spin();
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

      /* Configuration
      */

      AccountView.prototype.render = function() {
        var timezone, timezoneIndex, _i, _len;
        $(this.el).html(template());
        timezoneIndex = {};
        this.timezoneField = this.$("#account-timezone-field");
        for (_i = 0, _len = timezones.length; _i < _len; _i++) {
          timezone = timezones[_i];
          this.timezoneField.append("<option>" + timezone + "</option>");
        }
        return this.el;
      };

      AccountView.prototype.setListeners = function() {
        if (app.views.home.logoutButton === void 0) {
          app.views.home.logoutButton = $("#logout-button");
          app.views.home.logoutButton.click(app.views.home.logout);
        }
        if (app.views.home.accountButton === void 0) {
          app.views.home.accountButton = $("#account-button");
          app.views.home.accountButton.click(app.views.home.account);
        }
        if (app.views.home.homeButton === void 0) {
          app.views.home.homeButton = $("#home-button");
          app.views.home.homeButton.click(app.views.home.home);
        }
        app.views.home.selectNavButton(app.views.home.accountButton);
        this.emailField = $("#account-email-field");
        this.infoAlert = $("#account-info");
        this.infoAlert.hide();
        this.errorAlert = $("#account-error");
        this.errorAlert.hide();
        this.accountDataButton = $("#account-form-button");
        this.accountDataButton.click(this.onDataSubmit);
        return this.loadingIndicator = this.$(".loading-indicator");
      };

      return AccountView;

    })(Backbone.View);

  }).call(this);
  
}});

window.require.define({"views/application": function(exports, require, module) {
  (function() {
    var BaseRow, template,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    template = require('../templates/application');

    BaseRow = require('views/row').BaseRow;

    exports.ApplicationRow = (function(_super) {

      __extends(ApplicationRow, _super);

      ApplicationRow.prototype.className = "application";

      ApplicationRow.prototype.events = {
        "click .remove-app": "onRemoveClicked"
      };

      /* Constructor
      */

      function ApplicationRow(model) {
        this.model = model;
        this.onRemoveClicked = __bind(this.onRemoveClicked, this);
        ApplicationRow.__super__.constructor.call(this, this.model);
      }

      /* Listener
      */

      ApplicationRow.prototype.onRemoveClicked = function(event) {
        event.preventDefault();
        return this.removeApp();
      };

      /* Functions
      */

      ApplicationRow.prototype.removeApp = function() {
        var _this = this;
        this.$(".remove-app").html("Removing...");
        return this.model.uninstall({
          success: function() {
            return _this.$(".remove-app").html("Removed!");
          },
          error: function() {
            return _this.$(".remove-app").html("Remove failed.");
          }
        });
      };

      /* configuration
      */

      ApplicationRow.prototype.render = function() {
        $(this.el).html(template({
          app: this.model
        }));
        this.el.id = this.model.slug;
        if (this.model.state === "broken") {
          $(this.el).addClass("broken");
          $(this.el).find(".application-inner").append('<p class="broken-notifier">broken app<p>');
        }
        return this.el;
      };

      return ApplicationRow;

    })(BaseRow);

  }).call(this);
  
}});

window.require.define({"views/applications_view": function(exports, require, module) {
  (function() {
    var AppCollection, AppRow, Application, InstallButton, User, applicationsTemplate, client,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    client = require('lib/request');

    applicationsTemplate = require('../templates/applications');

    User = require('../models/user').User;

    AppRow = require('views/application').ApplicationRow;

    AppCollection = require('collections/application').ApplicationCollection;

    Application = require("models/application").Application;

    InstallButton = (function() {

      function InstallButton(button) {
        this.button = button;
      }

      InstallButton.prototype.displayOrange = function(text) {
        this.button.html(text);
        this.button.removeClass("btn-success");
        this.button.removeClass("btn-danger");
        this.button.removeClass("disabled");
        return this.button.addClass("btn-warning");
      };

      InstallButton.prototype.displayGreen = function(text) {
        this.button.html(text);
        this.button.addClass("btn-success");
        this.button.addClass("disabled");
        this.button.removeClass("btn-danger");
        return this.button.removeClass("btn-warning");
      };

      InstallButton.prototype.displayRed = function(text) {
        this.button.html(text);
        this.button.removeClass("btn-success");
        this.button.addClass("btn-danger");
        this.button.removeClass("disabled");
        return this.button.removeClass("btn-warning");
      };

      return InstallButton;

    })();

    exports.ApplicationsView = (function(_super) {

      __extends(ApplicationsView, _super);

      ApplicationsView.prototype.id = 'applications-view';

      /* Constructor
      */

      function ApplicationsView() {
        this.displayError = __bind(this.displayError, this);
        this.displayInfo = __bind(this.displayInfo, this);
        this.checkData = __bind(this.checkData, this);
        this.addApplication = __bind(this.addApplication, this);
        this.clearApps = __bind(this.clearApps, this);
        this.onCloseAddAppClicked = __bind(this.onCloseAddAppClicked, this);
        this.onManageAppsClicked = __bind(this.onManageAppsClicked, this);
        this.onInstallClicked = __bind(this.onInstallClicked, this);
        this.onAddClicked = __bind(this.onAddClicked, this);      ApplicationsView.__super__.constructor.call(this);
        this.isManaging = false;
        this.isInstalling = false;
        this.apps = new AppCollection(this);
      }

      /* Listeners
      */

      ApplicationsView.prototype.onAddClicked = function() {
        this.installAppButton.displayOrange("install");
        this.addApplicationForm.show();
        return this.addApplicationModal.toggle();
      };

      ApplicationsView.prototype.onInstallClicked = function() {
        var app, data, dataChecking, isInstalling,
          _this = this;
        if (this.isInstalling) return true;
        this.isInstalling = true;
        data = {
          name: this.$("#app-name-field").val(),
          description: this.$("#app-description-field").val(),
          git: this.$("#app-git-field").val()
        };
        this.errorAlert.hide();
        this.installAppButton.displayOrange("install");
        dataChecking = this.checkData(data);
        if (!dataChecking.error) {
          this.errorAlert.hide();
          this.installAppButton.button.html("installing...");
          this.installInfo.spin();
          app = new Application(data);
          return app.install({
            success: function(data) {
              _this.isInstalling = false;
              if ((data.status != null) === "broken") {
                _this.apps.add(app);
                window.app.views.home.addApplication(app);
                _this.installAppButton.displayRed("Install failed");
                _this.installInfo.spin();
                return setTimeout(function() {
                  return _this.addApplicationForm.slideToggle();
                }, 1000);
              } else {
                _this.apps.add(app);
                window.app.views.home.addApplication(app);
                _this.installAppButton.displayGreen("Install succeeds!");
                return _this.installInfo.spin();
              }
            },
            error: function(data) {
              _this.isInstalling = false;
              _this.installAppButton.displayRed("Install failed");
              return _this.installInfo.spin();
            }
          });
        } else {
          isInstalling = false;
          return this.displayError(dataChecking.msg);
        }
      };

      ApplicationsView.prototype.onManageAppsClicked = function() {
        var _this = this;
        this.$('.application-outer').toggle();
        if (!this.machineInfos.is(':visible')) {
          this.machineInfos.find('.progress').spin();
          client.get('api/sys-data', {
            success: function(data) {
              _this.machineInfos.find('.progress').spin();
              _this.displayMemory(data.freeMem, data.totalMem);
              return _this.displayDiskSpace(data.usedDiskSpace, data.totalDiskSpace);
            },
            error: function() {
              this.machineInfos.find('.progress').spin();
              return alert('Server error occured, machine infos cannot be displayed.');
            }
          });
        }
        this.machineInfos.toggle();
        return this.isManaging = !this.isManaging;
      };

      ApplicationsView.prototype.onCloseAddAppClicked = function() {
        return this.addApplicationModal.hide();
      };

      /* Functions
      */

      ApplicationsView.prototype.clearApps = function() {
        return this.appList.html(null);
      };

      ApplicationsView.prototype.addApplication = function(application) {
        var el, row;
        row = new AppRow(application);
        el = row.render();
        this.appList.append(el);
        this.$(el).hide();
        this.$(el).fadeIn();
        if (this.isManaging) return this.$(el).find(".application-outer").show();
      };

      ApplicationsView.prototype.checkData = function(data) {
        var property, rightData, _ref;
        rightData = true;
        for (property in data) {
          rightData = (data[property] != null) && data[property].length > 0;
          if (!rightData) break;
        }
        if (!rightData) {
          return {
            error: true,
            msg: "All fields are required"
          };
        } else if (!((_ref = data.git) != null ? _ref.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?.git$/) : void 0)) {
          return {
            error: true,
            msg: "Git url should be of form https://.../my-repo.git"
          };
        } else {
          return {
            error: false
          };
        }
      };

      ApplicationsView.prototype.displayInfo = function(msg) {
        this.errorAlert.hide();
        this.infoAlert.html(msg);
        return this.infoAlert.show();
      };

      ApplicationsView.prototype.displayError = function(msg) {
        this.infoAlert.hide();
        this.errorAlert.html(msg);
        return this.errorAlert.show();
      };

      ApplicationsView.prototype.displayMemory = function(freeMem, totalMem) {
        var total, usedMemory;
        total = Math.floor(totalMem / 1024) + "Mo";
        this.machineInfos.find('.memory .total').html(total);
        usedMemory = ((totalMem - freeMem) / totalMem) * 100;
        return this.machineInfos.find('.memory .bar').css('width', usedMemory + '%');
      };

      ApplicationsView.prototype.displayDiskSpace = function(usedSpace, totalSpace) {
        this.machineInfos.find('.disk .total').html(totalSpace + "Go");
        return this.machineInfos.find('.disk .bar').css('width', usedSpace + '%');
      };

      /* Init functions
      */

      ApplicationsView.prototype.fetchData = function() {
        return this.apps.fetch();
      };

      ApplicationsView.prototype.render = function() {
        $(this.el).html(applicationsTemplate());
        return this.el;
      };

      ApplicationsView.prototype.setListeners = function() {
        this.appList = this.$("#app-list");
        this.addApplicationButton = this.$("#add-app-button");
        this.addApplicationButton.click(this.onAddClicked);
        this.addApplicationForm = this.$("#add-app-form");
        this.addApplicationModal = this.$("#add-app-modal");
        this.manageAppsButton = this.$("#manage-app-button");
        this.manageAppsButton.click(this.onManageAppsClicked);
        this.installAppButton = new InstallButton(this.$("#add-app-submit"));
        this.installAppButton.button.click(this.onInstallClicked);
        this.infoAlert = this.$("#add-app-form .info");
        this.errorAlert = this.$("#add-app-form .error");
        this.machineInfos = this.$(".machine-infos");
        this.appNameField = this.$("#app-name-field");
        this.appDescriptionField = this.$("#app-description-field");
        this.appGitField = this.$("#app-git-field");
        this.installInfo = this.$("#add-app-modal .loading-indicator");
        this.errorAlert.hide();
        this.infoAlert.hide();
        this.machineInfos.hide();
        this.addApplicationCloseCross = this.$("#add-app-modal .close");
        return this.addApplicationCloseCross.click(this.onCloseAddAppClicked);
      };

      return ApplicationsView;

    })(Backbone.View);

  }).call(this);
  
}});

window.require.define({"views/home_view": function(exports, require, module) {
  (function() {
    var AppCollection, User, appButtonTemplate, appIframeTemplate, homeTemplate,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    homeTemplate = require('../templates/home');

    appButtonTemplate = require("../templates/application_button");

    appIframeTemplate = require("../templates/application_iframe");

    AppCollection = require('collections/application').ApplicationCollection;

    User = require("../models/user").User;

    exports.HomeView = (function(_super) {

      __extends(HomeView, _super);

      HomeView.prototype.id = 'home-view';

      function HomeView() {
        this.onAppButtonClicked = __bind(this.onAppButtonClicked, this);
        this.addApplication = __bind(this.addApplication, this);
        this.clearApps = __bind(this.clearApps, this);
        this.setFrameSize = __bind(this.setFrameSize, this);
        this.account = __bind(this.account, this);
        this.home = __bind(this.home, this);
        this.logout = __bind(this.logout, this);      HomeView.__super__.constructor.call(this);
        this.apps = new AppCollection(this);
      }

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

      HomeView.prototype.home = function() {
        this.content.show();
        this.frames.hide();
        if (typeof app !== "undefined" && app !== null) {
          app.routers.main.navigate('home', true);
        }
        return this.selectNavButton(this.homeButton);
      };

      HomeView.prototype.account = function() {
        this.content.show();
        this.frames.hide();
        if (typeof app !== "undefined" && app !== null) {
          app.routers.main.navigate('account', true);
        }
        return this.selectNavButton(this.accountButton);
      };

      HomeView.prototype.setFrameSize = function() {
        var header;
        header = this.$("#header");
        return this.frames.height($(window).height() - header.height());
      };

      HomeView.prototype.selectNavButton = function(button) {
        this.buttons.find("li").removeClass("active");
        return button.parent().addClass("active");
      };

      HomeView.prototype.clearApps = function() {
        this.$(".app-button a").unbind();
        return this.$(".app-button").remove();
      };

      HomeView.prototype.addApplication = function(application) {
        this.buttons.find(".nav:last").append(appButtonTemplate({
          app: application
        }));
        return this.buttons.find("#" + application.slug).click(this.onAppButtonClicked);
      };

      HomeView.prototype.onAppButtonClicked = function(event) {
        var id;
        id = event.target.id;
        return typeof app !== "undefined" && app !== null ? app.routers.main.navigate("/apps/" + id, true) : void 0;
      };

      HomeView.prototype.loadApp = function(slug) {
        var frame;
        this.frames.show();
        frame = this.$("#" + slug + "-frame");
        if (frame.length === 0) {
          this.frames.append(appIframeTemplate({
            id: slug
          }));
          frame = this.$("#" + slug + "-frame");
        }
        this.content.hide();
        this.$("#app-frames iframe").hide();
        frame.show();
        this.selectNavButton(this.$("#" + slug));
        return this.selectedApp = slug;
      };

      /* Configuration
      */

      HomeView.prototype.fetch = function() {
        var _this = this;
        return this.apps.fetch({
          success: function() {
            if (_this.selectedApp != null) {
              _this.selectNavButton(_this.$("#" + _this.selectedApp));
            }
            return _this.selectedApp = null;
          }
        });
      };

      HomeView.prototype.render = function() {
        $(this.el).html(homeTemplate());
        return this.el;
      };

      HomeView.prototype.setListeners = function() {
        this.logoutButton = this.$("#logout-button");
        this.logoutButton.click(this.logout);
        this.accountButton = this.$("#account-button");
        this.accountButton.click(this.account);
        this.homeButton = this.$("#home-button");
        this.homeButton.click(this.home);
        this.buttons = this.$("#buttons");
        this.selectNavButton(this.homeButton);
        this.frames = this.$("#app-frames");
        this.content = this.$("#content");
        this.buttons.fadeIn();
        $(window).resize(this.setFrameSize);
        return this.setFrameSize();
      };

      return HomeView;

    })(Backbone.View);

  }).call(this);
  
}});

window.require.define({"views/row": function(exports, require, module) {
  (function() {
    var __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    exports.BaseRow = (function(_super) {

      __extends(BaseRow, _super);

      BaseRow.prototype.tagName = "div";

      function BaseRow(model) {
        this.model = model;
        BaseRow.__super__.constructor.call(this);
        this.id = this.model.slug;
        this.model.view = this;
      }

      BaseRow.prototype.remove = function() {
        return $(this.el).remove();
      };

      return BaseRow;

    })(Backbone.View);

  }).call(this);
  
}});

