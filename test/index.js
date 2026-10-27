"use strict";

// Enable color as a normal terminal even on CI environment.
if (process.env.CI) {
  process.stdout.isTTY = true;
  process.env.CI = "";
  process.env.COLORTERM = true;
}

var util = require("node:util");
var inspect = util.inspect;

var assert = require("node:assert");
var { beforeEach, describe, it, mock } = require("node:test");

// Reference: https://github.com/nodejs/node/blob/4e2ceba/lib/internal/util/inspect.js#L267-L274
function stylizeWithColor(str, styleType) {
  const style = inspect.styles[styleType];
  if (style !== undefined) {
    const color = inspect.colors[style];

    return `\u001b[${color[0]}m${str}\u001b[${color[1]}m`;
  }
  return str;
}

function withColor(str) {
  return stylizeWithColor(str, "date");
}

var log = require("../");

var stdoutSpy;
var stderrSpy;

function expectCloseTo(arg, needsColor) {
  var now = new Date();
  var time;
  var maxAttempts = 5;
  for (var attempts = 1; attempts < maxAttempts; attempts++) {
    try {
      time = now.toLocaleTimeString("en", { hour12: false });
      if (needsColor) {
        assert.strictEqual(arg, "[" + withColor(time) + "] ");
      } else {
        assert.strictEqual(arg, "[" + time + "] ");
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

describe("log()", { timeout: 5000 }, function () {
  beforeEach(function () {
    stdoutSpy = mock.method(process.stdout, "write");
    stderrSpy = mock.method(process.stderr, "write");
  });

  var term = process.env.TERM;
  var colorterm = process.env.COLORTERM;

  it("should work i guess", function () {
    log(1, 2, 3, 4, "five");
    expectCloseTo(stdoutSpy.mock.calls[0].arguments[0], true);
    assert.strictEqual(stdoutSpy.mock.calls[1].arguments[0], "1 2 3 4 five\n");
  });

  it("should accept formatting", function () {
    log("%s %d %j", "something", 0.1, { key: "value" });
    expectCloseTo(stdoutSpy.mock.calls[0].arguments[0], true);
    assert.strictEqual(
      stdoutSpy.mock.calls[1].arguments[0],
      'something 0.1 {"key":"value"}\n',
    );
  });

  it("does not add color if argv contains --no-color", function () {
    process.argv.push("--no-color");

    log(1, 2, 3, 4, "five");
    expectCloseTo(stdoutSpy.mock.calls[0].arguments[0], false);
    assert.strictEqual(stdoutSpy.mock.calls[1].arguments[0], "1 2 3 4 five\n");
    process.argv.pop();
  });

  it("adds color if argv contains --color", function () {
    process.argv.push("--color");

    log(1, 2, 3, 4, "five");
    expectCloseTo(stdoutSpy.mock.calls[0].arguments[0], true);
    assert.strictEqual(stdoutSpy.mock.calls[1].arguments[0], "1 2 3 4 five\n");

    process.argv.pop();
  });

  it("does not add color if no support", function () {
    process.env.TERM = "dumb";
    delete process.env.COLORTERM;

    log(1, 2, 3, 4, "five");
    expectCloseTo(stdoutSpy.mock.calls[0].arguments[0], false);
    assert.strictEqual(stdoutSpy.mock.calls[1].arguments[0], "1 2 3 4 five\n");

    process.env.TERM = term;
    process.env.COLORTERM = colorterm;
  });
});

describe("log.info()", function () {
  beforeEach(function () {
    stdoutSpy = mock.method(process.stdout, "write");
    stderrSpy = mock.method(process.stderr, "write");
  });

  it("should work i guess", function () {
    log.info(1, 2, 3, 4, "five");
    expectCloseTo(stdoutSpy.mock.calls[0].arguments[0], true);
    assert.strictEqual(stdoutSpy.mock.calls[1].arguments[0], "1 2 3 4 five\n");
  });

  it("should accept formatting", function () {
    log.info("%s %d %j", "something", 0.1, { key: "value" });
    expectCloseTo(stdoutSpy.mock.calls[0].arguments[0], true);
    assert.strictEqual(
      stdoutSpy.mock.calls[1].arguments[0],
      'something 0.1 {"key":"value"}\n',
    );
  });
});

describe("log.dir()", function () {
  beforeEach(function () {
    stdoutSpy = mock.method(process.stdout, "write");
    stderrSpy = mock.method(process.stderr, "write");
  });

  it("should format an object with util.inspect", function () {
    log.dir({ key: "value" });
    expectCloseTo(stdoutSpy.mock.calls[0].arguments[0], true);
    assert.strictEqual(
      stdoutSpy.mock.calls[1].arguments[0],
      util.inspect({ key: "value" }) + "\n",
    );
  });
});

describe("log.warn()", function () {
  beforeEach(function () {
    stdoutSpy = mock.method(process.stdout, "write");
    stderrSpy = mock.method(process.stderr, "write");
  });

  it("should work i guess", function () {
    log.warn(1, 2, 3, 4, "five");
    expectCloseTo(stderrSpy.mock.calls[0].arguments[0], true);
    assert.strictEqual(stderrSpy.mock.calls[1].arguments[0], "1 2 3 4 five\n");
  });

  it("should accept formatting", function () {
    log.warn("%s %d %j", "something", 0.1, { key: "value" });
    expectCloseTo(stderrSpy.mock.calls[0].arguments[0], true);
    assert.strictEqual(
      stderrSpy.mock.calls[1].arguments[0],
      'something 0.1 {"key":"value"}\n',
    );
  });
});

describe("log.error()", function () {
  beforeEach(function () {
    stdoutSpy = mock.method(process.stdout, "write");
    stderrSpy = mock.method(process.stderr, "write");
    log(1, 2, 3, 4, "five");
  });

  it("should work i guess", function () {
    log.error(1, 2, 3, 4, "five");
    expectCloseTo(stdoutSpy.mock.calls[0].arguments[0], true);
    assert.strictEqual(stderrSpy.mock.calls[1].arguments[0], "1 2 3 4 five\n");
  });

  it("should accept formatting", function () {
    log.error("%s %d %j", "something", 0.1, { key: "value" });
    expectCloseTo(stdoutSpy.mock.calls[0].arguments[0], true);
    assert.strictEqual(
      stderrSpy.mock.calls[1].arguments[0],
      'something 0.1 {"key":"value"}\n',
    );
  });
});
