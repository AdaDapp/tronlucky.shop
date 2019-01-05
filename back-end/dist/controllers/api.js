'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Test = exports.Delect = exports.Put = exports.Post = exports.Get = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var Test = exports.Test = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(ctx) {
    var res;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _smartContract3.default.getTodayBetList();

          case 2:
            res = _context2.sent;


            console.log("res:", res);
            // var res = await callback.then(function(re) {
            //   return re
            // })
            ctx.body = res;
            // console.log('')
            // const HttpProvider = TronWeb.providers.HttpProvider;
            // const fullNode = new HttpProvider('http://47.90.240.201:8090'); // Full node http endpoint
            // const solidityNode = new HttpProvider('http://47.90.240.201:8091'); // Solidity node http endpoint
            // const eventServer = new HttpProvider('http://47.90.240.201:8092'); // Contract events http endpoint

            // const privateKey = '';

            // const tronWeb = new TronWeb(
            //     fullNode,
            //     solidityNode,
            //     eventServer,
            //     privateKey
            // );
            // var res;
            // const address = 'TXsYEg41yPQKzpYBM1gwWNvpTEoGUtExTu';
            // const owner_address = tronWeb.defaultAddress.hex;
            // console.log(owner_address);
            // // The majority of the function calls are asynchronus,
            // // meaning that they cannot return the result instantly.
            // // These methods therefore return a promise, which you can await.
            // const balance = await tronWeb.trx.getBalance(address);
            // const contract = await tronWeb.trx.getContract(address);

            // res = await tronWeb.fullNode.request("wallet/triggersmartcontract", {
            //     contract_address: '41f04053ec8484e978e894c414b6caafc57917802f',
            //     owner_address: owner_address,
            //     function_selector: 'doBuy()',
            //     fee_limit: parseInt(6000000),
            //     call_value: parseInt(10000000)
            // }, "post");

            // //console.log({balance});
            // // console.log(contract);
            // console.log(res);

            // ctx.body = res;
            // ctx.body = {
            //   result: balance,
            //   name: balance,
            //   para: balance
            // }

            // // You can also bind a `then` and `catch` method.
            // tronWeb.trx.getBalance(address).then(balance => {
            //     console.log({balance});
            // }).catch(err => console.error(err));

            // // If you'd like to use a similar API to Web3, provide a callback function.
            // tronWeb.trx.getBalance(address, (err, balance) => {
            //   if (err) 
            //     return console.error(err);
            //     console.log({balance});
            // });

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TronWeb = require('tronweb');
var redis = require('redis');


var web3 = require("web3");

var Get = exports.Get = function Get(ctx) {
  console.log('dasdasd');
  ctx.body = {
    result: 'get',
    name: ctx.params.name,
    para: ctx.query
  };
};

var Post = exports.Post = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(ctx) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            ctx.body = {
              result: 'post',
              name: ctx.params.name,
              para: ctx.request.body
            };

          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function Post(_x) {
    return _ref.apply(this, arguments);
  };
}();

var Put = exports.Put = function Put(ctx) {
  ctx.body = {
    result: 'put',
    name: ctx.params.name,
    para: ctx.request.body
  };
};

var Delect = exports.Delect = function Delect(ctx) {
  ctx.body = {
    result: 'delect',
    name: ctx.params.name,
    para: ctx.request.body
  };
};
