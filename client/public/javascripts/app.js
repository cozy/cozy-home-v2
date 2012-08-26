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
          return _this.view.addAppRow(app);
        });
      };

      ApplicationCollection.prototype.onAdd = function(app) {
        return this.view.addAppRow(app);
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
          _this.initialize(_this);
          return Backbone.history.start();
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

window.require.define({"initialize": function(exports, require, module) {
  (function() {
    var AccountView, ApplicationsView, BrunchApplication, HomeView, LoginView, MainRouter, RegisterView, ResetView, checkAuthentication,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    BrunchApplication = require('helpers').BrunchApplication;

    MainRouter = require('routers/main_router').MainRouter;

    HomeView = require('views/home_view').HomeView;

    LoginView = require('views/login_view').LoginView;

    RegisterView = require('views/register_view').RegisterView;

    AccountView = require('views/account_view').AccountView;

    ResetView = require('views/reset_view').ResetView;

    ApplicationsView = require('views/applications_view').ApplicationsView;

    checkAuthentication = function() {
      return $.ajax({
        type: "GET",
        url: "authenticated/",
        success: function(data) {
          if (data.success) {
            if (Backbone.history.getFragment() === '') {
              return app.routers.main.navigate('home', true);
            }
          } else if (data.nouser) {
            return app.routers.main.navigate(app.views.register.path, true);
          } else {
            return app.routers.main.navigate('login', true);
          }
        },
        error: function(data) {
          return app.routers.main.navigate('login', true);
        }
      });
    };

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
        this.views.login = new LoginView();
        this.views.register = new RegisterView();
        this.views.account = new AccountView();
        this.views.reset = new ResetView();
        this.views.applications = new ApplicationsView();
        console.log(this.views.home.render());
        $("body").html(this.views.home.render());
        this.views.home.setListeners();
        if (window.location.hash.indexOf("password/reset") < 0) {
          return checkAuthentication();
        }
      };

      return Application;

    })(BrunchApplication);

    window.app = new exports.Application;

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

      User.prototype.register = function(callbacks) {
        return client.post("register/", {
          email: this.email,
          password: this.password
        }, callbacks);
      };

      User.prototype.login = function(callbacks) {
        return client.post("login/", {
          password: this.password
        }, callbacks);
      };

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
        "login": "login",
        "applications": "applications",
        "register": "register",
        "account": "account",
        "password/reset/:key": "resetPassword"
      };

      MainRouter.prototype.home = function() {
        return this.applications();
      };

      MainRouter.prototype.applications = function() {
        return this.loadView(app.views.applications);
      };

      MainRouter.prototype.login = function() {
        return this.loadView(app.views.login);
      };

      MainRouter.prototype.register = function() {
        return this.loadView(app.views.register);
      };

      MainRouter.prototype.account = function() {
        return this.loadView(app.views.account);
      };

      MainRouter.prototype.resetPassword = function(key) {
        this.loadView(app.views.reset);
        return app.views.reset.setKey(key);
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
  buf.push('/></p><p><label>fill this field to set a new password</label><input');
  buf.push(attrs({ 'id':('account-password1-field'), 'type':("password") }));
  buf.push('/></p><p><label>confirm new password</label><input');
  buf.push(attrs({ 'id':('account-password2-field'), 'type':("password") }));
  buf.push('/></p><p><button');
  buf.push(attrs({ 'id':('account-form-button'), 'type':("submit"), "class": ("btn") }));
  buf.push('>Send changes</button><div');
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
  buf.push(attrs({ "class": ('navbar-inner') }));
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
  buf.push('></i></a></li></ul></div></div></header><div');
  buf.push(attrs({ "class": ('container') }));
  buf.push('><div');
  buf.push(attrs({ 'id':('content') }));
  buf.push('></div></div>');
  }
  return buf.join("");
  };
}});

window.require.define({"templates/layout": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow) {
  var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<header');
  buf.push(attrs({ 'id':('header'), "class": ('navbar') }));
  buf.push('><div');
  buf.push(attrs({ "class": ('navbar-inner') }));
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
  buf.push('></i></a></li></ul></div></div></header><div');
  buf.push(attrs({ "class": ('container') }));
  buf.push('><div');
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
    var template,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    template = require('../templates/account');

    exports.AccountView = (function(_super) {

      __extends(AccountView, _super);

      AccountView.prototype.id = 'account-view';

      /* Constructor
      */

      function AccountView() {
        this.onDataSubmit = __bind(this.onDataSubmit, this);      AccountView.__super__.constructor.call(this);
      }

      AccountView.prototype.fetchData = function() {
        var _this = this;
        return $.get("api/users/", function(data) {
          return _this.emailField.val(data.rows[0].email);
        });
      };

      AccountView.prototype.onDataSubmit = function(event) {
        var form,
          _this = this;
        form = {
          email: $("#account-email-field").val(),
          password1: $("#account-password1-field").val(),
          password2: $("#account-password2-field").val()
        };
        this.infoAlert.hide();
        this.errorAlert.hide();
        $.ajax({
          type: 'POST',
          url: "api/user/",
          data: form,
          success: function(data) {
            if (data.success) {
              _this.infoAlert.html(data.msg);
              return _this.infoAlert.show();
            } else {
              return _this.displayErrors(JSON.parse(data.responseText).msg);
            }
          },
          error: function(data) {
            return _this.displayErrors(JSON.parse(data.responseText).msg);
          }
        });
        return {
          /* Functions
          */
          displayErrors: function(msgs) {
            var errorString, msg, _i, _len;
            errorString = "";
            for (_i = 0, _len = msgs.length; _i < _len; _i++) {
              msg = msgs[_i];
              console.log(msg);
              errorString += msg + "<br />";
            }
            _this.errorAlert.html(errorString);
            return _this.errorAlert.show();
          }
        };
      };

      /* Configuration
      */

      AccountView.prototype.render = function() {
        $(this.el).html(template());
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
        return this.accountDataButton.click(this.onDataSubmit);
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
    var AppCollection, AppRow, Application, InstallButton, User, applicationsTemplate,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    applicationsTemplate = require('../templates/applications');

    User = require("../models/user").User;

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
        this.addAppRow = __bind(this.addAppRow, this);
        this.clearApps = __bind(this.clearApps, this);
        this.onCloseAddAppClicked = __bind(this.onCloseAddAppClicked, this);
        this.onManageAppsClicked = __bind(this.onManageAppsClicked, this);
        this.onInstallClicked = __bind(this.onInstallClicked, this);
        this.onAddClicked = __bind(this.onAddClicked, this);      ApplicationsView.__super__.constructor.call(this);
        this.isManaging = false;
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
        var app, data,
          _this = this;
        data = {
          name: this.$("#app-name-field").val(),
          description: this.$("#app-description-field").val(),
          git: this.$("#app-git-field").val()
        };
        this.errorAlert.hide();
        this.installAppButton.displayOrange("install");
        if (this.checkData(data)) {
          this.errorAlert.hide();
          this.installAppButton.button.html("installing...");
          this.installInfo.spin();
          app = new Application(data);
          return app.install({
            success: function() {
              _this.apps.add(app);
              _this.installAppButton.displayGreen("Install succeeds!");
              _this.installInfo.spin();
              return setTimeout(function() {
                return _this.addApplicationForm.slideToggle();
              }, 1000);
            },
            error: function(data) {
              _this.installAppButton.displayRed("Install failed");
              return _this.installInfo.spin();
            }
          });
        } else {
          return this.displayError("All fields are required");
        }
      };

      ApplicationsView.prototype.onManageAppsClicked = function() {
        $(".application-outer").toggle();
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

      ApplicationsView.prototype.addAppRow = function(app) {
        var el, row;
        row = new AppRow(app);
        el = row.render();
        this.appList.append(el);
        this.$(el).hide();
        this.$(el).fadeIn();
        if (this.isManaging) return this.$(el).find(".application-outer").show();
      };

      ApplicationsView.prototype.checkData = function(data) {
        var property, rightData;
        rightData = true;
        for (property in data) {
          rightData = (data[property] != null) && data[property].length > 0;
          if (!rightData) break;
        }
        return rightData;
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
        this.appNameField = this.$("#app-name-field");
        this.appDescriptionField = this.$("#app-description-field");
        this.appGitField = this.$("#app-git-field");
        this.installInfo = this.$("#add-app-modal .loading-indicator");
        this.errorAlert.hide();
        this.infoAlert.hide();
        this.installInfo.spin();
        this.addApplicationCloseCross = this.$("#add-app-modal .close");
        return this.addApplicationCloseCross.click(this.onCloseAddAppClicked);
      };

      return ApplicationsView;

    })(Backbone.View);

  }).call(this);
  
}});

window.require.define({"views/home_view": function(exports, require, module) {
  (function() {
    var User, homeTemplate,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    homeTemplate = require('../templates/home');

    User = require("../models/user").User;

    exports.HomeView = (function(_super) {

      __extends(HomeView, _super);

      function HomeView() {
        this.account = __bind(this.account, this);
        this.home = __bind(this.home, this);
        this.logout = __bind(this.logout, this);
        HomeView.__super__.constructor.apply(this, arguments);
      }

      HomeView.prototype.id = 'home-view';

      /* Functions
      */

      HomeView.prototype.logout = function() {
        var user,
          _this = this;
        user = new User();
        return user.logout({
          success: function(data) {
            return app.routers.main.navigate('login', true);
          },
          error: function() {
            return alert("Server error occured, logout failed.");
          }
        });
      };

      HomeView.prototype.home = function() {
        app.routers.main.navigate('home', true);
        return this.selectNavButton(this.homeButton);
      };

      HomeView.prototype.account = function() {
        app.routers.main.navigate('account', true);
        return this.selectNavButton(this.accountButton);
      };

      HomeView.prototype.selectNavButton = function(button) {
        this.buttons.find("li").removeClass("active");
        return button.parent().addClass("active");
      };

      /* Configuration
      */

      HomeView.prototype.render = function() {
        $(this.el).html(homeTemplate());
        return this.el;
      };

      HomeView.prototype.setListeners = function() {
        this.appList = $("#app-list");
        this.logoutButton = $("#logout-button");
        this.logoutButton.click(this.logout);
        this.accountButton = $("#account-button");
        this.accountButton.click(this.account);
        this.homeButton = $("#home-button");
        this.homeButton.click(this.home);
        this.buttons = this.$("#buttons");
        this.selectNavButton(this.homeButton);
        return this.buttons.fadeIn();
      };

      return HomeView;

    })(Backbone.View);

  }).call(this);
  
}});

window.require.define({"views/login_view": function(exports, require, module) {
  (function() {
    var User, template,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    template = require("../templates/login");

    User = require("../models/user").User;

    exports.LoginView = (function(_super) {

      __extends(LoginView, _super);

      function LoginView() {
        this.onForgotButtonClicked = __bind(this.onForgotButtonClicked, this);
        this.logUser = __bind(this.logUser, this);
        this.submitPassword = __bind(this.submitPassword, this);
        LoginView.__super__.constructor.apply(this, arguments);
      }

      LoginView.prototype.id = 'login-view';

      LoginView.prototype.className = 'center';

      /* Constructor
      */

      /* Listeners
      */

      /* Functions
      */

      LoginView.prototype.submitPassword = function() {
        return this.logUser(this.passwordField.val());
      };

      LoginView.prototype.logUser = function(password) {
        var user,
          _this = this;
        if (!(this.errorAlert != null)) this.errorAlert = $("#login-error");
        this.errorAlert.hide();
        user = new User(null, password);
        return user.login({
          success: function(data) {
            app.views.home.buttons.show();
            return app.routers.main.navigate('home', true);
          },
          error: function(data) {
            var info;
            if ((data != null ? data.responseText : void 0) != null) {
              if ((data != null ? data.responseText : void 0) != null) {
                info = JSON.parse(data.responseText);
              }
            } else {
              info = data.msg;
            }
            return _this.displayError(info.msg);
          }
        });
      };

      LoginView.prototype.fetchData = function() {};

      LoginView.prototype.onForgotButtonClicked = function() {
        var _this = this;
        return $.ajax({
          type: "POST",
          url: "login/forgot/",
          success: function(data) {
            if (data.success) {
              return _this.displayInfo(data.success);
            } else {
              return _this.displayError(data.msg);
            }
          },
          error: function() {
            return _this.displayError("Server error occured.");
          }
        });
      };

      LoginView.prototype.displayError = function(text) {
        $("#login-form-error-text").html(text);
        return this.errorAlert.show();
      };

      LoginView.prototype.displayInfo = function(text) {
        $("#login-info-text").html(text);
        return this.infoAlert.show();
      };

      LoginView.prototype.render = function() {
        $(this.el).html(template());
        return this.el;
      };

      LoginView.prototype.setListeners = function() {
        var _this = this;
        this.passwordField = $("#login-password");
        this.buttons = $("#buttons");
        this.buttons.hide();
        this.forgotButton = $("#forgot-password-button");
        this.forgotButton.click(this.onForgotButtonClicked);
        this.passwordField = $("#login-password");
        this.infoAlert = $("#login-info");
        this.infoAlert.hide();
        this.errorAlert = $("#login-error");
        this.errorAlert.hide();
        return this.passwordField.keyup(function(event) {
          if (event.which === 13) return _this.submitPassword();
        });
      };

      return LoginView;

    })(Backbone.View);

  }).call(this);
  
}});

window.require.define({"views/register_view": function(exports, require, module) {
  (function() {
    var User, template,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    template = require('../templates/register');

    User = require('../models/user').User;

    exports.RegisterView = (function(_super) {

      __extends(RegisterView, _super);

      function RegisterView() {
        this.submitData = __bind(this.submitData, this);
        RegisterView.__super__.constructor.apply(this, arguments);
      }

      RegisterView.prototype.id = 'register-view';

      RegisterView.prototype.className = 'center';

      RegisterView.prototype.path = 'register';

      /* Constructor
      */

      /* Listeners
      */

      /* Functions
      */

      RegisterView.prototype.submitData = function() {
        var email, password, user,
          _this = this;
        email = this.emailField.val();
        password = this.passwordField.val();
        user = new User(email, password);
        return this.errorAlert.fadeOut(function() {
          return user.register({
            success: function() {
              return app.views.login.logUser(password);
            },
            error: function(data) {
              var error;
              error = JSON.parse(data.responseText);
              _this.errorAlert.html(error.msg);
              return _this.errorAlert.fadeIn();
            }
          });
        });
      };

      RegisterView.prototype.fetchData = function() {};

      /* Configuration
      */

      RegisterView.prototype.render = function() {
        $(this.el).html(template());
        return this.el;
      };

      RegisterView.prototype.setListeners = function() {
        var _this = this;
        this.emailField = $("#register-email");
        this.passwordField = $("#register-password");
        this.errorAlert = $("#register-error");
        this.errorAlert.hide();
        this.buttons = $("#buttons");
        this.buttons.hide();
        return this.passwordField.keyup(function(event) {
          if (event.which === 13) return _this.submitData();
        });
      };

      return RegisterView;

    })(Backbone.View);

  }).call(this);
  
}});

window.require.define({"views/reset_view": function(exports, require, module) {
  (function() {
    var template,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    template = require('../templates/reset');

    exports.ResetView = (function(_super) {

      __extends(ResetView, _super);

      ResetView.prototype.id = 'reset-view';

      /* Constructor
      */

      function ResetView() {
        this.onDataSubmit = __bind(this.onDataSubmit, this);      ResetView.__super__.constructor.call(this);
      }

      ResetView.prototype.fetchData = function() {};

      ResetView.prototype.setKey = function(key) {
        return this.key = key;
      };

      ResetView.prototype.onDataSubmit = function(event) {
        var form;
        if (this.passwordField1.val() !== this.passwordField2.val()) {
          return alert("Passwords do not match, type them again");
        } else {
          form = {
            key: this.key,
            password1: this.passwordField1.val(),
            password2: this.passwordField2.val()
          };
          return this.sendForm(form);
        }
      };

      ResetView.prototype.sendForm = function(form) {
        var _this = this;
        return $.ajax({
          type: "POST",
          url: "password/reset/" + this.key,
          data: form,
          success: function(data) {
            if (data.success) {
              alert("New password is now set.");
              return app.routers.main.navigate('login', true);
            } else {
              return alert("Something went wrong, your password was not updated.");
            }
          },
          error: function() {
            return alert("Server errer occured, change failed.");
          }
        });
      };

      /* Configuration
      */

      ResetView.prototype.render = function() {
        $(this.el).html(template());
        return this.el;
      };

      ResetView.prototype.setListeners = function() {
        this.buttons = $("#buttons");
        this.buttons.hide();
        this.passwordField1 = $("#reset-password1-field");
        this.passwordField2 = $("#reset-password2-field");
        this.resetDataButton = $("#reset-form-button");
        return this.resetDataButton.click(this.onDataSubmit);
      };

      return ResetView;

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

