import { smartContract } from '../config.js'
import { getMinWen, getHashCode } from '../tool/Common.js'
import redisUtils from '../tool/redis.js'
import { RedisKeys } from '../config.js'
const { SMART_CONTRACT_MIN, SMART_CONTRACT_HASH, } = RedisKeys

const TronWeb = require('tronweb')
const web3 = require("web3");

// console.log(smartContract)
const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider(smartContract.fullNodeUrl); // Full node http endpoint
const solidityNode = new HttpProvider(smartContract.solidityNodeUrl); // Solidity node http endpoint
const eventServer = new HttpProvider(smartContract.eventServerUrl); // Contract events http endpoint
const tronWeb = new TronWeb(
    fullNode,
    solidityNode,
    eventServer,
    smartContract.developerPrivateKey
);
const owner_address = tronWeb.defaultAddress.hex;

// 后台调用doBuy方法
export async function doBuy () {
  var res = await tronWeb.fullNode.request("wallet/triggersmartcontract", {
      // contract_address: '41f04053ec8484e978e894c414b6caafc57917802f',
      contract_address : smartContract.contractHexAddress,
      owner_address: owner_address,
      function_selector: 'doBuy()',
      fee_limit: parseInt(6000000),
      call_value: parseInt(10000000)
  }, "post");
  return res;
}

// 请求智能合约status方法
export async function queryStatus () {
  var res = await tronWeb.fullNode.request("wallet/triggersmartcontract", {
      contract_address : smartContract.contractHexAddress,
      owner_address: owner_address,
      function_selector: 'status()',
      fee_limit: parseInt(6000000)
  }, "post");
  // console.log('res res:', res)
  return res;
}

// 请求智能合约status方法
export async function queryPrice () {
  var res = await tronWeb.fullNode.request("wallet/triggersmartcontract", {
      contract_address : smartContract.contractHexAddress,
      owner_address: owner_address,
      function_selector: 'price()',
      fee_limit: parseInt(6000000)
  }, "post");
  // console.log('res res:', res)
  return res;
}

// 请求智能合约assistantInfo方法
export async function queryAssistantInfo () {
  console.log('contractHexAddress:', smartContract.contractHexAddress)
  var res = await tronWeb.fullNode.request("wallet/triggersmartcontract", {
      contract_address : smartContract.contractHexAddress,
      owner_address: owner_address,
      function_selector: 'assistant()',
      fee_limit: parseInt(6000000)
  }, "post");
  console.log('assistantInfo res:', res)
  return res;
}

// 提交保证金
export async function commitDeposit (value) {
  var contract =  await tronWeb.trx.getContract(smartContract.contractBase58Address);
  var contract2 =  await tronWeb.contract(contract.abi.entrys, smartContract.contractHexAddress);
  console.log('commitDeposit callValue:', value)
  var res = await contract2.commitDeposit().send({
    callValue : parseInt(value)
  });
  return res;
}

// 提交Hash到智能合约
export async function commitHash () {
  var minwen = getMinWen()
  var hashValue = getHashCode(web3, minwen)
  console.log('minwen:', minwen)
  console.log('hashValue:', hashValue)
  redisUtils.set(SMART_CONTRACT_MIN, minwen)
  redisUtils.set(SMART_CONTRACT_HASH, hashValue)
  var contract =  await tronWeb.trx.getContract(smartContract.contractBase58Address);
  var contract2 =  await tronWeb.contract(contract.abi.entrys, smartContract.contractHexAddress);
  var res = await contract2.commitHash(hashValue).send();
  return res;
}

// 测试加密算法
export async function testsh3 () {
  var minwen = '6d052cf8f6cece3720fa8244f8019f5513e6f34b1e4bd09e3f1895763885d4d6'
  // var minwen = 'test'
  var hashValue = getHashCode(web3, minwen)
  console.log('minwen:', minwen)
  console.log('hashValue:', hashValue)
  return hashValue;
}

// 提交明文到智能合约
export async function doLucky (value) {
  var contract =  await tronWeb.trx.getContract(smartContract.contractBase58Address);
  var contract2 =  await tronWeb.contract(contract.abi.entrys, smartContract.contractHexAddress);

  if(!value) {
    // 从缓存中取明文
    var minWen = redisUtils.get(SMART_CONTRACT_MIN);
    var result= await minWen.then(async function(value) {
      console.log('doLucky minwen:', value)
      if(value) {
        // 需要测试
        var test11 = await contract2.doLucky(value).send().then(function(res2){
          return res2;
        });
        return test11
      }
    })
    return result
  } else {
    // 需要测试
    var res = await contract2.doLucky(value).send();
    return res;
  }
}

// 获取txid的状态
export async function gettransactioninfobyid (txid) {
  var res = await tronWeb.solidityNode.request("walletsolidity/gettransactioninfobyid", {
      value : txid
  }, "post");
  console.log('gettransactioninfobyid res:', res)
  return res;
}

// 获取中奖者的信息
export async function roundLucky (value) {
  var contract =  await tronWeb.trx.getContract(smartContract.contractBase58Address);
  var contract2 =  await tronWeb.contract(contract.abi.entrys, smartContract.contractHexAddress);
  var res = await contract2.roundLucky(value).call();
  console.log('roundLucky res:', res)
  return res;
}


// 智能合约自动打钱给用户
export async function doRefund () {
  var contract =  await tronWeb.trx.getContract(smartContract.contractBase58Address);
  var contract2 =  await tronWeb.contract(contract.abi.entrys, smartContract.contractHexAddress);
  var res = await contract2.doRefund().send();
  console.log('doRefund res:', res)
  return res;
}

// 智能合约自动给幸运者和assistant账户发钱
export async function sendBonusAndFee (value) {
  var contract =  await tronWeb.trx.getContract(smartContract.contractBase58Address);
  var contract2 =  await tronWeb.contract(contract.abi.entrys, smartContract.contractHexAddress);
  console.log('sendBonusAndFee value:', value)
  var res = await contract2.sendBonusAndFee(parseInt(value)).send();
  console.log('sendBonusAndFee res:', res)
  return res;
}

// 智能合约自动给幸运者和assistant账户发钱
export async function sendRefund (value) {
  var contract =  await tronWeb.trx.getContract(smartContract.contractBase58Address);
  var contract2 =  await tronWeb.contract(contract.abi.entrys, smartContract.contractHexAddress);
  var res = await contract2.sendRefund(value).send();
  console.log('sendRefund res:', res)
  return res;
}


// 请求智能合约查询轮次
export async function queryRound() {
  // var res = await tronWeb.fullNode.request("wallet/triggersmartcontract", {
  //     contract_address : smartContract.contractHexAddress,
  //     owner_address: owner_address,
  //     function_selector: 'round()',
  //     fee_limit: parseInt(6000000)
  // }, "post");
  // console.log('queryRound res:', res)
  // return res;
  var contract =  await tronWeb.trx.getContract(smartContract.contractBase58Address);
  var contract2 =  await tronWeb.contract(contract.abi.entrys, smartContract.contractHexAddress);
  var res = await contract2.round().call();
  console.log('doRefund res:', res)
  return res;
}

// 请求智能合约status方法
export async function  queryTotalCoin () {
  var res = await tronWeb.fullNode.request("wallet/triggersmartcontract", {
      contract_address : smartContract.contractHexAddress,
      owner_address: owner_address,
      function_selector: 'totalCoin()',
      fee_limit: parseInt(6000000)
  }, "post");
  // console.log('res res:', res)
  return res;
}

















