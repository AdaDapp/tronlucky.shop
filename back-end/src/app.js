import Koa2 from 'koa'
import KoaBody from 'koa-body'
import KoaStatic from 'koa-static2'
import {
  System as SystemConfig
} from './config'
import path from 'path'
import MainRoutes from './routes/main-routes'
import ErrorRoutesCatch from './middleware/ErrorRoutesCatch'
import ErrorRoutes from './routes/error-routes'
import jwt from 'koa-jwt'
import fs from 'fs'
import redisUtils from './tool/redis.js'
import './tasks/webSocket.js'
import './tasks/smartContract.js'
// import './db/smartContract.js'
// import PluginLoader from './lib/PluginLoader'

const WebSocket = require("koa-websocket");
const Koa = new Koa2()
let app = WebSocket(Koa);

const env = process.env.NODE_ENV || 'development' // Current mode

const publicKey = fs.readFileSync(path.join(__dirname, '../publicKey.pub'))

global.ws = [];

app
  .use((ctx, next) => {
    // if (ctx.request.header.host.split(':')[0] === 'localhost' || ctx.request.header.host.split(':')[0] === '127.0.0.1') {
    //   ctx.set('Access-Control-Allow-Origin', '*')
    // } else {
    //   ctx.set('Access-Control-Allow-Origin', SystemConfig.HTTP_server_host)
    // }
    ctx.set('Access-Control-Allow-Origin', '*')
    ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
    ctx.set('Access-Control-Allow-Credentials', true) // 允许带上 cookie
    return next()
  })
  .use(ErrorRoutesCatch())
  .use(KoaStatic('assets', path.resolve(__dirname, '../assets'))) // Static resource
  // .use(jwt({ secret: publicKey }).unless({ path: [/^\/public|\/user\/login|\/assets/] }))
  .use(KoaBody({
    multipart: true,
    strict: false,
    formidable: {
      uploadDir: path.join(__dirname, '../assets/uploads/tmp')
    },
    jsonLimit: '10mb',
    formLimit: '10mb',
    textLimit: '10mb'
  })) // Processing request
  // .use(PluginLoader(SystemConfig.System_plugin_path))
  .use(MainRoutes.routes())
  .use(MainRoutes.allowedMethods())
  .use(ErrorRoutes())



if (env === 'development') { // logger
  app.use((ctx, next) => {
    const start = new Date()
    return next().then(() => {
      const ms = new Date() - start
      console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
    })
  })
}

/* 实现简单的接发消息 */
app.ws.use((ctx, next) => {
    /* 每打开一个连接就往 上线文数组中 添加一个上下文 */
    global.ws.push(ctx);
    ctx.websocket.on("message", (message) => {
        console.log(message);
        for(let i = 0; i < global.ws.length; i++) {
            if (ctx == global.ws[i]) continue;
            global.ws[i].websocket.send(message);
        }
    });
    ctx.websocket.on("close", (message) => {
        console.log('close:', message)
        /* 连接关闭时, 清理 上下文数组, 防止报错 */
        let index = global.ws.indexOf(ctx);
        console.log('index:', index)
        global.ws.splice(index, 1);
        console.log('global.ws length:', global.ws.length)
    });
});

app.listen(SystemConfig.API_server_port)

console.log('Now start API server on port ' + SystemConfig.API_server_port + '...')

export default app
