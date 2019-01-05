import {
  SET_ONLINE_USERS,
  SET_MOBILE,
  SET_INVITATION_CODE,
} from './constants'
import { getData, postData } from '../../utils/fetch'
import { getParam } from '../../utils/util'
import { setRelive } from '../../routes/Home/modules/actions'

// 激活邀请码
export const activeInvitationCode = (invitationCode) => {
  return (dispatch, getState) => {
    let url ="answer/show/active/" + invitationCode;
    return new Promise((resolve, reject)=>{
      getData(url).then(function (resp) {
        if (resp){
          resolve(resp);
          dispatch(setRelive(resp.data))
        } else {
          reject(resp)
        }
      });
    })
  }
}

// 获取当前在线人数
export const getOnlineUsers = (showId) => {
  return (dispatch, getState) => {
    let url = 'answer/' + showId + '/online/-1';
    return new Promise((resolve, reject)=>{
      getData(url).then(function (resp) {
        if (resp.data){
          resolve(resp);
          dispatch(setOnlineUsers(resp.data))
        } else {
          reject(resp)
        }
      });
    })
  }
}

// 查询场次信息
export const getUserInfo = () => {
  return (dispatch, getState) => {
    let url ="answer/show";
    return new Promise((resolve, reject)=>{
      getData(url, {
        noErrorMsg : true
      }).then(function (resp) {
        if (resp.data){
          resolve(resp);
          const { mobile, invitationCode } = resp.data
          dispatch(setMobile({
            mobile : mobile,
            invitationCode : invitationCode,
          }))
        } else {
          reject(resp)
        }
      });
    })
  }
}

export const setOnlineUsers = (data = {}) => {
  return {
    type    : SET_ONLINE_USERS,
    payload : data
  }
}

// 设置带掩码的手机号
export const setMobile = (data = {}) => {
  return {
    type    : SET_MOBILE,
    payload : data
  }
}

// 设置邀请码
export const setInvitationCode = (data = {}) => {
  return {
    type    : SET_INVITATION_CODE,
    payload : data
  }
}










