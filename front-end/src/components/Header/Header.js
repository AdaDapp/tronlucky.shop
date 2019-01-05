import React from 'react'
import './Header.less'
import { howPlayDirections, faireExplanation, } from '../../utils/util.js'
// import { Icon } from 'antd';
//import { Button, Dropdown, } from 'element-react';
//import 'element-theme-default';
import { Dropdown, Menu, Icon, Modal  } from 'antd';

// const Item = Dropdown.Item;
// const Menu = Dropdown.Menu;
const Item = Menu.Item;

class Header extends React.Component {

	constructor(props){
		super(props);
		const { howPlay, fairState } = this;
		const { priceValue, localBase58Address } = this.props
		this.state = {
			howPlayFlag : false
		}
		this.desMenu = (
		  <Menu>
		    <Item key="1">
		      <a onClick={howPlay}>怎么玩</a>
		    </Item>
		    <Item key="2">
		      <a onClick={fairState}>公平申明</a>
		    </Item>
		  </Menu>
		);
		this.addrMenu = (
			<Menu>
				<div className='addr-menu-box' key="1">
					<span>地址：</span>
					<span>{localBase58Address}</span>
				</div>
				<div className='addr-menu-box' key="2">
					<span>TRX余额：</span>
					<span>{priceValue} TRX</span>
				</div>
			</Menu>
		);
	}

	howPlay = () => {
		window.location.href = 'https://github.com/AdaDapp/tronlucky.shop';
	}

	fairState = () => {
		window.location.href = 'https://github.com/AdaDapp/tronlucky.shop';
	}

	render(){
		const { online, showClose } = this.props
		const { desMenu, addrMenu, } = this
		const { howPlayFlag=false,  } = this.state
		return (
			<div className='header'>
		        <div className="left-box"></div>
				<div className='right-box'>
					<Dropdown overlay={desMenu} className='right-item'>
					    <div className='dropdown-box'>
							<a className="ins-txt" href="#">游戏说明</a>
							<Icon type="down" className="down-icon" />
						</div>
					</Dropdown>

					<Dropdown overlay={addrMenu}>
					    <div className='dropdown-box'>
							<a className="ins-txt" href="#">地址信息</a>
							<Icon type="down" className="down-icon" />
						</div>
					</Dropdown>
				</div>

				<Modal
		          title="怎么玩"
		          visible={this.state.visible}
		          onOk={this.handleOk}
		          onCancel={this.handleCancel}
		        >
		          <p>Some contents...</p>
		          <p>Some contents...</p>
		          <p>Some contents...</p>
		        </Modal>
			</div>
		)
	}
}

export default Header
