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

<<<<<<< HEAD
window.require.define({"test/task_model_test": function(exports, require, module) {
<<<<<<< HEAD
  (function() {

    describe('Suscribe', function() {
      before(function() {});
      after(function() {});
      return describe("Test", function() {
        return it("Then it displays an error message.", function() {});
      });
    });

  }).call(this);
=======
  
  describe('Suscribe', function() {
    before(function() {});
=======
window.require.define({"test/application_view_test": function(exports, require, module) {
  var HomeView;

  HomeView = require("views/home_view").HomeView;

  describe('Manage applications', function() {
    before(function() {
      this.view = new HomeView();
      this.view.render();
      return this.view.setListeners();
    });
>>>>>>> add code to display app form when application button is clicked
    after(function() {});
    describe("Display installation form", function() {
      it("When I click on add application button", function() {
        return this.view.addApplicationButton.click();
      });
      it("It displays a form to describe new app", function() {
        return expect(this.view.addApplicationForm.is(":visible")).to.be.ok;
      });
      it("When I click on add application button", function() {
        return this.view.addApplicationButton.click();
      });
      return it("It displays a form to describe new app", function() {
        return expect(this.view.addApplicationForm.is(":visible")).to.not.be.ok;
      });
    });
    return describe("Add first available applications", function() {
      it("When I click on install application buttonp", function() {});
      it("Then loading process is started and displayed", function() {});
      it("When loading process is finished", function() {});
      it("Then app is marked as installed", function() {});
      return it("And app is listed inside my apps", function() {});
    });
  });
>>>>>>> clean ui for correct message displaying + debug
  
}});

window.require.define({"test/test-helpers": function(exports, require, module) {
<<<<<<< HEAD
  (function() {

    module.exports = {
      expect: require('chai').expect,
      should: require('chai').should,
      sinon: require('sinon'),
      $: require('jquery')
    };

  }).call(this);
=======
  
  module.exports = {
    expect: require('chai').expect,
    sinon: require('sinon'),
    $: require('jquery')
  };
>>>>>>> clean ui for correct message displaying + debug
  
}});

window.require('test/application_view_test');
