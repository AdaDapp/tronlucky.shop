//引入公共Constants
import {
  GET_TEAMS_INFO,
  SET_TEAMS_INFO,
  SET_RELIVE,
} from './constants'
// import {
//   STORE_CATEGORY_LIST
// } from '../../../constants/common'

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_TEAMS_INFO] : (state, action) => {
  	console.log('set teams info:', action)
    var payload = action.payload
    const {shows=[], invitationCode='', relive='', online='', showActivationCode=false} = payload
  	return Object.assign({}, state, {
      teamList: shows,
      invitationCode: invitationCode,
      relive: relive,
      online: online,
      showActivationCode: showActivationCode,
    });
  },
  [SET_RELIVE] : (state, action) => {
    console.log('set relive info:', action)
    var payload = action.payload
    const {relive='', showActivationCode} = payload
    return Object.assign({}, state, {
      relive: relive,
      showActivationCode: showActivationCode,
    });
  },
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
	invitationCode : '', // 邀请码
	teamList:[], // 答题场次列表
  relive:'', // 复活卡数量
  online:'', // 在线人数
  showActivationCode: false, // 是否显示填写邀请码按钮
}

export default function homeReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}