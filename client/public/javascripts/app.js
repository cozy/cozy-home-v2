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
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    BaseCollection = require("collections/collections").BaseCollection;

    Application = require("models/application").Application;

    exports.ApplicationCollection = (function(_super) {

      __extends(ApplicationCollection, _super);

      ApplicationCollection.prototype.model = Application;

      ApplicationCollection.prototype.url = 'api/applications/';

      function ApplicationCollection() {
        ApplicationCollection.__super__.constructor.call(this);
      }

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

      BrunchApplication.prototype.initialize = function() {
        return null;
      };

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
    var AccountView, BrunchApplication, HomeView, LoginView, MainRouter, RegisterView, ResetView, checkAuthentication,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    BrunchApplication = require('helpers').BrunchApplication;

    MainRouter = require('routers/main_router').MainRouter;

    HomeView = require('views/home_view').HomeView;

    LoginView = require('views/login_view').LoginView;

    RegisterView = require('views/register_view').RegisterView;

    AccountView = require('views/account_view').AccountView;

    ResetView = require('views/reset_view').ResetView;

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
        this.routers = {};
        this.views = {};
        this.routers.main = new MainRouter;
        this.views.home = new HomeView;
        this.views.login = new LoginView();
        this.views.register = new RegisterView();
        this.views.account = new AccountView();
        this.views.reset = new ResetView();
        $("body").html(require("templates/layout"));
        if (window.location.hash.indexOf("password/reset") < 0) {
          return checkAuthentication();
        }
      };

      return Application;

    })(BrunchApplication);

    window.app = new exports.Application;

  }).call(this);
  
}});

window.require.define({"models/application": function(exports, require, module) {
  (function() {
    var BaseModel,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    BaseModel = require("models/models").BaseModel;

    exports.Application = (function(_super) {

      __extends(Application, _super);

      Application.prototype.url = '/api/applications/';

      function Application(app) {
        this.app = app;
        Application.__super__.constructor.call(this);
        this.slug = app.slug;
        this.name = app.name;
        this.description = app.description;
        this.icon = app.icon;
        this;
      }

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
        "market": "market",
        "register": "register",
        "account": "account",
        "password/reset/:key": "resetPassword"
      };

      MainRouter.prototype.home = function() {
        return this.loadView(app.views.home);
      };

      MainRouter.prototype.market = function() {
        return this.loadView(app.views.market);
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
  buf.push('<h1>Account</h1><form');
  buf.push(attrs({ 'id':('account-form') }));
  buf.push('><p><label>email:<input');
  buf.push(attrs({ 'id':('account-email-field'), 'type':("text") }));
  buf.push('/></label><label>fill this field to set a new password:<input');
  buf.push(attrs({ 'id':('account-password1-field'), 'type':("password") }));
  buf.push('/></label><label>confirm new password:<input');
  buf.push(attrs({ 'id':('account-password2-field'), 'type':("password") }));
  buf.push('/></label><button');
  buf.push(attrs({ 'id':('account-form-button'), 'type':("submit"), "class": ("btn") }));
  buf.push('>Send changes</button></p><div');
  buf.push(attrs({ 'id':('account-info'), "class": ('alert') + ' ' + ('main-alert') }));
  buf.push('><div');
  buf.push(attrs({ 'id':('account-info-text') }));
  buf.push('></div></div><div');
  buf.push(attrs({ 'id':('account-error'), "class": ('alert') + ' ' + ('alert-error') + ' ' + ('main-alert') }));
  buf.push('><div');
  buf.push(attrs({ 'id':('account-form-error-text') }));
  buf.push('></div></div></form>');
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
  buf.push('><img');
  buf.push(attrs({ 'src':("images/" + (app.icon) + "") }));
  buf.push('/>' + escape((interp = app.name) == null ? '' : interp) + '\n<p');
  buf.push(attrs({ "class": ('info-text') }));
  buf.push('>' + escape((interp = app.description) == null ? '' : interp) + '</p></div></a>');
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
  buf.push('<div');
  buf.push(attrs({ 'id':('app-list') }));
  buf.push('></div><div');
  buf.push(attrs({ "class": ('spacer') }));
  buf.push('></div>');
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
  buf.push(attrs({ 'id':('header') }));
  buf.push('><h2');
  buf.push(attrs({ 'id':('header-title') }));
  buf.push('><a');
  buf.push(attrs({ 'href':("http://www.mycozycloud.com/"), 'target':("_blank"), 'title':("home") }));
  buf.push('>Cozy Cloud\n</a></h2><div');
  buf.push(attrs({ 'id':('buttons') }));
  buf.push('><button');
  buf.push(attrs({ 'id':('account-button'), 'type':("submit"), "class": ("btn") }));
  buf.push('>Account</button><button');
  buf.push(attrs({ 'id':('home-button'), 'type':("submit"), "class": ("btn") }));
  buf.push('>Applications</button><button');
  buf.push(attrs({ 'id':('logout-button'), 'type':("submit"), "class": ("btn") }));
  buf.push('>Sign out</button></div></header><div');
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
  buf.push('<h1>Reset Password</h1><form');
  buf.push(attrs({ 'id':('reset-form') }));
  buf.push('><p><label>fill this field to set a new password:<input');
  buf.push(attrs({ 'id':('reset-password1-field'), 'type':("password") }));
  buf.push('/></label><label>confirm new password:<input');
  buf.push(attrs({ 'id':('reset-password2-field'), 'type':("password") }));
  buf.push('/></label><button');
  buf.push(attrs({ 'id':('reset-form-button'), 'type':("submit"), "class": ("btn") }));
  buf.push('>Send changes</button></p></form>');
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
        return $.ajax({
          type: 'POST',
          url: "api/user/",
          data: form,
          success: function(data) {
            var errorString, msg, msgs, _i, _len;
            if (data.success) {
              _this.infoAlert.html(data.msg);
              return _this.infoAlert.show();
            } else {
              msgs = JSON.parse(data.responseText).msg;
              errorString = "";
              for (_i = 0, _len = msgs.length; _i < _len; _i++) {
                msg = msgs[_i];
                errorString += msg + "<br />";
              }
              _this.errorAlert.html(errorString);
              return _this.errorAlert.show();
            }
          },
          error: function(data) {
            var errorString, msg, msgs, _i, _len;
            msgs = JSON.parse(data.responseText).msg;
            errorString = "";
            for (_i = 0, _len = msgs.length; _i < _len; _i++) {
              msg = msgs[_i];
              console.log(msg);
              errorString += msg + "<br />";
            }
            _this.errorAlert.html(errorString);
            return _this.errorAlert.show();
          }
        });
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
        app.views.home.homeButton.show();
        app.views.home.accountButton.hide();
        app.views.home.logoutButton.show();
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

      /* configuration
      */

      ApplicationRow.prototype.render = function() {
        $(this.el).html(template({
          app: this.model
        }));
        this.el.id = this.model.slug;
        return this.el;
      };

      return ApplicationRow;

    })(BaseRow);

  }).call(this);
  
}});

window.require.define({"views/home_view": function(exports, require, module) {
  (function() {
    var AppCollection, AppRow, User, homeTemplate,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    homeTemplate = require('../templates/home');

    User = require("../models/user").User;

    AppRow = require('views/application').ApplicationRow;

    AppCollection = require('collections/application').ApplicationCollection;

    exports.HomeView = (function(_super) {

      __extends(HomeView, _super);

      HomeView.prototype.id = 'home-view';

      /* Constructor
      */

      function HomeView() {
        this.fillApps = __bind(this.fillApps, this);
        this.account = __bind(this.account, this);
        this.home = __bind(this.home, this);
        this.logout = __bind(this.logout, this);      HomeView.__super__.constructor.call(this);
        this.apps = new AppCollection();
        this.apps.bind('reset', this.fillApps);
      }

      /* Listeners
      */

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
        return app.routers.main.navigate('home', true);
      };

      HomeView.prototype.account = function() {
        return app.routers.main.navigate('account', true);
      };

      HomeView.prototype.fetchData = function() {
        return this.apps.fetch();
      };

      HomeView.prototype.fillApps = function() {
        var _this = this;
        this.appList = $("#app-list");
        this.appList.html(null);
        return this.apps.forEach(function(app) {
          var el, row;
          row = new AppRow(app);
          el = row.render();
          return _this.appList.append(el);
        });
      };

      /* Configuration
      */

      HomeView.prototype.render = function() {
        $(this.el).html(homeTemplate());
        return this.el;
      };

      HomeView.prototype.setListeners = function() {
        this.appList = $("#app-list");
        if (this.logoutButton === void 0) {
          this.logoutButton = $("#logout-button");
          this.logoutButton.click(this.logout);
        }
        if (this.accountButton === void 0) {
          this.accountButton = $("#account-button");
          this.accountButton.click(this.account);
        }
        if (this.homeButton === void 0) {
          this.homeButton = $("#home-button");
          this.homeButton.click(this.home);
        }
        this.buttons = $("#buttons");
        this.buttons.show();
        this.homeButton.hide();
        this.accountButton.show();
        return this.logoutButton.show();
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
        this.homeButton = $("#home-button");
        this.homeButton.hide();
        this.accountButton = $("#account-button");
        this.accountButton.hide();
        this.logoutButton = $("#logout-button");
        this.logoutButton.hide();
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
        this.accountButton = $("#account-button");
        this.accountButton.hide();
        this.homeButton = $("#home-button");
        this.homeButton.hide();
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

