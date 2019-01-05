import React from 'react'
import cs from 'classnames'
import './HomeView.less'
import Header from '../../../components/Header/Header'
import { smartContract, rankColumns, allBuyColumns, } from '../../../utils/constants'

import { List, Button, Tabs, Table, message, Progress, } from 'antd';
const TabPane = Tabs.TabPane;

var leftTimerout = null;
var leftTimerInterval = null;
var isTest = true
let tronWeb = window.tronWeb;
var localBase58Address = tronWeb.defaultAddress.base58;

class HomeView extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			priceValue : '1000',  // 价格
			balance : '', // 余额
			statusValue : '', // 智能合约状态
			processValue: '0', // 进度值，以100为基准
			minwenValue: '',   // 明文
			miwenValue: '',	   // 密文
			statusDesc: '', // 状态对应的描述
			buyAmount: '', // 购买的金额
			totalCoinValue: '', //已经购买的总金额
			rankData : [
				// {
				// 	"rank" : "1",
				// 	"player" : "dasdasda***dasd",
				// 	"amount" : "1000",
				// 	"award"  : "100"
				// },
				// {
				// 	"rank" : "2",
				// 	"player" : "wwwdasda***dasd",
				// 	"amount" : "1000",
				// 	"award"  : "100"
				// },
				// {
				// 	"rank" : "3",
				// 	"player" : "pppdasda***dasd",
				// 	"amount" : "1000",
				// 	"award"  : "100"
				// },
				// {
				// 	"rank" : "4",
				// 	"player" : "uiydasda***dasd",
				// 	"amount" : "1000",
				// 	"award"  : "100"
				// },
				// {
				// 	"rank" : "1",
				// 	"player" : "dasdasda***dasd",
				// 	"amount" : "1000",
				// 	"award"  : "100"
				// },
				// {
				// 	"rank" : "2",
				// 	"player" : "wwwdasda***dasd",
				// 	"amount" : "1000",
				// 	"award"  : "100"
				// },
				// {
				// 	"rank" : "3",
				// 	"player" : "pppdasda***dasd",
				// 	"amount" : "1000",
				// 	"award"  : "100"
				// },
				// {
				// 	"rank" : "4",
				// 	"player" : "uiydasda***dasd",
				// 	"amount" : "1000",
				// 	"award"  : "100"
				// },
				// {
				// 	"rank" : "1",
				// 	"player" : "dasdasda***dasd",
				// 	"amount" : "1000",
				// 	"award"  : "100"
				// },
				// {
				// 	"rank" : "2",
				// 	"player" : "wwwdasda***dasd",
				// 	"amount" : "1000",
				// 	"award"  : "100"
				// },
				// {
				// 	"rank" : "3",
				// 	"player" : "pppdasda***dasd",
				// 	"amount" : "1000",
				// 	"award"  : "100"
				// },
				// {
				// 	"rank" : "4",
				// 	"player" : "uiydasda***dasd",
				// 	"amount" : "1000",
				// 	"award"  : "100"
				// }
			],
			allBuyData : [
				// {
				// 	"time" : "18:20:01",
				// 	"player" : "dasdasda***dasd",
				// 	"amount" : "1000",
				// 	"award"  : "100"
				// },
				// {
				// 	"time" : "18:20:01",
				// 	"player" : "wwwdasda***dasd",
				// 	"amount" : "1000",
				// 	"award"  : "100"
				// },
				// {
				// 	"time" : "18:20:01",
				// 	"player" : "pppdasda***dasd",
				// 	"amount" : "1000",
				// 	"award"  : "100"
				// },
				// {
				// 	"time" : "18:20:01",
				// 	"player" : "uiydasda***dasd",
				// 	"amount" : "1000",
				// 	"award"  : "100"
				// }
			],

		}
	}

	saveBetDetailInfo = (buyAmount) => {
		console.log('saveBetDetailInfo buyAmount:', buyAmount)
		const { saveBetDetailInfo } = this.props
		console.log('saveBetDetailInfo buyAmount2:', saveBetDetailInfo)
		var param = {
			player : localBase58Address,
			amount: buyAmount,
		}
		saveBetDetailInfo(param).then(function(res) {
			console.log('saveBetDetailInfo res:', res)
		})
	}

	// 购买
	buy = () => {
		const self = this
		const { statusValue } = this.state
		let tronWeb = window.tronWeb;
		var amountInput = this.refs.amountInput
		var value = amountInput.value
		console.log('amountInput value:', value)
		if(statusValue != '2') {
			message.info('暂时不能购买，请稍等！');
			return;
		}
		if(!value || parseInt(value) < 10) {
			message.info('购买金额低于10TRX');
			return;
		}
		if(parseInt(value)/10*10 != value) {
			message.info('购买TRX数量必须是10的整数倍');
			return;
		}
		console.log("smartContract.contractBase58Address:", smartContract.contractBase58Address)
		tronWeb.trx.getContract(smartContract.contractBase58Address).then(contract => {
			console.log(contract)
            console.log('- Origin Address:', contract.origin_address);
	        var contract2 = tronWeb.contract(contract.abi.entrys, smartContract.contractHexAddress);
	        var buyAmount = amountInput.value;
	        contract2.doBuy().send({
	        	callValue : (parseInt(buyAmount)*1000000)
	        }).then(function(txid){
	        	console.log('doBuy txid:', txid);
	        	if(txid) {
	        		setTimeout(function queryBuyRes() {
	        			tronWeb.solidityNode.request("walletsolidity/gettransactioninfobyid", {
							value : txid
						}, "post").then(function(trRes) {
							var receipt = trRes.receipt
							console.log("receipt:", receipt);
							if(receipt) {
								var result = receipt.result
								console.log("result:", result);
								if(!result) {
									setTimeout(queryBuyRes, 4000);
								} else if(result == 'SUCCESS') {
									// 成功则调用save接口
									self.saveBetDetailInfo(buyAmount)
								} else {
									// 失败应该提示TODO
								}
							} else {
								setTimeout(queryBuyRes, 4000);
							}
						});
	        		}, 4000);
	        	}
	        })
	    });
	}

	handleMessage = (evt) => {
		var statusDesc = ''
		if(!evt) {
			return;
		}
		var data = evt.data;
		if(!data) {
			return;
		}
		data = JSON.parse(data)
		var statusValue = data['statusValue']
		var priceValue = data['priceValue']
		var minwenValue = data['minwenValue']
		var miwenValue = data['miwenValue']
		var totalCoinValue = data['totalCoinValue']
		var processValue = ''
		if(totalCoinValue && priceValue) {
			processValue = parseInt(totalCoinValue)/parseInt(priceValue)*100
		}
		
		if(statusValue == '1') {
			statusDesc = '准备中'

		} else if(statusValue == '3') {
			statusDesc = '开奖中'
		} else {
			statusDesc = ''
		}
		
		this.setState({
			statusValue: statusValue,
			priceValue: priceValue,
			minwenValue: minwenValue,
			miwenValue: miwenValue,
			statusDesc: statusDesc,
			totalCoinValue: totalCoinValue,
			processValue: processValue,
		})
		console.log(statusValue)
	}

	componentDidMount() {

        // 初始化定时器
        //return;
        // Waiting.show()
        // this.getTeamsTimes()
        const self = this
		// 查询地址
		var address = tronWeb.defaultAddress.base58;
		var hexAddr = tronWeb.defaultAddress.hex;
		console.log("address:", address);
		console.log("hexAddr:", hexAddr);
		// 查询余额
		tronWeb.trx.getBalance(address).then(function(resp){
			console.log(resp)
			resp = (parseInt(resp)/1000000).toFixed(3)
			self.setState({
				balance : resp
			})
		})

        var CreateWebSocket = (function () {
	        return function (urlValue) {
	            if (window.WebSocket) return new WebSocket(urlValue);
	            if (window.MozWebSocket) return new MozWebSocket(urlValue);
	            return false;
	        }
	    })()

	    // 实例化websoscket websocket有两种协议ws(不加密)和wss(加密)
	    var webSocket = CreateWebSocket("ws://18.222.203.250:80/server");
	    // var webSocket = CreateWebSocket("ws://127.0.0.1:3001");
	    webSocket.onopen = function (evt) {
	    	console.log('webSocket.onopen');
	        // 一旦连接成功，就发送第一条数据
	         webSocket.send("第一条数据")
	    }
	    webSocket.onmessage = function (evt) {
	        // 这是服务端返回的数据
	        // console.log("服务端说" + evt.data)
	        self.handleMessage(evt)
	    }
	    // 关闭连接
	    webSocket.onclose = function (evt) {
	        console.log("Connection closed.")
	        webSocket.close();
	    }
    }

    componentWillUnmount() {
        // 销毁定时器
        // clearInterval(leftTimerInterval);
    	// clearTimeout(leftTimerout);
    }

	render(){
		const self = this
		const { rankData=[], allBuyData=[], statusValue, priceValue, balance, processValue, minwenValue, miwenValue, statusDesc } = this.state
		return (
			<div className='home-body'>
				<Header priceValue={priceValue} localBase58Address={localBase58Address} />
				<div className='main-content-1'>
					<div className='main-content-section-1'>
						<div className='game-form'>
							<div className='game-form-section0'>
								拼购的商品
							</div>
							<div className='game-form-section1'>
								<div className='goods-box'></div>
								<div className='goods-price-box'>
									<p>介绍：{'北宋名画'}</p>
									<p>价格：<span className='price-span'>{priceValue}</span>TRX</p>
								</div>
							</div>
							<div className='game-form-section2'>
								<p className='process-tit'>拼购进度</p>
								<Progress percent={parseInt(processValue)} />
							</div>
						</div>
						<div className='trade-form'>
							<div className={cs({'hidden':(statusValue !='2')})}>
								<div className='trade-section1-box'>
							 		<p className='section1-tit'>余额：{balance}TRX</p>
							 	</div>
							 	<div className='trade-section2-box'>
							 		<input className='section2-tit' type="text" readOnly value='投入' />
							 		<input className='section2-amount' type="text" ref="amountInput" />
							 		<input className='section2-unit' type="text" readOnly value='TRX' />
							 	</div>
							 	<div className='buy-btn-box'>
							 		<a className={'buy-btn'} onClick={() => self.buy()}></a>
							 	</div>
							</div>
						 	<div className={cs({'logining-box':true, 'hidden':true, 'show':(statusValue =='1' || statusValue =='3')})}>
					          <div className="logining-cir-box">  
					              <i><span></span></i>
					              <p className="cir-txt">{statusDesc}</p>
					          </div>
					        </div>
					        <div className={cs({'logining-box':true, 'hidden':true, 'show':(statusValue =='4')})}>
					        	<div className="logining-cir-box">  
					        		<i><span></span></i>
					        		<div className='success-box'>
					        			<p>开奖成功</p>
					          	   		<p>下一局稍后开始</p>
					        		</div>
					            </div>
					        </div>
					        <div className={cs({'logining-box':true, 'hidden':true, 'show':(statusValue =='5')})}>
					        	<div className="logining-cir-box">  
					        		<i><span></span></i>
					        		<div className='fail-box'>
					        			<p>开奖失败</p>
					          			<p>下一局稍后开始</p>
					        		</div>
					            </div>
					        </div>
						</div>
					</div>
					<div className='main-content-section-2'>
						{minwenValue && (
							<div className='random-min-box'>
					 			<input className='random-tit' readOnly value='随机明文' />
					 			<input className='random-value' readOnly value={minwenValue} />
					 		</div>
					 	)}
					 	{miwenValue && (
					 		<div className='random-mi-box'>
						 		<input className='random-tit' readOnly value='随机密文' />
						 		<input className='random-value' readOnly value={miwenValue} />
						 	</div>
					 	)}
					</div>
				</div>
				<div className='main-content-2'>
					
				</div>
		  	</div>
		)
	}
}

export default HomeView
