import React from 'react'
import './Mask.less'

import { Button } from 'antd-mobile';

class Mask extends React.Component {

	onClick() {
		var { onClick } = this.props
		if(typeof onClick == 'function') {
			onClick()
		}
	}

	render(){
		var { showMaskFlag } = this.props
		return (
			<div className={showMaskFlag ? 'mask-box' : 'hidden'} onClick={() => this.onClick()}></div>
		)
	}
} 

export default Mask