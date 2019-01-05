'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaBody = require('koa-body');

var _koaBody2 = _interopRequireDefault(_koaBody);

var _koaStatic = require('koa-static2');

var _koaStatic2 = _interopRequireDefault(_koaStatic);

var _config = require('./config');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _mainRoutes = require('./routes/main-routes');

var _mainRoutes2 = _interopRequireDefault(_mainRoutes);

var _ErrorRoutesCatch = require('./middleware/ErrorRoutesCatch');

var _ErrorRoutesCatch2 = _interopRequireDefault(_ErrorRoutesCatch);

var _errorRoutes = require('./routes/error-routes');

var _errorRoutes2 = _interopRequireDefault(_errorRoutes);

var _koaJwt = require('koa-jwt');

var _koaJwt2 = _interopRequireDefault(_koaJwt);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _redis = require('./tool/redis.js');

var _redis2 = _interopRequireDefault(_redis);

require('./tasks/webSocket.js');

require('./tasks/smartContract.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import './db/smartContract.js'
// import PluginLoader from './lib/PluginLoader'

var WebSocket = require("koa-websocket");
var Koa = new _koa2.default();
var app = WebSocket(Koa);

var env = process.env.NODE_ENV || 'development'; // Current mode

var publicKey = _fs2.default.readFileSync(_path2.default.join(__dirname, '../publicKey.pub'));

var ctxs = [];
global.ws = [];

app.use(function (ctx, next) {
  if (ctx.request.header.host.split(':')[0] === 'localhost' || ctx.request.header.host.split(':')[0] === '127.0.0.1') {
    ctx.set('Access-Control-Allow-Origin', '*');
  } else {
    ctx.set('Access-Control-Allow-Origin', _config.System.HTTP_server_host);
  }
  ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  ctx.set('Access-Control-Allow-Credentials', true); // 允许带上 cookie
  return next();
}).use((0, _ErrorRoutesCatch2.default)()).use((0, _koaStatic2.default)('assets', _path2.default.resolve(__dirname, '../assets'))) // Static resource
// .use(jwt({ secret: publicKey }).unless({ path: [/^\/public|\/user\/login|\/assets/] }))
.use((0, _koaBody2.default)({
  multipart: true,
  strict: false,
  formidable: {
    uploadDir: _path2.default.join(__dirname, '../assets/uploads/tmp')
  },
  jsonLimit: '10mb',
  formLimit: '10mb',
  textLimit: '10mb'
})) // Processing request
// .use(PluginLoader(SystemConfig.System_plugin_path))
.use(_mainRoutes2.default.routes()).use(_mainRoutes2.default.allowedMethods()).use((0, _errorRoutes2.default)());

if (env === 'development') {
  // logger
  app.use(function (ctx, next) {
    var start = new Date();
    return next().then(function () {
      var ms = new Date() - start;
      console.log(ctx.method + ' ' + ctx.url + ' - ' + ms + 'ms');
    });
  });
}

/* 实现简单的接发消息 */
app.ws.use(function (ctx, next) {
  /* 每打开一个连接就往 上线文数组中 添加一个上下文 */
  ctxs.push(ctx);
  global.ws.push(ctx);
  ctx.websocket.on("message", function (message) {
    console.log(message);
    for (var i = 0; i < ctxs.length; i++) {
      if (ctx == ctxs[i]) continue;
      ctxs[i].websocket.send(message);
    }
  });
  ctx.websocket.on("close", function (message) {
    console.log('close:', message);
    /* 连接关闭时, 清理 上下文数组, 防止报错 */
    var index = ctxs.indexOf(ctx);
    ctxs.splice(index, 1);
  });
});

app.listen(_config.System.API_server_port);

console.log('Now start API server on port ' + _config.System.API_server_port + '...');

exports.default = app;