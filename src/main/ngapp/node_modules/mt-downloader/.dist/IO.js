'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BAR = exports.HTTP = exports.FILE = exports.toOB = exports.fromCB = undefined;

var _rx = require('rx');

var _RxFP = require('./RxFP');

var Rx = _interopRequireWildcard(_RxFP);

var _muxer = require('muxer');

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _Request = require('./Request');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const fromCB = exports.fromCB = _ramda2.default.compose(_ramda2.default.apply, _rx.Observable.fromNodeCallback);
const toOB = exports.toOB = cb => _ramda2.default.compose(Rx.shareReplay(1), Rx.flatMap(fromCB(cb)));

/**
 * Provides wrappers over the async utils inside the
 * {@link https://nodejs.org/api/fs.html fs module}.
 * The wrappers take in an input stream of arguments
 * and returns the result of function call as another stream.
 * @namespace FILE
 */
const FILE = exports.FILE = _ramda2.default.curry(fs => {
  return {
    /**
     * @function
     * @memberOf FILE
     * @param {external:Observable} params$
     * @return {external:Observable}
     */
    open: toOB(fs.open),

    /**
     * {@link https://nodejs.org/api/fs.html#fs_fs_open_path_flags_mode_callback}
     * @function
     * @memberOf FILE
     * @param {external:Observable} params$
     * @return {external:Observable}
     */
    fstat: toOB(fs.fstat),

    /**
     * {@link https://nodejs.org/api/fs.html#fs_fs_read_fd_buffer_offset_length_position_callback}
     * @function
     * @memberOf FILE
     * @param {external:Observable} params$
     * @return {external:Observable}
     */
    read: toOB(fs.read),

    /**
     * {@link https://nodejs.org/api/fs.html#fs_fs_write_fd_buffer_offset_length_position_callback}
     * @function
     * @memberOf FILE
     * @param {external:Observable} params$
     * @return {external:Observable}
     */
    write: toOB(fs.write),

    /**
     * {@link https://nodejs.org/api/fs.html#fs_fs_close_fd_callback}
     * @function
     * @memberOf FILE
     * @param {external:Observable} params$
     * @return {external:Observable}
     */
    close: toOB(fs.close),

    /**
     * {@link https://nodejs.org/api/fs.html#fs_fs_truncate_path_len_callback}
     * @function
     * @memberOf FILE
     * @param {external:Observable} params$
     * @return {external:Observable}
     */
    truncate: toOB(fs.truncate),

    /**
     * {@link https://nodejs.org/api/fs.html#fs_fs_rename_oldpath_newpath_callback}
     * @function
     * @memberOf FILE
     * @param {external:Observable} params$
     * @return {external:Observable}
     */
    rename: toOB(fs.rename)
  };
});

/**
 * @namespace HTTP
 */
const HTTP = exports.HTTP = _ramda2.default.curry(_request => {
  const request = (0, _Request.Request)(_request);
  const requestHead = params => {
    const [{ response$ }] = (0, _muxer.demux)(request(params), 'response$');
    return response$.first().tap(x => x.destroy()).share();
  };

  const select = _ramda2.default.curry((event, request$) => request$.filter(x => x.event === event).pluck('message'));
  return {
    requestHead,
    select,
    /**
     * Stream based wrapper over {@link https://www.npmjs.com/package/request npm/request}
     * @function
     * @memberOf HTTP
     * @param {object} params - {@link https://www.npmjs.com/package/request  request} module params.
     * @return {external:Observable} multiplex stream
     */
    request
  };
});

const BAR = exports.BAR = _ramda2.default.curry(ProgressBar => {
  const bar = new ProgressBar(':bar :percent ', {
    total: 1000,
    complete: '█',
    incomplete: '░'
  });
  return bar.update.bind(bar);
});
//# sourceMappingURL=IO.js.map