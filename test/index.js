'use strict';

// Enable color as a normal terminal even on CI environment.
if (process.env.CI) {
  process.stdout.isTTY = true;
  process.env.CI = '';
  process.env.COLORTERM = true;
}

// Node.js >=v12 removes escaped quotes in inspect string by:
// https://github.com/nodejs/node/pull/21624
var nodeVersion = require('parse-node-version')(process.version);
var isLessThanNode12 = (nodeVersion.major < 12);

var util = require('util');

var expect = require('expect');
var sinon = require('sinon');
var gray = require('ansi-gray');
var timestamp = require('time-stamp');

var log = require('../');

var stdoutSpy = sinon.spy(process.stdout, 'write');
var stderrSpy = sinon.spy(process.stderr, 'write');

describe('log()', function() {

  var term = process.env.TERM;
  var colorterm = process.env.COLORTERM;

  beforeEach(function(done) {
    stdoutSpy.resetHistory();
    done();
  });

  it('should work i guess', function(done) {
    log(1, 2, 3, 4, 'five');
    var time = timestamp('HH:mm:ss');
    expect(stdoutSpy.args[0][0]).toEqual('[' + gray(time) + '] ');
    if (isLessThanNode12) {
      expect(stdoutSpy.args[1][0]).toEqual('1 2 3 4 \'five\'\n');
    } else {
      expect(stdoutSpy.args[1][0]).toEqual('1 2 3 4 five\n');
    }

    done();
  });

  it('should accept formatting', function(done) {
    log('%s %d %j', 'something', 0.1, { key: 'value' });
    var time = timestamp('HH:mm:ss');
    expect(stdoutSpy.args[0][0]).toEqual('[' + gray(time) + '] ');
    expect(stdoutSpy.args[1][0]).toEqual('something 0.1 {"key":"value"}\n');

    done();
  });

  it('does not add color if argv contains --no-color', function(done) {
    process.argv.push('--no-color');

    log(1, 2, 3, 4, 'five');
    var time = timestamp('HH:mm:ss');
    expect(stdoutSpy.args[0][0]).toEqual('[' + time + '] ');
    if (isLessThanNode12) {
      expect(stdoutSpy.args[1][0]).toEqual('1 2 3 4 \'five\'\n');
    } else {
      expect(stdoutSpy.args[1][0]).toEqual('1 2 3 4 five\n');
    }

    process.argv.pop();

    done();
  });

  it('adds color if argv contains --color', function(done) {
    process.argv.push('--color');

    log(1, 2, 3, 4, 'five');
    var time = timestamp('HH:mm:ss');
    expect(stdoutSpy.args[0][0]).toEqual('[' + gray(time) + '] ');
    if (isLessThanNode12) {
      expect(stdoutSpy.args[1][0]).toEqual('1 2 3 4 \'five\'\n');
    } else {
      expect(stdoutSpy.args[1][0]).toEqual('1 2 3 4 five\n');
    }

    process.argv.pop();

    done();
  });

  it('does not add color if no support', function(done) {
    process.env.TERM = 'dumb';
    delete process.env.COLORTERM;

    log(1, 2, 3, 4, 'five');
    var time = timestamp('HH:mm:ss');
    expect(stdoutSpy.args[0][0]).toEqual('[' + time + '] ');
    if (isLessThanNode12) {
      expect(stdoutSpy.args[1][0]).toEqual('1 2 3 4 \'five\'\n');
    } else {
      expect(stdoutSpy.args[1][0]).toEqual('1 2 3 4 five\n');
    }

    process.env.TERM = term;
    process.env.COLORTERM = colorterm;

    done();
  });
});

describe('log.info()', function() {

  beforeEach(function(done) {
    stdoutSpy.resetHistory();
    done();
  });

  it('should work i guess', function(done) {
    log.info(1, 2, 3, 4, 'five');
    var time = timestamp('HH:mm:ss');
    expect(stdoutSpy.args[0][0]).toEqual('[' + gray(time) + '] ');
    if (isLessThanNode12) {
      expect(stdoutSpy.args[1][0]).toEqual('1 2 3 4 \'five\'\n');
    } else {
      expect(stdoutSpy.args[1][0]).toEqual('1 2 3 4 five\n');
    }

    done();
  });

  it('should accept formatting', function(done) {
    log.info('%s %d %j', 'something', 0.1, { key: 'value' });
    var time = timestamp('HH:mm:ss');
    expect(stdoutSpy.args[0][0]).toEqual('[' + gray(time) + '] ');
    expect(stdoutSpy.args[1][0]).toEqual('something 0.1 {"key":"value"}\n');

    done();
  });
});

describe('log.dir()', function() {

  beforeEach(function(done) {
    stdoutSpy.resetHistory();
    done();
  });

  it('should format an object with util.inspect', function(done) {
    log.dir({ key: 'value' });
    var time = timestamp('HH:mm:ss');
    expect(stdoutSpy.args[0][0]).toEqual('[' + gray(time) + '] ');
    expect(stdoutSpy.args[1][0]).toEqual(util.inspect({ key: 'value' }) + '\n');

    done();
  });
});

describe('log.warn()', function() {

  beforeEach(function(done) {
    stderrSpy.resetHistory();
    done();
  });

  it('should work i guess', function(done) {
    log.warn(1, 2, 3, 4, 'five');
    var time = timestamp('HH:mm:ss');
    expect(stderrSpy.args[0][0]).toEqual('[' + gray(time) + '] ');
    if (isLessThanNode12) {
      expect(stderrSpy.args[1][0]).toEqual('1 2 3 4 \'five\'\n');
    } else {
      expect(stderrSpy.args[1][0]).toEqual('1 2 3 4 five\n');
    }

    done();
  });

  it('should accept formatting', function(done) {
    log.warn('%s %d %j', 'something', 0.1, { key: 'value' });
    var time = timestamp('HH:mm:ss');
    expect(stderrSpy.args[0][0]).toEqual('[' + gray(time) + '] ');
    expect(stderrSpy.args[1][0]).toEqual('something 0.1 {"key":"value"}\n');

    done();
  });
});

describe('log.error()', function() {

  beforeEach(function(done) {
    stderrSpy.resetHistory();
    done();
  });

  it('should work i guess', function(done) {
    log.error(1, 2, 3, 4, 'five');
    var time = timestamp('HH:mm:ss');
    expect(stderrSpy.args[0][0]).toEqual('[' + gray(time) + '] ');
    if (isLessThanNode12) {
      expect(stderrSpy.args[1][0]).toEqual('1 2 3 4 \'five\'\n');
    } else {
      expect(stderrSpy.args[1][0]).toEqual('1 2 3 4 five\n');
    }

    done();
  });

  it('should accept formatting', function(done) {
    log.error('%s %d %j', 'something', 0.1, { key: 'value' });
    var time = timestamp('HH:mm:ss');
    expect(stderrSpy.args[0][0]).toEqual('[' + gray(time) + '] ');
    expect(stderrSpy.args[1][0]).toEqual('something 0.1 {"key":"value"}\n');

    done();
  });
});
