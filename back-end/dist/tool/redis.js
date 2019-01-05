'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var redis = require('redis');
// const md5 = require('md5');

var _require = require('../config'),
    Redis = _require.Redis,
    isDev = _require.isDev,
    env = _require.env;

var client = void 0;

//若是本地开发环境
if (isDev) {
	client = redis.createClient();
} else {
	client = redis.createClient(Redis.port, Redis.host, { auth_pass: Redis.pwd });
}

//加载完毕
client.on('ready', function (res) {
	// global.logger.log(`redis was ready, env: ${env}, redisOption: ${JSON.stringify(redisOption)}, redis is ready!`);
	console.log('redis is ready!');
});

//错误监听
client.on('error', function (err) {
	// global.logger.error(`redis found error, env: ${env}, redisOption: ${JSON.stringify(redisOption)}, Error:${err}!`);
	console.log('redis is error!');
});

//停止
client.on('end', function (err) {
	// global.logger.log(`redis was end, env: ${env}, redisOption: ${JSON.stringify(redisOption)}, Error:${err}!`);
	console.log('redis is end!');
});

var redisClass = function () {
	function redisClass() {
		(0, _classCallCheck3.default)(this, redisClass);
	}

	(0, _createClass3.default)(redisClass, [{
		key: 'clearLike',


		//获取数据缓存层redis的key
		// getCacheApiKey(key, params) {
		//   return ['short-link-api', 'cache', key, md5(JSON.stringify(params))].join(':');
		// }

		// //设置数据缓存层redis的key、value
		// async setCacheApiValue(key, rsp){
		//   await this.set(key, ajaxResult.ok('操作成功', rsp));
		// }

		//根据KEY前缀模糊删除redis
		value: function () {
			var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(key) {
				return _regenerator2.default.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								client.keys(key, function (err, keys) {
									if (keys.length) {
										client.del(keys);
										global.logger.log('redis \u6279\u91CF\u5220\u9664\u524D\u7F00[SESSION:*]\u6210\u529F\uFF0C\u53D7\u5F71\u54CD\u6761\u6570' + keys.length + '!');
									}
								});

							case 1:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, this);
			}));

			function clearLike(_x) {
				return _ref.apply(this, arguments);
			}

			return clearLike;
		}()

		//设置值-字符串

	}, {
		key: 'set',
		value: function () {
			var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(key, value, expire) {
				return _regenerator2.default.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								_context2.next = 2;
								return new _promise2.default(function (resolve, reject) {
									var baseType = typeof value === 'string' || typeof value === 'boolean' || typeof value === 'boolean' || typeof value === 'undefined';
									var data = baseType ? value : (0, _stringify2.default)(value);

									client.set(key, data, function (err, rsp) {
										if (err) {
											reject(err);
										} else {
											resolve(rsp ? rsp.toString() : rsp);
										}
									});

									//有效期，单位秒 3650天默认
									client.expire(key, expire || 3600 * 24 * 3650);
								});

							case 2:
								return _context2.abrupt('return', _context2.sent);

							case 3:
							case 'end':
								return _context2.stop();
						}
					}
				}, _callee2, this);
			}));

			function set(_x2, _x3, _x4) {
				return _ref2.apply(this, arguments);
			}

			return set;
		}()

		//获取值-字符串

	}, {
		key: 'get',
		value: function () {
			var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(key) {
				return _regenerator2.default.wrap(function _callee3$(_context3) {
					while (1) {
						switch (_context3.prev = _context3.next) {
							case 0:
								_context3.next = 2;
								return new _promise2.default(function (resolve, reject) {
									client.get(key, function (err, rsp) {
										if (err) {
											reject(err);
										} else {
											var data = '';
											try {
												data = JSON.parse(rsp);
											} catch (e) {
												data = rsp ? rsp.toString() : rsp;
											}

											resolve(data);
										}
									});
								});

							case 2:
								return _context3.abrupt('return', _context3.sent);

							case 3:
							case 'end':
								return _context3.stop();
						}
					}
				}, _callee3, this);
			}));

			function get(_x5) {
				return _ref3.apply(this, arguments);
			}

			return get;
		}()

		//设置值-对象

	}, {
		key: 'hmset',
		value: function () {
			var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(key, value, expire) {
				return _regenerator2.default.wrap(function _callee4$(_context4) {
					while (1) {
						switch (_context4.prev = _context4.next) {
							case 0:
								_context4.next = 2;
								return new _promise2.default(function (resolve, reject) {
									if (!value) {
										resolve(null);
									}
									client.hmset(key, value, function (err, rsp) {
										if (err) {
											console.log('redis hmset err', err);
											reject();
										} else {
											//console.log('hmset', rsp)
											resolve(rsp);
										}
									});
									//有效期，单位秒
									client.expire(key, expire || 60);
								});

							case 2:
								return _context4.abrupt('return', _context4.sent);

							case 3:
							case 'end':
								return _context4.stop();
						}
					}
				}, _callee4, this);
			}));

			function hmset(_x6, _x7, _x8) {
				return _ref4.apply(this, arguments);
			}

			return hmset;
		}()

		//获取值-对象

	}, {
		key: 'hgetall',
		value: function () {
			var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(key) {
				return _regenerator2.default.wrap(function _callee5$(_context5) {
					while (1) {
						switch (_context5.prev = _context5.next) {
							case 0:
								_context5.next = 2;
								return new _promise2.default(function (resolve, reject) {
									client.hgetall(key, function (err, rsp) {
										if (err) {
											//console.log('redis hgetall err', err)
											reject();
										} else {
											//console.log('hgetall', rsp)
											resolve(rsp);
										}
									});
								});

							case 2:
								return _context5.abrupt('return', _context5.sent);

							case 3:
							case 'end':
								return _context5.stop();
						}
					}
				}, _callee5, this);
			}));

			function hgetall(_x9) {
				return _ref5.apply(this, arguments);
			}

			return hgetall;
		}()

		//判断是否存在这个键

	}, {
		key: 'exists',
		value: function () {
			var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(key) {
				return _regenerator2.default.wrap(function _callee6$(_context6) {
					while (1) {
						switch (_context6.prev = _context6.next) {
							case 0:
								_context6.next = 2;
								return new _promise2.default(function (resolve, reject) {
									client.exists(key, function (err, rsp) {
										if (err) {
											reject();
										} else {
											resolve(rsp);
										}
									});
								});

							case 2:
								return _context6.abrupt('return', _context6.sent);

							case 3:
							case 'end':
								return _context6.stop();
						}
					}
				}, _callee6, this);
			}));

			function exists(_x10) {
				return _ref6.apply(this, arguments);
			}

			return exists;
		}()

		//删除某个键

	}, {
		key: 'del',
		value: function () {
			var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(key) {
				return _regenerator2.default.wrap(function _callee7$(_context7) {
					while (1) {
						switch (_context7.prev = _context7.next) {
							case 0:
								_context7.next = 2;
								return new _promise2.default(function (resolve, reject) {
									client.del(key, function (err, rsp) {
										if (err) {
											reject();
										} else {
											resolve(rsp);
										}
									});
								});

							case 2:
								return _context7.abrupt('return', _context7.sent);

							case 3:
							case 'end':
								return _context7.stop();
						}
					}
				}, _callee7, this);
			}));

			function del(_x11) {
				return _ref7.apply(this, arguments);
			}

			return del;
		}()
	}]);
	return redisClass;
}();

var redisUtils = new redisClass();
exports.default = redisUtils;