/**
 * 防抖
 * @param fn 绑定方法
 * @param delay 延迟时间
 */
export function debounce(fn: Function, delay: number) {
  let timerId;
  return (...args) => {
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

/**
 * 截流
 * @param func 绑定方法
 * @param wait 延迟时间
 * @param mustReturn
 */
export function throttle(func: Function, wait: number, mustReturn?: number) {
  let timeout;
  let startTime = Date.now();
  return (...args) => {
    const currentTime = Date.now();
    timeout && clearTimeout(timeout);
    if (mustReturn && currentTime - startTime >= mustReturn) {
      startTime = currentTime;
      func.apply(this, args);
    } else {
      timeout = setTimeout(func.bind(this, args), wait);
    }
  };
}
