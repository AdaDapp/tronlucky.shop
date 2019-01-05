const schedule = require('node-schedule');
import redisUtils from '../tool/redis.js'
import { RedisKeys } from '../config.js'
const { SMART_CONTRACT_STATUS, SMART_CONTRACT_PRICE, SMART_CONTRACT_MIN, SMART_CONTRACT_HASH, SMART_CONTRACT_TOTALCOIN, } = RedisKeys

async function scheduleCronstyle() {
	var rule = new schedule.RecurrenceRule();
	// 每5秒钟执行一次
	var seconds = [1,6,11,16,21,26,31,36,41,46,51,56];
	rule.second = seconds;
  	//每分钟的第30秒定时执行一次:
    schedule.scheduleJob(rule,()=>{
    	var status = redisUtils.get(SMART_CONTRACT_STATUS);
    	var price = redisUtils.get(SMART_CONTRACT_PRICE);
        var minwen = redisUtils.get(SMART_CONTRACT_MIN);
        var miwen = redisUtils.get(SMART_CONTRACT_HASH);
        var totalCoin = redisUtils.get(SMART_CONTRACT_TOTALCOIN);
    	Promise.all([status, price, minwen, miwen, totalCoin]).then(result => {
		    // console.log(result);
            if(!result || result.length<2) {
                return;
            } 
            var statusValue = result[0]
            var priceValue = result[1]
            var minwenValue = result[2]
            var miwenValue = ''
            if(global.canShowMinwen) {
                miwenValue = result[3]
            }
            var totalCoinValue = result[4]
            if(statusValue && priceValue) {
                var obj = {
                    statusValue : statusValue,
                    priceValue : (parseInt(priceValue)/1000000),
                    minwenValue : minwenValue,
                    miwenValue : miwenValue,
                    totalCoinValue : (parseInt(totalCoinValue)/1000000),
                }
                for(let i = 0; i < global.ws.length; i++) {
                    global.ws[i].websocket.send(JSON.stringify(obj));
                }
            }
		});
    });
}

scheduleCronstyle();