//引入公共Constants
import {
  SET_ONLINE_USERS,
  SET_MOBILE,
  SET_INVITATION_CODE,
} from './constants'
// import {
//   STORE_CATEGORY_LIST
// } from '../../../constants/common'

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_ONLINE_USERS] : (state, action) => {
    console.log('set_online_users info:', action)
    return Object.assign({}, state, action.payload);
  },
  [SET_MOBILE] : (state, action) => {
    console.log('SET_MOBILE info:', action)
    return Object.assign({}, state, action.payload);
  },
  [SET_INVITATION_CODE] : (state, action) => {
    console.log('SET_INVITATION_CODE info:', action)
    return Object.assign({}, state, action.payload);
  },

}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  online: '', // 在场次之外的在线人数
  mobile: '',
  invitationCode: ''
}

export default function commonReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}