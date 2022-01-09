export default function debounce(
  fn,
  delay,
  immediate = false,
  callback = null,
) {
  let timer = null;
  let isInvoke = false;
  const _debounce = function (...args) {
    return new Promise((resolve, reject) => {
      // 取消上一次的定时器
      if (timer) clearTimeout(timer);
      // 判断是否需要立即执行
      if (immediate && !isInvoke) {
        const res = fn.apply(this, args);
        if (callback && typeof callback === "function") callback(res);
        resolve(res);
        isInvoke = true;
      } else {
        // 延迟执行
        timer = setTimeout(() => {
          // 外部传入的真正需要执行的函数
          const res = fn.apply(this, args);
          if (callback && typeof callback === "function") callback(res);
          resolve(res);
          timer = null;
          isInvoke = false;
        }, delay);
      }
    });
  };
  _debounce.cancel = function () {
    if (timer) clearTimeout(timer);
    timer = null;
    isInvoke = false;
  };
  return _debounce;
}
