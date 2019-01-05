import { doBuy, status, gettransactioninfobyid, queryAssistantInfo, queryPrice, commitDeposit, commitHash,
         roundLucky, doRefund, doLucky, queryRound, sendBonusAndFee, queryTotalCoin,} from '../services/smartContract.js'
const TronWeb = require('tronweb')
var redis = require('redis')
import {Redis} from '../config.js'
import { getByte32 } from '../tool/Common.js'
import dbUtils from '../db/smartContract.js'

const web3 = require("web3");

export let Get = (ctx) => {
  console.log('dasdasd');
  ctx.body = {
    result: 'get',
    name: ctx.params.name,
    para: ctx.query
  }
}

export let Post = async (ctx) => {
  ctx.body = {
    result: 'post',
    name: ctx.params.name,
    para: ctx.request.body
  }
}

export let Put = (ctx) => {
  ctx.body = {
    result: 'put',
    name: ctx.params.name,
    para: ctx.request.body
  }
}

export let Delect = (ctx) => {
  ctx.body = {
    result: 'delect',
    name: ctx.params.name,
    para: ctx.request.body
  }
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
  // var res = await sendBonusAndFee('0x16');
  // var res = await dbUtils.getTodayBetList();
  var res = await queryTotalCoin();
  
  console.log("res:", res)
  // var res = await callback.then(function(re) {
  //   return re
  // })
  ctx.body = res;
  // console.log('')
  // const HttpProvider = TronWeb.providers.HttpProvider;
  // const fullNode = new HttpProvider('http://47.90.240.201:8090'); // Full node http endpoint
  // const solidityNode = new HttpProvider('http://47.90.240.201:8091'); // Solidity node http endpoint
  // const eventServer = new HttpProvider('http://47.90.240.201:8092'); // Contract events http endpoint

  // const privateKey = '';

  // const tronWeb = new TronWeb(
  //     fullNode,
  //     solidityNode,
  //     eventServer,
  //     privateKey
  // );
  // var res;
  // const address = 'TXsYEg41yPQKzpYBM1gwWNvpTEoGUtExTu';
  // const owner_address = tronWeb.defaultAddress.hex;
  // console.log(owner_address);
  // // The majority of the function calls are asynchronus,
  // // meaning that they cannot return the result instantly.
  // // These methods therefore return a promise, which you can await.
  // const balance = await tronWeb.trx.getBalance(address);
  // const contract = await tronWeb.trx.getContract(address);

  // res = await tronWeb.fullNode.request("wallet/triggersmartcontract", {
  //     contract_address: '41f04053ec8484e978e894c414b6caafc57917802f',
  //     owner_address: owner_address,
  //     function_selector: 'doBuy()',
  //     fee_limit: parseInt(6000000),
  //     call_value: parseInt(10000000)
  // }, "post");

  // //console.log({balance});
  // // console.log(contract);
  // console.log(res);

  // ctx.body = res;
    // ctx.body = {
    //   result: balance,
    //   name: balance,
    //   para: balance
    // }

    // // You can also bind a `then` and `catch` method.
    // tronWeb.trx.getBalance(address).then(balance => {
    //     console.log({balance});
    // }).catch(err => console.error(err));

    // // If you'd like to use a similar API to Web3, provide a callback function.
    // tronWeb.trx.getBalance(address, (err, balance) => {
    //   if (err) 
    //     return console.error(err);
    //     console.log({balance});
    // });
  }

