import {
  SystemConfig
} from '../config'

// 截取字符串，多余的部分用...代替
export let setString = (str, len) => {
  let StrLen = 0
  let s = ''
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 128) {
      StrLen += 2
    } else {
      StrLen++
    }
    s += str.charAt(i)
    if (StrLen >= len) {
      return s + '...'
    }
  }
  return s
}

// 格式化设置
export let OptionFormat = (GetOptions) => {
  let options = '{'
  for (let n = 0; n < GetOptions.length; n++) {
    options = options + '\'' + GetOptions[n].option_name + '\':\'' + GetOptions[n].option_value + '\''
    if (n < GetOptions.length - 1) {
      options = options + ','
    }
  }
  return JSON.parse(options + '}')
}

// 替换SQL字符串中的前缀
export let SqlFormat = (str) => {
  if (SystemConfig.mysql_prefix !== 'api_') {
    str = str.replace(/api_/g, SystemConfig.mysql_prefix)
  }
  return str
}

// 数组去重
export let HovercUnique = (arr) => {
  let n = {}
  let r = []
  for (var i = 0; i < arr.length; i++) {
    if (!n[arr[i]]) {
      n[arr[i]] = true
      r.push(arr[i])
    }
  }
  return r
}

// 获取json长度
export let getJsonLength = (jsonData) => {
  var arr = []
  for (var item in jsonData) {
    arr.push(jsonData[item])
  }
  return arr.length
}

export let getMinWen = () => {
  var i = 0;
  var minwen = "0x";
  var random = 0;
  var aryNum = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
  for(i = 0; i < 64; i++) {
    random = parseInt(Math.random() * 16);
    minwen += aryNum[random];
  }
  return minwen;
}

export let getHashCode = (web3, minwen) => {
  // var result = '0x' + tronWeb.sha3(minwen, false);
  var result = web3.utils.soliditySha3({t: 'bytes32', v: minwen})
  return result;
}


// // 生成hash
// //产生一个hash值，只有数字，规则和java的hashcode规则相同
// function hashCode(str) {
//     var h = 0;
//     var len = str.length;
//     var t = 2147483648;
//     for (var i = 0; i < len; i++) {
//         h = 31 * h + str.charCodeAt(i);
//         if (h > 2147483647) h %= t; //java int溢出则取模
//     }
//     return h;
// }

// function randomWord(randomFlag, min, max) {
//     var str = "",
//         range = min,
//         arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
//     // 随机产生
//     if (randomFlag) {
//         range = Math.round(Math.random() * (max - min)) + min;
//     }
//     for (var i = 0; i < range; i++) {
//         pos = Math.round(Math.random() * (arr.length - 1));
//         str += arr[pos];
//     }
//     return str;
// }

// function gethashcode() {
//     //定义一个时间戳，计算与1970年相差的毫秒数  用来获得唯一时间
//     var timestamp = (new Date()).valueOf();
//     var myRandom=randomWord(false,6);
//     var hashcode=hashCode(myRandom+timestamp.toString());
//     return hashcode;
// }



















