import MxGraphFactory from 'mxgraph';

const mxGraphFactory = MxGraphFactory({
  mxImageBasePath: './mxgraph/images',
  mxBasePath: './mxgraph'
});

// 挂载MxGraph方法至window解决MxGraph内部调用问题
Object.keys(mxGraphFactory || {}).forEach(k => (window[k] = mxGraphFactory[k]));

export const mxGraph = mxGraphFactory.mxGraph;
export const mxGraphModel = mxGraphFactory.mxGraphModel;
export const mxCodec = mxGraphFactory.mxCodec;
export const mxUtils = mxGraphFactory.mxUtils;
export const mxClient = mxGraphFactory.mxClient;
export const mxEvent = mxGraphFactory.mxEvent;
export const mxRubberband = mxGraphFactory.mxRubberband;
export const mxCell = mxGraphFactory.mxCell;
export const mxCellState = mxGraphFactory.mxCellState;

export default mxGraphFactory;
