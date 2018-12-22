'use strict';

var expect = require('expect');
var timestamp = require('time-stamp');
var red = require('ansi-red');
var blue = require('ansi-blue');
var gray = require('ansi-gray');
var green = require('ansi-green');
var yellow = require('ansi-yellow');

var log = require('../');

var stdoutSpy = expect.spyOn(process.stdout, 'write').andCallThrough();
var stderrSpy = expect.spyOn(process.stderr, 'write').andCallThrough();

before(function(done) {
  log.theme.color = {
    red: red,
    blue: blue,
    gray: gray,
    green: green,
    yellow: yellow,
  };
  done();
});

describe('timestamp', function() {

  var timestampFormat, timestampColor;

  before(function(done) {
    timestampFormat = log.theme.TIMESTAMP.FORMAT;
    timestampColor = log.theme.TIMESTAMP.COLOR;
    done();
  });

  after(function(done) {
    log.theme.TIMESTAMP.FORMAT = timestampFormat;
    log.theme.TIMESTAMP.COLOR = timestampColor;
    done();
  });

  beforeEach(function(done) {
    stdoutSpy.reset();
    stderrSpy.reset();
    done();
  });

  it('should change timestamp color', function(done) {
    log.theme.TIMESTAMP.COLOR = red;
    log(1, 2, 3, 4, 'five');
    var time = timestamp('HH:mm:ss');

    expect(stdoutSpy.calls[0].arguments[0]).toEqual('[' + red(time) + '] ');
    expect(stdoutSpy.calls[1].arguments[0]).toEqual('1 2 3 4 \'five\'\n');

    log.theme.TIMESTAMP.COLOR = '{color.green:{1}}';
    log(1, 2, 3, 4, 'five');
    time = timestamp('HH:mm:ss');

    expect(stdoutSpy.calls[2].arguments[0]).toEqual('[' + green(time) + '] ');
    expect(stdoutSpy.calls[3].arguments[0]).toEqual('1 2 3 4 \'five\'\n');
    expect(stderrSpy.calls.length).toEqual(0);

    done();
  });

  it('should change timestamp format', function(done) {
    log.theme.TIMESTAMP.COLOR = blue;
    log.theme.TIMESTAMP.FORMAT =
      '{TIMESTAMP.COLOR: ({NOW: YYYY/MM/DD HH:mm:ss})} : ';
    log(1, 2, 3, 4, 'five');
    var time = timestamp('YYYY/MM/DD HH:mm:ss');

    expect(stdoutSpy.calls[0].arguments[0])
      .toEqual(blue('(' + time + ')') + ' : ');
    expect(stdoutSpy.calls[1].arguments[0])
      .toEqual('1 2 3 4 \'five\'\n');
    expect(stderrSpy.calls.length).toEqual(0);

    done();
  });
});

describe('log.themed', function() {

  before(function(done) {
    log.theme.MSG = '{color.green: {1}}';
    done();
  });

  beforeEach(function(done) {
    stdoutSpy.reset();
    done();
  });

  it('should output themed log', function(done) {
    log.themed('{MSG: This is {1} of {2}.}', 'A', 'B');
    var time = timestamp('HH:mm:ss');

    expect(stdoutSpy.calls[0].arguments[0])
      .toEqual('[' + gray(time) + '] ');
    expect(stdoutSpy.calls[1].arguments[0])
      .toEqual(green('This is A of B.') + '\n');
    expect(stderrSpy.calls.length).toEqual(0);

    done();
  });

  it('should output other format', function(done) {
    log.themed('{MSG: This is {2}\'s {1}.}', 'A', 'B');
    var time = timestamp('HH:mm:ss');

    expect(stdoutSpy.calls[0].arguments[0])
      .toEqual('[' + gray(time) + '] ');
    expect(stdoutSpy.calls[1].arguments[0])
      .toEqual(green('This is B\'s A.') + '\n');
    expect(stderrSpy.calls.length).toEqual(0);

    done();
  });

  it('should output in other language', function(done) {
    log.themed('{MSG: これは{2}の{1}です。}', 'A', 'B');
    var time = timestamp('HH:mm:ss');

    expect(stdoutSpy.calls[0].arguments[0])
      .toEqual('[' + gray(time) + '] ');
    expect(stdoutSpy.calls[1].arguments[0])
      .toEqual(green('これはBのAです。') + '\n');
    expect(stderrSpy.calls.length).toEqual(0);

    done();
  });

  it('should output multiple logs by lines', function(done) {
    log.themed(
      '{MSG: This is first message.}\n' +
      '{MSG: This is second message.}'
    );
    var time = timestamp('HH:mm:ss');

    expect(stdoutSpy.calls[0].arguments[0])
      .toEqual('[' + gray(time) + '] ');
    expect(stdoutSpy.calls[1].arguments[0])
      .toEqual(green('This is first message.') + '\n');

    expect(stdoutSpy.calls[2].arguments[0])
      .toEqual('[' + gray(time) + '] ');
    expect(stdoutSpy.calls[3].arguments[0])
      .toEqual(green('This is second message.') + '\n');

    expect(stderrSpy.calls.length).toEqual(0);

    done();
  });
});

describe('log.info.themed', function() {

  before(function(done) {
    log.theme.INFO = '{color.blue: {1}}';
    done();
  });

  beforeEach(function(done) {
    stdoutSpy.reset();
    stderrSpy.reset();
    done();
  });

  it('should output themed info log', function(done) {
    log.info.themed('{INFO: This is {1} of {2}.}', 'A', 'B');
    var time = timestamp('HH:mm:ss');

    expect(stdoutSpy.calls[0].arguments[0])
      .toEqual('[' + gray(time) + '] ');
    expect(stdoutSpy.calls[1].arguments[0])
      .toEqual(blue('This is A of B.') + '\n');
    expect(stderrSpy.calls.length).toEqual(0);

    done();
  });

  it('should output multiple logs by lines', function(done) {
    log.info.themed(
      '{INFO: This is first message.}\n' +
      '{INFO: This is second message.}'
    );
    var time = timestamp('HH:mm:ss');

    expect(stdoutSpy.calls[0].arguments[0])
      .toEqual('[' + gray(time) + '] ');
    expect(stdoutSpy.calls[1].arguments[0])
      .toEqual(blue('This is first message.') + '\n');

    expect(stdoutSpy.calls[2].arguments[0])
      .toEqual('[' + gray(time) + '] ');
    expect(stdoutSpy.calls[3].arguments[0])
      .toEqual(blue('This is second message.') + '\n');

    expect(stderrSpy.calls.length).toEqual(0);

    done();
  });
});

describe('log.warn.themed', function() {

  before(function(done) {
    log.theme.WARN = '{color.yellow: {1}}';
    done();
  });

  beforeEach(function(done) {
    stdoutSpy.reset();
    stderrSpy.reset();
    done();
  });

  it('should output themed warn log', function(done) {
    log.warn.themed('{WARN: This is {1} of {2}.}', 'A', 'B');
    var time = timestamp('HH:mm:ss');

    expect(stdoutSpy.calls.length).toEqual(0);
    expect(stderrSpy.calls[0].arguments[0])
      .toEqual('[' + gray(time) + '] ');
    expect(stderrSpy.calls[1].arguments[0])
      .toEqual(yellow('This is A of B.') + '\n');

    done();
  });

  it('should output multiple logs by lines', function(done) {
    log.warn.themed(
      '{WARN: This is first message.}\n' +
      '{WARN: This is second message.}'
    );
    var time = timestamp('HH:mm:ss');

    expect(stdoutSpy.calls.length).toEqual(0);

    expect(stderrSpy.calls[0].arguments[0])
      .toEqual('[' + gray(time) + '] ');
    expect(stderrSpy.calls[1].arguments[0])
      .toEqual(yellow('This is first message.') + '\n');

    expect(stderrSpy.calls[2].arguments[0])
      .toEqual('[' + gray(time) + '] ');
    expect(stderrSpy.calls[3].arguments[0])
      .toEqual(yellow('This is second message.') + '\n');

    done();
  });
});

describe('log.error.themed', function() {

  before(function(done) {
    log.theme.ERROR = '{color.red: {1}}';
    done();
  });

  beforeEach(function(done) {
    stdoutSpy.reset();
    stderrSpy.reset();
    done();
  });

  it('should output themed error log', function(done) {
    log.error.themed('{ERROR: This is {1} of {2}.}', 'A', 'B');
    var time = timestamp('HH:mm:ss');

    expect(stdoutSpy.calls.length).toEqual(0);

    expect(stderrSpy.calls[0].arguments[0])
      .toEqual('[' + gray(time) + '] ');
    expect(stderrSpy.calls[1].arguments[0])
      .toEqual(red('This is A of B.') + '\n');

    done();
  });

  it('should output multiple logs by lines', function(done) {
    log.error.themed(
      '{ERROR: This is first message.}\n' +
      '{ERROR: This is second message.}'
    );
    var time = timestamp('HH:mm:ss');

    expect(stdoutSpy.calls.length).toEqual(0);

    expect(stderrSpy.calls[0].arguments[0])
      .toEqual('[' + gray(time) + '] ');
    expect(stderrSpy.calls[1].arguments[0])
      .toEqual(red('This is first message.') + '\n');

    expect(stderrSpy.calls[2].arguments[0])
      .toEqual('[' + gray(time) + '] ');
    expect(stderrSpy.calls[3].arguments[0])
      .toEqual(red('This is second message.') + '\n');

    done();
  });
});
