/**
 * Created by tushar.mathur on 26/05/16.
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.demux = exports.mux = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _rx = require('rx');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var tuple = function tuple(a) {
  return function (b) {
    return [a, b];
  };
};
var createStream = function createStream(sources) {
  return function (key) {
    return sources[key].map(tuple(key));
  };
};
var match = function match(key) {
  return function (_ref) {
    var _ref2 = _slicedToArray(_ref, 1);

    var _key = _ref2[0];
    return _key === key;
  };
};
var first = function first(x) {
  return x[1];
};
var noMatch = function noMatch(keys) {
  return function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 1);

    var key = _ref4[0];
    return keys.indexOf(key) === -1;
  };
};

/**
 * Creates a multiplexed stream from all the input streams
 * @function
 * @param {Object} sources - Dictionary of source streams.
 * @returns {external:Observable} Multiplexed stream
 */
var mux = exports.mux = function mux(sources) {
  var keys = Object.keys(sources);
  return _rx.Observable.merge(keys.map(createStream(sources)));
};

/**
 * De-multiplexes the source stream
 * @function
 * @param {external:Observable} source$ - Input multiplexed stream
 * @param {...String} keys - Map of source streams
 * @returns {Array} Tuple of the selected streams and the rest of them
 */
var demux = exports.demux = function demux(source$) {
  for (var _len = arguments.length, keys = Array(_len > 1 ? _len - 1 : 0), _key2 = 1; _key2 < _len; _key2++) {
    keys[_key2 - 1] = arguments[_key2];
  }

  var createSource = function createSource(source, key) {
    var t$ = source$.filter(match(key)).map(first);
    return _extends({}, source, _defineProperty({}, key, t$));
  };

  var rest$ = source$.filter(noMatch(keys)).map(first);
  var source = keys.reduce(createSource, {});
  return [source, rest$];
};

/**
 * An observable is an interface that provides a generalized mechanism for push-based notification,
 * also known as observer design pattern.
 * @external Observable
 * @see {@link https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md RxJS Observable}
 */