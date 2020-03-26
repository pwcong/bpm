import { mxUtils, mxCodec, mxClient, mxEvent } from '@/components/mxgraph';
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
 * 导出绘图数据
 * @param graph 绘图对象
 * @param pretty 格式化输出
 */
export function exportXml(graph, pretty?: boolean) {
  const enc = new mxCodec(mxUtils.createXmlDocument());
  const node = enc.encode(graph.getModel());
  const xml = pretty ? mxUtils.getPrettyXml(node) : mxUtils.getXml(node);
  return xml;
}

/**
 * 展开节点
 * @param cells 节点映射
 */
export function getCells(cells) {
  return Object.keys(cells).map(k => cells[k]);
}

/**
 * 获取节点对象
 * @param graph 绘图对象
 * @param id 节点ID
 */
export function getCell(graph, id: string) {
  return graph.model.getCell(id);
}

/**
 * 处理节点样式
 * @param cell 节点
 * @param options 样式配置
 */
export function setStyle(
  cell,
  options: {
    add?: { [key: string]: string };
    remove?: Array<string>;
  }
) {
  const style = cell.getStyle() || '';

  const { add: newStyle = {}, remove: delStyle = [] } = options;

  const cache = {};
  const newStyleArray = style
    .split(';')
    .map(t => {
      if (!t) {
        return;
      }

      if (t.indexOf('=') < 0) {
        return t;
      }

      const arr = t.split('=');
      if (arr.length !== 2) {
        return t;
      }

      const key = arr[0];

      if (delStyle.indexOf(key) >= 0) {
        cache[key] = true;
        return;
      }

      let value = arr[1];

      if (newStyle[key]) {
        cache[key] = true;
        value = newStyle[key];
      }

      return `${key}=${value}`;
    })
    .filter(t => !!t);

  Object.keys(newStyle).forEach(k => {
    if (cache[k]) {
      return;
    }

    cache[k] = true;
    newStyleArray.push(`${k}=${newStyle[k]}`);
  });

  return newStyleArray.join(';') + ';';
}

/**
 * 包含节点样式
 * @param cell 节点
 * @param style 样式
 */
export function hasStyle(cell, style: string) {
  return (cell.getStyle() || '').indexOf(style) >= 0;
}

/**
 * 预制节点样式
 * @param graph 绘图对象
 * @param key 键值
 * @param style 样式
 */
export function putStyle(graph, key, style: object) {
  const styleObj = new Object();
  Object.keys(style).forEach(k => (styleObj[k] = style[k]));
  graph.getStylesheet().putCellStyle(key, styleObj);
}

/**
 * 更新对象
 * @param graph 绘图对象
 * @param cells 操作对象
 * @param updater 更新操作
 */
export function updateCells(
  graph,
  cells: Array<any>,
  updater: (graph, cell, index: number, cells: Array<any>) => void
) {
  graph.model.beginUpdate();
  try {
    for (let i = 0, l = cells.length; i < l; i++) {
      updater(graph, cells[i], i, cells);
    }
  } finally {
    graph.model.endUpdate();
  }
}

/**
 * 判断是否为滚轮事件
 * @param evt 事件对象
 */
export function isZoomWheelEvent(evt) {
  return mxClient.IS_MAC ? mxEvent.isMetaDown(evt) : mxEvent.isControlDown(evt);
}
