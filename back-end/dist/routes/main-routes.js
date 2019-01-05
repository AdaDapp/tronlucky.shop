'use strict';

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _index = require('../controllers/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = new _koaRouter2.default();

router.get('/public/get', function (ctx, next) {
  ctx.body = '禁止访问！';
}) // 以/public开头则不用经过权限认证
.all('/upload', _index2.default.upload.default).get('/api/:name', _index2.default.api.Get).post('/api/:name', _index2.default.api.Post).put('/api/:name', _index2.default.api.Put).del('/api/:name', _index2.default.api.Delect).post('/auth/:action', _index2.default.auth.Post)
//.get('/testzhineng', controllers.api.Test)
.get('/testzhineng', _index2.default.smartContract.Test).post('/smart/saveBetDetailInfo', _index2.default.smartContract.saveBetDetailInfo);

module.exports = router;