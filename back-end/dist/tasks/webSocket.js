'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var scheduleCronstyle = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var rule, seconds;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        rule = new schedule.RecurrenceRule();
                        // 每5秒钟执行一次

                        seconds = [1, 6, 11, 16, 21, 26, 31, 36, 41, 46, 51, 56];

                        rule.second = seconds;
                        //每分钟的第30秒定时执行一次:
                        schedule.scheduleJob(rule, function () {
                            var status = _redis2.default.get(SMART_CONTRACT_STATUS);
                            var price = _redis2.default.get(SMART_CONTRACT_PRICE);
                            var minwen = _redis2.default.get(SMART_CONTRACT_MIN);
                            var miwen = _redis2.default.get(SMART_CONTRACT_HASH);
                            _promise2.default.all([status, price, minwen, miwen]).then(function (result) {
                                // console.log(result);
                                if (!result || result.length < 2) {
                                    return;
                                }
                                var statusValue = result[0];
                                var priceValue = result[1];
                                var minwenValue = result[2];
                                var miwenValue = '';
                                if (global.canShowMinwen) {
                                    miwenValue = result[3];
                                }
                                if (statusValue && priceValue) {
                                    var obj = {
                                        statusValue: statusValue,
                                        priceValue: parseInt(priceValue) / 1000000,
                                        minwenValue: minwenValue,
                                        miwenValue: miwenValue
                                    };
                                    for (var i = 0; i < global.ws.length; i++) {
                                        global.ws[i].websocket.send((0, _stringify2.default)(obj));
                                    }
                                }
                            });
                        });

                    case 4:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function scheduleCronstyle() {
        return _ref.apply(this, arguments);
    };
}();

var _redis = require('../tool/redis.js');

var _redis2 = _interopRequireDefault(_redis);

var _config = require('../config.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schedule = require('node-schedule');
var SMART_CONTRACT_STATUS = _config.RedisKeys.SMART_CONTRACT_STATUS,
    SMART_CONTRACT_PRICE = _config.RedisKeys.SMART_CONTRACT_PRICE,
    SMART_CONTRACT_MIN = _config.RedisKeys.SMART_CONTRACT_MIN,
    SMART_CONTRACT_HASH = _config.RedisKeys.SMART_CONTRACT_HASH;


scheduleCronstyle();