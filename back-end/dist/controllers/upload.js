'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (ctx) {
  // 设置允许跨域的域名称
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'X-Requested-With');
  ctx.set('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');

  // ----- 情况1：跨域时，先发送一个options请求，此处要返回200 -----
  if (ctx.method === 'OPTIONS') {
    console.log('options 请求时，返回 200');

    // 返回结果
    ctx.status = 200;
    ctx.body = 'options OK';
    return;
  }

  // ----- 情况2：发送post请求，上传图片 -----

  // 处理 request
  console.log('parse ok');

  // 文件将要上传到哪个文件夹下面
  var uploadfolderpath = _path2.default.join(__dirname, '../../assets/uploads');

  var files = ctx.request.body.files;

  // formidable 会将上传的文件存储为一个临时文件，现在获取这个文件的目录
  var tempfilepath = files.file.path;
  // 获取文件类型
  var type = files.file.type;

  // 获取文件名，并根据文件名获取扩展名
  var filename = files.file.name;
  var extname = filename.lastIndexOf('.') >= 0 ? filename.slice(filename.lastIndexOf('.') - filename.length) : '';
  // 文件名没有扩展名时候，则从文件类型中取扩展名
  if (extname === '' && type.indexOf('/') >= 0) {
    extname = '.' + type.split('/')[1];
  }
  // 将文件名重新赋值为一个随机数（避免文件重名）
  filename = Math.random().toString().slice(2) + extname;

  // 构建将要存储的文件的路径
  var filenewpath = _path2.default.join(uploadfolderpath, filename);

  var result = '';

  // 将临时文件保存为正式的文件
  try {
    _fs2.default.renameSync(tempfilepath, filenewpath);
  } catch (err) {
    if (err) {
      // 发生错误
      console.log('fs.rename err');
      result = 'error|save error';
    }
  }
  // 保存成功
  console.log('fs.rename done');
  // 拼接url地址
  result = _config.System.API_server_type + _config.System.API_server_host + ':' + _config.System.API_server_port + '/assets/uploads' + filename;

  // 返回结果
  ctx.body = result;
};