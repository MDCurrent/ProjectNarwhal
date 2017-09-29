/**
 * Created by tushar.mathur on 22/01/16.
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RxTakeN = exports.CliValidOptions = exports.GetDownloadType = exports.RemoveExtension = exports.DOWNLOAD_TYPES = exports.RequestWithMeta = exports.WriteBuffer = exports.Completion = exports.TapBetween = exports.IsCompleted$ = exports.RxThrottleComplete = exports.FlattenMeta$ = exports.IsOffsetInRange = exports.ReadJSON$ = exports.SetMetaOffsets = exports.CreateWriteBufferParams = exports.CreateWriteBufferAtParams = exports.MetaPosition$ = exports.ReadFileAt$ = exports.CreateMeta$ = exports.PickFirst = exports.LocalFileSize$ = exports.RemoteFileSize$ = exports.BufferToJS$ = exports.JSToBuffer$ = exports.ToBuffer$ = exports.ToJSON$ = exports.RequestThread = exports.SetBufferParams = exports.GetBufferWriteOffset = exports.TimesCount = exports.GetThreadCount = exports.GetThreadEnd = exports.GetThreadStart = exports.GetThread = exports.GetOffset = exports.MergeDefaultOptions = exports.MTDPath = exports.CreateFilledBuffer = exports.ToBuffer = exports.CreateRequestParams = exports.SetRangeHeader = exports.CreateRangeHeader = exports.SplitRange = exports.ResolvePath = exports.GenerateFileName = exports.NormalizePath = exports.BUFFER_SIZE = exports.demuxFPH = exports.demuxFP = exports.trace = undefined;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _rx = require('rx');

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _RxFP = require('./RxFP');

var Rx = _interopRequireWildcard(_RxFP);

var _muxer = require('muxer');

var _Error = require('./Error');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const first = _ramda2.default.nth(0);
const second = _ramda2.default.nth(1);
const trace = exports.trace = _ramda2.default.curry((msg, value) => {
  console.log(msg, value);
  return value;
});
const demuxFP = exports.demuxFP = _ramda2.default.curry((list, $) => (0, _muxer.demux)($, ...list));
const demuxFPH = exports.demuxFPH = _ramda2.default.curry((list, $) => _ramda2.default.head((0, _muxer.demux)($, ...list)));
const BUFFER_SIZE = exports.BUFFER_SIZE = 1024 * 4;
const NormalizePath = exports.NormalizePath = path => _path2.default.resolve(process.cwd(), path);
const GenerateFileName = exports.GenerateFileName = x => {
  return _ramda2.default.last(_url2.default.parse(x).pathname.split('/')) || Date.now();
};
const ResolvePath = exports.ResolvePath = _ramda2.default.compose(NormalizePath, GenerateFileName);
const SplitRange = exports.SplitRange = (totalBytes, range) => {
  const delta = Math.round(totalBytes / range);
  const start = _ramda2.default.times(x => x * delta, range);
  const end = _ramda2.default.times(x => (x + 1) * delta - 1, range);
  end[range - 1] = totalBytes;
  return _ramda2.default.zip(start, end);
};
const CreateRangeHeader = exports.CreateRangeHeader = ([start, end]) => `bytes=${ start }-${ end }`;
const SetRangeHeader = exports.SetRangeHeader = ({ request, range }) => {
  return _ramda2.default.set(_ramda2.default.lensPath(['headers', 'range']), CreateRangeHeader(range), _ramda2.default.omit(['threads', 'offsets'], request));
};
const CreateRequestParams = exports.CreateRequestParams = ({ meta, index }) => {
  const range = [meta.offsets[index], second(meta.threads[index])];
  return SetRangeHeader({ request: meta, range });
};
const ToBuffer = exports.ToBuffer = _ramda2.default.curry((size, str) => {
  var buffer = CreateFilledBuffer(size);
  buffer.write(str);
  return buffer;
});
const CreateFilledBuffer = exports.CreateFilledBuffer = (size = BUFFER_SIZE, fill = ' ') => {
  const buffer = new Buffer(size);
  buffer.fill(fill);
  return buffer;
};
const MTDPath = exports.MTDPath = path => path + '.mtd';
const MergeDefaultOptions = exports.MergeDefaultOptions = options => _ramda2.default.mergeAll([{ range: 3, metaWrite: 300 }, { mtdPath: MTDPath(_ramda2.default.prop('path', options)) }, options]);

// TODO: Use R.lens instead
const GetOffset = exports.GetOffset = _ramda2.default.curry((meta, index) => meta.offsets[index]);
const GetThread = exports.GetThread = _ramda2.default.curry((meta, index) => meta.threads[index]);
const GetThreadStart = exports.GetThreadStart = _ramda2.default.curryN(2, _ramda2.default.compose(_ramda2.default.nth(0), GetThread));
const GetThreadEnd = exports.GetThreadEnd = _ramda2.default.curryN(2, _ramda2.default.compose(_ramda2.default.nth(1), GetThread));
const GetThreadCount = exports.GetThreadCount = _ramda2.default.compose(_ramda2.default.length, _ramda2.default.prop('threads'));
const TimesCount = exports.TimesCount = _ramda2.default.times(_ramda2.default.identity);

/*
 * STREAM BASED
 */
const GetBufferWriteOffset = exports.GetBufferWriteOffset = ({ buffer$, initialOffset }) => {
  const accumulator = ([_buffer, _offset], buffer) => [buffer, _buffer.length + _offset];
  return buffer$.scan(accumulator, [{ length: 0 }, initialOffset]);
};
const SetBufferParams = exports.SetBufferParams = ({ buffer$, index, meta }) => {
  const initialOffset = GetOffset(meta, index);
  const addParams = _ramda2.default.compose(Rx.map(_ramda2.default.append(index)), GetBufferWriteOffset);
  return addParams({ buffer$, initialOffset });
};

/**
 * Makes an HTTP request using the {HttpRequest} function and appends the
 * buffer response with appropriate write position and thread index.
 * @function
 * @private
 * @param {Object} HTTP - HTTP transformer
 * @param {function} HTTP.request - HTTP request function
 * @param {Object} r - a dict of meta and selected thread index
 * @param {Object} r.meta - the download meta info
 * @param {Object} r.index - index of the selected thread
 * @returns {Observable} a muxed {buffer$, response$}
 */
const RequestThread = exports.RequestThread = _ramda2.default.curry((HTTP, { meta, index }) => {
  const pluck = demuxFPH(['data$', 'response$']);
  const HttpRequest = _ramda2.default.compose(HTTP.request, CreateRequestParams);
  const { response$, data$ } = pluck(HttpRequest({ meta, index }));
  const buffer$ = SetBufferParams({ buffer$: data$, meta, index });
  return (0, _muxer.mux)({ buffer$, response$ });
});
const ToJSON$ = exports.ToJSON$ = source$ => source$.map(JSON.stringify.bind(JSON));
const ToBuffer$ = exports.ToBuffer$ = source$ => source$.map(ToBuffer(BUFFER_SIZE));
const JSToBuffer$ = exports.JSToBuffer$ = _ramda2.default.compose(ToBuffer$, ToJSON$);
const BufferToJS$ = exports.BufferToJS$ = buffer$ => {
  return buffer$.map(buffer => JSON.parse(buffer.toString()));
};
const RemoteFileSize$ = exports.RemoteFileSize$ = ({ HTTP, options }) => {
  return HTTP.requestHead(options).pluck('headers', 'content-length').map(x => parseInt(x, 10));
};
const LocalFileSize$ = exports.LocalFileSize$ = ({ FILE, fd$ }) => {
  return FILE.fstat(fd$.map(_ramda2.default.of)).pluck('size');
};
const PickFirst = exports.PickFirst = _ramda2.default.map(first);
const CreateMeta$ = exports.CreateMeta$ = ({ size$, options }) => {
  return size$.map(totalBytes => {
    if (!isFinite(totalBytes)) throw new _Error.MTDError(_Error.FILE_SIZE_UNKNOWN);
    const threads = SplitRange(totalBytes, options.range);
    return _ramda2.default.merge(options, { totalBytes, threads, offsets: PickFirst(threads) });
  });
};
const ReadFileAt$ = exports.ReadFileAt$ = ({ FILE, fd$, position$, size = BUFFER_SIZE }) => {
  const readParams$ = _rx.Observable.combineLatest(position$, fd$);
  const buffer = CreateFilledBuffer(size);
  const toParam = ([position, fd]) => [fd, buffer, 0, buffer.length, position];
  return FILE.read(readParams$.map(toParam));
};
const MetaPosition$ = exports.MetaPosition$ = ({ size$ }) => size$.map(_ramda2.default.add(-BUFFER_SIZE));
const CreateWriteBufferAtParams = exports.CreateWriteBufferAtParams = ({ fd$, buffer$, position$ }) => {
  const toParam = ([buffer, fd, position]) => [fd, buffer, 0, buffer.length, position];
  return _rx.Observable.combineLatest(buffer$, fd$, position$.first()).map(toParam);
};
const CreateWriteBufferParams = exports.CreateWriteBufferParams = _ramda2.default.compose(_rx.Observable.just, ([fd, buffer, position]) => [fd, buffer, 0, buffer.length, position], _ramda2.default.unnest);
const SetMetaOffsets = exports.SetMetaOffsets = ({ meta$, bufferWritten$ }) => {
  const offsetLens = thread => _ramda2.default.compose(_ramda2.default.lensProp('offsets'), _ramda2.default.lensIndex(thread));
  const start$ = meta$.map(meta => ({ meta, len: 0, thread: 0 })).first();
  const source$ = _rx.Observable.merge(start$, bufferWritten$.map(x => [x[3], x[2]]).map(_ramda2.default.zipObj(['len', 'thread'])).withLatestFrom(meta$.map(_ramda2.default.objOf('meta'))).map(_ramda2.default.mergeAll));

  const accumulator = (previous, current) => {
    const thread = current.thread;
    const pMeta = previous.meta;
    const oldVal = pMeta.offsets[thread];
    const lens = offsetLens(thread);
    const meta = _ramda2.default.set(lens, _ramda2.default.add(oldVal, current.len), pMeta);
    return _ramda2.default.merge(current, { meta });
  };
  return source$.scan(accumulator).skip(1).pluck('meta');
};
const ReadJSON$ = exports.ReadJSON$ = _ramda2.default.compose(BufferToJS$, Rx.map(second), ReadFileAt$);
const IsOffsetInRange = exports.IsOffsetInRange = _ramda2.default.curry((meta, i) => {
  const start = _ramda2.default.lte(GetThreadStart(meta, i));
  const end = _ramda2.default.gt(GetThreadEnd(meta, i));
  const inRange = _ramda2.default.allPass([start, end]);
  return inRange(GetOffset(meta, i));
});
const FlattenMeta$ = exports.FlattenMeta$ = Rx.flatMap(meta => {
  const MergeMeta = _ramda2.default.map(_ramda2.default.compose(_ramda2.default.merge({ meta }), _ramda2.default.objOf('index')));
  const IsValid = _ramda2.default.filter(IsOffsetInRange(meta));
  return MergeMeta(IsValid(TimesCount(GetThreadCount(meta))));
});
const RxThrottleComplete = exports.RxThrottleComplete = (window$, $, sh) => {
  const selector = window => _rx.Observable.merge($.throttle(window, sh), $.last());
  return window$.first().flatMap(selector);
};
const IsCompleted$ = exports.IsCompleted$ = meta$ => {
  const offsetsA = _ramda2.default.prop('offsets');
  const offsetsB = _ramda2.default.compose(_ramda2.default.map(second), _ramda2.default.prop('threads'));
  const subtract = _ramda2.default.apply(_ramda2.default.subtract);
  const diff = _ramda2.default.compose(_ramda2.default.all(_ramda2.default.lte(0)), _ramda2.default.map(subtract), _ramda2.default.zip);
  const isComplete = _ramda2.default.converge(diff, [offsetsA, offsetsB]);
  return meta$.map(isComplete).distinctUntilChanged();
};
const TapBetween = exports.TapBetween = _ramda2.default.curry((min, max, value) => {
  return Math.min(max, Math.max(min, value));
});

/**
 * Util method that calculates the total completion percentage (between 0-100).
 * @function
 * @param {Observable} meta$ Meta data stream ie. exposed by {@link DownloadFromMTDFile}
 * @return {external:Observable} Value between 0-100
 */
const Completion = exports.Completion = meta$ => {
  const tap0To100 = TapBetween(0, 1);
  return meta$.map(meta => {
    const total = meta.totalBytes;
    const downloaded = _ramda2.default.sum(meta.offsets) - _ramda2.default.sum(_ramda2.default.map(_ramda2.default.nth(0), meta.threads)) + _ramda2.default.length(meta.threads) - 1;
    return tap0To100(Math.ceil(downloaded / total * 100) / 100);
  });
};
const WriteBuffer = exports.WriteBuffer = ({ FILE, fd$, buffer$ }) => {
  const Write = _ramda2.default.compose(FILE.write, CreateWriteBufferParams);
  return _rx.Observable.combineLatest(fd$, buffer$).flatMap(params => {
    return Write(params).map(_ramda2.default.concat(_ramda2.default.nth(1, params)));
  });
};
/**
 * Makes HTTP requests to start downloading data for each thread described in
 * the meta data.
 * @function
 * @private
 * @param {Object} HTTP - an HTTP transformer
 * @param {function} HTTP.request - an HTTP transformer
 * @param {Observable} meta$ - meta data as a stream
 * @returns {Observable} - muxed stream of responses$ and buffer$
 */
const RequestWithMeta = exports.RequestWithMeta = _ramda2.default.uncurryN(2, HTTP => _ramda2.default.compose(Rx.flatMap(RequestThread(HTTP)), FlattenMeta$));

const DOWNLOAD_TYPES = exports.DOWNLOAD_TYPES = {
  NEW: 0,
  OLD: 1
};
const RemoveExtension = exports.RemoveExtension = _ramda2.default.replace(/\.mtd$/, '');
const GetDownloadType = exports.GetDownloadType = _ramda2.default.curry((NormalizePath, options$) => {
  const MergeType = type => _ramda2.default.compose(_ramda2.default.merge({ type }), _ramda2.default.objOf('options'));
  const GetPathFromURL = _ramda2.default.compose(NormalizePath, GenerateFileName, _ramda2.default.prop('url'));
  const GetPathFromFile = _ramda2.default.compose(NormalizePath, RemoveExtension, _ramda2.default.prop('file'));
  const GetMtdPathFromPath = _ramda2.default.compose(MTDPath, _ramda2.default.prop('path'));
  const MetaAssoc = _ramda2.default.curry((prop, T, options) => _ramda2.default.assoc(prop, T(options), options));
  const setPathFromURL = MetaAssoc('path', GetPathFromURL);
  const setPathFromFile = MetaAssoc('path', GetPathFromFile);
  const setMtdPath = MetaAssoc('mtdPath', GetMtdPathFromPath);

  const [ok$, not$] = options$.partition(x => x.url);
  return _rx.Observable.merge(ok$.map(_ramda2.default.compose(setMtdPath, setPathFromURL)).map(MergeType(DOWNLOAD_TYPES.NEW)), not$.map(_ramda2.default.compose(setMtdPath, setPathFromFile)).map(MergeType(DOWNLOAD_TYPES.OLD)));
});
const CliValidOptions = exports.CliValidOptions = _ramda2.default.anyPass([_ramda2.default.has('url'), _ramda2.default.has('file')]);
const RxTakeN = exports.RxTakeN = _ramda2.default.curry((n$, $) => {
  const accum = (memory, [value, count]) => {
    return { list: _ramda2.default.append(value, memory.list), count };
  };
  return $.withLatestFrom(n$).scan(accum, { list: [] }).filter(({ list, count }) => _ramda2.default.equals(_ramda2.default.length(list), count)).pluck('list').take(1);
});
//# sourceMappingURL=Utils.js.map