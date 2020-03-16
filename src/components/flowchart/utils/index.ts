import { mxUtils, mxCodec } from '@/components/mxgraph';
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
