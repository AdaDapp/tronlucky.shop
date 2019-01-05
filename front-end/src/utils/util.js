import { browserHistory } from 'react-router';

// 基于结束时间计算剩下的时间（参数为结束时间对应的年、月、日、小时、分、秒）
export const leftTimerByEnd = (year,month,day,hour,minute,second, diffTime) => { 
  var leftTime = (new Date(year,month-1,day,hour,minute,second)).getTime() - ((new Date()).getTime()-diffTime); //计算剩余的毫秒数 
  var days = parseInt(leftTime / 1000 / 60 / 60 / 24 , 10); //计算剩余的天数 
  var hours = parseInt(leftTime / 1000 / 60 / 60 % 24 , 10); //计算剩余的小时 
  var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟 
  var seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数 
  var showDays = checkTime(days); 
  var showHours = checkTime(hours); 
  var showMinutes = checkTime(minutes); 
  var showSeconds = checkTime(seconds);
  return {
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
    showDays: showDays,
    showHours: showHours,
    showMinutes: showMinutes,
    showSeconds: showSeconds,
  }
}

 export const checkTime = (i) => { //将0-9的数字前面加上0，例1变为01
  if (i < 10) {
  i = "0" + i;
  }
  return i;
 }


export const replace = (t) => {
  return t.replace(/=/g,"")
};

export const queryObj = () => {
  let s = location.search;
  let obj = {}
  if (!!!s) return obj;
  let params = s.substr(1, s.length);
  if (!!!params) return obj;
  let pA = params.split('&');
  for (let i = 0; i < pA.length; i++) {
    let paramArray = pA[i].split('=');
    if (paramArray[1] !== '') {
      obj[paramArray[0]] = paramArray[1]
    }
  }
  return obj;
};

export const getParam = (key) => {
  let s = location.search;

  let params = s.substr(1, s.length);
  let paramsArray = params.split('&');
  let value = "";
  //
  for (let i = 0; i < paramsArray.length; i++) {
    let paramArray = paramsArray[i].split('=');
    if (paramArray[0] == key) {
      value = paramArray[1];
      // 后面的值覆盖前面的值
    }
  }
  return value;
};
export const setUrlSearch =  (key, value) => {
  let s = location.search;
  if (s == "") {
    return "?" + key + "=" + value;
  } else {
    let params = s.substr(1, s.length);
    let paramsArray = params.split('&');
    let paramsValues = {};
    let l = 0;
    for (let i = 0; i < paramsArray.length; i++) {
      let paramArray = paramsArray[i].split('=');
      paramsValues[paramArray[0]] = paramArray[1];
      l++;
    }
    if (paramsValues[key] == null) {
      l++;
    }
    paramsValues[key] = value;
    let newS = "?";
    let c = 0;
    for (let i in paramsValues) {
      newS += i + "=" + paramsValues[i] + "";
      if (c < l - 1) {
        newS += "&";
      }
      c++;
    }
    return newS;
  }
};
export const goToH5Page = (url, bool=false) => {
  if (url && url.indexOf("?") && getParam('appChannel')) {
    url = url + '&appChannel='+ getParam('appChannel')
  }
  url = escape_str(url);
  if (bool) {
    //判断环境
    if (detector.browser.name === 'EDB' && window.xhapp) {
      xhapp.config({
        debugNoBridge: false
      });
      xhapp.goToPageWithLogin({
        url: url
      });
    } else {
      window.location.href = url
    }
  } else {
    window.location.href = url
  }
};

export const goToPage = (url, params=null, state=null, bool=false) => {
  let queryArr = [];
  getParam('appChannel') && (params.appChannel = getParam('appChannel'));
  if (params) {
    for (let key in params) {
      if (params[key]) {
        queryArr.push(
          `${key}=${params[key]}`
        )
      }
    }
  }
  //
  if(state) {
    for (let key in state){
      if (state[key]) {
        queryArr.push(
          `${key}=${state[key]}`
        )
      }
    }
  }

  let queryPath = '';
  if (queryArr.length > 0) {
    queryPath = queryArr.join("&");
  }
  if (bool) {
    //判断环境
    if (detector.browser.name === 'EDB' && window.xhapp) {
      xhapp.config({
        debugNoBridge: false
      });
      xhapp.openWin({
        url: queryPath ?  window.location.origin + url + "?" + queryPath : window.location.origin + url
      });
    } else {
      browserHistory.push({ pathname: url, query: params, state: state })
    }
  } else {
    browserHistory.push({ pathname: url, query: params, state: state })
  }
};

//设置标题
export const setTitle = (pageTile) => {
  document.title = pageTile;
  if (window.xhapp) {
    xhapp.config({
      debugNoBridge: false
    });
    xhapp.changeTitle({title: pageTile}).then(function (rsp) {
    });
  }
};
//设置app回退
export const appGoBack = (url) => {
  if (detector.browser.name === 'EDB' && window.xhapp) {
    window.xhappReady = function () {
      xhapp.registerGoback({}, function (callback) {
        // xhapp.resetIsBack({
        //   isH5Back: false
        // });
        if (url) {
          location.href = url;
        } else {
          history.back();
        }
      });
    };
    window.xhappReady();
  }
};

//判断是否为微信环境
export const isWeiXin = () => {
  const ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true;
  } else {
    return false;
  }
};

//判断是否为手机号
export const isPhoneNumber = (value) => {
  if (!value) return;
  value = value.trim(value);
  if (!value) return;
  if (/^((13[0-9])|(14[0-9])|(15[0-9])|(17[2-9])|(18[0-9]))\d{8}$/.test(value)) {
  } else {
    return false;
  }
  return true;
};

//判断是否为邮箱
export const isMail = (value) => {
  if (!value) return;
  value = value.trim(value);
  if (!value) return;
  if (!((/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/).test(value))) {
    return false;
  }
  return true;
};

//判断是否为发票
export const isInvoiceNumber = (value) => {
  if(!value) return;
  value = value.trim(value);
  if (!value) return;
  if (((/^[a-zA-Z0-9]{15}$/).test(value)) || ((/^[a-zA-Z0-9]{20}$/).test(value)) || ((/^[a-zA-Z0-9]{18}$/).test(value))) {
    return true;
  }
  return false;
};

export const escape_str = (str) => {
  var arrEntities = {'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"'};
  return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) {
    return arrEntities[t];
  });
}

// 将2018-03-10 12:27:53这种时间转换成时间戳
export const transerTime = (time) => {
  var timeList = time.split(' ')
  var time1List = timeList[0].split('-')
  var time2List = timeList[1].split(':')
  var month = time1List[1] 
  if(month.indexOf('0')==0) {
    month = month.substr(0) - 1
  }
  return new Date(time1List[0], month,time1List[2],time2List[0],time2List[1],time2List[2])
}

// 将数组转换成对象
export const convertListToObj = (list, key) => {
  if(!list || !key || key.length <= 0) {
    return {}
  }
  var obj = {}
  for(var i=0,len=list.length; i<len; i++) {
    var item = list[i]
    if(!item[key]) {
      return {}
    }
    obj[item[key]] = Object.assign({}, item)
  }
  return obj
}

// 将数组转换成对象(对象的key对应的value为数组)
export const convertListToObjList = (list, key) => {
  if(!list || !key || key.length <= 0) {
    return {}
  }
  var obj = {}
  for(var i=0,len=list.length; i<len; i++) {
    var item = list[i]
    var item_key = item[key]
    if(!item_key) {
      return {}
    }
    var obj_item_key = obj[item_key]
    if(obj_item_key) {
      obj_item_key = obj_item_key.concat(Object.assign({}, item))
    }else {
      var arr = []
      obj_item_key = arr.concat(Object.assign({}, item))
    }
    obj[item_key] = obj_item_key
  }
  return obj
}

// 将数组转换成对象(对象的key1对应的value为单一的对象，对象的key2对应的value为对象的数组)
export const convertListTo2ObjList = (list, defaultCid, defaultCity, key1, key2) => {
  if(!list || !key1 || key1.length <= 0 || !key2 || key2.length <= 0 || key1 == key2) {
    return {}
  }
  var obj1 = {}
  var obj2 = {}
  var obj2List = []
  var defaultModule1;
  var defaultModule2;
  defaultCity = defaultCity.replace('市', '')
  for(var i=0,len=list.length; i<len; i++) {
    // key1这种情况对应的以单个对象
    var item = list[i]
    var item_key1 = item[key1]
    if(!item_key1) {
      return {}
    }
    obj1[item_key1] = Object.assign({}, item)

    // key2这种情况对应的以单个对象的数组
    var item_key2 = item[key2]
    if(!item_key2) {
      return {}
    }
    var obj_item_key2 = obj2[item_key2]
    if(obj_item_key2) {
      obj_item_key2 = obj_item_key2.concat(Object.assign({}, item))
    }else {
      var arr = []
      obj_item_key2 = arr.concat(Object.assign({}, item))
    }
    obj2[item_key2] = obj_item_key2
    if(!defaultModule1 && defaultCid && (item.cid == defaultCid)) {
      defaultModule1 = Object.assign({}, item)
    }else if(!defaultModule1 && !defaultModule2 && defaultCity && (item.city.indexOf(defaultCity)>=0)) {
      defaultModule2 = Object.assign({}, item)
    }
  }
  for(var key in obj2) {
    var obj2item = {}
    obj2item[key2] = key
    obj2item['children'] = obj2[key] || {}
    obj2List.push(obj2item)
  }
  var result = {}
  result[key1] = obj1
  result[key2] = obj2List
  result['defaultModule'] = defaultModule1 || defaultModule2
  return result
}

// 将数组转换成特定label／value的数组
export const convertObjToPickerList = (obj) => {
  if(!obj) {
    return []
  }
  var pickerList = []
  for(var key in obj){
    var picker = {
      label: key,
      value: key
    }
    pickerList.push(picker)
  }
  var result = []
  result.push(pickerList)
  return result
}


