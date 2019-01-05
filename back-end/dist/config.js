'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RedisKeys = exports.env = exports.isDev = exports.smartContract = exports.SendEmail = exports.DB = exports.Redis = exports.System = undefined;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 系统配置
var System = exports.System = {
  API_server_type: 'http://', // API服务器协议类型,包含"http://"或"https://"
  API_server_host: 'localhost', // API服务器暴露的域名地址,请勿添加"http://"
  API_server_port: '3001', // API服务器监听的端口号
  HTTP_server_type: 'http://', // HTTP服务器协议类型,包含"http://"或"https://"
  HTTP_server_host: 'www.XXX.com', // HTTP服务器地址,请勿添加"http://" （即前端调用使用的服务器地址，如果是APP请设置为 * ）
  HTTP_server_port: '65534', // HTTP服务器端口号
  System_country: 'zh-cn', // 所在国家的国家代码
  System_plugin_path: _path2.default.join(__dirname, './plugins'), // 插件路径
  Session_Key: 'RESTfulAPI', // 生产环境务必随机设置一个值
  db_type: 'mysql' // 数据库类型
};

// var Redis = exports.Redis = {
//   host: '127.0.0.1', // 服务器地址
//   port: '6379', // 端口号
//   pwd: '123456' // 设置项
// };

// 生产
var Redis = exports.Redis = {
  host: '127.0.0.1', // 服务器地址
  port: '6379' // 端口号
};

// var DB = exports.DB = {
//   host: 'localhost', // 服务器地址
//   port: 3306, // 数据库端口号
//   username: 'admin', // 数据库用户名
//   password: 'admin888', // 数据库密码
//   database: 'development', // 数据库名称
//   prefix: 'api_' // 默认"api_"
// };

var DB = exports.DB = {
  host: 'localhost', // 服务器地址
  port: 3306, // 数据库端口号
  username: 'root', // 数据库用户名
  password: 'luckyshop@18', // 数据库密码
  database: 'smart' // 数据库名称
};

var SendEmail = exports.SendEmail = {
  service: 'smtp.abcd.com', // SMTP服务提供商域名
  username: 'postmaster%40abcd.com', // 用户名/用户邮箱
  password: 'password', // 邮箱密码
  sender_address: '"XX平台 👥" <postmaster@abcd.com>'
};

var smartContract = exports.smartContract = {
  developerAddress: 'TTVVtovFaTpLBQ5fHfcDWN8hxzPjGpW3ef', // 开发者账户地址
  developerPrivateKey: '', // 开发者私钥
  assistantPrivateKey: '', // assistant私钥
  fullNodeUrl: 'http://47.90.240.201:8090',
  solidityNodeUrl: 'http://47.90.240.201:8091',
  eventServerUrl: 'http://47.90.240.201:8092',
  contractHexAddress: '412c68606d590aeebdb56b09bc3d55bf11672e53be',
  contractBase58Address: 'TE21miaHFLdgXYaNF4dinLxKJFumQn2yvC',
  assistantHexAddress: '412c68606d590aeebdb56b09bc3d55bf11672e53be',
  assistantBase58Address: 'TE21miaHFLdgXYaNF4dinLxKJFumQn2yvC'
};

var isDev = exports.isDev = true;

var env = exports.env = 'dev';

var RedisKeys = exports.RedisKeys = {
  'SMART_CONTRACT_STATUS': 'SMART_CONTRACT_STATUS', // 智能合约返回的状态值
  'SMART_CONTRACT_PRICE': 'SMART_CONTRACT_PRICE', // 智能合约返回的商品价格
  'SMART_CONTRACT_HASH': 'SMART_CONTRACT_HASH', // 智能合约返回的商品价格
  'SMART_CONTRACT_MIN': 'SMART_CONTRACT_MIN', // 要传给智能合约的明文
  'SMART_CONTRACT_ROUND': 'SMART_CONTRACT_ROUND' // 轮次
};
