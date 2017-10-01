/**
 * Created by tushar.mathur on 29/06/16.
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateMTDFile = undefined;

var _muxer = require('muxer');

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _rx = require('rx');

var _Utils = require('./Utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Creates a new .mtd file that is a little larger in size than the original
 * file. The file is initially empty and has all the relevant meta
 * information regarding the download appended to the end.
 * @function
 * @param {object} options - The `options` must have `mtdPath` and `url`.
 * @param {string} options.url - Download url.
 * @param {string} options.path - Relative path where the file needs to be saved.
 * @param {number} [options.range=3] - Number of concurrent downloads.
 * @param {number} [options.metaWrite=300] - Throttles the write frequency of meta data.
 * @return {external:Observable}
 * A {@link https://github.com/tusharmath/muxer multiplexed stream} containing ~
 * - `written$` - Bytes being saved on disk.
 * - `meta$` - Meta information about the download.
 * - `remoteFileSize$` - Size of the content that is to be downloaded.
 * - `fdW$` - File descriptor in `w` mode.
 */
const CreateMTDFile = exports.CreateMTDFile = _ramda2.default.curry(({ FILE, HTTP }, options) => {
  /**
   * Create a new file
   */
  const fd$ = FILE.open(_rx.Observable.just([options.mtdPath, 'w']));

  /**
   * Retrieve file size on remote server
   */
  const size$ = (0, _Utils.RemoteFileSize$)({ HTTP, options });

  /**
   * Create initial meta data
   */
  const meta$ = (0, _Utils.CreateMeta$)({ options, size$ });

  /**
   * Create a new file with meta info appended at the end
   */
  const written$ = FILE.write((0, _Utils.CreateWriteBufferAtParams)({
    FILE,
    fd$: fd$,
    buffer$: (0, _Utils.JSToBuffer$)(meta$),
    position$: size$
  }));
  return (0, _muxer.mux)({ written$, meta$, remoteFileSize$: size$, fdW$: fd$ });
});
//# sourceMappingURL=CreateMTDFile.js.map