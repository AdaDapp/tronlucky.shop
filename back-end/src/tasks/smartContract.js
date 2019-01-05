// 智能合约定时任务
import { doBuy, queryStatus, gettransactioninfobyid, queryAssistantInfo, queryPrice, commitDeposit, commitHash,
		 doLucky, roundLucky, doRefund, sendBonusAndFee, sendRefund, queryRound, queryTotalCoin, } from '../services/smartContract.js'
import redisUtils from '../tool/redis.js'
import { RedisKeys } from '../config.js'
import { getByte32 } from '../tool/Common.js'
const { SMART_CONTRACT_STATUS, SMART_CONTRACT_PRICE, SMART_CONTRACT_MIN, SMART_CONTRACT_ROUND, SMART_CONTRACT_TOTALCOIN, SMART_CONTRACT_HASH, } = RedisKeys

var executeTimes = 0;

// 利用 
async function mainTask(){
	global.canShowMinwen = false
	// 1. 使用developer账号请求智能合约status()方法
	var statusRes = await queryStatus();
	var statusValue = getConstantResult(statusRes);
	if(!statusValue) {
		return
	}
	statusValue = statusValue.replace(/0/g, '');
	console.log('search statusValue:', statusValue)
	redisUtils.set(SMART_CONTRACT_STATUS, statusValue)

	// 查询当前轮次
	var roundRes = await queryRound();
	if(!roundRes) {
		return
	}
	var round = roundRes['_hex']
	round = parseInt(round, 16);
	console.log('task round:', round);
	redisUtils.set(SMART_CONTRACT_ROUND, round)

	if(statusValue == '1') {
		// 设置态，表示后端可以设置商品价格（可以不设置）
		// 查询商品价格
		var priceRes = await queryPrice();
		var price = getConstantResult(priceRes);
		if(!price) {
			return
		}
		price = parseInt(price,16); // 单位为sun
		console.log('当前的价格：', price)
		redisUtils.set(SMART_CONTRACT_PRICE, price);
		var submitDepositFlag = false
		while(true) {
			// 使用assistant账户查询保证金余额
			var assistantRes = await queryAssistantInfo();
			console.log('assistantRes assistantRes :', assistantRes)
			var assistantMoney = getConstantResult(assistantRes);
			if(!assistantMoney) {
				return
			}
			assistantMoney = assistantMoney.substring(64,128);
			assistantMoney = parseInt(assistantMoney,16); // 单位为sun
			console.log('当前的保证金：', assistantMoney)

			// 如果保证金小于price，需要提价至少和价格相同的保证金
			if(assistantMoney<price) {
				console.log('commitDeposit price:', price)
				var commitDepositRes = await commitDeposit(parseInt(price));
				console.log('commitDepositRes:', commitDepositRes)
				if(commitDepositRes) {
					var assistantMoney = getConstantResult(assistantRes);
					if(!assistantMoney) {
						return
					}
					assistantMoney = parseInt('assistantMoney',16); // 单位为sun
					console.log('提交之后的保证金：', assistantMoney)
					if(assistantMoney >= price) {
						submitDepositFlag = true;
						break;
					}
				} else {
					break;
				}
			} else {
				submitDepositFlag = true;
				break;
			}
			await delay(1000);
		}
		// 直到保证金大于价格就跳出提交保证金循环
		console.log("submitDepositFlag:", submitDepositFlag);

		// 如果保证金没问题，则生成hash
		if(submitDepositFlag) {
			const commitHashRes = await commitHash()
			if(!commitHashRes) {
				return
			}
			await delay(1000);
		}
	} else if(statusValue == '2') {
		// 购买态，表示用户可以开始购买商品
		var price = redisUtils.get(SMART_CONTRACT_PRICE);
		price.then(async function(value) {
			if(!value) {
				var priceRes = await queryPrice();
				var price = getConstantResult(priceRes);
				if(!price) {
					return
				}
				price = parseInt(price,16); // 单位为sun
				console.log('当前的价格：', price)
				redisUtils.set(SMART_CONTRACT_PRICE, price);
			}
		})
		// 购买了多少钱，用以前端显示进度条
		var totalCoinRes = await queryTotalCoin()
		if(!totalCoinRes) {
			return;
		}
		var totalCoin = getConstantResult(totalCoinRes);
		if(!totalCoin) {
			return
		}
		totalCoin = parseInt(totalCoin,16); // 单位为sun
		redisUtils.set(SMART_CONTRACT_TOTALCOIN, totalCoin);
	} else if(statusValue == '3') {
		executeTimes++; // 轮次
		console.log('executeTimes executeTimes:', executeTimes)

		var totalCoinRes = await queryTotalCoin()
		if(!totalCoinRes) {
			return;
		}
		var totalCoin = getConstantResult(totalCoinRes);
		if(!totalCoin) {
			return
		}
		totalCoin = parseInt(totalCoin,16); // 单位为sun
		redisUtils.set(SMART_CONTRACT_TOTALCOIN, totalCoin);

		// 开奖态：表示购买已经结束，即已经买满了
		console.log(new Date())
		await delay(50000);
		console.log(new Date())
		var doLuckyRes = await doLucky()
		global.canShowMinwen = true
		console.log('doLuckyRes:', doLuckyRes)
		await delay(60000);
		// 循环调用查看status状态
		var statusValue = '';
		for(var j=0; j<14; j++) {
			await delay(3000);
			statusRes = await queryStatus();
			statusValue = getConstantResult(statusRes);
			console.log('statusValue:', statusValue)
			if(!statusValue) {
				return
			}
			statusValue = statusValue.replace(/0/g, '');
			if(statusValue == '1') break;
		}
		if(statusValue == '1') {
			redisUtils.set(SMART_CONTRACT_STATUS, '4') // 后台定义的开奖成功状态
			// 将获奖金额打给用户
			var sendBonusAndFeeRes = await sendBonusAndFee(round)
			console.log('sendBonusAndFeeRes:', sendBonusAndFeeRes)
			// 获取
			var roundLuckyRes = await roundLucky(round)
			console.log('roundLuckyRes:', roundLuckyRes)
			if(!roundLuckyRes) {
				return
			}

			await delay(2000);
		} else if(statusValue == '3') {
			// 开奖失败
			var doRefundRes = await doRefund()
			console.log("doRefundRes:", doRefundRes)
			if(!doRefundRes) {
				return
			}
			await delay(1000); // TODO
			var roundRes = await queryRound();
			if(!roundRes) {
				return
			}
			var round = roundRes['_hex']
			console.log('round round:', round)
			// 将获奖金额打给用户
			// var sendRefundRes = await sendRefund(round)
			// console.log('sendRefundRes:', sendRefundRes)
			await delay(1000);
			statusRes = await queryStatus();
			statusValue = getConstantResult(statusRes);
			if(!statusValue) {
				return
			}
			statusValue = statusValue.replace(/0/g, '');
			if(statusValue == '1') {
				redisUtils.set(SMART_CONTRACT_STATUS, '5') // 后台定义的开奖失败状态
				await delay(2000);
				// 初始化
				redisUtils.set(SMART_CONTRACT_TOTALCOIN, '0');
				redisUtils.set(SMART_CONTRACT_MIN, '');
				redisUtils.set(SMART_CONTRACT_HASH, '');
			}
		}
	} else if(statusValue == '4') {
		// 开奖成功态：表示开奖成功
	} else if(statusValue == '5') {
		// 惩罚完成态：表示开奖失败，进行了惩罚并完成
	} else {

	}
    setTimeout(mainTask, 1000);
}

mainTask()

// 得到交易结果数据
function getConstantResult(res) {
	if(!res) {
		return;
	}
	var resultObj = res.result;
	if(!resultObj) {
		return;
	}
	var result = resultObj.result
	if(!(result && (result == true || result == 'true'))) {
		return;
	}

	var constant_result = res['constant_result']
	if(!constant_result || constant_result.length <= 0) {
		return;
	}
	var constantResult = constant_result[0]
	if(!constantResult) {
		return;
	}
	return constantResult;
}

// 得到交易结果数据
function getBonusAddress(res) {
	if(!res) {
		return;
	}
	var resultObj = res.result;
	if(!resultObj) {
		return;
	}
	var result = resultObj.result
	if(!(result && (result == true || result == 'true'))) {
		return;
	}

	var constant_result = res['constant_result']
	if(!constant_result || constant_result.length <= 0) {
		return;
	}
	var constantResult = constant_result[0]
	if(!constantResult) {
		return;
	}
	var address = constantResult.substring(0， 64);
	// TODD
	return constantResult;
}



function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function delay(time) {
  await sleep(time);
}

