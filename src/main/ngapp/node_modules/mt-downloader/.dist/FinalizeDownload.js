/**
 * Created by tushar.mathur on 29/06/16.
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FinalizeDownload = undefined;

var _muxer = require('muxer');

var _rx = require('rx');

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _Utils = require('./Utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Removes the meta information and the `.mtd` extension from the file once the
 * download is successfully completed.
 * @function
 * @param {object} params - `{fd$, meta$}`
 * @param {external:Observable} params.fd$ - File descriptor Observable
 * @param {external:Observable} params.meta$ - Download meta information
 * @returns {external:Observable}
 * A {@link https://github.com/tusharmath/muxer multiplexed stream} containing ~
 * - `truncated$` - Fired when the meta data is removed.
 * - `renamed$` - Fired when the `.mtd` extension is removed.
 */
const FinalizeDownload = exports.FinalizeDownload = _ramda2.default.curry(({ FILE }, { fd$, meta$ }) => {
  const [ok$, noop$] = (0, _Utils.IsCompleted$)(meta$).partition(Boolean);
  const Truncate = ({ FILE, meta$, fd$ }) => {
    const size$ = meta$.pluck('totalBytes');
    return FILE.truncate(_rx.Observable.combineLatest(fd$, size$).take(1));
  };
  const Rename = ({ FILE, meta$ }) => {
    const params$ = meta$.map(meta => [meta.mtdPath, meta.path]).take(1);
    return FILE.rename(params$);
  };
  return _rx.Observable.merge((0, _muxer.mux)({ noop$ }), ok$.flatMap(() => {
    const truncated$ = Truncate({ FILE, meta$, fd$ });
    const renamed$ = truncated$.flatMap(() => Rename({ FILE, meta$ }));
    return (0, _muxer.mux)({ truncated$, renamed$ });
  }));
});
//# sourceMappingURL=FinalizeDownload.js.map