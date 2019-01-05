'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queryRound = exports.sendRefund = exports.sendBonusAndFee = exports.doRefund = exports.roundLucky = exports.gettransactioninfobyid = exports.doLucky = exports.testsh3 = exports.commitHash = exports.commitDeposit = exports.queryAssistantInfo = exports.queryPrice = exports.queryStatus = exports.doBuy = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

// 后台调用doBuy方法
var doBuy = exports.doBuy = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var res;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return tronWeb.fullNode.request("wallet/triggersmartcontract", {
              // contract_address: '41f04053ec8484e978e894c414b6caafc57917802f',
              contract_address: _config.smartContract.contractHexAddress,
              owner_address: owner_address,
              function_selector: 'doBuy()',
              fee_limit: parseInt(6000000),
              call_value: parseInt(10000000)
            }, "post");

          case 2:
            res = _context.sent;
            return _context.abrupt('return', res);

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function doBuy() {
    return _ref.apply(this, arguments);
  };
}();

// 请求智能合约status方法


var queryStatus = exports.queryStatus = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    var res;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return tronWeb.fullNode.request("wallet/triggersmartcontract", {
              contract_address: _config.smartContract.contractHexAddress,
              owner_address: owner_address,
              function_selector: 'status()',
              fee_limit: parseInt(6000000)
            }, "post");

          case 2:
            res = _context2.sent;
            return _context2.abrupt('return', res);

          case 4:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function queryStatus() {
    return _ref2.apply(this, arguments);
  };
}();

// 请求智能合约status方法


var queryPrice = exports.queryPrice = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
    var res;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return tronWeb.fullNode.request("wallet/triggersmartcontract", {
              contract_address: _config.smartContract.contractHexAddress,
              owner_address: owner_address,
              function_selector: 'price()',
              fee_limit: parseInt(6000000)
            }, "post");

          case 2:
            res = _context3.sent;
            return _context3.abrupt('return', res);

          case 4:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function queryPrice() {
    return _ref3.apply(this, arguments);
  };
}();

// 请求智能合约assistantInfo方法


var queryAssistantInfo = exports.queryAssistantInfo = function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
    var res;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            console.log('contractHexAddress:', _config.smartContract.contractHexAddress);
            _context4.next = 3;
            return tronWeb.fullNode.request("wallet/triggersmartcontract", {
              contract_address: _config.smartContract.contractHexAddress,
              owner_address: owner_address,
              function_selector: 'assistant()',
              fee_limit: parseInt(6000000)
            }, "post");

          case 3:
            res = _context4.sent;

            console.log('assistantInfo res:', res);
            return _context4.abrupt('return', res);

          case 6:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function queryAssistantInfo() {
    return _ref4.apply(this, arguments);
  };
}();

// 提交保证金


var commitDeposit = exports.commitDeposit = function () {
  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(value) {
    var contract, contract2, res;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return tronWeb.trx.getContract(_config.smartContract.contractBase58Address);

          case 2:
            contract = _context5.sent;
            _context5.next = 5;
            return tronWeb.contract(contract.abi.entrys, _config.smartContract.contractHexAddress);

          case 5:
            contract2 = _context5.sent;

            console.log('commitDeposit callValue:', value);
            _context5.next = 9;
            return contract2.commitDeposit().send({
              callValue: parseInt(value)
            });

          case 9:
            res = _context5.sent;
            return _context5.abrupt('return', res);

          case 11:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function commitDeposit(_x) {
    return _ref5.apply(this, arguments);
  };
}();

// 提交Hash到智能合约


var commitHash = exports.commitHash = function () {
  var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
    var minwen, hashValue, contract, contract2, res;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            minwen = (0, _Common.getMinWen)();
            hashValue = (0, _Common.getHashCode)(web3, minwen);

            console.log('minwen:', minwen);
            console.log('hashValue:', hashValue);
            _redis2.default.set(SMART_CONTRACT_MIN, minwen);
            _redis2.default.set(SMART_CONTRACT_HASH, hashValue);
            _context6.next = 8;
            return tronWeb.trx.getContract(_config.smartContract.contractBase58Address);

          case 8:
            contract = _context6.sent;
            _context6.next = 11;
            return tronWeb.contract(contract.abi.entrys, _config.smartContract.contractHexAddress);

          case 11:
            contract2 = _context6.sent;
            _context6.next = 14;
            return contract2.commitHash(hashValue).send();

          case 14:
            res = _context6.sent;
            return _context6.abrupt('return', res);

          case 16:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function commitHash() {
    return _ref6.apply(this, arguments);
  };
}();

// 测试加密算法


var testsh3 = exports.testsh3 = function () {
  var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
    var minwen, hashValue;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            minwen = '6d052cf8f6cece3720fa8244f8019f5513e6f34b1e4bd09e3f1895763885d4d6';
            // var minwen = 'test'

            hashValue = (0, _Common.getHashCode)(web3, minwen);

            console.log('minwen:', minwen);
            console.log('hashValue:', hashValue);
            return _context7.abrupt('return', hashValue);

          case 5:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));

  return function testsh3() {
    return _ref7.apply(this, arguments);
  };
}();

// 提交明文到智能合约


var doLucky = exports.doLucky = function () {
  var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(value) {
    var contract, contract2, minWen, result, res;
    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return tronWeb.trx.getContract(_config.smartContract.contractBase58Address);

          case 2:
            contract = _context9.sent;
            _context9.next = 5;
            return tronWeb.contract(contract.abi.entrys, _config.smartContract.contractHexAddress);

          case 5:
            contract2 = _context9.sent;

            if (value) {
              _context9.next = 14;
              break;
            }

            // 从缓存中取明文
            minWen = _redis2.default.get(SMART_CONTRACT_MIN);
            _context9.next = 10;
            return minWen.then(function () {
              var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(value) {
                var test11;
                return _regenerator2.default.wrap(function _callee8$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        console.log('doLucky minwen:', value);

                        if (!value) {
                          _context8.next = 6;
                          break;
                        }

                        _context8.next = 4;
                        return contract2.doLucky(value).send().then(function (res2) {
                          return res2;
                        });

                      case 4:
                        test11 = _context8.sent;
                        return _context8.abrupt('return', test11);

                      case 6:
                      case 'end':
                        return _context8.stop();
                    }
                  }
                }, _callee8, this);
              }));

              return function (_x3) {
                return _ref9.apply(this, arguments);
              };
            }());

          case 10:
            result = _context9.sent;
            return _context9.abrupt('return', result);

          case 14:
            _context9.next = 16;
            return contract2.doLucky(value).send();

          case 16:
            res = _context9.sent;
            return _context9.abrupt('return', res);

          case 18:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, this);
  }));

  return function doLucky(_x2) {
    return _ref8.apply(this, arguments);
  };
}();

// 获取txid的状态


var gettransactioninfobyid = exports.gettransactioninfobyid = function () {
  var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(txid) {
    var res;
    return _regenerator2.default.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return tronWeb.solidityNode.request("walletsolidity/gettransactioninfobyid", {
              value: txid
            }, "post");

          case 2:
            res = _context10.sent;

            console.log('gettransactioninfobyid res:', res);
            return _context10.abrupt('return', res);

          case 5:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, this);
  }));

  return function gettransactioninfobyid(_x4) {
    return _ref10.apply(this, arguments);
  };
}();

// 获取中奖者的信息


var roundLucky = exports.roundLucky = function () {
  var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11(value) {
    var contract, contract2, res;
    return _regenerator2.default.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.next = 2;
            return tronWeb.trx.getContract(_config.smartContract.contractBase58Address);

          case 2:
            contract = _context11.sent;
            _context11.next = 5;
            return tronWeb.contract(contract.abi.entrys, _config.smartContract.contractHexAddress);

          case 5:
            contract2 = _context11.sent;
            _context11.next = 8;
            return contract2.roundLucky(value).call();

          case 8:
            res = _context11.sent;

            console.log('roundLucky res:', res);
            return _context11.abrupt('return', res);

          case 11:
          case 'end':
            return _context11.stop();
        }
      }
    }, _callee11, this);
  }));

  return function roundLucky(_x5) {
    return _ref11.apply(this, arguments);
  };
}();

// 智能合约自动打钱给用户


var doRefund = exports.doRefund = function () {
  var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12() {
    var contract, contract2, res;
    return _regenerator2.default.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.next = 2;
            return tronWeb.trx.getContract(_config.smartContract.contractBase58Address);

          case 2:
            contract = _context12.sent;
            _context12.next = 5;
            return tronWeb.contract(contract.abi.entrys, _config.smartContract.contractHexAddress);

          case 5:
            contract2 = _context12.sent;
            _context12.next = 8;
            return contract2.doRefund().send();

          case 8:
            res = _context12.sent;

            console.log('doRefund res:', res);
            return _context12.abrupt('return', res);

          case 11:
          case 'end':
            return _context12.stop();
        }
      }
    }, _callee12, this);
  }));

  return function doRefund() {
    return _ref12.apply(this, arguments);
  };
}();

// 智能合约自动给幸运者和assistant账户发钱


var sendBonusAndFee = exports.sendBonusAndFee = function () {
  var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13(value) {
    var contract, contract2, res;
    return _regenerator2.default.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.next = 2;
            return tronWeb.trx.getContract(_config.smartContract.contractBase58Address);

          case 2:
            contract = _context13.sent;
            _context13.next = 5;
            return tronWeb.contract(contract.abi.entrys, _config.smartContract.contractHexAddress);

          case 5:
            contract2 = _context13.sent;

            console.log('sendBonusAndFee value:', value);
            _context13.next = 9;
            return contract2.sendBonusAndFee(parseInt(value)).send();

          case 9:
            res = _context13.sent;

            console.log('sendBonusAndFee res:', res);
            return _context13.abrupt('return', res);

          case 12:
          case 'end':
            return _context13.stop();
        }
      }
    }, _callee13, this);
  }));

  return function sendBonusAndFee(_x6) {
    return _ref13.apply(this, arguments);
  };
}();

// 智能合约自动给幸运者和assistant账户发钱


var sendRefund = exports.sendRefund = function () {
  var _ref14 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14(value) {
    var contract, contract2, res;
    return _regenerator2.default.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _context14.next = 2;
            return tronWeb.trx.getContract(_config.smartContract.contractBase58Address);

          case 2:
            contract = _context14.sent;
            _context14.next = 5;
            return tronWeb.contract(contract.abi.entrys, _config.smartContract.contractHexAddress);

          case 5:
            contract2 = _context14.sent;
            _context14.next = 8;
            return contract2.sendRefund(value).send();

          case 8:
            res = _context14.sent;

            console.log('sendRefund res:', res);
            return _context14.abrupt('return', res);

          case 11:
          case 'end':
            return _context14.stop();
        }
      }
    }, _callee14, this);
  }));

  return function sendRefund(_x7) {
    return _ref14.apply(this, arguments);
  };
}();

// 请求智能合约查询轮次


var queryRound = exports.queryRound = function () {
  var _ref15 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee15() {
    var contract, contract2, res;
    return _regenerator2.default.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            _context15.next = 2;
            return tronWeb.trx.getContract(_config.smartContract.contractBase58Address);

          case 2:
            contract = _context15.sent;
            _context15.next = 5;
            return tronWeb.contract(contract.abi.entrys, _config.smartContract.contractHexAddress);

          case 5:
            contract2 = _context15.sent;
            _context15.next = 8;
            return contract2.round().call();

          case 8:
            res = _context15.sent;

            console.log('doRefund res:', res);
            return _context15.abrupt('return', res);

          case 11:
          case 'end':
            return _context15.stop();
        }
      }
    }, _callee15, this);
  }));

  return function queryRound() {
    return _ref15.apply(this, arguments);
  };
}();

var _config = require('../config.js');

var _Common = require('../tool/Common.js');

var _redis = require('../tool/redis.js');

var _redis2 = _interopRequireDefault(_redis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SMART_CONTRACT_MIN = _config.RedisKeys.SMART_CONTRACT_MIN,
    SMART_CONTRACT_HASH = _config.RedisKeys.SMART_CONTRACT_HASH;


var TronWeb = require('tronweb');
var web3 = require("web3");

// console.log(smartContract)
var HttpProvider = TronWeb.providers.HttpProvider;
var fullNode = new HttpProvider(_config.smartContract.fullNodeUrl); // Full node http endpoint
var solidityNode = new HttpProvider(_config.smartContract.solidityNodeUrl); // Solidity node http endpoint
var eventServer = new HttpProvider(_config.smartContract.eventServerUrl); // Contract events http endpoint
var tronWeb = new TronWeb(fullNode, solidityNode, eventServer, _config.smartContract.developerPrivateKey);
var owner_address = tronWeb.defaultAddress.hex;