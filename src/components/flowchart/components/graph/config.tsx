import { mxConstants, config as mxConfig } from '@/components/mxgraph';

export const defaultVertexStyle = {
  [mxConstants.STYLE_FONTCOLOR]: '#333333',
  [mxConstants.STYLE_FONTSIZE]: 12,
};

export const defaultEdgeStyle = {
  [mxConstants.STYLE_EDGE]: 'orthogonalEdgeStyle',
  [mxConstants.STYLE_STROKECOLOR]: '#666666',
  [mxConstants.STYLE_FONTCOLOR]: '#333333',
  [mxConstants.STYLE_LABEL_BACKGROUNDCOLOR]: '#e8f1fc',
  [mxConstants.STYLE_FONTSIZE]: 12,
  [mxConstants.STYLE_VERTICAL_LABEL_POSITION]: 'bottom',
  [mxConstants.STYLE_VERTICAL_ALIGN]: 'middle',
  [mxConstants.STYLE_FONTSTYLE]: '0',
  [mxConstants.STYLE_ENDARROW]: 'classic',
  [mxConstants.STYLE_STARTARROW]: '',
  [mxConstants.STYLE_ENDFILL]: 1,
  [mxConstants.STYLE_JETTYSIZE]: 'auto',
  [mxConstants.STYLE_ORTHOGONAL_LOOP]: 1,
  [mxConstants.STYLE_LABEL_PADDING]: 6,
};

export const defaultExtraStyle: { [key: string]: object } = {
  edge: defaultEdgeStyle,
  highlightEdge: {
    ...defaultEdgeStyle,
    [mxConstants.STYLE_STROKECOLOR]: mxConfig.themeColor,
  },
};
