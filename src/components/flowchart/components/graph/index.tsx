import {
  mxGraph,
  mxRubberband,
  mxKeyHandler,
  mxMarker,
  mxConstants,
  mxEvent,
  mxCellState,
  mxConnectionConstraint,
  mxPoint,
  mxGraphHandler
} from '@/components/mxgraph';
import { postEvent } from '@/utils/event';
import { EEventName } from '../../config';

import { dataMap } from '../toolbar/config';

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

  init = graph => {
    // 允许框选
    this.rubberband = new mxRubberband(graph);

    // 取消画布右键弹窗
    mxEvent.disableContextMenu(graph.container);

    // 公差
    graph.setTolerance(8);

    // 允许编辑
    graph.setEnabled(true);
    // 禁止重复连接
    graph.setMultigraph(false);
    // 回车键完成输入
    graph.setEnterStopsCellEditing(true);

    this.initKeyHandler(graph);
    this.initStylesheet(graph);
    this.initEvents(graph);
    this.initGuides(graph);
    this.initConnection(graph);
    this.initCell(graph);
  };

  initStylesheet = graph => {
    graph.alternateEdgeStyle = 'elbow=vertical';

    // 默认点的样式
    const vertexStyle = {};
    vertexStyle['strokeColor'] = 'grey';
    vertexStyle['fontColor'] = '#424242';
    vertexStyle['fontSize'] = 10;
    graph.getStylesheet().putDefaultVertexStyle(vertexStyle);

    // 默认边的样式
    const edgeStyle = {};
    edgeStyle['edgeStyle'] = 'orthogonalEdgeStyle';
    edgeStyle['strokeColor'] = '#ccc';
    edgeStyle['fontColor'] = '#333';
    edgeStyle['labelBackgroundColor'] = '#E8F1FC';
    edgeStyle['fontSize'] = 10;
    edgeStyle['verticalLabelPosition'] = 'bottom';
    edgeStyle['verticalAlign'] = 'middle';
    edgeStyle['fontStyle'] = '0';
    edgeStyle['endArrow'] = 'classic';
    edgeStyle['endFill'] = 1;
    edgeStyle['jettySize'] = 'auto';
    edgeStyle['selectionColor'] = 'red';

    edgeStyle['orthogonalLoop'] = 1;
    graph.getStylesheet().putDefaultEdgeStyle(edgeStyle);
  };

  initKeyHandler = graph => {
    // 键盘操作
    const keyHandler = (this.keyHandler = new mxKeyHandler(graph));
    keyHandler.bindKey(37, function() {
      console.log(arguments);
    });
  };

  initCell = graph => {
    // 禁止缩放大小
    // graph.setCellsResizable(false);

    // 允许拖放
    graph.setDropEnabled(true);
    graph.isValidDropTarget = function(cell, cells, evt) {
      return (
        cell != null &&
        ((this.isSplitEnabled() && this.isSplitTarget(cell, cells, evt)) ||
          (!this.model.isEdge(cell) &&
            (this.isSwimlane(cell) ||
              (this.model.getChildCount(cell) > 0 &&
                !this.isCellCollapsed(cell)))))
      );
    };

    // 对象切割
    graph.isSplitTarget = function(target, cells, evt) {
      debugger;
      return (
        this.model.isEdge(cells[0]) &&
        !mxEvent.isAltDown(evt) &&
        !mxEvent.isShiftDown(evt)
      );
    };

    mxMarker.addMarker('dash', function(
      canvas,
      shape,
      type,
      pe,
      unitX,
      unitY,
      size,
      source,
      sw,
      filled
    ) {
      const nx = unitX * (size + sw + 1);
      const ny = unitY * (size + sw + 1);

      return function() {
        canvas.begin();
        canvas.moveTo(pe.x - nx / 2 - ny / 2, pe.y - ny / 2 + nx / 2);
        canvas.lineTo(
          pe.x + ny / 2 - (3 * nx) / 2,
          pe.y - (3 * ny) / 2 - nx / 2
        );
        canvas.stroke();
      };
    });
  };

  initEvents = graph => {
    // 选中元素
    graph.getSelectionModel().addListener(mxEvent.CHANGE, (sender, evt) => {
      postEvent(EEventName.select, sender);
    });

    // 点击事件
    graph.addListener(mxEvent.CLICK, (sender, evt) => {});
    graph.addListener(mxEvent.DOUBLE_CLICK, (sender, evt) => {});
  };

  initConnection = graph => {
    // 允许连接
    graph.setConnectable(true);

    // 禁止空连接
    graph.setAllowDanglingEdges(false);

    // 设置连线锚点
    graph.getAllConnectionConstraints = function(terminal) {
      if (terminal !== null && this.model.isVertex(terminal.cell)) {
        const { constraints = [] } =
          dataMap.get((this.model.getValue(terminal.cell) || {}).key) || {};

        if (constraints.length > 0) {
          return constraints.map(
            c => new mxConnectionConstraint(new mxPoint(c[0], c[1]), true)
          );
        }

        return [
          new mxConnectionConstraint(new mxPoint(0.5, 0), true),
          new mxConnectionConstraint(new mxPoint(0, 0.5), true),
          new mxConnectionConstraint(new mxPoint(1, 0.5), true),
          new mxConnectionConstraint(new mxPoint(0.5, 1), true)
        ];
      }

      return null;
    };

    // 连接锚点时的样式
    graph.connectionHandler.getEdgeColor = function(valid) {
      return '#4285F4';
    };
    // 连接锚点时粗细
    graph.connectionHandler.getEdgeWidth = function(valid) {
      return 1;
    };

    // 自动计算锚点
    const mxConnectionHandlerUpdateEdgeState =
      graph.connectionHandler.updateEdgeState;
    graph.connectionHandler.updateEdgeState = function(pt, constraint) {
      if (pt !== null && this.previous !== null) {
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

          if (cp !== null) {
            const tmp =
              (cp.x - pt.x) * (cp.x - pt.x) + (cp.y - pt.y) * (cp.y - pt.y);

            if (dist === null || tmp < dist) {
              nearestConstraint = constraints[i];
              dist = tmp;
            }
          }
        }

        if (nearestConstraint !== null) {
          this.sourceConstraint = nearestConstraint;
        }
      }

      mxConnectionHandlerUpdateEdgeState.apply(this, arguments);
    };

    // 实时更新连线（联动自动计算锚点）
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

    // 禁止连接节点
    graph.connectionHandler.isConnectableCell = function(cell) {
      return false;
    };
  };

  initGuides = graph => {
    // 设置允许辅助线
    graph.graphHandler.guidesEnabled = true;
    graph.graphHandler.useGuidesForEvent = function(me) {
      return !mxEvent.isAltDown(me.getEvent());
    };

    // 设置步进距离
    graph.gridSize = 10;

    // 设置辅助线颜色
    mxConstants.GUIDE_COLOR = '#135995';
    // 设置辅助线宽度
    mxConstants.GUIDE_STROKEWIDTH = 1;

    // 设置辅助框颜色
    graph.graphHandler.createPreviewShape = function(bounds) {
      this.previewColor = '#4285f4';
      return mxGraphHandler.prototype.createPreviewShape.apply(this, arguments);
    };
  };

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
}
