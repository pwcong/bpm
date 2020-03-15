import MxGraphFactory from 'mxgraph';

const mxGraphFactory = MxGraphFactory({
  mxImageBasePath: './mxgraph/images',
  mxBasePath: './mxgraph'
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

function globalConfig() {
  // 挂载MxGraph方法至window解决MxGraph内部调用问题
  Object.keys(mxGraphFactory || {}).forEach(
    k => (window[k] = mxGraphFactory[k])
  );

  // 设置线选框颜色
  mxConstants.EDGE_SELECTION_COLOR = '#4285f4';
  // 设置点选框颜色
  mxConstants.VERTEX_SELECTION_COLOR = '#4285f4';

  mxEdgeHandler.prototype.handleImage = new mxImage(
    'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTBweCIgaGVpZ2h0PSIxMHB4IiB2aWV3Qm94PSIwIDAgMTAgMTAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8ZyBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8Y2lyY2xlIHN0cm9rZT0iI0ZGRkZGRiIgZmlsbD0iIzQyODVGNCIgY3g9IjUiIGN5PSI1IiByPSI0Ij48L2NpcmNsZT4KICAgIDwvZz4KPC9zdmc+',
    6,
    6
  );

  // 设置选框宽高锁定
  const originalVertexHandlerUnion = mxVertexHandler.prototype.union;
  mxVertexHandler.prototype.union = function(geo, dxs, dys, index) {
    const result = originalVertexHandlerUnion.apply(this, arguments);
    const lock = [0, 2, 5, 7];
    if (this.state.cell.isVertex() && lock.indexOf(index) > -1) {
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
  mxVertexHandler.prototype.createSizerShape = function(
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
          '#4285f4',
          1
        );
      default:
        return new mxEllipse(bounds, fillColor || '#ffffff', '#4285F4', 1);
    }
  };
}

// 全局配置
globalConfig();

export default mxGraphFactory;
