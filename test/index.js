'use strict';

var util = require('util');

var expect = require('expect');
var gray = require('ansi-gray');
var timestamp = require('time-stamp');

var log = require('../');

var stdoutSpy = expect.spyOn(process.stdout, 'write').andCallThrough();
var stderrSpy = expect.spyOn(process.stderr, 'write').andCallThrough();

describe('log()', function() {

  var term = process.env.TERM;
  var colorterm = process.env.COLORTERM;

  beforeEach(function(done) {
    stdoutSpy.reset();
    done();
  });

  it('should work i guess', function(done) {
    log(1, 2, 3, 4, 'five');
    var time = timestamp('HH:mm:ss');
    expect(stdoutSpy.calls[0].arguments).toInclude('[' + gray(time) + '] ');
    expect(stdoutSpy.calls[1].arguments).toInclude('1 2 3 4 \'five\'\n');

    done();
  });

  it('should accept formatting', function(done) {
    log('%s %d %j', 'something', 0.1, { key: 'value' });
    var time = timestamp('HH:mm:ss');
    expect(stdoutSpy.calls[0].arguments).toInclude('[' + gray(time) + '] ');
    expect(stdoutSpy.calls[1].arguments).toInclude('something 0.1 {\"key\":\"value\"}\n');

    done();
  });

  it('does not add color if argv contains --no-color', function(done) {
    process.argv.push('--no-color');

    log(1, 2, 3, 4, 'five');
    var time = timestamp('HH:mm:ss');
    expect(stdoutSpy.calls[0].arguments).toInclude('[' + time + '] ');
    expect(stdoutSpy.calls[1].arguments).toInclude('1 2 3 4 \'five\'\n');

    process.argv.pop();

    done();
  });

  it('adds color if argv contains --color', function(done) {
    process.argv.push('--color');

    log(1, 2, 3, 4, 'five');
    var time = timestamp('HH:mm:ss');
    expect(stdoutSpy.calls[0].arguments).toInclude('[' + gray(time) + '] ');
    expect(stdoutSpy.calls[1].arguments).toInclude('1 2 3 4 \'five\'\n');

    process.argv.pop();

    done();
  });

  it('does not add color if no support', function(done) {
    process.env.TERM = 'dumb';
    delete process.env.COLORTERM;

    log(1, 2, 3, 4, 'five');
    var time = timestamp('HH:mm:ss');
    expect(stdoutSpy.calls[0].arguments).toInclude('[' + time + '] ');
    expect(stdoutSpy.calls[1].arguments).toInclude('1 2 3 4 \'five\'\n');

    process.env.TERM = term;
    process.env.COLORTERM = colorterm;

    done();
  });
});

describe('log.info()', function() {

  beforeEach(function(done) {
    stdoutSpy.reset();
    done();
  });

  it('should work i guess', function(done) {
    log.info(1, 2, 3, 4, 'five');
    var time = timestamp('HH:mm:ss');
    expect(stdoutSpy.calls[0].arguments).toInclude('[' + gray(time) + '] ');
    expect(stdoutSpy.calls[1].arguments).toInclude('1 2 3 4 \'five\'\n');

    done();
  });

  it('should accept formatting', function(done) {
    log.info('%s %d %j', 'something', 0.1, { key: 'value' });
    var time = timestamp('HH:mm:ss');
    expect(stdoutSpy.calls[0].arguments).toInclude('[' + gray(time) + '] ');
    expect(stdoutSpy.calls[1].arguments).toInclude('something 0.1 {\"key\":\"value\"}\n');

    done();
  });
});

describe('log.dir()', function() {

  beforeEach(function(done) {
    stdoutSpy.reset();
    done();
  });

  it('should format an object with util.inspect', function(done) {
    log.dir({ key: 'value' });
    var time = timestamp('HH:mm:ss');
    expect(stdoutSpy.calls[0].arguments).toInclude('[' + gray(time) + '] ');
    expect(stdoutSpy.calls[1].arguments).toInclude(util.inspect({ key: 'value' }) + '\n');

    done();
  });
});

describe('log.warn()', function() {

  beforeEach(function(done) {
    stderrSpy.reset();
    done();
  });

  it('should work i guess', function(done) {
    log.warn(1, 2, 3, 4, 'five');
    var time = timestamp('HH:mm:ss');
    expect(stderrSpy.calls[0].arguments).toInclude('[' + gray(time) + '] ');
    expect(stderrSpy.calls[1].arguments).toInclude('1 2 3 4 \'five\'\n');

    done();
  });

  it('should accept formatting', function(done) {
    log.warn('%s %d %j', 'something', 0.1, { key: 'value' });
    var time = timestamp('HH:mm:ss');
    expect(stderrSpy.calls[0].arguments).toInclude('[' + gray(time) + '] ');
    expect(stderrSpy.calls[1].arguments).toInclude('something 0.1 {\"key\":\"value\"}\n');

    done();
  });
});

describe('log.error()', function() {

  beforeEach(function(done) {
    stderrSpy.reset();
    done();
  });

  it('should work i guess', function(done) {
    log.error(1, 2, 3, 4, 'five');
    var time = timestamp('HH:mm:ss');
    expect(stderrSpy.calls[0].arguments).toInclude('[' + gray(time) + '] ');
    expect(stderrSpy.calls[1].arguments).toInclude('1 2 3 4 \'five\'\n');

    done();
  });

  it('should accept formatting', function(done) {
    log.error('%s %d %j', 'something', 0.1, { key: 'value' });
    var time = timestamp('HH:mm:ss');
    expect(stderrSpy.calls[0].arguments).toInclude('[' + gray(time) + '] ');
    expect(stderrSpy.calls[1].arguments).toInclude('something 0.1 {\"key\":\"value\"}\n');

    done();
  });
});
