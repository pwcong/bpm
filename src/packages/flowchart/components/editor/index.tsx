import { Base64 } from 'js-base64';

import {
  mxEventSource,
  mxUndoManager,
  mxUtils,
  mxEvent,
  mxClient,
  mxConstants,
  mxMouseEvent,
  mxRectangleShape,
  mxRectangle,
  mxPoint,
  mxPolyline,
} from '../mxgraph';

import { getChartConfig } from '../../utils';
import { IConfig, IChartConfig } from '../../types';
import Graph from '../graph';

export default class Editor extends mxEventSource {
  static ctrlKey = mxClient.IS_MAC ? 'Command' : 'Ctrl';
  static deleteKey = mxClient.IS_MAC ? 8 : 46;

  container: HTMLElement;

  config: IChartConfig;
  editor: any;
  graph: any;

  undoManager: any;
  undoListener: any;

  constructor(container: HTMLElement, config?: IConfig) {
    super();
    this.container = container;

    this.config = getChartConfig(config || {});

    this.editor = this;
    this.graph = new Graph(this.container, null, null, null, this.config);

    this.init();
  }

  init = () => {
    this.initUndoManager();
    this.initPageView();
  };

  // 初始化回退管理器
  initUndoManager = () => {
    const graph = this.graph;
    const undoMgr = new mxUndoManager();

    this.undoListener = function (sender, evt) {
      undoMgr.undoableEditHappened(evt.getProperty('edit'));
    };

    // Installs the command history
    const listener = mxUtils.bind(this, function (sender, evt) {
      this.undoListener.apply(this, arguments);
    });

    graph.getModel().addListener(mxEvent.UNDO, listener);
    graph.getView().addListener(mxEvent.UNDO, listener);

    // Keeps the selection in sync with the history
    const undoHandler = function (sender, evt) {
      const cand = graph.getSelectionCellsForChanges(
        evt.getProperty('edit').changes
      );

      // graph.getModel();
      const cells: Array<any> = [];

      for (let i = 0; i < cand.length; i++) {
        if (graph.view.getState(cand[i]) != null) {
          cells.push(cand[i]);
        }
      }

      graph.setSelectionCells(cells);
    };

    undoMgr.addListener(mxEvent.UNDO, undoHandler);
    undoMgr.addListener(mxEvent.REDO, undoHandler);

    this.undoManager = undoMgr;
  };

  // 初始化画布区大小
  initPageFormat = () => {
    const graph = this.graph;

    const editable = this.config.editable;

    const iw = this.container.offsetWidth;
    const ih = this.container.offsetHeight;

    // graph.pageFormat = new mxRectangle(0, 0, iw - 260, ih - 220)
    graph.pageFormat = new mxRectangle(
      0,
      0,
      editable ? iw : iw - 100,
      editable ? ih : ih - 100
    );
  };

  // 初始化画布区绘制
  initPageView = () => {
    const graph = this.graph;

    this.initPageFormat();
    graph.pageScale = 1;

    graph.getPagePadding = function () {
      // return new mxPoint(130, 110)
      return this.config.editable ? new mxPoint(0, 0) : new mxPoint(50, 50);
    };

    graph.getPageLayout = function () {
      const size = this.getPageSize();
      const bounds = this.getGraphBounds();

      if (bounds.width === 0 || bounds.height === 0) {
        return new mxRectangle(0, 0, 1, 1);
      } else {
        // Computes untransformed graph bounds
        const x = Math.ceil(bounds.x / this.view.scale - this.view.translate.x);
        const y = Math.ceil(bounds.y / this.view.scale - this.view.translate.y);
        const w = Math.floor(bounds.width / this.view.scale);
        const h = Math.floor(bounds.height / this.view.scale);

        const x0 = Math.floor(x / size.width);
        const y0 = Math.floor(y / size.height);
        const w0 = Math.ceil((x + w) / size.width) - x0;
        const h0 = Math.ceil((y + h) / size.height) - y0;

        return new mxRectangle(x0, y0, w0, h0);
      }
    };
    graph.getPageSize = function () {
      return new mxRectangle(
        0,
        0,
        this.pageFormat.width * this.pageScale,
        this.pageFormat.height * this.pageScale
      );
    };
    graph.updatePageBreaks = function (visible, width, height) {
      const scale = this.view.scale;
      const tr = this.view.translate;
      const fmt = this.pageFormat;
      const ps = scale * this.pageScale;

      const bounds2 = this.view.getBackgroundPageBounds();

      width = bounds2.width;
      height = bounds2.height;
      const bounds = new mxRectangle(
        scale * tr.x,
        scale * tr.y,
        fmt.width * ps,
        fmt.height * ps
      );

      // Does not show page breaks if the scale is too small
      visible =
        visible &&
        Math.min(bounds.width, bounds.height) > this.minPageBreakDist;

      const horizontalCount = visible
        ? Math.ceil(height / bounds.height) - 1
        : 0;
      const verticalCount = visible ? Math.ceil(width / bounds.width) - 1 : 0;
      const right = bounds2.x + width;
      const bottom = bounds2.y + height;

      if (this.horizontalPageBreaks == null && horizontalCount > 0) {
        this.horizontalPageBreaks = [];
      }

      if (this.verticalPageBreaks == null && verticalCount > 0) {
        this.verticalPageBreaks = [];
      }

      const drawPageBreaks = mxUtils.bind(this, function (breaks) {
        if (breaks != null) {
          const count =
            breaks === this.horizontalPageBreaks
              ? horizontalCount
              : verticalCount;

          for (let i = 0; i <= count; i++) {
            const pts =
              breaks === this.horizontalPageBreaks
                ? [
                    new mxPoint(
                      Math.round(bounds2.x),
                      Math.round(bounds2.y + (i + 1) * bounds.height)
                    ),
                    new mxPoint(
                      Math.round(right),
                      Math.round(bounds2.y + (i + 1) * bounds.height)
                    ),
                  ]
                : [
                    new mxPoint(
                      Math.round(bounds2.x + (i + 1) * bounds.width),
                      Math.round(bounds2.y)
                    ),
                    new mxPoint(
                      Math.round(bounds2.x + (i + 1) * bounds.width),
                      Math.round(bottom)
                    ),
                  ];

            if (breaks[i] != null) {
              breaks[i].points = pts;
              breaks[i].redraw();
            } else {
              const pageBreak = new mxPolyline(pts, this.pageBreakColor);
              pageBreak.dialect = this.dialect;
              pageBreak.isDashed = this.pageBreakDashed;
              pageBreak.pointerEvents = false;
              pageBreak.init(this.view.backgroundPane);
              pageBreak.redraw();

              breaks[i] = pageBreak;
            }
          }

          for (let i = count; i < breaks.length; i++) {
            breaks[i].destroy();
          }

          breaks.splice(count, breaks.length - count);
        }
      });

      drawPageBreaks(this.horizontalPageBreaks);
      drawPageBreaks(this.verticalPageBreaks);
    };

    const graphSizeDidChange = graph.sizeDidChange;
    graph.sizeDidChange = function () {
      const pages = this.getPageLayout();
      const pad = this.getPagePadding();
      const size = this.getPageSize();

      // Updates the minimum graph size
      const minw = Math.ceil(2 * pad.x + pages.width * size.width);
      const minh = Math.ceil(2 * pad.y + pages.height * size.height);

      const min = graph.minimumGraphSize;

      // LATER: Fix flicker of scrollbar size in IE quirks mode
      // after delayed call in window.resize event handler
      if (min == null || min.width !== minw || min.height !== minh) {
        graph.minimumGraphSize = new mxRectangle(0, 0, minw, minh);
      }

      // Updates auto-translate to include padding and graph size
      const dx = pad.x - pages.x * size.width;
      const dy = pad.y - pages.y * size.height;

      if (
        !this.autoTranslate &&
        (this.view.translate.x !== dx || this.view.translate.y !== dy)
      ) {
        this.autoTranslate = true;
        this.view.x0 = pages.x;
        this.view.y0 = pages.y;

        // NOTE: THIS INVOKES THIS METHOD AGAIN. UNFORTUNATELY THERE IS NO WAY AROUND THIS SINCE THE
        // BOUNDS ARE KNOWN AFTER THE VALIDATION AND SETTING THE TRANSLATE TRIGGERS A REVALIDATION.
        // SHOULD MOVE TRANSLATE/SCALE TO VIEW.
        const tx = graph.view.translate.x;
        const ty = graph.view.translate.y;
        graph.view.setTranslate(dx, dy);

        // LATER: Fix rounding errors for small zoom
        graph.container.scrollLeft += Math.round((dx - tx) * graph.view.scale);
        graph.container.scrollTop += Math.round((dy - ty) * graph.view.scale);

        this.autoTranslate = false;

        return;
      }

      graphSizeDidChange.apply(this, arguments);
    };

    const view = graph.view;

    const graphViewValidate = graph.view.validate;
    view.validate = function () {
      if (
        this.graph.container != null &&
        mxUtils.hasScrollbars(this.graph.container)
      ) {
        const pad = this.graph.getPagePadding();
        const size = this.graph.getPageSize();

        // Updating scrollbars here causes flickering in quirks and is not needed
        // if zoom method is always used to set the current scale on the graph.
        // const tx = this.translate.x;
        // const ty = this.translate.y;
        this.translate.x = pad.x - (this.x0 || 0) * size.width;
        this.translate.y = pad.y - (this.y0 || 0) * size.height;
      }

      graphViewValidate.apply(this, arguments);
    };
    // view.translate = new mxPoint((iw - pw) / 2, (ih - ph) / 2);
    // view.translate = new mxPoint(0, 0);

    view.validateBackgroundPage = function () {
      const graph = this.graph;

      const bounds = this.getBackgroundPageBounds();

      if (this.backgroundPageShape == null) {
        // Finds first element in graph container
        let firstChild = graph.container.firstChild;

        while (
          firstChild != null &&
          firstChild.nodeType !== mxConstants.NODETYPE_ELEMENT
        ) {
          firstChild = firstChild.nextSibling;
        }

        if (firstChild != null) {
          this.backgroundPageShape = this.createBackgroundPageShape(bounds);
          this.backgroundPageShape.scale = 1;

          // Shadow filter causes problems in outline window in quirks mode. IE8 standards
          // also has known rendering issues inside mxWindow but not using shadow is worse.
          this.backgroundPageShape.isShadow = !mxClient.IS_QUIRKS;
          this.backgroundPageShape.dialect = mxConstants.DIALECT_STRICTHTML;
          this.backgroundPageShape.init(graph.container);

          // Required for the browser to render the background page in correct order
          firstChild.style.position = 'absolute';
          graph.container.insertBefore(
            this.backgroundPageShape.node,
            firstChild
          );
          this.backgroundPageShape.redraw();

          this.backgroundPageShape.node.className = 'bpm-flowchart-pager';

          // Adds listener for double click handling on background
          mxEvent.addListener(
            this.backgroundPageShape.node,
            'dblclick',
            mxUtils.bind(this, function (evt) {
              graph.dblClick(evt);
            })
          );

          // Adds basic listeners for graph event dispatching outside of the
          // container and finishing the handling of a single gesture
          mxEvent.addGestureListeners(
            this.backgroundPageShape.node,
            mxUtils.bind(this, function (evt) {
              graph.fireMouseEvent(mxEvent.MOUSE_DOWN, new mxMouseEvent(evt));
            }),
            mxUtils.bind(this, function (evt) {
              // Hides the tooltip if mouse is outside container
              if (
                graph.tooltipHandler != null &&
                graph.tooltipHandler.isHideOnHover()
              ) {
                graph.tooltipHandler.hide();
              }

              if (graph.isMouseDown && !mxEvent.isConsumed(evt)) {
                graph.fireMouseEvent(mxEvent.MOUSE_MOVE, new mxMouseEvent(evt));
              }
            }),
            mxUtils.bind(this, function (evt) {
              graph.fireMouseEvent(mxEvent.MOUSE_UP, new mxMouseEvent(evt));
            })
          );
        }
      } else {
        this.backgroundPageShape.scale = 1;
        this.backgroundPageShape.bounds = bounds;
        this.backgroundPageShape.redraw();
      }

      this.validateBackgroundStyles();
    };

    view.validateBackgroundStyles = function () {
      const graph = this.graph;
      const color = '#ffffff';
      const gridColor = '#eeeeee';
      let image = 'none';
      let position = '';

      if (graph.isGridEnabled()) {
        let phase = 10;

        if (mxClient.IS_SVG) {
          // Generates the SVG required for drawing the dynamic grid
          image = unescape(encodeURIComponent(this.createSvgGrid(gridColor)));
          image = window.btoa ? btoa(image) : Base64.encode(image, true);
          image = 'url(' + 'data:image/svg+xml;base64,' + image + ')';
          phase = graph.gridSize * this.scale * this.gridSteps;
        } else {
          // Fallback to grid wallpaper with fixed size
          image = 'url(' + this.gridImage + ')';
        }

        let x0 = 0;
        let y0 = 0;

        if (graph.view.backgroundPageShape != null) {
          const bds = this.getBackgroundPageBounds();

          x0 = 1 + bds.x;
          y0 = 1 + bds.y;
        }

        // Computes the offset to maintain origin for grid
        position =
          -Math.round(
            phase - mxUtils.mod(this.translate.x * this.scale - x0, phase)
          ) +
          'px ' +
          -Math.round(
            phase - mxUtils.mod(this.translate.y * this.scale - y0, phase)
          ) +
          'px';
      }

      let canvas = graph.view.canvas;

      if (canvas.ownerSVGElement != null) {
        canvas = canvas.ownerSVGElement;
      }

      if (graph.view.backgroundPageShape != null) {
        graph.view.backgroundPageShape.node.style.backgroundPosition = position;
        graph.view.backgroundPageShape.node.style.backgroundImage = image;
        graph.view.backgroundPageShape.node.style.backgroundColor = color;
        // graph.container.className = 'geDiagramContainer geDiagramBackdrop';
        canvas.style.backgroundImage = 'none';
        canvas.style.backgroundColor = '';
      } else {
        // graph.container.className = 'geDiagramContainer';
        canvas.style.backgroundPosition = position;
        canvas.style.backgroundColor = color;
        canvas.style.backgroundImage = image;
      }
    };

    view.createSvgGrid = function (color) {
      let tmp = this.graph.gridSize * this.scale;

      while (tmp < this.minGridSize) {
        tmp *= 2;
      }

      const tmp2 = this.gridSteps * tmp;

      // Small grid lines
      const d: Array<any> = [];

      for (let i = 1; i < this.gridSteps; i++) {
        const tmp3 = i * tmp;
        d.push(
          'M 0 ' +
            tmp3 +
            ' L ' +
            tmp2 +
            ' ' +
            tmp3 +
            ' M ' +
            tmp3 +
            ' 0 L ' +
            tmp3 +
            ' ' +
            tmp2
        );
      }

      // KNOWN: Rounding errors for certain scales (eg. 144%, 121% in Chrome, FF and Safari). Workaround
      // in Chrome is to use 100% for the svg size, but this results in blurred grid for large diagrams.
      const size = tmp2;
      const svg =
        '<svg width="' +
        size +
        '" height="' +
        size +
        '" xmlns="' +
        mxConstants.NS_SVG +
        '">' +
        '<defs><pattern id="grid" width="' +
        tmp2 +
        '" height="' +
        tmp2 +
        '" patternUnits="userSpaceOnUse">' +
        '<path d="' +
        d.join(' ') +
        '" fill="none" stroke="' +
        color +
        '" opacity="0.2" stroke-width="1"/>' +
        '<path d="M ' +
        tmp2 +
        ' 0 L 0 0 0 ' +
        tmp2 +
        '" fill="none" stroke="' +
        color +
        '" stroke-width="1"/>' +
        '</pattern></defs><rect width="100%" height="100%" fill="url(#grid)"/></svg>';

      return svg;
    };
    view.createBackgroundPageShape = function (bounds) {
      return new mxRectangleShape(bounds, '#ffffff', 'transparent');
    };
    view.getGraphBounds = function () {
      return this.graphBounds;
    };
    view.getBackgroundPageBounds = function () {
      const gb = this.getGraphBounds();

      // Computes unscaled, untranslated graph bounds
      const x = gb.width > 0 ? gb.x / this.scale - this.translate.x : 0;
      const y = gb.height > 0 ? gb.y / this.scale - this.translate.y : 0;
      const w = gb.width / this.scale;
      const h = gb.height / this.scale;

      const fmt = this.graph.pageFormat;
      const ps = this.graph.pageScale;

      const pw = fmt.width * ps;
      const ph = fmt.height * ps;

      const x0 = Math.floor(Math.min(0, x) / pw);
      const y0 = Math.floor(Math.min(0, y) / ph);
      const xe = Math.ceil(Math.max(1, x + w) / pw);
      const ye = Math.ceil(Math.max(1, y + h) / ph);

      const rows = xe - x0;
      const cols = ye - y0;

      const bounds = new mxRectangle(
        this.scale * (this.translate.x + x0 * pw),
        this.scale * (this.translate.y + y0 * ph),
        this.scale * rows * pw,
        this.scale * cols * ph
      );

      return bounds;
    };

    this.graph.view.validate();
    this.graph.sizeDidChange();
  };

  // 销毁对象
  destroy = () => {
    try {
      this.graph && this.graph.destroy();

      const { keyHandler } = this.graph;

      keyHandler && keyHandler.destroy();
    } catch (e) {
      // DO NOTHING
    }
  };
}
