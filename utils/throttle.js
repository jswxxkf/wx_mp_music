export default function (
  fn,
  interval = 1000,
  options = { leading: true, trailing: false, callback: null },
) {
  const { leading, trailing, callback } = options;
  // 1.记录上一次的开始时间
  let lastTime = 0;
  let timer = null;
  // 2.事件触发时, 真正执行的函数
  function _throttle(...args) {
    return new Promise((resolve, reject) => {
      const currTime = new Date().getTime();
      // 2.1.若第一次不需要触发，则立刻将lastTime与currTime保持一致
      if (!leading && !lastTime) lastTime = currTime;
      // 2.2.使用当前触发的时间和之前的时间间隔以及上一次开始的时间, 计算出还剩余多长事件需要去触发函数
      const remainTime = interval - (currTime - lastTime);
      if (remainTime <= 0) {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        const res = fn.apply(this, args);
        if (callback && typeof callback === "function") callback(res);
        resolve(res);
        lastTime = currTime;
        return;
      }
      if (trailing && !timer) {
        timer = setTimeout(() => {
          timer = null;
          const res = fn.apply(this, args);
          if (callback && typeof callback === "function") callback(res);
          resolve(res);
          lastTime = !leading ? 0 : new Date().getTime();
        }, remainTime);
      }
    });
  }
  _throttle.cancel = function () {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };
  return _throttle;
}
