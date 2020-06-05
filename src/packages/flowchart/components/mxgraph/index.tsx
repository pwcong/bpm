import MxGraphFactory from 'mxgraph';

import { message } from 'antd';

import { parseJSON } from '../../utils';
import { getBasePath, getImageBasePath } from './utils';
import config from './config';

export { config };
export * from './utils';

const mxGraphFactory = MxGraphFactory({
  // mxImageBasePath: './static/mxgraph/images',
  mxImageBasePath: getImageBasePath(),
  // mxBasePath: './static/mxgraph'
  mxBasePath: getBasePath(),
  // 预加载资源
  mxLoadResources: true,
});

export const mxGraph = mxGraphFactory.mxGraph;
export const mxGraphModel = mxGraphFactory.mxGraphModel;
export const mxCodec = mxGraphFactory.mxCodec;
export const mxUtils = mxGraphFactory.mxUtils;
export const mxClient = mxGraphFactory.mxClient;
export const mxEvent = mxGraphFactory.mxEvent;
export const mxRubberband = mxGraphFactory.mxRubberband;
export const mxCell = mxGraphFactory.mxCell;
export const mxCellState = mxGraphFactory.mxCellState;
export const mxConstants = mxGraphFactory.mxConstants;
export const mxPerimeter = mxGraphFactory.mxPerimeter;
export const mxEdgeStyle = mxGraphFactory.mxEdgeStyle;
export const mxConnectionConstraint = mxGraphFactory.mxConnectionConstraint;
export const mxPoint = mxGraphFactory.mxPoint;
export const mxConstraintHandler = mxGraphFactory.mxConstraintHandler;
export const mxParallelEdgeLayout = mxGraphFactory.mxParallelEdgeLayout;
export const mxLayoutManager = mxGraphFactory.mxLayoutManager;
export const mxCellTracker = mxGraphFactory.mxCellTracker;
export const mxCellOverlay = mxGraphFactory.mxCellOverlay;
export const mxImage = mxGraphFactory.mxImage;
export const mxKeyHandler = mxGraphFactory.mxKeyHandler;
export const mxMarker = mxGraphFactory.mxMarker;
export const mxUndoManager = mxGraphFactory.mxUndoManager;
export const mxEventSource = mxGraphFactory.mxEventSource;
export const mxPopupMenu = mxGraphFactory.mxPopupMenu;
export const mxResources = mxGraphFactory.mxResources;
export const mxGeometry = mxGraphFactory.mxGeometry;
export const mxEventObject = mxGraphFactory.mxEventObject;
export const mxGraphView = mxGraphFactory.mxGraphView;
export const mxCellRenderer = mxGraphFactory.mxCellRenderer;
export const mxStencil = mxGraphFactory.mxStencil;
export const mxConnector = mxGraphFactory.mxConnector;
export const mxShape = mxGraphFactory.mxShape;
export const mxEllipse = mxGraphFactory.mxEllipse;
export const mxEdgeHandler = mxGraphFactory.mxEdgeHandler;
export const mxVertexHandler = mxGraphFactory.mxVertexHandler;
export const mxRectangle = mxGraphFactory.mxRectangle;
export const mxRectangleShape = mxGraphFactory.mxRectangleShape;
export const mxImageShape = mxGraphFactory.mxImageShape;
export const mxGraphHandler = mxGraphFactory.mxGraphHandler;
export const mxMouseEvent = mxGraphFactory.mxMouseEvent;
export const mxPolyline = mxGraphFactory.mxPolyline;
export const mxOutline = mxGraphFactory.mxOutline;
export const mxClipboard = mxGraphFactory.mxClipboard;
export const mxSvgCanvas2D = mxGraphFactory.mxSvgCanvas2D;
export const mxGuide = mxGraphFactory.mxGuide;
export const mxMultiplicity = mxGraphFactory.mxMultiplicity;
export const mxHierarchicalLayout = mxGraphFactory.mxHierarchicalLayout;
export const mxFastOrganicLayout = mxGraphFactory.mxFastOrganicLayout;

export function mxCellAttributeChange(cell, attribute, value) {
  this.cell = cell;
  this.attribute = attribute;
  this.value = value;
  this.previous = value;
}
mxCellAttributeChange.prototype.execute = function () {
  if (this.cell != null) {
    const tmp = this.cell.getAttribute(this.attribute);

    if (this.previous == null) {
      this.cell.value.removeAttribute(this.attribute);
    } else {
      this.cell.setAttribute(this.attribute, this.previous);
    }

    this.previous = tmp;
  }
};

function globalConfig() {
  // 挂载MxGraph方法至window解决MxGraph内部调用问题
  Object.keys(mxGraphFactory || {}).forEach(
    (k) => (window[k] = mxGraphFactory[k])
  );

  // 设置线选框颜色
  mxConstants.EDGE_SELECTION_COLOR = config.themeColor;
  // 设置点选框颜色
  mxConstants.VERTEX_SELECTION_COLOR = config.themeColor;
  // 设置置入对象颜色
  mxConstants.DROP_TARGET_COLOR = config.themeColor;
  // 设置高亮颜色
  mxConstants.HIGHLIGHT_OPACITY = 60;
  mxConstants.HIGHLIGHT_STROKEWIDTH = 2;
  mxConstants.HIGHLIGHT_COLOR = config.themeColor;
  mxConstants.OUTLINE_HIGHLIGHT_COLOR = config.themeColor;
  mxConstants.DEFAULT_VALID_COLOR = config.themeColor;
  mxConstants.VALID_COLOR = config.themeColor;
  mxConstants.HANDLE_FILLCOLOR = config.themeColor;

  // 设置导航器颜色
  mxConstants.OUTLINE_STROKEWIDTH = 1;
  mxConstants.OUTLINE_COLOR = config.themeColor;

  // 设置辅助线颜色
  mxConstants.GUIDE_COLOR = config.themeColor;
  // 设置辅助线宽度
  mxConstants.GUIDE_STROKEWIDTH = 1;
  // 设置辅助线为直线
  mxGuide.prototype.createGuideShape = function () {
    const guide = new mxPolyline(
      [],
      mxConstants.GUIDE_COLOR,
      mxConstants.GUIDE_STROKEWIDTH
    );

    return guide;
  };

  // 设置弹窗
  mxGraph.prototype.validationAlert = function (msg) {
    message.error(msg, 2);
  };

  // 重写节点校验类型获取方法
  const originMultiplicityCheckType = mxMultiplicity.prototype.checkType;
  mxMultiplicity.prototype.checkType = function (
    graph,
    value,
    type,
    attr,
    attrValue
  ) {
    const key = parseJSON(value, {}).key;
    if (key !== undefined) {
      return type === key;
    }

    return originMultiplicityCheckType.apply(this, arguments);
  };

  // 设置ID生成器
  mxGraphModel.prototype.createId = function (cell) {
    const id = this.nextId;
    this.nextId++;

    let res = this.prefix + id + this.postfix;

    if (this.isVertex(cell)) {
      res = `N${id}`;
    } else if (this.isEdge(cell)) {
      res = `E${id}`;
    }

    return res;
  };

  // 设置线触点图标
  mxEdgeHandler.prototype.handleImage = new mxImage(
    getImageBasePath('dot.svg'),
    6,
    6
  );

  // 设置锚点图标
  mxConstraintHandler.prototype.pointImage = new mxImage(
    getImageBasePath('point.svg'),
    10,
    10
  );

  // 设置锚点颜色
  mxConstraintHandler.prototype.highlightColor = config.themeColor;
  mxConstraintHandler.prototype.createHighlightShape = function () {
    const hl = new mxEllipse(null, this.highlightColor, this.highlightColor, 0);
    hl.opacity = 30;
    return hl;
  };

  // 设置选框宽高锁定
  const originalVertexHandlerUnion = mxVertexHandler.prototype.union;
  mxVertexHandler.prototype.union = function (geo, dxs, dys, index) {
    const result = originalVertexHandlerUnion.apply(this, arguments);
    // const lock = [0, 2, 5, 7];
    if (
      this.state.cell.isVertex()
      // && lock.indexOf(index) > -1
    ) {
      // 锁定宽高
      const bounds = this.state.cell.geometry;
      const coff = bounds.width / bounds.height;
      // 宽变化
      if (result.width !== bounds.width) {
        result.height = result.width / coff;
        // 高变化
      } else if (result.height !== bounds.height) {
        result.width = result.height * coff;
      }
    }
    return result;
  };

  // 设置选框触点
  const originalVertexHandlerCreateSizerShape =
    mxVertexHandler.prototype.createSizerShape;
  mxVertexHandler.prototype.createSizerShape = function (
    bounds,
    index,
    fillColor
  ) {
    originalVertexHandlerCreateSizerShape.apply(this, arguments);
    switch (index) {
      case 0:
      case 2:
      case 5:
      case 7:
        return new mxRectangleShape(
          bounds,
          fillColor || '#ffffff',
          config.themeColor,
          1
        );
      default:
        return new mxEllipse(
          bounds,
          fillColor || '#ffffff',
          config.themeColor,
          1
        );
    }
  };
}

// 全局配置
globalConfig();

export default mxGraphFactory;
