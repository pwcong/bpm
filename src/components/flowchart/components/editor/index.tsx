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
  mxPoint
} from '@/components/mxgraph';
import Graph from '../graph';

export default class Editor extends mxEventSource {
  static ctrlKey = mxClient.IS_MAC ? 'Cmd' : 'Ctrl';

  container: HTMLElement;

  editor: any;
  graph: any;
  editable: boolean;

  undoManager: any;
  undoListener: any;

  constructor(container: HTMLElement, editable?: boolean) {
    super();
    this.container = container;
    this.editable = editable !== undefined ? editable : true;
    this.graph = new Graph(this.container, null, null, null);

    this.editor = this;
    this.init();
  }

  init = () => {
    this.initUndoManager();
    this.initKeyHandler();
    this.initPageView();
  };

  initUndoManager = () => {
    const graph = this.graph;
    const undoMgr = new mxUndoManager();

    this.undoListener = function(sender, evt) {
      undoMgr.undoableEditHappened(evt.getProperty('edit'));
    };

    // Installs the command history
    const listener = mxUtils.bind(this, function(sender, evt) {
      this.undoListener.apply(this, arguments);
    });

    graph.getModel().addListener(mxEvent.UNDO, listener);
    graph.getView().addListener(mxEvent.UNDO, listener);

    // Keeps the selection in sync with the history
    const undoHandler = function(sender, evt) {
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

  initKeyHandler = () => {
    const keyHandler = this.graph.keyHandler;
    keyHandler.bindKey(8, () => this.graph.removeCells());
  };

  initPageView = () => {
    const graph = this.graph;

    graph.pageScale = 1;

    const iw = window.innerWidth;
    const ih = window.innerHeight;

    graph.minimumGraphSize = iw > ih ? iw * 5 : ih * 5;

    const pw = iw * 0.8;
    const ph = (ih - 48) * 0.8;
    graph.pageFormat = new mxRectangle(0, 0, pw, ph);

    const view = graph.view;

    view.translate = new mxPoint((iw - pw) / 2, (ih - 48 - ph) / 2);

    view.validateBackgroundPage = function() {
      const graph = this.graph;

      const bounds = this.getBackgroundPageBounds();

      if (this.backgroundPageShape == null) {
        // Finds first element in graph container
        let firstChild = graph.container.firstChild;

        while (
          firstChild != null &&
          firstChild.nodeType != mxConstants.NODETYPE_ELEMENT
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

          this.backgroundPageShape.node.className = 'flowchart-page';

          // Adds listener for double click handling on background
          mxEvent.addListener(
            this.backgroundPageShape.node,
            'dblclick',
            mxUtils.bind(this, function(evt) {
              graph.dblClick(evt);
            })
          );

          // Adds basic listeners for graph event dispatching outside of the
          // container and finishing the handling of a single gesture
          mxEvent.addGestureListeners(
            this.backgroundPageShape.node,
            mxUtils.bind(this, function(evt) {
              graph.fireMouseEvent(mxEvent.MOUSE_DOWN, new mxMouseEvent(evt));
            }),
            mxUtils.bind(this, function(evt) {
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
            mxUtils.bind(this, function(evt) {
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

    view.validateBackgroundStyles = function() {
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

    view.createSvgGrid = function(color) {
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
    view.createBackgroundPageShape = function(bounds) {
      return new mxRectangleShape(bounds, '#ffffff', 'transparent');
    };
    view.getGraphBounds = function() {
      return this.graphBounds;
    };
    view.getBackgroundPageBounds = function() {
      var gb = this.getGraphBounds();

      // Computes unscaled, untranslated graph bounds
      var x = gb.width > 0 ? gb.x / this.scale - this.translate.x : 0;
      var y = gb.height > 0 ? gb.y / this.scale - this.translate.y : 0;
      var w = gb.width / this.scale;
      var h = gb.height / this.scale;

      var fmt = this.graph.pageFormat;
      var ps = this.graph.pageScale;

      var pw = fmt.width * ps;
      var ph = fmt.height * ps;

      var x0 = Math.floor(Math.min(0, x) / pw);
      var y0 = Math.floor(Math.min(0, y) / ph);
      var xe = Math.ceil(Math.max(1, x + w) / pw);
      var ye = Math.ceil(Math.max(1, y + h) / ph);

      var rows = xe - x0;
      var cols = ye - y0;

      var bounds = new mxRectangle(
        this.scale * (this.translate.x + x0 * pw),
        this.scale * (this.translate.y + y0 * ph),
        this.scale * rows * pw,
        this.scale * cols * ph
      );

      return bounds;
    };

    graph.view.validateBackground();
  };

  destroy = () => {
    this.graph && this.graph.destroy();
  };
}
