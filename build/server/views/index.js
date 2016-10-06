var jade = require('jade/runtime');
module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (argsFromLocationHash, imports) {
buf.push("<!DOCTYPE html><html><head><meta charset=\"utf-8\"><title>Cozy - Home</title><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><link rel=\"stylesheet\" href=\"app-icons/sprite-svg-data.css\"><link rel=\"stylesheet\" href=\"/fonts/fonts.css\"><link rel=\"stylesheet\" href=\"stylesheets/app.css\"><script>var argsFromLocationHash = " + (jade.escape((jade_interp = argsFromLocationHash) == null ? '' : jade_interp)) + "\nwindow.urlArguments = argsFromLocationHash(window.location.hash)</script><script>" + (null == (jade_interp = imports) ? "" : jade_interp) + "</script><script src=\"javascripts/vendor.js\" defer></script><script src=\"javascripts/app.js\" onload=\"require('initialize')\" defer></script></head><body></body></html>");}.call(this,"argsFromLocationHash" in locals_for_with?locals_for_with.argsFromLocationHash:typeof argsFromLocationHash!=="undefined"?argsFromLocationHash:undefined,"imports" in locals_for_with?locals_for_with.imports:typeof imports!=="undefined"?imports:undefined));;return buf.join("");
}