import {
  mxUtils,
  mxCodec,
  mxEvent,
  mxRubberband,
  mxConstants,
  mxPerimeter,
  mxEdgeStyle,
  mxConnectionConstraint,
  mxPoint,
  mxCellState,
  mxParallelEdgeLayout,
  mxLayoutManager,
  mxCellTracker,
  mxKeyHandler,
  mxMarker,
  mxImage
} from '@/components/mxgraph';

import { IConfig, defaultConfig, defaultLabelProperty } from './types';

/**
 * 样式配置
 * @param graph 绘图对象
 * @param config 配置信息
 */
export function configurateStylesheet(graph, config: IConfig) {
  // 创建节点默认样式
  let style = {};
  style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
  style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
  style[mxConstants.STYLE_STROKECOLOR] = 'gray';
  style[mxConstants.STYLE_ROUNDED] = true;
  style[mxConstants.STYLE_FILLCOLOR] = '#EEEEEE';
  style[mxConstants.STYLE_GRADIENTCOLOR] = 'white';
  style[mxConstants.STYLE_FONTCOLOR] = '#774400';
  style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
  style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
  style[mxConstants.STYLE_FONTSIZE] = '12';
  style[mxConstants.STYLE_FONTSTYLE] = 1;
  graph.getStylesheet().putDefaultVertexStyle(style);

  // 创建线条默认样式
  style = {};
  style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_CONNECTOR;
  style[mxConstants.STYLE_STROKECOLOR] = '#6482B9';
  style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
  style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
  style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
  style[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_CLASSIC;
  style[mxConstants.STYLE_FONTSIZE] = '10';
  style[mxConstants.STYLE_ROUNDED] = true;
  graph.getStylesheet().putDefaultEdgeStyle(style);

  // TODO 添加自定义节点样式
  // style = {}
  // style[mxConstants.STYLE_SPACING] = '8';
  // graph.getStylesheet().putCellStyle('bottom', style);
}

/**
 * 提示配置
 * @param graph
 * @param config
 */
export function configurateTooltip(graph, config: IConfig) {
  if (!config.useTooltip) {
    return;
  }
}

/**
 * 事件配置
 * @param graph 绘图对象
 * @param config 配置信息
 */
export function configurateEvents(graph, config: IConfig) {
  // 取消画布右键弹窗
  mxEvent.disableContextMenu(graph.container);

  // 代理键盘事件
  var keyHandler = new mxKeyHandler(graph);
  keyHandler.enter = function() {};
  keyHandler.bindKey(37, function() {});

  // 框选事件
  graph.getSelectionModel().addListener(mxEvent.CHANGE, function(sender, evt) {
    console.log(graph.getSelectionCell());
    console.log(graph.getSelectionCells());
  });

  // 点击事件
  graph.addListener(mxEvent.CLICK, function(sender, evt) {});
  graph.addListener(mxEvent.DOUBLE_CLICK, function(sender, evt) {});
}

/**
 * 高亮配置
 * @param graph 绘图对象
 * @param config 配置信息
 */
export function configurateHighlight(graph, config: IConfig) {
  if (!config.useHeighlight) {
    return;
  }
  new mxCellTracker(graph, '#4285f4');
}

/**
 * 节点名称配置
 * @param graph 绘图对象
 * @param config 配置信息
 */
export function configurateLabel(graph, config: IConfig) {
  // 重写获取节点名称方法
  graph.convertValueToString = function(cell) {
    const value = this.model.getValue(cell);

    if (value != null) {
      if (mxUtils.isNode(value)) {
        return value.nodeName;
      } else {
        return value[config.labelProperty || defaultLabelProperty];
      }
    }

    return '';
  };

  // 重写设置节点名称方法
  graph.cellLabelChanged = function(cell, value, autoSize) {
    this.model.beginUpdate();
    try {
      const v = this.model.getValue(cell);
      this.model.setValue(
        cell,
        Object.assign({}, v, {
          [config.labelProperty || defaultLabelProperty]: value
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
/**
 * 节点配置
 * @param graph 绘图对象
 * @param config 配置信息
 */
export function configurateVertex(graph, config: IConfig) {}
/**
 * 连线配置
 * @param graph 绘图对象
 * @param config 配置信息
 */
export function configurateEdge(graph, config: IConfig) {
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
    var nx = unitX * (size + sw + 1);
    var ny = unitY * (size + sw + 1);

    return function() {
      canvas.begin();
      canvas.moveTo(pe.x - nx / 2 - ny / 2, pe.y - ny / 2 + nx / 2);
      canvas.lineTo(pe.x + ny / 2 - (3 * nx) / 2, pe.y - (3 * ny) / 2 - nx / 2);
      canvas.stroke();
    };
  });
}

/**
 * 连线配置
 * @param graph 绘图对象
 * @param config 配置信息
 */
export function configurateConnectable(graph, config: IConfig) {
  // 允许连接
  graph.setConnectable(config.connectable);

  // 禁止空连接
  graph.setAllowDanglingEdges(false);

  // 设置锚点样式
  graph.connectionHandler.constraintHandler.pointImage = new mxImage(
    './mxgraph/images/dot.png',
    10,
    10
  );
  graph.connectionHandler.constraintHandler.highlightColor = '#4285f4';

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

      for (var i = 0; i < constraints.length; i++) {
        var cp = this.graph.getConnectionPoint(this.previous, constraints[i]);

        if (cp != null) {
          var tmp =
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
 * 框选配置
 * @param graph 绘图对象
 * @param config 配置信息
 */
export function configurateRubberband(graph, config: IConfig) {
  if (!config.useRubberband) {
    return;
  }
  new mxRubberband(graph);
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

/**
 * 辅助线配置
 * @param graph 绘图对象
 * @param config 配置信息
 */
export function configurateGuides(graph, config: IConfig) {
  if (!config.useGuides) {
    return;
  }
  graph.graphHandler.guidesEnabled = true;
  graph.graphHandler.useGuidesForEvent = function(me) {
    return !mxEvent.isAltDown(me.getEvent());
  };

  // 设置辅助线颜色
  mxConstants.GUIDE_COLOR = '#FF0000';
  // 设置辅助线宽度
  mxConstants.GUIDE_STROKEWIDTH = 1;
}

/**
 * 配置绘图
 * @param graph 绘图对象
 * @param config 配置信息
 */
export function configurate(graph, config?: IConfig) {
  config = Object.assign({}, defaultConfig, config);

  graph.alternateEdgeStyle = 'elbow=vertical';

  graph.setMultigraph(!!config.useMultigraph);
  graph.setEnabled(!!config.enable);
  graph.setEnterStopsCellEditing(!!config.useEnterStopsCellEditing);

  configurateEvents(graph, config);
  configurateStylesheet(graph, config);
  configurateLayout(graph, config);
  configurateLabel(graph, config);
  configurateVertex(graph, config);
  configurateEdge(graph, config);
  configurateConnectable(graph, config);
  configurateRubberband(graph, config);
  configurateTooltip(graph, config);
  configurateHighlight(graph, config);
  configurateGuides(graph, config);
}

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
 * 加载绘制绘图数据
 * @param graph 绘图对象
 */
export function render(graph) {
  // var overlays = graph.getCellOverlays(cell);
  // if (overlays == null)
  // {
  //   // Creates a new overlay with an image and a tooltip
  //   var overlay = new mxCellOverlay(
  //     new mxImage('editors/images/overlays/check.png', 16, 16),
  //     'Overlay tooltip');
  //   // Installs a handler for clicks on the overlay
  //   overlay.addListener(mxEvent.CLICK, function(sender, evt2)
  //   {
  //     mxUtils.alert('Overlay clicked');
  //   });
  //   // Sets the overlay for the cell in the graph
  //   graph.addCellOverlay(cell, overlay);
  // }
  // else
  // {
  //   graph.removeCellOverlays(cell);
  // }
}
