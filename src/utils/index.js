// 格式化数字
function formatNumber(n) {
  const str = n.toString();
  return str[1] ? str : `0${str}`;
}
// 格式化日期
export function formatTime(date) {
  const type = typeof date;
  if (type === "number" || type === "string") {
    date = new Date(date);
  } else if (type === "object" && !date) {
    return "";
  }
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  const t1 = [year, month, day].map(formatNumber).join("-");
  const t2 = [hour, minute, second].map(formatNumber).join(":");
  return `${t1} ${t2}`;
}


// 获取用户当前坐标
export function getLocation() {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: "gcj02",
      success: resolve,
      fail: reject
    });
  });
}
export  function debounce(func, wait, immediate) {
  // immediate默认为false
  var timeout, args, context, timestamp, result;

  var later = function() {
    // 当wait指定的时间间隔期间多次调用debounce返回的函数，则会不断更新timestamp的值，导致last < wait && last >= 0一直为true，从而不断启动新的计时器延时执行func
    var last = +new Date() - timestamp;

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function(keyword) {
    context = this[0];
    args = arguments;
    console.log('context',this);
    console.log('args',arguments);
    
    timestamp = +new Date();
    // 第一次调用该方法时，且immediate为true，则调用func函数
    var callNow = immediate && !timeout;
    // 在wait指定的时间间隔内首次调用该方法，则启动计时器定时调用func函数
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
};


export default {
  formatNumber,
  formatTime
};
