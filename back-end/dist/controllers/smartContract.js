'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Test = exports.saveBetDetailInfo = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

// 保存用户投注信息
var saveBetDetailInfo = exports.saveBetDetailInfo = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(ctx) {
    var param, round, array, res;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            param = ctx.request.body;
            _context.next = 3;
            return _redis2.default.get(SMART_CONTRACT_ROUND);

          case 3:
            round = _context.sent;
            array = [];

            array.push(param.player);
            array.push(param.amount);
            array.push(round);
            console.log('saveBetDetailInfo param:', array);

            if (!(array && array.length > 0)) {
              _context.next = 16;
              break;
            }

            _context.next = 12;
            return _smartContract3.default.insertBetDetailInfo(array);

          case 12:
            res = _context.sent;

            if (!(res.insertId >= 0)) {
              _context.next = 16;
              break;
            }

            ctx.body = 'success';
            return _context.abrupt('return');

          case 16:
            ctx.body = 'fail';

          case 17:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function saveBetDetailInfo(_x) {
    return _ref.apply(this, arguments);
  };
}();

var Test = exports.Test = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(ctx) {
    var res;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _smartContract.sendBonusAndFee)('22');

          case 2:
            res = _context2.sent;


            // var res = await dbUtils.getTodayList();

            // var arry = ['3123123125', '1000', '2'];
            // var res = await dbUtils.insertBetDetailInfo(arry);

            // var arry = ['3123123125', '2', '900'];
            // var res = await dbUtils.insertWinDetailInfo(arry);

            // var res = await dbUtils.getMineBetList('3123123123')


            console.log("res:", res);
            // var res = await callback.then(function(re) {
            //   return re
            // })
            ctx.body = res;

          case 5:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function Test(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var _smartContract = require('../services/smartContract.js');

var _config = require('../config.js');

var _Common = require('../tool/Common.js');

var _smartContract2 = require('../db/smartContract.js');

var _smartContract3 = _interopRequireDefault(_smartContract2);

var _redis = require('../tool/redis.js');

var _redis2 = _interopRequireDefault(_redis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TronWeb = require('tronweb');
var redis = require('redis');
var SMART_CONTRACT_ROUND = _config.RedisKeys.SMART_CONTRACT_ROUND;


var web3 = require("web3");