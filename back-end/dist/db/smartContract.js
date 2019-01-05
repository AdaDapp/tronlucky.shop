'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mysql = require('mysql');
var connection = mysql.createConnection({
	//Options
	host: 'localhost',
	port: '3306',
	user: 'root',
	password: 'Liu2409182',
	database: 'smart'
});

function handleDisconnect() {
	connection.connect(function (err) {
		// callback(err,result);
		if (err) {
			console.log(err);
			console.log("try to connect");
			setTimeout(handleDisconnect, 1000); //经过1秒后尝试重新连接
			return;
		}
		console.log("Success");
	});
}
handleDisconnect();

var dbClass = function () {
	function dbClass() {
		(0, _classCallCheck3.default)(this, dbClass);
	}

	(0, _createClass3.default)(dbClass, [{
		key: 'insertBetDetailInfo',


		// 插入投注明细表
		value: function () {
			var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(array) {
				return _regenerator2.default.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								_context.next = 2;
								return new _promise2.default(function (resolve, reject) {
									var addSql = "INSERT INTO smart.bet_detail_info(player, amount, round, create_date, creator, modify_date, modifier) VALUES(?,?,?,now(),'admin',now(),'admin')";
									connection.query(addSql, array, function (err, rsp) {
										if (err) {
											reject(err);
										} else {
											var data = '';
											resolve(rsp);
										}
									});
								});

							case 2:
								return _context.abrupt('return', _context.sent);

							case 3:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, this);
			}));

			function insertBetDetailInfo(_x) {
				return _ref.apply(this, arguments);
			}

			return insertBetDetailInfo;
		}()

		// 插入中奖结果信息表

	}, {
		key: 'insertWinDetailInfo',
		value: function () {
			var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(array) {
				return _regenerator2.default.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								_context2.next = 2;
								return new _promise2.default(function (resolve, reject) {
									var addSql = "INSERT INTO smart.win_detail_info(player, round, bonus, create_date, creator, modify_date, modifier) VALUES(?,?,?,now(),'admin',now(),'admin')";
									connection.query(addSql, array, function (err, rsp) {
										if (err) {
											reject(err);
										} else {
											var data = '';
											resolve(rsp);
										}
									});
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

			function insertWinDetailInfo(_x2) {
				return _ref2.apply(this, arguments);
			}

			return insertWinDetailInfo;
		}()

		// 查询所有投注

	}, {
		key: 'getAllBetList',
		value: function () {
			var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
				return _regenerator2.default.wrap(function _callee3$(_context3) {
					while (1) {
						switch (_context3.prev = _context3.next) {
							case 0:
								_context3.next = 2;
								return new _promise2.default(function (resolve, reject) {
									connection.query('select * from smart.bet_detail_info order by id desc', function (err, rsp) {
										if (err) {
											reject(err);
										} else {
											var data = '';
											resolve(rsp);
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

			function getAllBetList() {
				return _ref3.apply(this, arguments);
			}

			return getAllBetList;
		}()

		// 查询当天投注

	}, {
		key: 'getTodayBetList',
		value: function () {
			var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
				return _regenerator2.default.wrap(function _callee4$(_context4) {
					while (1) {
						switch (_context4.prev = _context4.next) {
							case 0:
								_context4.next = 2;
								return new _promise2.default(function (resolve, reject) {
									connection.query('select * from smart.bet_detail_info where to_days(create_date) = to_days(now()) order by id desc', function (err, rsp) {
										if (err) {
											reject(err);
										} else {
											var data = '';
											resolve(rsp);
										}
									});
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

			function getTodayBetList() {
				return _ref4.apply(this, arguments);
			}

			return getTodayBetList;
		}()

		// 查询我的投注

	}, {
		key: 'getMineBetList',
		value: function () {
			var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(player) {
				return _regenerator2.default.wrap(function _callee5$(_context5) {
					while (1) {
						switch (_context5.prev = _context5.next) {
							case 0:
								_context5.next = 2;
								return new _promise2.default(function (resolve, reject) {
									var sql = 'select * from smart.bet_detail_info where player = ?';
									connection.query(sql, player, function (err, rsp) {
										if (err) {
											reject(err);
										} else {
											var data = '';
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

			function getMineBetList(_x3) {
				return _ref5.apply(this, arguments);
			}

			return getMineBetList;
		}()
	}]);
	return dbClass;
}();

var dbUtils = new dbClass();
exports.default = dbUtils;