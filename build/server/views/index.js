var jade = require('jade/runtime');
module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (imports) {
buf.push("<!DOCTYPE html><html><head><meta charset=\"utf-8\"><title>Cozy - Home</title><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><link rel=\"stylesheet\" href=\"app-icons/sprite-svg-data.css\"><link rel=\"stylesheet\" href=\"/fonts/fonts.css\"><link rel=\"stylesheet\" href=\"stylesheets/app.css\"><script>" + (null == (jade_interp = imports) ? "" : jade_interp) + "</script><script src=\"javascripts/vendor.js\" defer></script><script src=\"javascripts/app.js\" onload=\"require('initialize')\" defer></script></head><body></body></html>");}.call(this,"imports" in locals_for_with?locals_for_with.imports:typeof imports!=="undefined"?imports:undefined));;return buf.join("");
}