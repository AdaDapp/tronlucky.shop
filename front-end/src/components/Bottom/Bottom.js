import React from 'react'
import './Bottom.less'
import { goToPage } from '../../utils/util'
import { Button, Toast } from 'antd-mobile';
import Mask from '../Mask/Mask'

class Bottom extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			showWriteCodeFlag : false,    // 30分钟以外
      		showMaskFlag : false, // 展示MASK的标志
		}
	}

	componentDidMount() {
        // 初始化定时器
        //return;
        //this.textInput.focus();
    }

	writeShareCode() {
		var self = this
		this.setState({
			showWriteCodeFlag : true,
			showMaskFlag : true,
		})
		setTimeout(function(){
			self.textInput.focus();
		}, 200);
	}

	// 查询获奖榜单
	goToRankList() {
		goToPage('/topic/ranklist.html', {}, {}, true);
	}

	// 跳去活动规则
	goToAnswerRule() {
		goToPage('/topic/answerrule.html', {}, {}, true);
	}

	// 激活邀请码
	activeInvitationCode() {
		const self = this
		const { activeInvitationCode } = this.props
		var code = self.textInput.value
		if(!code || code.length<8){
			Toast.info('请输入正确的邀请码!');
			return
		}
		activeInvitationCode(this.textInput.value).then(function(res){
			// 激活邀请码，展示激活成功的弹出框
			console.log('activeInvitationCode activeInvitationCode:', res)
			if(res.subCode) {
				// 出现错误
				Toast.info(res.subMessage || '请输入正确的邀请码!');
			}else {
				// 正确
				Toast.info('邀请成功！');
				self.setState({
					showWriteCodeFlag: false,
          			showMaskFlag: false,
        		})
			}
		})
	}

	// 点击Mask关闭输入邀请码框和按钮
	clickMask() {
		this.setState({
			showWriteCodeFlag: false,
			showMaskFlag: false,
		})
  }

  // 分享邀请码
  share() {
    goToPage('/topic/sharepage.html', {}, {}, true)
  }

	render(){
		var { showReviveFlag=true, relive=0, showActivationCode=false } = this.props
		const { showWriteCodeFlag, showMaskFlag } = this.state
		return (
			<div>
				<div className={showReviveFlag ? 'content-2' : 'hidden'}>
					<a className='revive-box'>
						<div className='small-heart-icon revive-icon'></div>
						<p className='revive-card'>复活卡</p>
						<p className='revive-card-num'>{relive}</p>
					</a>
          			{showActivationCode ? <div className='invite-box' onClick={() => this.writeShareCode()}>填写邀请码</div> : <div className='invite-box' onClick={() => this.share()}>分享邀请码</div>}
				</div>

				<div className='bottom-box'>
					<a className='win-list-btn hidden' onClick={() => this.goToRankList()}>获奖榜单</a>
					<div className='ver-split hidden'></div>
					<a className='rule-btn' onClick={() => this.goToAnswerRule()}>活动规则</a>
				</div>
				<div className={showWriteCodeFlag ? 'write-code-box' : 'hidden'}>
					<input placeholder='填写邀请码' type="tel" maxLength={8} className='write-code-input'  ref={(input) => { this.textInput = input; }} />
					<a className='write-code-btn' onClick={() => this.activeInvitationCode()}>确定</a>
				</div>
				<Mask showMaskFlag={showMaskFlag} onClick={() => this.clickMask()} />
			</div>
		)
	}
}

export default Bottom
