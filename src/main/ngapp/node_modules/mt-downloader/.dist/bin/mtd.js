#!/usr/bin/env node

/**
 * Created by tushar.mathur on 04/06/16.
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Executor = exports.DownloadOptions = exports.IsNewDownload = exports.ValidOptions = exports.Size = exports.FlatMapShare = exports.LogAlways = exports.LogError = exports.Log = undefined;

var _meow = require('meow');

var _meow2 = _interopRequireDefault(_meow);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _muxer = require('muxer');

var _rx = require('rx');

var _RxFP = require('../RxFP');

var Rx = _interopRequireWildcard(_RxFP);

var _index = require('../index');

var _Messages = require('./Messages');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * LIB
 */
const Log = exports.Log = console.log.bind(console);
const LogError = exports.LogError = console.error.bind(console);
const LogAlways = exports.LogAlways = message => () => Log(message);
const FlatMapShare = exports.FlatMapShare = _ramda2.default.curry((func, $) => $.flatMap(func).share());
const Size = exports.Size = meta$ => meta$.pluck('totalBytes').take(1);
const ValidOptions = exports.ValidOptions = Rx.partition(_index.CliValidOptions);
const IsNewDownload = exports.IsNewDownload = _ramda2.default.whereEq({ type: _index.DOWNLOAD_TYPES.NEW });
const DownloadOptions = exports.DownloadOptions = _ramda2.default.compose(_ramda2.default.map(Rx.pluck('options')), Rx.partition(IsNewDownload), _index.GetDownloadType);
const Executor = exports.Executor = signal$ => {
  const [{ size$, completion$, invalidOptions$, validOptions$ }] = (0, _muxer.demux)(signal$, 'size$', 'completion$', 'invalidOptions$', 'validOptions$');
  _rx.Observable.merge(validOptions$.take(1).map(msg => [msg, LogAlways('\nStarting...')]), size$.map(msg => [msg, _ramda2.default.compose(Log, _Messages.Status)]), invalidOptions$.map(msg => [msg, LogAlways(_Messages.Help)]), completion$.map(msg => [msg, _index.BAR])).subscribe(([msg, action]) => action(msg), _ramda2.default.partial(LogError, ['Failure']), _ramda2.default.partial(Log, ['Complete']));
};

const [validOptions$, invalidOptions$] = ValidOptions(_rx.Observable.just((0, _meow2.default)(_Messages.Help).flags).shareReplay(1));
const [new$, resume$] = DownloadOptions(validOptions$);
const created$ = FlatMapShare(_index.CreateMTDFile, new$).takeLast(1);
const mtdFile$ = _rx.Observable.merge(resume$, Rx.sample([new$], created$).map(_ramda2.default.head)).pluck('mtdPath');
const downloaded$ = FlatMapShare(_index.DownloadFromMTDFile, mtdFile$);
const [{ fdR$, meta$ }] = (0, _muxer.demux)(downloaded$, 'meta$', 'fdR$');
const finalized$ = FlatMapShare(_index.FinalizeDownload, Rx.sample([fdR$, meta$], downloaded$.last()).map(([fd, meta]) => ({ fd$: _rx.Observable.just(fd), meta$: _rx.Observable.just(meta) })).last());
const completion$ = (0, _index.Completion)(meta$.throttle(1000));
const size$ = Size(meta$);
Executor((0, _muxer.mux)({ finalized$, size$, completion$, invalidOptions$, validOptions$ }));
//# sourceMappingURL=mtd.js.map