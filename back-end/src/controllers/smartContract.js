import { doBuy, status, gettransactioninfobyid, queryAssistantInfo, queryPrice, commitDeposit, commitHash,
         roundLucky, doRefund, doLucky, queryRound, sendBonusAndFee, } from '../services/smartContract.js'
const TronWeb = require('tronweb')
var redis = require('redis')
import {RedisKeys} from '../config.js'
import { getByte32 } from '../tool/Common.js'
import dbUtils from '../db/smartContract.js'
import redisUtils from '../tool/redis.js'
const { SMART_CONTRACT_ROUND, } = RedisKeys

const web3 = require("web3");


// 保存用户投注信息
export async function saveBetDetailInfo (ctx) {
  var param = ctx.request.body;
  var round = await redisUtils.get(SMART_CONTRACT_ROUND)
  var array = []
  array.push(param.player)
  array.push(param.amount)
  array.push(round)
  console.log('saveBetDetailInfo param:', array);
  if(array && array.length > 0) {
    var res = await dbUtils.insertBetDetailInfo(array);
    if(res.insertId >= 0) {
      ctx.body = 'success';
      return
    }
  }
  ctx.body = 'fail';
}


export async function Test (ctx) {
  // var res = await doBuy();
  // var res = await status();
  // var res = await gettransactioninfobyid();
  // var res = await queryAssistantInfo();
  // var res = await price();
  // var res = await commitHash();
  // var res = await commitDeposit(10166 * 1000000);
  // var res = await doLucky(getByte32())
  // var res = await doRefund();
  // var res = await doLucky();
  // var res = await queryRound();
  var res = await sendBonusAndFee('22');

  // var res = await dbUtils.getTodayList();
  
  // var arry = ['3123123125', '1000', '2'];
  // var res = await dbUtils.insertBetDetailInfo(arry);

  // var arry = ['3123123125', '2', '900'];
  // var res = await dbUtils.insertWinDetailInfo(arry);

  // var res = await dbUtils.getMineBetList('3123123123')
  
  
  console.log("res:", res)
  // var res = await callback.then(function(re) {
  //   return re
  // })
  ctx.body = res;
}

