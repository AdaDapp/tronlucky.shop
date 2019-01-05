/**
 * Created by dongruihe on 2017/10/11.
 */
import React from 'react'
import './Waiting.less'

class Waiting extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
    return <div className="waiting-mask">
    	<div className="xhsc-waiting">
	      <img src={ require('../../../imgs/common/loading2.gif') }/>
	      <p>{ this.props.text ? this.props.text : '等待中...' }</p>
	    </div>
    </div>
  }
}

export default Waiting
