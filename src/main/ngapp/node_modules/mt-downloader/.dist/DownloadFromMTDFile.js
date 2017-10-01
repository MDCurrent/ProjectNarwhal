/**
 * Created by tushar.mathur on 29/06/16.
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DownloadFromMTDFile = undefined;

var _muxer = require('muxer');

var _rx = require('rx');

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _Utils = require('./Utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Reads a `.mtd` file and resumes the download from the last successfully saved
 * byte.
 * @function
 * @param {String} mtdPath - Relative path to the `.mtd` file.
 * @param {Object} [meta] - Optional meta data to override the one that's being
 * loaded from the `.mtd` file.
 * @return {external:Observable}
 * A {@link https://github.com/tusharmath/muxer multiplexed stream} containing ~
 * - `metaWritten$` - Meta data buffer stream.
 * - `response$` - HTTP response object.
 * - `responses$` - List of all the HTTP response objects.
 * - `localFileSize$` - Size of the `.mtd` file on disk.
 * - `fdR$` - File Descriptor in `r+` mode.
 * - `meta$` - Download meta information.
 */
const DownloadFromMTDFile = exports.DownloadFromMTDFile = _ramda2.default.curryN(2, ({ FILE, HTTP }, mtdPath, _meta) => {
  /**
   * Open file to read+append
   */
  const fd$ = FILE.open(_rx.Observable.just([mtdPath, 'r+']));

  /**
   * Retrieve File size on disk
   */
  const size$ = (0, _Utils.LocalFileSize$)({ FILE, fd$ });

  /**
   * Retrieve Meta info
   */
  const metaPosition$ = (0, _Utils.MetaPosition$)({ size$ });
  const meta$ = (0, _Utils.ReadJSON$)({ FILE, fd$, position$: metaPosition$ }).map(meta => _ramda2.default.merge(meta, _meta));

  /**
   * Make a HTTP request for each thread
   */
  const { response$, buffer$ } = (0, _Utils.demuxFPH)(['buffer$', 'response$'], (0, _Utils.RequestWithMeta)(HTTP, meta$).share());

  /**
   * Select all the responses
   */
  const responses$ = (0, _Utils.RxTakeN)(meta$.map(_Utils.GetThreadCount), response$);

  /**
   * Create write params and save buffer+offset to disk
   */
  const bufferWritten$ = (0, _Utils.WriteBuffer)({ FILE, fd$, buffer$ });

  /**
   * Update META info
   */
  const nMeta$ = (0, _Utils.SetMetaOffsets)({ meta$, bufferWritten$ });

  /**
   * Persist META to disk
   */
  const metaWritten$ = FILE.write((0, _Utils.CreateWriteBufferAtParams)({
    fd$,
    buffer$: (0, _Utils.JSToBuffer$)((0, _Utils.RxThrottleComplete)(meta$.pluck('metaWrite'), nMeta$)),
    position$: size$
  }));

  /**
   * Create sink$
   */
  return (0, _muxer.mux)({
    metaWritten$, response$, responses$,
    localFileSize$: size$,
    fdR$: fd$, metaPosition$,
    meta$: _rx.Observable.merge(nMeta$, meta$)
  });
});
//# sourceMappingURL=DownloadFromMTDFile.js.map