/**
 * Created by dongruihe on 2017/9/14.
 */
import { getParam, goToPage } from './util'
import { Toast } from 'antd-mobile'
//import Loading from '../components/Loading'
export const getData = (url, params={}) => {
  //url = __ROOT__ + '/edb-h5-api/v1/' + url;
  // url = 'http://10.3.208.66:4040/v1/' + url
  const setting = {
    credentials: 'include',   //携带cookie用于缓存
  };
  //拼接参数
  let paramsArray = [];
  Object.keys(params).forEach(key => {
    if (params[key] !== '' && params[key] !== null) {
      paramsArray.push(key + '=' + params[key])
    }
  });
  const query = paramsArray.join('&');

  //get请求，参数处理
  if (query) {
    if (url.search(/\?/) === -1) {
      url += '?' + query
    } else {
      url += '&' + query
    }
  }

  return new Promise(function (resolve, reject) {
    try {
      fetch(url,setting)
        .then((response) => {
          // do something
          if (response.status === 404) {
            Toast.info('404');
            return {};
          }
          if (response.status === 403) {
            Toast.info('403');
            return reject({})
          }else{
            return response.json()
          }
        }).then((json)=>{
          console.log('fetch json:', json)
          resolve(json);
          // if (json && (json.code === 'success' || json.code === '200')){
          //   resolve(json);
          // } else if(json && !json.success){
          //   // goToPage('/topic/networkerror.html');
          // }else {
          //   //异常处理
          //   if (!params.noErrorMsg) {
          //     Toast.info( (json && json.msg) || '数据请求错误!');
          //   }
          //   reject(json);
          // }
          return json;
        });
    } catch (err){
      reject(err);
    }
  })
};

// 发送数据
export const postData = (url, params, opts) => {
  // url = __ROOT__ + '/edb-h5-api/v1/' + url;
  url = __ROOT__ + url;
  let myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const setting = {
    method: 'POST',
    credentials: 'include',   //携带cookie用于缓存
    headers: myHeaders,
    body: JSON.stringify(params),
  };

  return new Promise(function (resolve, reject) {
    if(typeof resolve != 'function'){
      resolve = function(){}
    }
    if(typeof reject != 'function'){
      reject = function(){}
    }
    try {
      fetch(url,setting)
        .then((response) => {
          // do something
          if (response.status === 404) {
            Toast.info('404');
            return {};
          }
          if (response.status === 403) {
            Toast.info('403');
            return reject({})
          }
          return response.json()
        }).then((json)=>{
          resolve(json);
          return json;
        });
    } catch (err){
      reject(err);
    }
  })
};
