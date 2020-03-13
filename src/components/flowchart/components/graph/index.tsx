import {
  mxGraph,
  mxRubberband,
  mxKeyHandler,
  // mxEllipse,
  mxConstants,
  mxEvent,
  mxConnectionConstraint,
  mxPoint
} from '@/components/mxgraph';

export type IGraph = any;

export default class Graph extends mxGraph {
  rubberband: any;
  keyHandler: any;

  model: any;
  cellSizeUpdated: any;

  constructor(
    container: HTMLElement | null,
    model: any | null,
    renderHint: string | null,
    stylesheet: string | null
  ) {
    super(container, model, renderHint, stylesheet);
    this.init(this);
  }

  // 重写获取节点名称方法
  convertValueToString = cell => {
    const value = this.model.getValue(cell) || {};
    return value['name'] || '';
  };

  // 重写设置节点名称方法
  cellLabelChanged = (cell, value, autoSize) => {
    this.model.beginUpdate();
    try {
      const v = this.model.getValue(cell);
      this.model.setValue(
        cell,
        Object.assign({}, v, {
          name: value
        })
      );

      if (autoSize) {
        this.cellSizeUpdated(cell, false);
      }
    } finally {
      this.model.endUpdate();
    }
  };

  init = graph => {
    this.keyHandler = new mxKeyHandler(graph);
    this.rubberband = new mxRubberband(graph);

    // 取消画布右键弹窗
    mxEvent.disableContextMenu(graph.container);

    graph.setEnabled(true);
    graph.setMultigraph(false);
    graph.setEnterStopsCellEditing(true);

    this.initStylesheet(graph);
    this.initGuides(graph);
    this.initConnectionHandler(graph);
  };

  initStylesheet = graph => {
    // 默认边的样式
    const edgeStyle = graph.getStylesheet().getDefaultEdgeStyle();
    edgeStyle.edgeStyle = 'orthogonalEdgeStyle';
    edgeStyle.strokeColor = '#ccc';
    edgeStyle.fontColor = '#333';
    edgeStyle.labelBackgroundColor = '#E8F1FC';
    edgeStyle.fontSize = 10;
    edgeStyle.verticalLabelPosition = 'bottom';
    edgeStyle.verticalAlign = 'middle';
    edgeStyle.fontStyle = '0';
    edgeStyle.rounded = 1;
    edgeStyle.endArrow = 'classic';
    edgeStyle.endFill = 1;
    edgeStyle.jettySize = 'auto';
    edgeStyle.orthogonalLoop = 1;
    // 开启贝塞尔曲线
    // edgeStyle[mxConstants.STYLE_CURVED] = '1'

    // 默认图形节点的样式
    const vertexStyle = graph.getStylesheet().getDefaultVertexStyle();
    vertexStyle.strokeColor = 'grey';
    vertexStyle.fontColor = '#424242';
    vertexStyle.fontSize = 10;
  };

  initConnectionHandler = graph => {
    // 允许连接
    graph.setConnectable(true);

    // 禁止空连接
    graph.setAllowDanglingEdges(false);

    // 连接锚点时的样式
    graph.connectionHandler.getEdgeColor = function(valid) {
      return '#4285F4';
    };
    // 连接锚点时粗细
    graph.connectionHandler.getEdgeWidth = function(valid) {
      return 1;
    };

    // 设置连线锚点
    graph.getAllConnectionConstraints = function(terminal) {
      if (terminal != null && this.model.isVertex(terminal.cell)) {
        return [
          new mxConnectionConstraint(new mxPoint(0.5, 0), true),
          new mxConnectionConstraint(new mxPoint(0, 0.5), true),
          new mxConnectionConstraint(new mxPoint(1, 0.5), true),
          new mxConnectionConstraint(new mxPoint(0.5, 1), true)
        ];
      }

      return null;
    };

    // 自动计算锚点
    const mxConnectionHandlerUpdateEdgeState =
      graph.connectionHandler.updateEdgeState;
    graph.connectionHandler.updateEdgeState = function(pt, constraint) {
      debugger
      if (pt != null && this.previous != null) {
        const constraints = this.graph.getAllConnectionConstraints(
          this.previous
        );
        let nearestConstraint: any = null;
        let dist: any = null;

        for (let i = 0; i < constraints.length; i++) {
          const cp = this.graph.getConnectionPoint(
            this.previous,
            constraints[i]
          );

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

    // 禁止连接节点
    graph.connectionHandler.isConnectableCell = function(cell) {
      return false;
    };
  };

  initGuides = graph => {
    graph.graphHandler.guidesEnabled = true;
    graph.graphHandler.useGuidesForEvent = function(me) {
      return !mxEvent.isAltDown(me.getEvent());
    };
    graph.gridSize = 10;

    // 设置辅助线颜色
    mxConstants.GUIDE_COLOR = '#135995';
    // 设置辅助线宽度
    mxConstants.GUIDE_STROKEWIDTH = 1;
  };
}
