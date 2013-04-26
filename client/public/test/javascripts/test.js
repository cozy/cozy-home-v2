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

window.require.register("test/application_collection_test", function(exports, require, module) {
  (function() {
    var Application, ApplicationCollection, ApplicationsView;

    ApplicationCollection = require("collections/application").ApplicationCollection;

    Application = require("models/application").Application;

    ApplicationsView = require("views/applications_view").ApplicationsView;

    describe('Application Collection', function() {
      before(function() {
        this.view = new ApplicationsView();
        this.view.render();
        this.view.setListeners();
        return this.apps = new ApplicationCollection(this.view);
      });
      after(function() {});
      describe("binding reset", function() {
        it("When I add 3 apps silently to the collection and fire reset event", function() {
          this.apps.add(new Application({
            name: "app 01",
            silent: true
          }));
          this.apps.add(new Application({
            name: "app 02",
            silent: true
          }));
          this.apps.add(new Application({
            name: "app 03",
            silent: true
          }));
          return this.apps.onReset();
        });
        return it("Then it displays 3 apps inside app list", function() {
          return expect(this.view.$("#app-list .application").length).to.equal(3);
        });
      });
      return describe("binding add", function() {
        it("When I add 1 app to the collection", function() {
          this.view.clearApps();
          this.apps.reset([]);
          return this.apps.add(new Application({
            name: "app 01"
          }));
        });
        return it("Then it displays 1 app inside app list", function() {
          return expect(this.view.$("#app-list .application").length).to.equal(1);
        });
      });
    });

  }).call(this);
  
});
window.require.register("test/application_view_test", function(exports, require, module) {
  (function() {
    var Application, ApplicationsView;

    ApplicationsView = require("views/applications_view").ApplicationsView;

    Application = require("models/application").Application;

    describe('Manage applications', function() {
      before(function() {
        this.view = new ApplicationsView();
        this.view.render();
        return this.view.setListeners();
      });
      describe("unit tests", function() {
        it("addApplication", function() {
          this.view.addApplication(new Application({
            name: "app 01"
          }));
          return expect(this.view.$(".application").length).to.equal(1);
        });
        it("clearApps", function() {
          this.view.clearApps();
          return expect(this.view.$(".application").length).to.equal(0);
        });
        it("checkData", function() {
          var data;
          data = {
            git: "https://github.com/mycozycloud/cozy-notes.git"
          };
          expect(this.view.checkData(data).error).to.not.be.ok;
          data.name = "test";
          expect(this.view.checkData(data).error).to.not.be.ok;
          data.description = void 0;
          expect(this.view.checkData(data).error).to.be.ok;
          data.description = "";
          expect(this.view.checkData(data).error).to.be.ok;
          data.description = "desc";
          expect(this.view.checkData(data).error).to.not.be.ok;
          data.git = "blabla";
          return expect(this.view.checkData(data).error).to.be.ok;
        });
        it("displayInfo", function() {
          this.view.displayInfo("test");
          expect(this.view.infoAlert.is(":visible")).to.be.ok;
          return expect(this.view.infoAlert.html()).to.equal("test");
        });
        it("displayError", function() {
          this.view.displayError("test");
          expect(this.view.errorAlert.is(":visible")).to.be.ok;
          expect(this.view.errorAlert.html()).to.equal("test");
          return expect(this.view.infoAlert.is(":visible")).to.not.be.ok;
        });
        return it("onManageAppsClicked", function() {
          this.view.addApplication(new Application({
            name: "app 01"
          }));
          this.view.onManageAppsClicked();
          expect(this.view.isManaging).to.be.ok;
          this.view.onManageAppsClicked();
          return expect(this.view.isManaging).to.not.be.ok;
        });
      });
      describe("Display installation form", function() {
        it("When I click on add application button", function() {
          this.view.addApplicationModal.hide();
          return this.view.addApplicationButton.click();
        });
        it("It displays a form to describe new app", function() {
          return expect(this.view.addApplicationModal.is(":visible")).to.be.ok;
        });
        it("When I click on add application button", function() {
          return this.view.addApplicationButton.click();
        });
        it("It hides the form", function() {
          return expect(this.view.addApplicationModal.is(":visible")).to.not.be.ok;
        });
        it("When I display the form and I click on close button", function() {
          this.view.addApplicationButton.click();
          return this.view.addApplicationCloseCross.click();
        });
        return it("It hides the form", function() {
          return expect(this.view.addApplicationModal.is(":visible")).to.not.be.ok;
        });
      });
      return describe("Add a new application", function() {
        return describe("Wrong data", function() {
          it("When I click on install application button", function() {
            this.data = {
              name: "My App",
              slug: "my-app",
              description: "Awesome app",
              state: "running",
              index: 0,
              git: "git@github.com:mycozycloud/my-app.git"
            };
            this.view.appNameField.val(this.data.name);
            return this.view.installAppButton.button.click();
          });
          return it("Then error message is diplayed", function() {
            expect(this.view.errorAlert.is(":visible")).to.be.ok;
            return expect(this.view.infoAlert.is(":visible")).to.not.be.ok;
          });
        });
      });
    });

  }).call(this);
  
});
window.require.register("test/home_view_test", function(exports, require, module) {
  (function() {
    var Application, HomeView;

    HomeView = require("views/home_view").HomeView;

    Application = require("initialize").Application;

    describe('Manage applications', function() {
      before(function() {
        this.view = new HomeView();
        this.view.render();
        return this.view.setListeners();
      });
      return describe("unit tests", function() {
        it("home", function() {
          this.view.home();
          return expect(this.view.homeButton.parent().hasClass("active")).to.be.ok;
        });
        it("account", function() {
          this.view.account();
          return expect(this.view.accountButton.parent().hasClass("active")).to.be.ok;
        });
        it("selectNavButton", function() {
          this.view.selectNavButton(this.view.homeButton);
          expect(this.view.homeButton.parent().hasClass("active")).to.be.ok;
          this.view.selectNavButton(this.view.accountButton);
          return expect(this.view.accountButton.parent().hasClass("active")).to.be.ok;
        });
        it("addApplication", function() {});
        it("clearApps", function() {
          this.view.clearApps();
          return expect(this.view.$(".app-button").length).to.equal(0);
        });
        return it("loadApp", function() {});
      });
    });

  }).call(this);
  
});
window.require.register("test/test-helpers", function(exports, require, module) {
  (function() {

    module.exports = {
      expect: require('chai').expect,
      sinon: require('sinon'),
      $: require('jquery')
    };

  }).call(this);
  
});
