(function(/*! Brunch !*/) {
  if (!this.require) {
    var modules = {}, cache = {}, require = function(name, root) {
      var module = cache[name], path = expand(root, name), fn;
      if (module) {
        return module;
      } else if (fn = modules[path] || modules[path = expand(path, './index')]) {
        module = {id: name, exports: {}};
        try {
          cache[name] = module.exports;
          fn(module.exports, function(name) {
            return require(name, dirname(path));
          }, module);
          return cache[name] = module.exports;
        } catch (err) {
          delete cache[name];
          throw err;
        }
      } else {
        throw 'module \'' + name + '\' not found';
      }
    }, expand = function(root, name) {
      var results = [], parts, part;
      if (/^\.\.?(\/|$)/.test(name)) {
        parts = [root, name].join('/').split('/');
      } else {
        parts = name.split('/');
      }
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part == '..') {
          results.pop();
        } else if (part != '.' && part != '') {
          results.push(part);
        }
      }
      return results.join('/');
    }, dirname = function(path) {
      return path.split('/').slice(0, -1).join('/');
    };
    this.require = function(name) {
      return require(name, '');
    };
    this.require.brunch = true;
    this.require.define = function(bundle) {
      for (var key in bundle)
        modules[key] = bundle[key];
    };
  }
}).call(this);(this.require.define({
  "templates/register": function(exports, require, module) {
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
  }
}));
(this.require.define({
  "main": function(exports, require, module) {
    (function() {
  var AccountView, HomeView, LoginView, MainRouter, MarketView, RegisterView;

  window.app = {};

  app.routers = {};

  app.models = {};

  app.collections = {};

  app.views = {};

  MainRouter = require('routers/main_router').MainRouter;

  HomeView = require('views/home_view').HomeView;

  MarketView = require('views/market').MarketView;

  LoginView = require('views/login_view').LoginView;

  RegisterView = require('views/register_view').RegisterView;

  AccountView = require('views/account_view').AccountView;

  $(document).ready(function() {
    app.initialize = function() {
      app.routers.main = new MainRouter();
      app.views.home = new HomeView();
      app.views.market = new MarketView();
      app.views.login = new LoginView();
      app.views.register = new RegisterView();
      app.views.account = new AccountView();
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
    app.initialize();
    return Backbone.history.start();
  });

}).call(this);

  }
}));
(this.require.define({
  "views/row": function(exports, require, module) {
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

  }
}));
(this.require.define({
  "views/market": function(exports, require, module) {
    (function() {
  var AppCollection, AppRow, homeTemplate,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  homeTemplate = require('../templates/market');

  AppRow = require('views/application').ApplicationRow;

  AppCollection = require('collections/application').ApplicationCollection;

  exports.MarketView = (function(_super) {

    __extends(MarketView, _super);

    MarketView.prototype.id = 'market-view';

    /* Constructor
    */

    function MarketView() {
      this.fillApps = __bind(this.fillApps, this);      MarketView.__super__.constructor.call(this);
      this.apps = new AppCollection();
      this.apps.bind('reset', this.fillApps);
    }

    /* Listeners
    */

    /* Functions
    */

    MarketView.prototype.fetchData = function() {
      return this.apps.fetch();
    };

    MarketView.prototype.fillApps = function() {
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

    MarketView.prototype.render = function() {
      $(this.el).html(homeTemplate());
      return this.el;
    };

    return MarketView;

  })(Backbone.View);

}).call(this);

  }
}));
(this.require.define({
  "views/application": function(exports, require, module) {
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

  }
}));
(this.require.define({
  "views/appmarket": function(exports, require, module) {
    (function() {
  var BaseRow, appTemplate,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  appTemplate = require('../templates/app');

  BaseRow = require('views/row').BaseRow;

  exports.AppRow = (function(_super) {

    __extends(AppRow, _super);

    AppRow.prototype.className = "app";

    AppRow.prototype.events = {
      "click .button": "onInstallClicked"
    };

    function AppRow(model) {
      this.model = model;
      this.onInstallClicked = __bind(this.onInstallClicked, this);
      AppRow.__super__.constructor.call(this, this.model);
    }

    AppRow.prototype.onInstallClicked = function(event) {
      event.preventDefault();
      return this.installApp();
    };

    AppRow.prototype.installApp = function() {
      var _this = this;
      this.$(".info-text").html("Installing...");
      return $.ajax({
        type: 'POST',
        dataType: "json",
        contentType: "application/json",
        url: "/api/installed-apps/",
        data: '{"name": "' + this.model.name + '", "slug": "' + this.model.slug + '"}',
        success: function() {
          return _this.$(".info-text").html("Installed!");
        },
        error: function() {
          return _this.$(".info-text").html("Install failed.");
        }
      });
    };

    AppRow.prototype.render = function() {
      $(this.el).html(appTemplate({
        app: this.model
      }));
      this.el.id = this.model.slug;
      return this.el;
    };

    return AppRow;

  })(BaseRow);

}).call(this);

  }
}));
(this.require.define({
  "views/register_view": function(exports, require, module) {
    (function() {
  var template,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  template = require('../templates/register');

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
      var email, password,
        _this = this;
      email = this.emailField.val();
      password = this.passwordField.val();
      this.errorAlert.hide();
      return $.ajax({
        type: 'POST',
        url: "register/",
        data: {
          email: email,
          password: password
        },
        success: function(data) {
          if (data.success) {
            return app.views.login.logUser(password);
          } else {
            return _this.errorAlert.fadeIn();
          }
        },
        error: function() {
          return _this.errorAlert.fadeIn();
        }
      });
    };

    RegisterView.prototype.fetchData = function() {
      return true;
    };

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
      return this.passwordField.keyup(function(event) {
        if (event.which === 13) return _this.submitData();
      });
    };

    return RegisterView;

  })(Backbone.View);

}).call(this);

  }
}));
(this.require.define({
  "templates/application": function(exports, require, module) {
    module.exports = function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<a');
buf.push(attrs({ 'href':("apps/" + (app.path) + ""), 'target':("_blank") }));
buf.push('><div');
buf.push(attrs({ "class": ('application-inner') }));
buf.push('>' + escape((interp = app.name) == null ? '' : interp) + '\n<p');
buf.push(attrs({ "class": ('info-text') }));
buf.push('></p></div></a>');
}
return buf.join("");
};
  }
}));
(this.require.define({
  "templates/appmarket": function(exports, require, module) {
    module.exports = function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<p');
buf.push(attrs({ "class": ('title') }));
buf.push('>' + escape((interp = app.name) == null ? '' : interp) + '<input');
buf.push(attrs({ 'type':("submit"), 'value':("install"), "class": ("button") }));
buf.push('/></p><div');
buf.push(attrs({ "class": ('info-text') }));
buf.push('></div>');
}
return buf.join("");
};
  }
}));
(this.require.define({
  "templates/account": function(exports, require, module) {
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
buf.push('>Send changes</button></p></form>');
}
return buf.join("");
};
  }
}));
(this.require.define({
  "templates/market": function(exports, require, module) {
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
  }
}));
(this.require.define({
  "views/account_view": function(exports, require, module) {
    (function() {
  var template,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  template = require('../templates/account');

  exports.AccountView = (function(_super) {

    __extends(AccountView, _super);

    AccountView.prototype.id = 'account-view';

    /* Constructor
    */

    function AccountView() {
      AccountView.__super__.constructor.call(this);
    }

    AccountView.prototype.fetchData = function() {
      var _this = this;
      return $.get("api/users/", function(data) {
        return _this.emailField.val(data.rows[0].email);
      });
    };

    /* Configuration
    */

    AccountView.prototype.render = function() {
      $(this.el).html(template());
      return this.el;
    };

    AccountView.prototype.setListeners = function() {
      return this.emailField = $("#account-email-field");
    };

    return AccountView;

  })(Backbone.View);

}).call(this);

  }
}));
(this.require.define({
  "templates/login": function(exports, require, module) {
    module.exports = function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<h2>Sign in</h2><div');
buf.push(attrs({ 'id':('login-form') }));
buf.push('><p><input');
buf.push(attrs({ 'id':('login-password'), 'type':("password"), 'placeholder':("enter your password...") }));
buf.push('/></p><div');
buf.push(attrs({ 'id':('login-error'), "class": ('alert') + ' ' + ('alert-error') + ' ' + ('main-alert') }));
buf.push('><div');
buf.push(attrs({ 'id':('login-form-error-text') }));
buf.push('><wrong>password</wrong></div></div></div>');
}
return buf.join("");
};
  }
}));
(this.require.define({
  "templates/home": function(exports, require, module) {
    module.exports = function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div');
buf.push(attrs({ 'id':('app-list') }));
buf.push('></div>');
}
return buf.join("");
};
  }
}));
(this.require.define({
  "routers/main_router": function(exports, require, module) {
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
      "account": "account"
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

    MainRouter.prototype.loadView = function(view) {
      $('#content').html(view.render());
      view.fetchData();
      return view.setListeners();
    };

    return MainRouter;

  })(Backbone.Router);

}).call(this);

  }
}));
(this.require.define({
  "models/application": function(exports, require, module) {
    (function() {
  var BaseModel,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  BaseModel = require("models/models").BaseModel;

  exports.Application = (function(_super) {

    __extends(Application, _super);

    Application.prototype.url = '/api/applications/';

    function Application(app) {
      Application.__super__.constructor.call(this);
      this.slug = app.slug;
      this.name = app.name;
      this.path = "" + app.slug + "/";
    }

    return Application;

  })(BaseModel);

}).call(this);

  }
}));
(this.require.define({
  "models/models": function(exports, require, module) {
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

  }
}));
(this.require.define({
  "models/appmarket": function(exports, require, module) {
    (function() {
  var BaseModel,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  BaseModel = require("models/models").BaseModel;

  exports.App = (function(_super) {

    __extends(App, _super);

    App.prototype.url = '/api/market/apps/';

    function App(app) {
      App.__super__.constructor.call(this);
      this.slug = app.slug;
      this.name = app.name;
      this.path = "/" + app.slug + "/";
    }

    return App;

  })(BaseModel);

}).call(this);

  }
}));
(this.require.define({
  "collections/collections": function(exports, require, module) {
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

  }
}));
(this.require.define({
  "collections/appmarket": function(exports, require, module) {
    (function() {
  var App, BaseCollection,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  BaseCollection = require("collections/collections").BaseCollection;

  App = require("models/app").App;

  exports.AppCollection = (function(_super) {

    __extends(AppCollection, _super);

    AppCollection.prototype.model = App;

    AppCollection.prototype.url = '/api/market/apps/';

    function AppCollection() {
      AppCollection.__super__.constructor.call(this);
    }

    return AppCollection;

  })(BaseCollection);

}).call(this);

  }
}));
(this.require.define({
  "collections/application": function(exports, require, module) {
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

  }
}));
(this.require.define({
  "views/login_view": function(exports, require, module) {
    (function() {
  var template,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  template = require('../templates/login');

  exports.LoginView = (function(_super) {

    __extends(LoginView, _super);

    function LoginView() {
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
      var _this = this;
      this.errorAlert.hide();
      return $.ajax({
        type: 'POST',
        url: "login/",
        data: {
          password: password
        },
        success: function(data) {
          if (data.success) {
            return app.routers.main.navigate('home', true);
          } else {
            return _this.errorAlert.fadeIn();
          }
        },
        error: function() {
          return _this.errorAlert.fadeIn();
        }
      });
    };

    LoginView.prototype.fetchData = function() {
      return true;
    };

    LoginView.prototype.render = function() {
      $(this.el).html(template());
      return this.el;
    };

    LoginView.prototype.setListeners = function() {
      var _this = this;
      this.passwordField = $("#login-password");
      this.errorAlert = $("#login-error");
      this.errorAlert.hide();
      this.accountButton = $("#account-button");
      this.accountButton.hide();
      this.logoutButton = $("#logout-button");
      this.logoutButton.hide();
      return this.passwordField.keyup(function(event) {
        if (event.which === 13) return _this.submitPassword();
      });
    };

    return LoginView;

  })(Backbone.View);

}).call(this);

  }
}));
(this.require.define({
  "views/home_view": function(exports, require, module) {
    (function() {
  var AppCollection, AppRow, homeTemplate,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  homeTemplate = require('../templates/home');

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
      this.logout = __bind(this.logout, this);      HomeView.__super__.constructor.call(this);
      this.apps = new AppCollection();
      this.apps.bind('reset', this.fillApps);
    }

    /* Listeners
    */

    /* Functions
    */

    HomeView.prototype.logout = function() {
      var _this = this;
      return $.ajax({
        type: 'GET',
        url: "logout/",
        success: function(data) {
          if (data.success) {
            return app.routers.main.navigate('login', true);
          } else {
            return alert("Server error occured, logout failed.");
          }
        },
        error: function() {
          return alert("Server error occured, logout failed.");
        }
      });
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
      this.accountButton.show();
      return this.logoutButton.show();
    };

    return HomeView;

  })(Backbone.View);

}).call(this);

  }
}));
