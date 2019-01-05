'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

// 利用 
var mainTask = function () {
	var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
		var statusRes, statusValue, roundRes, round, priceRes, price, submitDepositFlag, assistantRes, assistantMoney, commitDepositRes, commitHashRes, doLuckyRes, j, sendBonusAndFeeRes, roundLuckyRes, doRefundRes;
		return _regenerator2.default.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						global.canShowMinwen = false;
						// 1. 使用developer账号请求智能合约status()方法
						_context2.next = 3;
						return (0, _smartContract.queryStatus)();

					case 3:
						statusRes = _context2.sent;
						statusValue = getConstantResult(statusRes);

						if (statusValue) {
							_context2.next = 7;
							break;
						}

						return _context2.abrupt('return');

					case 7:
						statusValue = statusValue.replace(/0/g, '');
						console.log('search statusValue:', statusValue);
						_redis2.default.set(SMART_CONTRACT_STATUS, statusValue);

						// 查询当前轮次
						_context2.next = 12;
						return (0, _smartContract.queryRound)();

					case 12:
						roundRes = _context2.sent;

						if (roundRes) {
							_context2.next = 15;
							break;
						}

						return _context2.abrupt('return');

					case 15:
						round = roundRes['_hex'];

						round = parseInt(round, 16);
						console.log('task round:', round);
						_redis2.default.set(SMART_CONTRACT_ROUND, round);

						if (!(statusValue == '1')) {
							_context2.next = 78;
							break;
						}

						_context2.next = 22;
						return (0, _smartContract.queryPrice)();

					case 22:
						priceRes = _context2.sent;
						price = getConstantResult(priceRes);

						if (price) {
							_context2.next = 26;
							break;
						}

						return _context2.abrupt('return');

					case 26:
						price = parseInt(price, 16); // 单位为sun
						console.log('当前的价格：', price);
						_redis2.default.set(SMART_CONTRACT_PRICE, price);
						submitDepositFlag = false;

					case 30:
						if (!true) {
							_context2.next = 67;
							break;
						}

						_context2.next = 33;
						return (0, _smartContract.queryAssistantInfo)();

					case 33:
						assistantRes = _context2.sent;

						console.log('assistantRes assistantRes :', assistantRes);
						assistantMoney = getConstantResult(assistantRes);

						if (assistantMoney) {
							_context2.next = 38;
							break;
						}

						return _context2.abrupt('return');

					case 38:
						assistantMoney = assistantMoney.substring(64, 128);
						assistantMoney = parseInt(assistantMoney, 16); // 单位为sun
						console.log('当前的保证金：', assistantMoney);

						// 如果保证金小于price，需要提价至少和价格相同的保证金

						if (!(assistantMoney < price)) {
							_context2.next = 61;
							break;
						}

						console.log('commitDeposit price:', price);
						_context2.next = 45;
						return (0, _smartContract.commitDeposit)(parseInt(price) * 2);

					case 45:
						commitDepositRes = _context2.sent;

						console.log('commitDepositRes:', commitDepositRes);

						if (!commitDepositRes) {
							_context2.next = 58;
							break;
						}

						assistantMoney = getConstantResult(assistantRes);

						if (assistantMoney) {
							_context2.next = 51;
							break;
						}

						return _context2.abrupt('return');

					case 51:
						assistantMoney = parseInt('assistantMoney', 16); // 单位为sun
						console.log('提交之后的保证金：', assistantMoney);

						if (!(assistantMoney >= price)) {
							_context2.next = 56;
							break;
						}

						submitDepositFlag = true;
						return _context2.abrupt('break', 67);

					case 56:
						_context2.next = 59;
						break;

					case 58:
						return _context2.abrupt('break', 67);

					case 59:
						_context2.next = 63;
						break;

					case 61:
						submitDepositFlag = true;
						return _context2.abrupt('break', 67);

					case 63:
						_context2.next = 65;
						return delay(1000);

					case 65:
						_context2.next = 30;
						break;

					case 67:
						// 直到保证金大于价格就跳出提交保证金循环
						console.log("submitDepositFlag:", submitDepositFlag);

						// 如果保证金没问题，则生成hash

						if (!submitDepositFlag) {
							_context2.next = 76;
							break;
						}

						_context2.next = 71;
						return (0, _smartContract.commitHash)();

					case 71:
						commitHashRes = _context2.sent;

						if (commitHashRes) {
							_context2.next = 74;
							break;
						}

						return _context2.abrupt('return');

					case 74:
						_context2.next = 76;
						return delay(1000);

					case 76:
						_context2.next = 163;
						break;

					case 78:
						if (!(statusValue == '2')) {
							_context2.next = 83;
							break;
						}

						// 购买态，表示用户可以开始购买商品
						price = _redis2.default.get(SMART_CONTRACT_PRICE);

						price.then(function () {
							var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(value) {
								var priceRes, price;
								return _regenerator2.default.wrap(function _callee$(_context) {
									while (1) {
										switch (_context.prev = _context.next) {
											case 0:
												if (value) {
													_context.next = 10;
													break;
												}

												_context.next = 3;
												return (0, _smartContract.queryPrice)();

											case 3:
												priceRes = _context.sent;
												price = getConstantResult(priceRes);

												if (price) {
													_context.next = 7;
													break;
												}

												return _context.abrupt('return');

											case 7:
												price = parseInt(price, 16); // 单位为sun
												console.log('当前的价格：', price);
												_redis2.default.set(SMART_CONTRACT_PRICE, price);

											case 10:
											case 'end':
												return _context.stop();
										}
									}
								}, _callee, this);
							}));

							return function (_x) {
								return _ref2.apply(this, arguments);
							};
						}());
						_context2.next = 163;
						break;

					case 83:
						if (!(statusValue == '3')) {
							_context2.next = 162;
							break;
						}

						executeTimes++; // 轮次
						console.log('executeTimes executeTimes:', executeTimes);
						// 开奖态：表示购买已经结束，即已经买满了
						console.log(new Date());
						_context2.next = 89;
						return delay(50000);

					case 89:
						console.log(new Date());
						_context2.next = 92;
						return (0, _smartContract.doLucky)();

					case 92:
						doLuckyRes = _context2.sent;

						global.canShowMinwen = true;
						console.log('doLuckyRes:', doLuckyRes);
						_context2.next = 97;
						return delay(60000);

					case 97:
						// 循环调用查看status状态
						statusValue = '';
						j = 0;

					case 99:
						if (!(j < 14)) {
							_context2.next = 115;
							break;
						}

						_context2.next = 102;
						return delay(3000);

					case 102:
						_context2.next = 104;
						return (0, _smartContract.queryStatus)();

					case 104:
						statusRes = _context2.sent;

						statusValue = getConstantResult(statusRes);
						console.log('statusValue:', statusValue);

						if (statusValue) {
							_context2.next = 109;
							break;
						}

						return _context2.abrupt('return');

					case 109:
						statusValue = statusValue.replace(/0/g, '');

						if (!(statusValue == '1')) {
							_context2.next = 112;
							break;
						}

						return _context2.abrupt('break', 115);

					case 112:
						j++;
						_context2.next = 99;
						break;

					case 115:
						if (!(statusValue == '1')) {
							_context2.next = 131;
							break;
						}

						_redis2.default.set(SMART_CONTRACT_STATUS, '4'); // 后台定义的开奖成功状态
						// 将获奖金额打给用户
						_context2.next = 119;
						return (0, _smartContract.sendBonusAndFee)(round);

					case 119:
						sendBonusAndFeeRes = _context2.sent;

						console.log('sendBonusAndFeeRes:', sendBonusAndFeeRes);
						// 获取
						_context2.next = 123;
						return (0, _smartContract.roundLucky)(executeTimes);

					case 123:
						roundLuckyRes = _context2.sent;

						console.log('roundLuckyRes:', roundLuckyRes);

						if (roundLuckyRes) {
							_context2.next = 127;
							break;
						}

						return _context2.abrupt('return');

					case 127:
						_context2.next = 129;
						return delay(2000);

					case 129:
						_context2.next = 160;
						break;

					case 131:
						if (!(statusValue == '3')) {
							_context2.next = 160;
							break;
						}

						_context2.next = 134;
						return (0, _smartContract.doRefund)();

					case 134:
						doRefundRes = _context2.sent;

						console.log("doRefundRes:", doRefundRes);

						if (doRefundRes) {
							_context2.next = 138;
							break;
						}

						return _context2.abrupt('return');

					case 138:
						_context2.next = 140;
						return delay(1000);

					case 140:
						_context2.next = 142;
						return (0, _smartContract.queryRound)();

					case 142:
						roundRes = _context2.sent;

						if (roundRes) {
							_context2.next = 145;
							break;
						}

						return _context2.abrupt('return');

					case 145:
						round = roundRes['_hex'];

						console.log('round round:', round);
						// 将获奖金额打给用户
						// var sendRefundRes = await sendRefund(round)
						// console.log('sendRefundRes:', sendRefundRes)
						_context2.next = 149;
						return delay(1000);

					case 149:
						_context2.next = 151;
						return (0, _smartContract.queryStatus)();

					case 151:
						statusRes = _context2.sent;

						statusValue = getConstantResult(statusRes);

						if (statusValue) {
							_context2.next = 155;
							break;
						}

						return _context2.abrupt('return');

					case 155:
						statusValue = statusValue.replace(/0/g, '');

						if (!(statusValue == '1')) {
							_context2.next = 160;
							break;
						}

						_redis2.default.set(SMART_CONTRACT_STATUS, '5'); // 后台定义的开奖失败状态
						_context2.next = 160;
						return delay(2000);

					case 160:
						_context2.next = 163;
						break;

					case 162:
						if (statusValue == '4') {
							// 开奖成功态：表示开奖成功
						} else if (statusValue == '5') {
							// 惩罚完成态：表示开奖失败，进行了惩罚并完成
						} else {}

					case 163:
						setTimeout(mainTask, 1000);

					case 164:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, this);
	}));

	return function mainTask() {
		return _ref.apply(this, arguments);
	};
}();

var delay = function () {
	var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(time) {
		return _regenerator2.default.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						_context3.next = 2;
						return sleep(time);

					case 2:
					case 'end':
						return _context3.stop();
				}
			}
		}, _callee3, this);
	}));

	return function delay(_x2) {
		return _ref3.apply(this, arguments);
	};
}();

var _smartContract = require('../services/smartContract.js');

var _redis = require('../tool/redis.js');

var _redis2 = _interopRequireDefault(_redis);

var _config = require('../config.js');

var _Common = require('../tool/Common.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 智能合约定时任务
var SMART_CONTRACT_STATUS = _config.RedisKeys.SMART_CONTRACT_STATUS,
    SMART_CONTRACT_PRICE = _config.RedisKeys.SMART_CONTRACT_PRICE,
    SMART_CONTRACT_MIN = _config.RedisKeys.SMART_CONTRACT_MIN,
    SMART_CONTRACT_ROUND = _config.RedisKeys.SMART_CONTRACT_ROUND;


var executeTimes = 0;

mainTask();

// 得到交易结果数据
function getConstantResult(res) {
	if (!res) {
		return;
	}
	var resultObj = res.result;
	if (!resultObj) {
		return;
	}
	var result = resultObj.result;
	if (!(result && (result == true || result == 'true'))) {
		return;
	}

	var constant_result = res['constant_result'];
	if (!constant_result || constant_result.length <= 0) {
		return;
	}
	var constantResult = constant_result[0];
	if (!constantResult) {
		return;
	}
	return constantResult;
}

function sleep(time) {
	return new _promise2.default(function (resolve) {
		return setTimeout(resolve, time);
	});
}