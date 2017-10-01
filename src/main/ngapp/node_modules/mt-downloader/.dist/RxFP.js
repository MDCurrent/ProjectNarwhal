/**
 * Created by tushar.mathur on 10/06/16.
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sample = exports.subscribe = exports.first = exports.partition = exports.share = exports.tap = exports.trace = exports.repeat = exports.shareReplay = exports.scanWith = exports.scan = exports.pluck = exports.distinctUntilChanged = exports.filter = exports.zipWith = exports.zip = exports.withLatestFrom = exports.flatMap = exports.map = undefined;

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _rx = require('rx');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const map = exports.map = _ramda2.default.curry((func, $) => $.map(func));
const flatMap = exports.flatMap = _ramda2.default.curry((func, $) => $.flatMap(func));
const withLatestFrom = exports.withLatestFrom = _ramda2.default.curry((list, $) => $.withLatestFrom(...list));
const zip = exports.zip = _ramda2.default.curry((list, $) => $.zip(...list));
const zipWith = exports.zipWith = _ramda2.default.curry((func, list, $) => $.zip(...list, func));
const filter = exports.filter = _ramda2.default.curry((func, $) => $.filter(func));
const distinctUntilChanged = exports.distinctUntilChanged = $ => $.distinctUntilChanged();
const pluck = exports.pluck = _ramda2.default.curry((path, $) => $.pluck(path));
const scan = exports.scan = _ramda2.default.curry((func, $) => $.scan(func));
const scanWith = exports.scanWith = _ramda2.default.curry((func, m, $) => $.scan(func, m));
const shareReplay = exports.shareReplay = _ramda2.default.curry((count, $) => $.shareReplay(count));
const repeat = exports.repeat = _ramda2.default.curry((value, count) => _rx.Observable.repeat(value, count));
const trace = exports.trace = _ramda2.default.curry((msg, $) => $.tap(x => console.log(msg, x)));
const tap = exports.tap = _ramda2.default.curry((func, $) => $.tap(func));
const share = exports.share = $ => $.share();
const partition = exports.partition = _ramda2.default.curry((func, $) => $.partition(func));
const first = exports.first = $ => $.first();
const subscribe = exports.subscribe = _ramda2.default.curry((observer, $) => $.subscribe(observer));
const sample = exports.sample = _ramda2.default.curry((a$$, b$) => b$.withLatestFrom(...a$$).map(_ramda2.default.tail));
//# sourceMappingURL=RxFP.js.map