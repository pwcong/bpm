import MxGraphFactory from 'mxgraph';
// import { Base64 } from 'js-base64';

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
export const mxGraphHandler = mxGraphFactory.mxGraphHandler;
export const mxMouseEvent = mxGraphFactory.mxMouseEvent;

function globalConfig() {
  // 挂载MxGraph方法至window解决MxGraph内部调用问题
  Object.keys(mxGraphFactory || {}).forEach(
    k => (window[k] = mxGraphFactory[k])
  );

  // 设置线选框颜色
  mxConstants.EDGE_SELECTION_COLOR = '#4285f4';
  // 设置点选框颜色
  mxConstants.VERTEX_SELECTION_COLOR = '#4285f4';
  // 设置置入对象颜色
  mxConstants.DROP_TARGET_COLOR = '#4285f4';
  // 设置高亮颜色
  mxConstants.HIGHLIGHT_OPACITY = 60;
  mxConstants.HIGHLIGHT_STROKEWIDTH = 2;
  mxConstants.HIGHLIGHT_COLOR = '#4285f4';
  mxConstants.OUTLINE_HIGHLIGHT_COLOR = '#4285f4';

  // 设置线触点图标
  mxEdgeHandler.prototype.handleImage = new mxImage(
    'mxgraph/images/dot.svg',
    6,
    6
  );

  // 设置锚点图标
  mxConstraintHandler.prototype.pointImage = new mxImage(
    'mxgraph/images/point.svg',
    10,
    10
  );

  // 设置锚点颜色
  mxConstraintHandler.prototype.highlightColor = '#4285F4';
  mxConstraintHandler.prototype.createHighlightShape = function() {
    const hl = new mxEllipse(null, this.highlightColor, this.highlightColor, 0);
    hl.opacity = 30;
    return hl;
  };

  // mxGraph.prototype.isSplitTarget = function(target, cells, evt) {
  //   return true;
  //   // mxGraph.prototype.isSplitTarget.apply(this, arguments)
  // };

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

  // 设置绘图区
  // mxGraphView.prototype.validateBackgroundPage = function() {
  //   const graph = this.graph;

  //   if (graph.container != null && !graph.transparentBackground) {
  //     if (graph.pageVisible) {
  //       const bounds = this.getBackgroundPageBounds();

  //       if (this.backgroundPageShape == null) {
  //         // Finds first element in graph container
  //         let firstChild = graph.container.firstChild;

  //         while (
  //           firstChild != null &&
  //           firstChild.nodeType != mxConstants.NODETYPE_ELEMENT
  //         ) {
  //           firstChild = firstChild.nextSibling;
  //         }

  //         if (firstChild != null) {
  //           this.backgroundPageShape = this.createBackgroundPageShape(bounds);
  //           this.backgroundPageShape.scale = 1;

  //           // Shadow filter causes problems in outline window in quirks mode. IE8 standards
  //           // also has known rendering issues inside mxWindow but not using shadow is worse.
  //           this.backgroundPageShape.isShadow = !mxClient.IS_QUIRKS;
  //           this.backgroundPageShape.dialect = mxConstants.DIALECT_STRICTHTML;
  //           this.backgroundPageShape.init(graph.container);

  //           // Required for the browser to render the background page in correct order
  //           firstChild.style.position = 'absolute';
  //           graph.container.insertBefore(
  //             this.backgroundPageShape.node,
  //             firstChild
  //           );
  //           this.backgroundPageShape.redraw();

  //           // this.backgroundPageShape.node.className = 'geBackgroundPage';

  //           // Adds listener for double click handling on background
  //           mxEvent.addListener(
  //             this.backgroundPageShape.node,
  //             'dblclick',
  //             mxUtils.bind(this, function(evt) {
  //               graph.dblClick(evt);
  //             })
  //           );

  //           // Adds basic listeners for graph event dispatching outside of the
  //           // container and finishing the handling of a single gesture
  //           mxEvent.addGestureListeners(
  //             this.backgroundPageShape.node,
  //             mxUtils.bind(this, function(evt) {
  //               graph.fireMouseEvent(mxEvent.MOUSE_DOWN, new mxMouseEvent(evt));
  //             }),
  //             mxUtils.bind(this, function(evt) {
  //               // Hides the tooltip if mouse is outside container
  //               if (
  //                 graph.tooltipHandler != null &&
  //                 graph.tooltipHandler.isHideOnHover()
  //               ) {
  //                 graph.tooltipHandler.hide();
  //               }

  //               if (graph.isMouseDown && !mxEvent.isConsumed(evt)) {
  //                 graph.fireMouseEvent(
  //                   mxEvent.MOUSE_MOVE,
  //                   new mxMouseEvent(evt)
  //                 );
  //               }
  //             }),
  //             mxUtils.bind(this, function(evt) {
  //               graph.fireMouseEvent(mxEvent.MOUSE_UP, new mxMouseEvent(evt));
  //             })
  //           );
  //         }
  //       } else {
  //         this.backgroundPageShape.scale = 1;
  //         this.backgroundPageShape.bounds = bounds;
  //         this.backgroundPageShape.redraw();
  //       }
  //     } else if (this.backgroundPageShape != null) {
  //       this.backgroundPageShape.destroy();
  //       this.backgroundPageShape = null;
  //     }

  //     this.validateBackgroundStyles();
  //   }
  // };
  // mxGraphView.prototype.validateBackgroundStyles = function() {
  //   const graph = this.graph;
  //   const color =
  //     graph.background == null || graph.background == mxConstants.NONE
  //       ? graph.defaultPageBackgroundColor
  //       : graph.background;
  //   const gridColor =
  //     color != null && this.gridColor != color.toLowerCase()
  //       ? this.gridColor
  //       : '#ffffff';
  //   let image = 'none';
  //   let position = '';

  //   if (graph.isGridEnabled()) {
  //     let phase = 10;

  //     if (mxClient.IS_SVG) {
  //       // Generates the SVG required for drawing the dynamic grid
  //       image = unescape(encodeURIComponent(this.createSvgGrid(gridColor)));
  //       image = window.btoa ? btoa(image) : Base64.encode(image, true);
  //       image = 'url(' + 'data:image/svg+xml;base64,' + image + ')';
  //       phase = graph.gridSize * this.scale * this.gridSteps;
  //     } else {
  //       // Fallback to grid wallpaper with fixed size
  //       image = 'url(' + this.gridImage + ')';
  //     }

  //     let x0 = 0;
  //     let y0 = 0;

  //     if (graph.view.backgroundPageShape != null) {
  //       const bds = this.getBackgroundPageBounds();

  //       x0 = 1 + bds.x;
  //       y0 = 1 + bds.y;
  //     }

  //     // Computes the offset to maintain origin for grid
  //     position =
  //       -Math.round(
  //         phase - mxUtils.mod(this.translate.x * this.scale - x0, phase)
  //       ) +
  //       'px ' +
  //       -Math.round(
  //         phase - mxUtils.mod(this.translate.y * this.scale - y0, phase)
  //       ) +
  //       'px';
  //   }

  //   let canvas = graph.view.canvas;

  //   if (canvas.ownerSVGElement != null) {
  //     canvas = canvas.ownerSVGElement;
  //   }

  //   if (graph.view.backgroundPageShape != null) {
  //     graph.view.backgroundPageShape.node.style.backgroundPosition = position;
  //     graph.view.backgroundPageShape.node.style.backgroundImage = image;
  //     graph.view.backgroundPageShape.node.style.backgroundColor = color;
  //     // graph.container.className = 'geDiagramContainer geDiagramBackdrop';
  //     canvas.style.backgroundImage = 'none';
  //     canvas.style.backgroundColor = '';
  //   } else {
  //     // graph.container.className = 'geDiagramContainer';
  //     canvas.style.backgroundPosition = position;
  //     canvas.style.backgroundColor = color;
  //     canvas.style.backgroundImage = image;
  //   }
  // };
  // mxGraphView.prototype.createSvgGrid = function(color) {
  //   let tmp = this.graph.gridSize * this.scale;

  //   while (tmp < this.minGridSize) {
  //     tmp *= 2;
  //   }

  //   const tmp2 = this.gridSteps * tmp;

  //   // Small grid lines
  //   const d: Array<any> = [];

  //   for (let i = 1; i < this.gridSteps; i++) {
  //     const tmp3 = i * tmp;
  //     d.push(
  //       'M 0 ' +
  //         tmp3 +
  //         ' L ' +
  //         tmp2 +
  //         ' ' +
  //         tmp3 +
  //         ' M ' +
  //         tmp3 +
  //         ' 0 L ' +
  //         tmp3 +
  //         ' ' +
  //         tmp2
  //     );
  //   }

  //   // KNOWN: Rounding errors for certain scales (eg. 144%, 121% in Chrome, FF and Safari). Workaround
  //   // in Chrome is to use 100% for the svg size, but this results in blurred grid for large diagrams.
  //   const size = tmp2;
  //   const svg =
  //     '<svg width="' +
  //     size +
  //     '" height="' +
  //     size +
  //     '" xmlns="' +
  //     mxConstants.NS_SVG +
  //     '">' +
  //     '<defs><pattern id="grid" width="' +
  //     tmp2 +
  //     '" height="' +
  //     tmp2 +
  //     '" patternUnits="userSpaceOnUse">' +
  //     '<path d="' +
  //     d.join(' ') +
  //     '" fill="none" stroke="' +
  //     color +
  //     '" opacity="0.2" stroke-width="1"/>' +
  //     '<path d="M ' +
  //     tmp2 +
  //     ' 0 L 0 0 0 ' +
  //     tmp2 +
  //     '" fill="none" stroke="' +
  //     color +
  //     '" stroke-width="1"/>' +
  //     '</pattern></defs><rect width="100%" height="100%" fill="url(#grid)"/></svg>';

  //   return svg;
  // };
  // mxGraphView.prototype.createBackgroundPageShape = function(bounds) {
  //   return new mxRectangleShape(
  //     bounds,
  //     '#ffffff',
  //     this.graph.defaultPageBorderColor
  //   );
  // };
  // mxGraphView.prototype.getGraphBounds = function() {
  //   var b = this.graphBounds;

  //   if (this.graph.useCssTransforms) {
  //     var t = this.graph.currentTranslate;
  //     var s = this.graph.currentScale;

  //     b = new mxRectangle(
  //       (b.x + t.x) * s,
  //       (b.y + t.y) * s,
  //       b.width * s,
  //       b.height * s
  //     );
  //   }

  //   return b;
  // };
  // mxGraphView.prototype.getBackgroundPageBounds = function() {
  //   var gb = this.getGraphBounds();

  //   // Computes unscaled, untranslated graph bounds
  //   var x = gb.width > 0 ? gb.x / this.scale - this.translate.x : 0;
  //   var y = gb.height > 0 ? gb.y / this.scale - this.translate.y : 0;
  //   var w = gb.width / this.scale;
  //   var h = gb.height / this.scale;

  //   var fmt = this.graph.pageFormat;
  //   var ps = this.graph.pageScale;

  //   var pw = fmt.width * ps;
  //   var ph = fmt.height * ps;

  //   var x0 = Math.floor(Math.min(0, x) / pw);
  //   var y0 = Math.floor(Math.min(0, y) / ph);
  //   var xe = Math.ceil(Math.max(1, x + w) / pw);
  //   var ye = Math.ceil(Math.max(1, y + h) / ph);

  //   var rows = xe - x0;
  //   var cols = ye - y0;

  //   var bounds = new mxRectangle(
  //     this.scale * (this.translate.x + x0 * pw),
  //     this.scale * (this.translate.y + y0 * ph),
  //     this.scale * rows * pw,
  //     this.scale * cols * ph
  //   );

  //   return bounds;
  // };
}

// 全局配置
globalConfig();

export default mxGraphFactory;
