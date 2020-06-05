import { IWrappedComponentRefObject } from '../types';
import EditorUI from '../components/editorui';
import { getChartConfig } from './chart';

export * from './chart';
export * from './hook';

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

/**
 * 转换JSON数据
 * @param json JSON格式值
 * @param defaultValue 默认值
 */
export function parseJSON(json: string | object, defaultValue?: any) {
  if (typeof json === 'object') {
    return json || defaultValue || {};
  }

  try {
    return JSON.parse(json) || defaultValue || {};
  } catch (e) {
    return defaultValue || {};
  }
}

/**
 * 获取绘图UI对象
 * @param chartRef 绘图对象
 */
export function getEditorUIFromChartRef(
  chartRef?: IWrappedComponentRefObject | null
) {
  const editorUI = chartRef && chartRef.current && chartRef.current.editorUI;
  return editorUI || undefined;
}

/**
 * 获取绘图UI对象工具栏配置
 */
export function getToolbarConfigFromEditorUI(editorUI: EditorUI) {
  return getChartConfig(editorUI.config).toolbar;
}

/**
 * 获取绘图UI对象菜单栏配置
 */
export function getMenubarConfigFromEditorUI(editorUI: EditorUI) {
  return getChartConfig(editorUI.config).menubar;
}
