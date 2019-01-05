const redis = require('redis');
// const md5 = require('md5');
const {Redis, isDev, env} = require('../config');
let client;

//若是本地开发环境
if(isDev){
	client = redis.createClient();
}else{
	client = redis.createClient(Redis.port, Redis.host, {auth_pass: Redis.pwd});
}

//加载完毕
client.on('ready',function(res){
    // global.logger.log(`redis was ready, env: ${env}, redisOption: ${JSON.stringify(redisOption)}, redis is ready!`);
    console.log('redis is ready!');
});

//错误监听
client.on('error', function (err) {  
	// global.logger.error(`redis found error, env: ${env}, redisOption: ${JSON.stringify(redisOption)}, Error:${err}!`);
	console.log('redis is error!');
});

//停止
client.on('end',function(err){
    // global.logger.log(`redis was end, env: ${env}, redisOption: ${JSON.stringify(redisOption)}, Error:${err}!`);
    console.log('redis is end!');
});

class redisClass {

  //获取数据缓存层redis的key
  // getCacheApiKey(key, params) {
  //   return ['short-link-api', 'cache', key, md5(JSON.stringify(params))].join(':');
  // }

  // //设置数据缓存层redis的key、value
  // async setCacheApiValue(key, rsp){
  //   await this.set(key, ajaxResult.ok('操作成功', rsp));
  // }

  //根据KEY前缀模糊删除redis
  async clearLike(key){
    client.keys(key, function(err, keys) {
      if(keys.length){
        client.del(keys);
        global.logger.log(`redis 批量删除前缀[SESSION:*]成功，受影响条数${keys.length}!`);
      }
    });
  }

	//设置值-字符串
	async set(key, value, expire){
		return await new Promise((resolve, reject) => {
			const baseType = typeof value === 'string' || typeof value === 'boolean' || typeof value === 'boolean' || typeof value === 'undefined';
			const data = baseType? value: JSON.stringify(value);

			client.set(key, data, function(err, rsp) {
				if(err){
					reject(err);
				}else{
					resolve(rsp? rsp.toString(): rsp);
				}
			});

			//有效期，单位秒 3650天默认
			client.expire(key, expire || 3600 * 24 * 3650);
		});
	}

	//获取值-字符串
	async get(key){
		return await new Promise((resolve, reject) => {
			client.get(key, function(err, rsp) {
				if(err){
					reject(err);
				}else{
					let data = '';
					try{
						data = JSON.parse(rsp);
					}catch(e){
						data = rsp? rsp.toString(): rsp;
					}

					resolve(data);
				}
			});
		});
	}


	//设置值-对象
	async hmset(key, value, expire){
		return await new Promise((resolve, reject) => {
			if(!value){
				resolve(null);
			}
			client.hmset(key, value, function(err, rsp) {
				if(err){
					console.log('redis hmset err', err)
					reject();
				}else{
					//console.log('hmset', rsp)
					resolve(rsp);
				}
			});
			//有效期，单位秒
			client.expire(key, expire || 60);
		});
	}

	//获取值-对象
	async hgetall(key){
		return await new Promise((resolve, reject) => {
			client.hgetall(key, function(err, rsp) {
				if(err){
					//console.log('redis hgetall err', err)
					reject();
				}else{
					//console.log('hgetall', rsp)
					resolve(rsp);
				}
			});
		});
	}


	//判断是否存在这个键
	async exists(key){
		return await new Promise((resolve, reject) => {
			client.exists(key, function(err, rsp) {
				if(err){
					reject();
				}else{
					resolve(rsp);
				}
			});
		});
	}

	//删除某个键
	async del(key){
		return await new Promise((resolve, reject) => {
			client.del(key, function(err, rsp) {
				if(err){
					reject();
				}else{
					resolve(rsp);
				}
			});
		});
	}

}

var redisUtils = new redisClass();
export default redisUtils;
