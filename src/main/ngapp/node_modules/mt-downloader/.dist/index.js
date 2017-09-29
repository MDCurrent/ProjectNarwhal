/**
 * Created by tusharmathur on 5/15/15.
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CliValidOptions = exports.Completion = exports.DOWNLOAD_TYPES = exports.GetDownloadType = exports.MTDPath = exports.FinalizeDownload = exports.DownloadFromMTDFile = exports.CreateMTDFile = exports.BAR = exports.FILE = exports.HTTP = undefined;

var _Utils = require('./Utils');

var U = _interopRequireWildcard(_Utils);

var _IO = require('./IO');

var T = _interopRequireWildcard(_IO);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _gracefulFs = require('graceful-fs');

var _gracefulFs2 = _interopRequireDefault(_gracefulFs);

var _progress = require('progress');

var _progress2 = _interopRequireDefault(_progress);

var _CreateMTDFile2 = require('./CreateMTDFile');

var _DownloadFromMTDFile2 = require('./DownloadFromMTDFile');

var _FinalizeDownload2 = require('./FinalizeDownload');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const HTTP = exports.HTTP = T.HTTP(_request2.default);
const FILE = exports.FILE = T.FILE(_gracefulFs2.default);
const BAR = exports.BAR = T.BAR(_progress2.default);

const CreateMTDFile = exports.CreateMTDFile = _ramda2.default.compose((0, _CreateMTDFile2.CreateMTDFile)({
  FILE,
  HTTP
}), U.MergeDefaultOptions);
const DownloadFromMTDFile = exports.DownloadFromMTDFile = (0, _DownloadFromMTDFile2.DownloadFromMTDFile)({ FILE, HTTP });
const FinalizeDownload = exports.FinalizeDownload = (0, _FinalizeDownload2.FinalizeDownload)({ FILE });
const MTDPath = exports.MTDPath = U.MTDPath;
const GetDownloadType = exports.GetDownloadType = U.GetDownloadType(U.NormalizePath);
const DOWNLOAD_TYPES = exports.DOWNLOAD_TYPES = U.DOWNLOAD_TYPES;

const Completion = exports.Completion = U.Completion;
const CliValidOptions = exports.CliValidOptions = U.CliValidOptions;

/**
 * @external Observable
 * @see {@link https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md}
 */
//# sourceMappingURL=index.js.map