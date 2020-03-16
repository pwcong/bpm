import {
  mxUtils,
  mxCodec,
  mxParallelEdgeLayout,
  mxLayoutManager
} from '@/components/mxgraph';

import { IConfig } from '../types';

/**
 * 加载绘制绘图数据
 * @param graph 绘图对象
 * @param xml 绘图数据
 */
export function loadXml(graph, xml: string) {
  const xmlDoc = mxUtils.parseXml(xml);
  const dec = new mxCodec(xmlDoc);
  const node = xmlDoc.documentElement;
  dec.decode(node, graph.getModel());
}

/**
 * 布局配置
 * @param graph 绘图对象
 * @param config 配置信息
 */
export function configurateLayout(graph, config: IConfig) {
  const layout = new mxParallelEdgeLayout(graph);
  const layoutMgr = new mxLayoutManager(graph);
  layoutMgr.getLayout = function(cell) {
    if (cell.getChildCount() > 0) {
      return layout;
    }
  };
}
