import { mxUtils, mxCodec } from '@/components/mxgraph';
/**
 * 加载绘图数据
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
 * 到处绘图数据
 * @param graph 绘图对象
 * @param pretty 格式化输出
 */
export function exportXml(graph, pretty?: boolean) {
  const enc = new mxCodec(mxUtils.createXmlDocument());
  const node = enc.encode(graph.getModel());
  const xml = pretty ? mxUtils.getPrettyXml(node) : mxUtils.getXml(node);
  return xml;
}
