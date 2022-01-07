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
var isLessThanNode12 = nodeVersion.major < 12;

var util = require('util');
var inspect = util.inspect;

var expect = require('expect');
var sinon = require('sinon');

/* eslint-disable node/no-unsupported-features/es-syntax */
// Reference: https://github.com/nodejs/node/blob/4e2ceba/lib/internal/util/inspect.js#L267-L274
function stylizeWithColor(str, styleType) {
  const style = inspect.styles[styleType];
  if (style !== undefined) {
    const color = inspect.colors[style];

    return `\u001b[${color[0]}m${str}\u001b[${color[1]}m`;
  }
  return str;
}
/* eslint-enable node/no-unsupported-features/es-syntax */

function withColor(str) {
  return stylizeWithColor(str, 'date');
}

var log = require('../');

var stdoutSpy = sinon.spy(process.stdout, 'write');
var stderrSpy = sinon.spy(process.stderr, 'write');

function expectCloseTo(arg, needsColor) {
  var now = new Date();
  var time;
  var maxAttempts = 5;
  for (var attempts = 1; attempts < maxAttempts; attempts++) {
    try {
      time = now.toLocaleTimeString('en', { hour12: false });
      if (needsColor) {
        expect(arg).toEqual('[' + withColor(time) + '] ');
      } else {
        expect(arg).toEqual('[' + time + '] ');
      }
      // Return on a success
      return;
    } catch (err) {
      if (attempts === maxAttempts) {
        throw err;
      } else {
        now.setSeconds(now.getSeconds() - 1);
      }
    }
  }
}

describe('log()', function () {
  this.timeout(5000);

  var term = process.env.TERM;
  var colorterm = process.env.COLORTERM;

  beforeEach(function (done) {
    stdoutSpy.resetHistory();
    done();
  });

  it('should work i guess', function (done) {
    log(1, 2, 3, 4, 'five');
    expectCloseTo(stdoutSpy.args[0][0], true);
    if (isLessThanNode12) {
      expect(stdoutSpy.args[1][0]).toEqual("1 2 3 4 'five'\n");
    } else {
      expect(stdoutSpy.args[1][0]).toEqual('1 2 3 4 five\n');
    }

    done();
  });

  it('should accept formatting', function (done) {
    log('%s %d %j', 'something', 0.1, { key: 'value' });
    expectCloseTo(stdoutSpy.args[0][0], true);
    expect(stdoutSpy.args[1][0]).toEqual('something 0.1 {"key":"value"}\n');

    done();
  });

  it('does not add color if argv contains --no-color', function (done) {
    process.argv.push('--no-color');

    log(1, 2, 3, 4, 'five');
    expectCloseTo(stdoutSpy.args[0][0], false);
    if (isLessThanNode12) {
      expect(stdoutSpy.args[1][0]).toEqual("1 2 3 4 'five'\n");
    } else {
      expect(stdoutSpy.args[1][0]).toEqual('1 2 3 4 five\n');
    }

    process.argv.pop();

    done();
  });

  it('adds color if argv contains --color', function (done) {
    process.argv.push('--color');

    log(1, 2, 3, 4, 'five');
    expectCloseTo(stdoutSpy.args[0][0], true);
    if (isLessThanNode12) {
      expect(stdoutSpy.args[1][0]).toEqual("1 2 3 4 'five'\n");
    } else {
      expect(stdoutSpy.args[1][0]).toEqual('1 2 3 4 five\n');
    }

    process.argv.pop();

    done();
  });

  it('does not add color if no support', function (done) {
    process.env.TERM = 'dumb';
    delete process.env.COLORTERM;

    log(1, 2, 3, 4, 'five');
    expectCloseTo(stdoutSpy.args[0][0], false);
    if (isLessThanNode12) {
      expect(stdoutSpy.args[1][0]).toEqual("1 2 3 4 'five'\n");
    } else {
      expect(stdoutSpy.args[1][0]).toEqual('1 2 3 4 five\n');
    }

    process.env.TERM = term;
    process.env.COLORTERM = colorterm;

    done();
  });
});

describe('log.info()', function () {
  beforeEach(function (done) {
    stdoutSpy.resetHistory();
    done();
  });

  it('should work i guess', function (done) {
    log.info(1, 2, 3, 4, 'five');
    expectCloseTo(stdoutSpy.args[0][0], true);
    if (isLessThanNode12) {
      expect(stdoutSpy.args[1][0]).toEqual("1 2 3 4 'five'\n");
    } else {
      expect(stdoutSpy.args[1][0]).toEqual('1 2 3 4 five\n');
    }

    done();
  });

  it('should accept formatting', function (done) {
    log.info('%s %d %j', 'something', 0.1, { key: 'value' });
    expectCloseTo(stdoutSpy.args[0][0], true);
    expect(stdoutSpy.args[1][0]).toEqual('something 0.1 {"key":"value"}\n');

    done();
  });
});

describe('log.dir()', function () {
  beforeEach(function (done) {
    stdoutSpy.resetHistory();
    done();
  });

  it('should format an object with util.inspect', function (done) {
    log.dir({ key: 'value' });
    expectCloseTo(stdoutSpy.args[0][0], true);
    expect(stdoutSpy.args[1][0]).toEqual(util.inspect({ key: 'value' }) + '\n');

    done();
  });
});

describe('log.warn()', function () {
  beforeEach(function (done) {
    stderrSpy.resetHistory();
    done();
  });

  it('should work i guess', function (done) {
    log.warn(1, 2, 3, 4, 'five');
    expectCloseTo(stdoutSpy.args[0][0], true);
    if (isLessThanNode12) {
      expect(stderrSpy.args[1][0]).toEqual("1 2 3 4 'five'\n");
    } else {
      expect(stderrSpy.args[1][0]).toEqual('1 2 3 4 five\n');
    }

    done();
  });

  it('should accept formatting', function (done) {
    log.warn('%s %d %j', 'something', 0.1, { key: 'value' });
    expectCloseTo(stdoutSpy.args[0][0], true);
    expect(stderrSpy.args[1][0]).toEqual('something 0.1 {"key":"value"}\n');

    done();
  });
});

describe('log.error()', function () {
  beforeEach(function (done) {
    stderrSpy.resetHistory();
    done();
  });

  it('should work i guess', function (done) {
    log.error(1, 2, 3, 4, 'five');
    expectCloseTo(stdoutSpy.args[0][0], true);
    if (isLessThanNode12) {
      expect(stderrSpy.args[1][0]).toEqual("1 2 3 4 'five'\n");
    } else {
      expect(stderrSpy.args[1][0]).toEqual('1 2 3 4 five\n');
    }

    done();
  });

  it('should accept formatting', function (done) {
    log.error('%s %d %j', 'something', 0.1, { key: 'value' });
    expectCloseTo(stdoutSpy.args[0][0], true);
    expect(stderrSpy.args[1][0]).toEqual('something 0.1 {"key":"value"}\n');

    done();
  });
});
