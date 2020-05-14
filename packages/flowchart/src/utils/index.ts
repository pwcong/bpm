import { IWrappedComponentRefObject } from '@/types';

export * from './chart';

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
