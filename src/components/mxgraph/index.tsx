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

/**
 * 全局配置
 */
function globalConfigurate() {
  // 挂载MxGraph方法至window解决MxGraph内部调用问题
  Object.keys(mxGraphFactory || {}).forEach(
    k => (window[k] = mxGraphFactory[k])
  );
}

globalConfigurate();

export default mxGraphFactory;
