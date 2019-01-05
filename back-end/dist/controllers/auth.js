'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Post = exports.CheckAuth = undefined;

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var publicKey = _fs2.default.readFileSync(_path2.default.join(__dirname, '../../publicKey.pub'));

// 用户登录的时候返回token
// let token = jwt.sign({
//   userInfo: userInfo // 你要保存到token的数据
// }, publicKey, { expiresIn: '7d' })

/**
 * 检查授权是否合法
 */
var CheckAuth = exports.CheckAuth = function CheckAuth(ctx) {
  var token = ctx.request.header.authorization;
  try {
    var decoded = _jsonwebtoken2.default.verify(token.substr(7), publicKey);
    if (decoded.userInfo) {
      return {
        status: 1,
        result: decoded.userInfo
      };
    } else {
      return {
        status: 403,
        result: {
          errInfo: '没有授权'
        }
      };
    }
  } catch (err) {
    return {
      status: 503,
      result: {
        errInfo: '解密错误'
      }
    };
  }
};

var Post = exports.Post = function Post(ctx) {
  switch (ctx.params.action) {
    case 'check':
      return CheckAuth(ctx).then(function (result) {
        ctx.body = result;
      });
    default:
      return CheckAuth(ctx).then(function (result) {
        ctx.body = result;
      });
  }
};