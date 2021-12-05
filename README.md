<p align="center">
  <a href="http://gulpjs.com">
    <img height="257" width="114" src="https://raw.githubusercontent.com/gulpjs/artwork/master/gulp-2x.png">
  </a>
</p>

# fancy-log

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][ci-image]][ci-url] [![Coveralls Status][coveralls-image]][coveralls-url]

Log things, prefixed with a timestamp.

## Usage

```js
var log = require('fancy-log');

log('a message');
// [16:27:02] a message

log.error('oh no!');
// [16:27:02] oh no!
```

## API

### `log(msg...)`

Logs the message as if you called `console.log` but prefixes the output with the
current time in HH:MM:ss format.

### `log.error(msg...)`

Logs the message as if you called `console.error` but prefixes the output with the
current time in HH:MM:ss format.

### `log.warn(msg...)`

Logs the message as if you called `console.warn` but prefixes the output with the
current time in HH:MM:ss format.


### `log.info(msg...)`

Logs the message as if you called `console.info` but prefixes the output with the
current time in HH:MM:ss format.

### `log.dir(msg...)`

Logs the message as if you called `console.dir` but prefixes the output with the
current time in HH:MM:ss format.

## License

MIT

<!-- prettier-ignore-start -->
[downloads-image]: https://img.shields.io/npm/dm/fancy-log.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/fancy-log
[npm-image]: https://img.shields.io/npm/v/fancy-log.svg?style=flat-square

[ci-url]: https://github.com/gulpjs/fancy-log/actions?query=workflow:dev
[ci-image]: http://img.shields.io/github/workflow/status/gulpjs/fancy-log/dev?style=flat-square

[coveralls-url]: https://coveralls.io/r/gulpjs/fancy-log
[coveralls-image]: https://img.shields.io/coveralls/gulpjs/fancy-log/master.svg?style=flat-square
<!-- prettier-ignore-end -->
