import {
  mxGraph,
  mxRubberband,
  mxKeyHandler,
  // mxImage,
  mxMarker,
  mxConstants,
  mxEllipse,
  mxEvent,
  mxCellState,
  mxConnectionConstraint,
  mxPoint
} from '@/components/mxgraph';
import { postEvent } from '@/utils/event';
import { EEventName } from '../../config';

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

    // graph.connectionHandler.constraintHandler.pointImage = new mxImage(
    //   'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAV9JREFUOBGlk7EvQ1EUxr9z+rSCSWPpgKFDQ0L/hjcQXUwMZovEJAbxB4hBrF3MBiZLhcHfUBJbB6xSE6K83ut+r73J65PwpGd5L/d8v3PPPfe7glQsH3bmu+Zr0wJL1so00yL2SYDrnI6cXO0V7pOIW+/F2pnNv7Tej2GxZWHVrye/AjEQ1CfLYzvn6/LJXFyAcLv1dungUERQqwaoLQaYnerVeXg2aNxGaDQjWOt6E9wUy+MrLBKwSn/nsDih2F8toDoz2EClpKiU8gjnAhxcdNB+NWHMANvCM0fd6M5V1aON0R8wN0hG89Fg9/QDrlsT5IIF7Q3MKttO75wE/T811HJOZJXTZpJnzhpeS1b9VfmBZSnitWQHp5WFTmmUJuEarypreC1ZpcMI8p6zhteSVdqTDqNJeEV/BTXUkiGrsbedPekwmuS3IsxR03djnezQVo4LsO2hHlPy3P99zt9vb8bpqgmVugAAAABJRU5ErkJggg==',
    //   8,
    //   8
    // );

    // 锚点高亮
    graph.connectionHandler.constraintHandler.highlightColor = '#4285F4';
    graph.connectionHandler.constraintHandler.createHighlightShape = function() {
      const hl = new mxEllipse(
        null,
        this.highlightColor,
        this.highlightColor,
        0
      );
      hl.opacity = 30;
      return hl;
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
