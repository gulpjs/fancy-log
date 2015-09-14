'use strict';
/*
  Initial code from https://github.com/gulpjs/gulp-util/blob/v3.0.6/test/log.js
 */
var lab = exports.lab = require('lab').script();
var code = require('code');
var chalk = require('chalk');
var dateformat = require('dateformat');

var log = require('./');

lab.describe('log()', function(){

  var stdout_write = process.stdout.write;
  var writtenValue = '';

  function writeSpy(value) {
    writtenValue += value;
  }

  lab.afterEach(function(done){
    writtenValue = '';
    done();
  });

  lab.it('should work i guess', function(done){
    // Stub process.stdout.write
    process.stdout.write = writeSpy;

    log(1, 2, 3, 4, 'five');
    var time = dateformat(new Date(), 'HH:MM:ss');
    code.expect(writtenValue).equals('[' + chalk.grey(time) + '] 1 2 3 4 \'five\'\n');

    // Restore process.stdout.write after test
    process.stdout.write = stdout_write;

    done();
  });

  lab.it('should accept formatting', function(done){
     // Stub process.stdout.write
    process.stdout.write = writeSpy;

    log('%s %d %j', 'something', 0.1, {key: 'value'});
    var time = dateformat(new Date(), 'HH:MM:ss');
    code.expect(writtenValue).equals(
      '[' + chalk.grey(time) + '] '+
      'something 0.1 {\"key\":\"value\"}\n'
    );

    // Restore process.stdout.write after test
    process.stdout.write = stdout_write;

    done();
  });
});

lab.describe('log.error()', function(){

  var stderr_write = process.stderr.write;
  var writtenValue = '';

  function writeSpy(value) {
    writtenValue += value;
  }

  lab.afterEach(function(done){
    writtenValue = '';
    done();
  });

  lab.it('should work i guess', function(done){
    // Stub process.stderr.write
    process.stderr.write = writeSpy;

    log.error(1, 2, 3, 4, 'five');
    var time = dateformat(new Date(), 'HH:MM:ss');
    code.expect(writtenValue).equals('[' + chalk.grey(time) + '] 1 2 3 4 \'five\'\n');

    // Restore process.stderr.write after test
    process.stderr.write = stderr_write;

    done();
  });

  lab.it('should accept formatting', function(done){
     // Stub process.stderr.write
    process.stderr.write = writeSpy;

    log.error('%s %d %j', 'something', 0.1, {key: 'value'});
    var time = dateformat(new Date(), 'HH:MM:ss');
    code.expect(writtenValue).equals(
      '[' + chalk.grey(time) + '] '+
      'something 0.1 {\"key\":\"value\"}\n'
    );

    // Restore process.stderr.write after test
    process.stderr.write = stderr_write;

    done();
  });
});
