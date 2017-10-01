/**
 * Created by tushar.mathur on 18/06/16.
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Request = exports.RequestParams = exports.ev = undefined;

var _rx = require('rx');

var _muxer = require('muxer');

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ev = exports.ev = _ramda2.default.curry(($, event) => $.filter(_ramda2.default.whereEq({ event })).pluck('message'));

const RequestParams = exports.RequestParams = _ramda2.default.curry((request, params) => {
  return _rx.Observable.create(observer => request(params).on('data', message => observer.onNext({ event: 'data', message })).on('response', message => observer.onNext({ event: 'response', message })).on('complete', () => observer.onCompleted()).on('error', error => observer.onError(error)));
});

const Request = exports.Request = _ramda2.default.curry((request, params) => {
  const Response$ = ev(RequestParams(request, params));
  return (0, _muxer.mux)({
    response$: Response$('response'),
    data$: Response$('data')
  });
});
//# sourceMappingURL=Request.js.map