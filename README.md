<p align="center">
  <a href="https://gulpjs.com">
    <img height="257" width="114" src="https://raw.githubusercontent.com/gulpjs/artwork/master/gulp-2x.png">
  </a>
</p>

# fancy-log

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][ci-image]][ci-url] [![Coveralls Status][coveralls-image]][coveralls-url]

Log things, prefixed with a timestamp.

## Usage

```js
var log = require("fancy-log");

log("a message");
// [16:27:02] a message

log.error("oh no!");
// [16:27:02] oh no!
```

## API

### `log(msg...)`

Logs the message as if you called `console.log` but prefixes the output with the
current time in HH:mm:ss format.

### `log.error(msg...)`

Logs the message as if you called `console.error` but prefixes the output with the
current time in HH:mm:ss format.

### `log.warn(msg...)`

Logs the message as if you called `console.warn` but prefixes the output with the
current time in HH:mm:ss format.

### `log.info(msg...)`

Logs the message as if you called `console.info` but prefixes the output with the
current time in HH:mm:ss format.

### `log.dir(msg...)`

Logs the message as if you called `console.dir` but prefixes the output with the
current time in HH:mm:ss format.

## Styling

If the terminal that you are logging to supports colors, the timestamp will be formatted as though it were a `Date` being formatted by `util.inspect()`. This means that it will be formatted as magenta by default but can be adjusted following node's [Customizing util.inspect colors](https://nodejs.org/dist/latest-v10.x/docs/api/util.html#util_customizing_util_inspect_colors) documentation.

For example, this will cause the logged timestamps (and other dates) to display in red:

```js
var util = require("util");

util.inspect.styles.date = "red";
```

## Strict No LLM / No AI Policy

No LLMs for issues.

No LLMs for patches / pull requests.

No LLMs for comments on the bug tracker, including translation.

English is encouraged, but not required. You are welcome to post in your native language and rely on others to have their own translation tools of choice to interpret your words.

## License

MIT

<!-- prettier-ignore-start -->
[downloads-image]: https://img.shields.io/npm/dm/fancy-log.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/fancy-log
[npm-image]: https://img.shields.io/npm/v/fancy-log.svg?style=flat-square

[ci-url]: https://github.com/gulpjs/fancy-log/actions/workflows/dev.yml
[ci-image]: https://img.shields.io/github/actions/workflow/status/gulpjs/fancy-log/dev.yml?style=flat-square

[coveralls-url]: https://coveralls.io/r/gulpjs/fancy-log
[coveralls-image]: https://img.shields.io/coveralls/gulpjs/fancy-log/main.svg?style=flat-square
<!-- prettier-ignore-end -->
