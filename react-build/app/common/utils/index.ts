/**
 * 判断当前运行模式是否为 "开发者模式"
 */
export const isDev = () => {
  return process.env.NODE_ENV === "development";
}

/**
 * 将对象格式的配置转换为数组，并统一 下拉选择的数据格式
 * @param config 
 */
export const toSelectOption = (config: any) => {
  const keys = Object.keys(config);
  if (keys.length > 0) {
    return keys.map((key) => {
      return { text: config[key], value: key };
    });
  }
  return [];
}

export const formatTime = (time: any) => {
  return Math.round(new Date(time).getTime() / 1000);
}

/**
 * 转换时间戳
 * @param {number} timestamp 时间戳(s)
 * @param {string} split 分隔符，默认使用"-"，2021-06-11
 * @param {number} mode 转换模式 现支持如下模式  1：转换到 [天] 级别  2：转换到 [秒] 级别，默认 [天] 级别
 * @returns
 */
export const tellTime = ({ timestamp, split = '-', mode = 1 }) => {
  const timestampNumber = Number(timestamp);
  if (Number.isNaN(timestampNumber)) {
    return timestamp;
  }
  const time = new Date(timestampNumber * 1000);
  const year = time.getFullYear(); // 年
  const month = time.getMonth() + 1 > 9 ? time.getMonth() + 1 : `0${time.getMonth() + 1}`; // 月
  const day = time.getDate() > 9 ? time.getDate() : `0${time.getDate()}`; // 日
  const hour = time.getHours() > 9 ? time.getHours() : `0${time.getHours()}`; // 时
  const minute = time.getMinutes() > 9 ? time.getMinutes() : `0${time.getMinutes()}`; // 分
  const second = time.getSeconds() > 9 ? time.getSeconds() : `0${time.getSeconds()}`; // 秒
  if (mode === 1) {
    return `${year}${split}${month}${split}${day}`;
  }
  if (mode === 2) {
    if (second !== '00') {
      return `${year}${split}${month}${split}${day}  ${hour}:${minute}:${second}`;
    }
    return `${year}${split}${month}${split}${day}  ${hour}:${minute}`;
  }
}

/**
 * 函数防抖
 * @param fn
 * @param delay 防抖的时间(ms)，默认200ms
 */
export const debounce = (fn: Function, delay?: number) => {
  const fnDelay = delay || 200;
  let timer: any;
  return function () {
    const args = arguments;
    clearTimeout(timer);
    timer = null;
    timer = setTimeout(function () {
      fn.apply(this, args);
    }, fnDelay);
  };
}