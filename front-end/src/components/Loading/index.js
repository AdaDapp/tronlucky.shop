/**
 * Created by dongruihe on 2017/11/22.
 */
import LoadingComponent from './Loading/Loading';
import React from 'react';
import ReactDOM from 'react-dom';
const Loading = {
  show(){
    const MOUNT_NODE = document.getElementById('dialog_div');
    ReactDOM.render(<LoadingComponent/>, MOUNT_NODE);
  },
  close(){
    const MOUNT_NODE = document.getElementById('dialog_div');
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
  }
};

export default Loading;
