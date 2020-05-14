import { parseJSON } from '@bpm/utils';

import { MX, mxConfig } from '@/components/mx';

import { IConfig, IBaseConfig } from '@/types';
import { putStyle, getBaseConfig } from '@/utils';

import {
  defaultVertexStyle,
  defaultEdgeStyle,
  defaultExtraStyle,
} from './config';
import { getDot } from './utils';

const {
  mxGraph,
  mxRubberband,
  mxKeyHandler,
  mxClient,
  mxMarker,
  mxEvent,
  mxCellState,
  mxConnectionConstraint,
  mxPoint,
  mxGraphHandler,
  mxRectangle,
  mxMultiplicity,
} = MX;

export default class Graph extends mxGraph {
  graph: any;
  model: any;

  rubberband: any;
  keyHandler: any;

  config: IBaseConfig;
  editable: boolean;

  constructor(
    container: HTMLElement | null,
    model: any | null,
    renderHint: string | null,
    stylesheet: string | null,
    extraConfig: IConfig
  ) {
    super(container, model, renderHint, stylesheet);

    this.config = getBaseConfig(extraConfig);
    this.editable = this.config.editable;

    this.graph = this;
    this.init(this.graph);
  }

  init = (graph) => {
    // 允许框选
    this.rubberband = new mxRubberband(graph);
    this.rubberband.setEnabled(mxClient.IS_TOUCH ? false : true);

    // 取消画布右键弹窗
    mxEvent.disableContextMenu(graph.container);

    // 公差计算
    graph.setTolerance(8);

    // 允许编辑
    graph.setEnabled(true);

    // 允许拖动
    graph.setPanning(true);

    // 使用html标签
    !mxClient.IS_IE && graph.setHtmlLabels(true);

    // 回车键完成输入
    // graph.setEnterStopsCellEditing(true)

    this.initKeyHandler(graph);
    this.initStylesheet(graph);
    this.initGuides(graph);
    this.initConnection(graph);
    this.initCells(graph);
    this.initMarker(graph);
  };

  initStylesheet = (graph) => {
    graph.alternateEdgeStyle = 'elbow=vertical';

    // 默认点的样式
    graph.getStylesheet().putDefaultVertexStyle(defaultVertexStyle);

    // 默认边的样式
    graph.getStylesheet().putDefaultEdgeStyle(defaultEdgeStyle);

    // 默认拓展样式
    Object.keys(defaultExtraStyle).forEach((key) =>
      putStyle(graph, key, defaultExtraStyle[key])
    );

    // 初始化节点样式
    Object.keys(this.config.toolbar.map).forEach((key) => {
      const cell = this.config.toolbar.map[key] || ({} as any);
      const { style = {}, status = {} } = cell;
      putStyle(graph, key, style);
      Object.keys(status).forEach((s) =>
        putStyle(graph, `${key}#${s}`, status[s])
      );
    });
  };

  initKeyHandler = (graph) => {
    // 键盘操作
    this.keyHandler = new mxKeyHandler(graph);

    /** 兼容mac meta和window control */
    this.keyHandler.isControlDown = function (evt) {
      return mxEvent.isControlDown(evt) || (mxClient.IS_MAC && evt.metaKey);
    };

    this.keyHandler.setEnabled(this.editable);
  };

  initCells = (graph) => {
    // 是否锁定节点
    graph.setCellsLocked(!this.editable);

    graph.setCellsEditable(true);
    graph.setCellsMovable(true);
    graph.setCellsResizable(true);
    graph.setEdgeLabelsMovable(true);

    // 允许拖放
    graph.setDropEnabled(true);

    // 设置气泡提示
    graph.setTooltips(true);
    graph.getTooltipForCell = function (cell) {
      return this.convertValueToString(cell);
    };
  };

  initMarker = (graph) => {
    // 高亮斜线逻辑
    mxMarker.addMarker('dash', function (c, shape) {
      const dot = getDot(shape.points, shape.scale);
      return function () {
        c.begin();
        // pe为起点
        // c.moveTo(pe.x - nx / 2 - ny / 2, pe.y - ny / 2 + nx / 2)
        // c.lineTo(pe.x + ny / 2 - 3 * nx / 2, pe.y - 3 * ny / 2 - nx / 2)
        c.moveTo(dot.x - 5, dot.y - 5);
        c.lineTo(dot.x + 5, dot.y + 5);
        const node = c.node;
        c.stroke();
        node.setAttribute('stroke-width', 2);
        node.setAttribute('stroke', mxConfig.themeColor);
      };
    });
  };

  initConnection = (graph) => {
    const config = this.config;

    // 允许连接
    graph.setConnectable(true);

    // 禁止重复连接
    graph.setMultigraph(false);
    // 设置连线规则
    Object.keys(this.config.toolbar.map).forEach((key) => {
      const cell = this.config.toolbar.map[key] || ({} as any);
      const { multiplicities = [] } = cell;

      multiplicities.forEach((m) => {
        graph.multiplicities.push(
          new mxMultiplicity(
            m.source,
            key,
            m.attr,
            m.value,
            m.min,
            m.max,
            m.validNeighbors,
            m.countError,
            m.typeError,
            m.validNeighborsAllowed
          )
        );
      });
    });

    // 禁止空连接
    graph.setAllowDanglingEdges(false);

    // 设置连线锚点
    graph.getAllConnectionConstraints = function (terminal) {
      if (terminal != null && this.model.isVertex(terminal.cell)) {
        const { constraints = [] } =
          config.toolbar.map[
            parseJSON(this.model.getValue(terminal.cell), {}).key
          ] || {};

        if (constraints.length > 0) {
          return constraints.map(
            (c) => new mxConnectionConstraint(new mxPoint(c[0], c[1]), true)
          );
        }

        return [
          new mxConnectionConstraint(new mxPoint(0.5, 0), true),
          new mxConnectionConstraint(new mxPoint(0, 0.5), true),
          new mxConnectionConstraint(new mxPoint(1, 0.5), true),
          new mxConnectionConstraint(new mxPoint(0.5, 1), true),
        ];
      }

      return null;
    };

    // 连接锚点时的样式
    graph.connectionHandler.getEdgeColor = function (valid) {
      return '#4285F4';
    };
    // 连接锚点时粗细
    graph.connectionHandler.getEdgeWidth = function (valid) {
      return 1;
    };

    // 自动计算锚点
    // const mxConnectionHandlerUpdateEdgeState =
    //   graph.connectionHandler.updateEdgeState
    // graph.connectionHandler.updateEdgeState = function (pt, constraint) {
    //   if (pt != null && this.previous != null) {
    //     const constraints = this.graph.getAllConnectionConstraints(
    //       this.previous
    //     )
    //     let nearestConstraint: any = null
    //     let dist: any = null

    //     for (let i = 0; i < constraints.length; i++) {
    //       const cp = this.graph.getConnectionPoint(
    //         this.previous,
    //         constraints[i]
    //       )

    //       if (cp != null) {
    //         const tmp =
    //           (cp.x - pt.x) * (cp.x - pt.x) + (cp.y - pt.y) * (cp.y - pt.y)

    //         if (dist == null || tmp < dist) {
    //           nearestConstraint = constraints[i]
    //           dist = tmp
    //         }
    //       }
    //     }

    //     if (nearestConstraint != null) {
    //       this.sourceConstraint = nearestConstraint
    //     }
    //   }

    //   mxConnectionHandlerUpdateEdgeState.apply(this, arguments)
    // }

    // 实时更新连线（联动自动计算锚点）
    graph.connectionHandler.createEdgeState = function (me) {
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
    graph.connectionHandler.isConnectableCell = function (cell) {
      return false;
    };
  };

  initGuides = (graph) => {
    // 设置允许辅助线
    graph.graphHandler.guidesEnabled = true;
    graph.graphHandler.useGuidesForEvent = function (me) {
      return !mxEvent.isAltDown(me.getEvent());
    };

    // 设置步进距离
    graph.gridSize = 10;
    graph.view.gridSteps = 4;

    // 设置辅助框颜色
    graph.graphHandler.createPreviewShape = function (bounds) {
      this.previewColor = mxConfig.themeColor;
      return mxGraphHandler.prototype.createPreviewShape.apply(this, arguments);
    };

    // 设置页面辅助线
    const graphHandlerGetGuideStates = graph.graphHandler.getGuideStates;
    graph.graphHandler.getGuideStates = function () {
      let result = graphHandlerGetGuideStates.apply(this, arguments);
      // Create virtual cell state for page centers
      const guides: Array<any> = [];

      const pf = this.graph.pageFormat;
      const ps = this.graph.pageScale;
      const pw = pf.width * ps;
      const ph = pf.height * ps;
      const t = this.graph.view.translate;
      const s = this.graph.view.scale;

      const layout = this.graph.getPageLayout();

      for (let i = 0; i < layout.width; i++) {
        guides.push(
          new mxRectangle(
            ((layout.x + i) * pw + t.x) * s,
            (layout.y * ph + t.y) * s,
            pw * s,
            ph * s
          )
        );
      }

      for (let j = 0; j < layout.height; j++) {
        guides.push(
          new mxRectangle(
            (layout.x * pw + t.x) * s,
            ((layout.y + j) * ph + t.y) * s,
            pw * s,
            ph * s
          )
        );
      }
      // Page center guides have predence over normal guides
      result = guides.concat(result);
      return result;
    };
  };

  // 重写获取节点名称方法
  convertValueToString = (cell) => {
    try {
      const value = parseJSON(this.model.getValue(cell), {});
      return value['name'] || '';
    } catch (e) {
      return '';
    }
  };

  // 重写设置节点名称方法
  cellLabelChanged = (cell, value, autoSize) => {
    this.model.beginUpdate();
    try {
      const v = parseJSON(this.model.getValue(cell), {});
      this.model.setValue(
        cell,
        JSON.stringify(
          Object.assign({}, v, {
            name: value,
          })
        )
      );
      if (autoSize) {
        this.graph.cellSizeUpdated(cell, false);
      }
    } finally {
      this.model.endUpdate();
    }
  };
}
