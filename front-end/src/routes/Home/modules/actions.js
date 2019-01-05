import {
  SET_TEAMS_INFO,
  SET_RELIVE
} from './constants'
import { getData, postData } from '../../../utils/fetch'
import { getParam } from '../../../utils/util'

// 保存投注明细信息
export const saveBetDetailInfo = (param) => {

  return (dispatch, getState) => {
    let url ="/smart/saveBetDetailInfo";
    return new Promise((resolve, reject)=>{
      postData(url, param).then(function (resp) {
        console.log("resp:", resp)
        resolve(resp);
        // if (resp.data){
        //   resolve(resp);
        //   dispatch(setTeamsInfo(resp.data))
        // } else {
        //   reject(resp)
        // }
      });
    })
  }
}

// 查询场次信息
export const getTeamsInfo = () => {
  return (dispatch, getState) => {
  	let url ="answer/show";
    return new Promise((resolve, reject)=>{
      getData(url, {
        noErrorMsg : true
      }).then(function (resp) {
        if (resp.data){
          resolve(resp);
          dispatch(setTeamsInfo(resp.data))
        } else {
          reject(resp)
        }
      });
    })
  }
}

// 设置场次信息
export const setTeamsInfo = (data = {}) => {
  return {
    type    : SET_TEAMS_INFO,
    payload : data
  }
}

// 设置复活卡数量
export const setRelive = (data = {}) => {
  return {
    type    : SET_RELIVE,
    payload : data
  }
}