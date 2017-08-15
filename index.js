'use strict';
/*
  Initial code from https://github.com/gulpjs/gulp-util/blob/v3.0.6/lib/log.js
 */
var grey = require('chalk').grey;
var timestamp = require('time-stamp');

var mappout = { log: 'stdout', info: 'stdout', dir: 'stdout', warn: 'stderr', error: 'stderr' };

function _log(args, type){
  var time = '['+grey(timestamp('HH:mm:ss'))+']';
  process[mappout[type]].write(time + ' ');
  console[type].apply(console, args);
  return this;
}

module.exports = function(){ return _log(arguments, 'log'); };
module.exports.info = function(){ return _log(arguments, 'info'); };
module.exports.dir = function(){ return _log(arguments, 'dir'); };
module.exports.warn = function(){ return _log(arguments, 'warn'); };
module.exports.error = function(){ return _log(arguments, 'error'); };
