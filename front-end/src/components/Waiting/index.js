/**
 * Created by dongruihe on 2017/11/14.
 */
import WaitingComponnet from './Waiting/Waiting';
import React from 'react';
import ReactDOM from 'react-dom';
const Waiting = {
  show(text){
    const MOUNT_NODE = document.getElementById('dialog_div');
    ReactDOM.render(<WaitingComponnet text={text} />, MOUNT_NODE);
  },
  close(){
    const MOUNT_NODE = document.getElementById('dialog_div');
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
  }
};

export default Waiting;
