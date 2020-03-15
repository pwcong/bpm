import {
  mxUtils,
  mxCodec,
  mxConnectionConstraint,
  mxPoint,
  mxCellState,
  mxParallelEdgeLayout,
  mxLayoutManager,
  mxCellTracker,
  // mxMarker,
  mxEllipse,
  mxImage
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
 * 高亮配置
 * @param graph 绘图对象
 * @param config 配置信息
 */
export function configurateHighlight(graph, config: IConfig) {
  new mxCellTracker(graph, '#4285f4');
}

/**
 * 连线配置
 * @param graph 绘图对象
 * @param config 配置信息
 */
export function configurateConnectable(graph, config: IConfig) {
  // 允许连接
  graph.setConnectable(true);

  // 禁止空连接
  graph.setAllowDanglingEdges(false);

  // 设置锚点样式
  graph.connectionHandler.constraintHandler.pointImage = new mxImage(
    './mxgraph/images/dot.png',
    10,
    10
  );

  graph.connectionHandler.constraintHandler.highlightColor = '#4285F4';
  /** hover锚点高亮 */
  graph.connectionHandler.constraintHandler.createHighlightShape = function() {
    const hl = new mxEllipse(null, this.highlightColor, this.highlightColor, 0);
    hl.opacity = 30;
    return hl;
  };

  graph.connectionHandler.constraintHandler.highlightColor = '#4285f4';

  // 设置连线锚点
  graph.getAllConnectionConstraints = function(terminal) {
    if (terminal != null && this.model.isVertex(terminal.cell)) {
      return [
        new mxConnectionConstraint(new mxPoint(0.25, 0), true),
        new mxConnectionConstraint(new mxPoint(0.5, 0), true),
        new mxConnectionConstraint(new mxPoint(0.75, 0), true),
        new mxConnectionConstraint(new mxPoint(0, 0.25), true),
        new mxConnectionConstraint(new mxPoint(0, 0.5), true),
        new mxConnectionConstraint(new mxPoint(0, 0.75), true),
        new mxConnectionConstraint(new mxPoint(1, 0.25), true),
        new mxConnectionConstraint(new mxPoint(1, 0.5), true),
        new mxConnectionConstraint(new mxPoint(1, 0.75), true),
        new mxConnectionConstraint(new mxPoint(0.25, 1), true),
        new mxConnectionConstraint(new mxPoint(0.5, 1), true),
        new mxConnectionConstraint(new mxPoint(0.75, 1), true)
      ];
    }

    return null;
  };

  // 禁止连接节点
  graph.connectionHandler.isConnectableCell = function(cell) {
    return false;
  };

  // 自动计算锚点
  const mxConnectionHandlerUpdateEdgeState =
    graph.connectionHandler.updateEdgeState;
  graph.connectionHandler.updateEdgeState = function(pt, constraint) {
    if (pt != null && this.previous != null) {
      const constraints = this.graph.getAllConnectionConstraints(this.previous);
      let nearestConstraint: any = null;
      let dist: any = null;

      for (let i = 0; i < constraints.length; i++) {
        const cp = this.graph.getConnectionPoint(this.previous, constraints[i]);

        if (cp != null) {
          const tmp =
            (cp.x - pt.x) * (cp.x - pt.x) + (cp.y - pt.y) * (cp.y - pt.y);

          if (dist == null || tmp < dist) {
            nearestConstraint = constraints[i];
            dist = tmp;
          }
        }
      }

      if (nearestConstraint != null) {
        this.sourceConstraint = nearestConstraint;
      }
    }

    mxConnectionHandlerUpdateEdgeState.apply(this, arguments);
  };

  // 设置拖拽边的过程出现折线，默认为直线
  graph.connectionHandler.createEdgeState = function(me) {
    const edge = graph.createEdge(
      null,
      null,
      null,
      null,
      null,
      'edgeStyle=orthogonalEdgeStyle'
    );

    return new mxCellState(
      this.graph.view,
      edge,
      this.graph.getCellStyle(edge)
    );
  };
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
