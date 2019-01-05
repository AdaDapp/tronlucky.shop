/**
 * Created by dongruihe on 2017/8/11.
 */
import React from 'react';

import { ActivityIndicator } from 'antd-mobile';
import './Loading.less';

class Loading extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { animating, size, toast, text } = this.props;
    return (
      <div className='loading-mask'>
        <ActivityIndicator className="fixed-activity-indicator"
           animating={ animating }
           size={ size }
           toast={ toast }
           text={ text }
        />
      </div>
    )
  }
}

Loading.PropTypes = {

};
Loading.defaultProps = {
  animating:true,
  size:'small',   // large
  toast:false,
  text:'',
};

export default Loading
