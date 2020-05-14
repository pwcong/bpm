import React from 'react';

import { postEvent, parseJSON, throttle } from '@bpm/utils';
import { MX, mxConfig  } from '@/components/mx';

import {
  setStyle,
  expandCells,
  updateCells,
  isZoomWheelEvent,
  getBaseConfig,
} from '@/utils';
import { getImageBasePath } from '@/components/mx';
import { EEventName, IConfig, IBaseConfig, ICell } from '@/types';

import Editor from '../editor';
import Actions from '../actions';
import HoverIcons from '../common/hover-icons';
import { useMask } from '../common/mask';
import { makeClickable } from '../toolbar/utils';

import ArrowPanel from './components/arrow-panel';
import { getValidator } from './utils';

const {
  mxEventSource,
  mxEvent,
  mxConstants,
  mxGeometry,
  mxUtils,
  mxClipboard,
  mxEventObject,
  mxCellOverlay,
  mxImage,
  mxPoint,
} = MX;

export default class EditorUI extends mxEventSource {
  container: HTMLElement;

  maxZoom = 200;
  minZoom = 30;

  editorUI: EditorUI;
  editor: Editor;
  graph: any;

  actions: Actions;

  config: IBaseConfig;

  keydownHandler: any;
  keyupHandler: any;
  hoverIcons: any;

  constructor(container: HTMLElement, config?: IConfig) {
    super();

    this.container = container;
    this.config = getBaseConfig(config || {});

    this.editorUI = this;
    this.editor = new Editor(container, config);
    this.graph = this.editor.graph;

    this.actions = new Actions(this);

    this.init();
  }

  init = () => {
    this.initKeyHandler();
    this.initEvents();
    this.initWheelZoom();
    this.initArrow();
    this.initPanning();
  };

  // 设置箭头操作
  initArrow = () => {
    const editorUI = this.editorUI;
    const editable = this.config.editable !== false;

    const toolbarMap = this.config.toolbar.data.reduce(
      (p, c) => p.set(c.key, c),
      new Map<string, ICell>()
    );

    editable &&
      (this.hoverIcons = new HoverIcons(this.editor.graph, function (
        cell,
        dir,
        evt
      ) {
        if (!cell) {
          return;
        }

        const { connections = [] } =
          toolbarMap.get(parseJSON(cell.value, {}).key) || {};

        const { clientX = 0, clientY = 0 } = evt;

        connections.length > 0 &&
          useMask({
            children: (close) => (
              <ArrowPanel
                editorUI={editorUI}
                data={connections.map((c) => ({
                  ...c,
                  getComponent: c.getComponent
                    ? (cmpt: React.ReactElement, ui: EditorUI, item: ICell) =>
                        c.getComponent
                          ? React.cloneElement(c.getComponent(cmpt, ui, item), {
                              onClick: () => {
                                makeClickable(editorUI, item, cell, dir);
                                close();
                              },
                            })
                          : cmpt
                    : undefined,
                  onInitial: undefined,
                }))}
                position={{
                  x: clientX,
                  y: clientY,
                }}
              />
            ),
          });
      }));
  };

  // 设置拖动画布操作
  initPanning = () => {
    const graph = this.graph;
    const diagramContainer = graph.container;

    let spaceKeyPressed = false;

    let currentInContainer = false;
    mxEvent.addListener(diagramContainer, 'mouseenter', (e) => {
      currentInContainer = true;
    });
    mxEvent.addListener(diagramContainer, 'mouseleave', (e) => {
      currentInContainer = false;
    });

    this.keydownHandler = (evt) => {
      if (evt.which === 32 /* Space */ && !graph.isEditing()) {
        spaceKeyPressed = true;
        this.hoverIcons && this.hoverIcons.reset();
        graph.container.style.cursor = 'move';
        // Disables scroll after space keystroke with scrollbars

        if (!graph.isEditing() && currentInContainer) {
          mxEvent.consume(evt);
        }
      }
    };

    // Keeps graph container focused on mouse down
    const graphFireMouseEvent = graph.fireMouseEvent;
    graph.fireMouseEvent = function (evtName, me, sender) {
      if (evtName === mxEvent.MOUSE_DOWN) {
        this.container.focus();
      }

      graphFireMouseEvent.apply(this, arguments);
    };

    mxEvent.addListener(document, 'keydown', this.keydownHandler);

    this.keyupHandler = (evt) => {
      graph.container.style.cursor = '';
      spaceKeyPressed = false;
    };

    mxEvent.addListener(document, 'keyup', this.keyupHandler);

    const panningHandlerIsForcePanningEvent =
      graph.panningHandler.isForcePanningEvent;
    graph.panningHandler.isForcePanningEvent = function (me) {
      // Ctrl+left button is reported as right button in FF on Mac
      return (
        panningHandlerIsForcePanningEvent.apply(this, arguments) ||
        spaceKeyPressed
      );
    };
  };

  wheelHandler = throttle(
    (evt, zoomIn, force) => {
      if (force || isZoomWheelEvent(evt)) {
        let source = mxEvent.getSource(evt);
        evt.preventDefault();
        while (source != null) {
          // 找到最外层容器
          if (source === this.graph.container) {
            this.zoom(zoomIn ? 'zoomIn' : 'zoomOut');
            mxEvent.consume(evt);
            return;
          }
          source = source.parentNode;
        }
      }
    },
    50,
    50
  );

  initWheelZoom = () => {
    mxEvent.addMouseWheelListener(this.wheelHandler, this.graph.container);
  };

  // 绑定键盘事件
  initKeyHandler = () => {
    const graph = this.graph;
    const keyHandler = graph.keyHandler;

    keyHandler.bindKey(8, () => {
      this.delete();
    });
    keyHandler.bindControlKey(37, () => {
      this.rubberband();
    });
    keyHandler.bindControlKey(90, () => {
      this.undo();
    });
    keyHandler.bindControlShiftKey(90, () => {
      this.redo();
    });

    keyHandler.bindControlKey(187, () => {
      this.zoom('zoomIn');
    });

    keyHandler.bindControlKey(189, () => {
      this.zoom('zoomOut');
    });
    // 全选
    keyHandler.bindControlKey(65, () => {
      graph.selectAll(null, true);
    });
    // 取消全选
    keyHandler.bindControlShiftKey(65, () => {
      graph.clearSelection();
    });

    keyHandler.bindControlKey(67, () => {
      this.copy();
    });

    keyHandler.bindControlKey(88, () => {
      this.cut();
    });

    keyHandler.bindControlKey(86, () => {
      this.paste();
    });

    const moveVertexs = (geometry) => {
      updateCells(
        graph,
        expandCells(graph.getSelectionCells()).filter((c) =>
          graph.model.isVertex(c)
        ),
        function (g, c) {
          const geo = mxUtils.clone(c.getGeometry());
          geo.x += geometry.x;
          geo.y += geometry.y;
          g.model.setGeometry(c, geo);
        }
      );
    };

    // 元素移动（上）
    keyHandler.bindKey(38, () => {
      moveVertexs(new mxGeometry(0, -10));
    });
    // 元素移动（下）
    keyHandler.bindKey(40, () => {
      moveVertexs(new mxGeometry(0, 10));
    });
    // 元素移动（左）
    keyHandler.bindKey(37, () => {
      moveVertexs(new mxGeometry(-10, 0));
    });
    // 元素移动（右）
    keyHandler.bindKey(39, () => {
      moveVertexs(new mxGeometry(10, 0));
    });
  };

  // 绑定画布事件
  initEvents = () => {
    const graph = this.graph;

    // 选中元素
    graph
      .getSelectionModel()
      .addListener(mxEvent.CHANGE, function (sender, evt) {
        postEvent(EEventName.select, { sender, event: evt });
      });

    // 点击事件
    graph.addListener(mxEvent.CLICK, (sender, evt) => {
      // this.rubberband(false)
    });
    graph.addListener(mxEvent.DOUBLE_CLICK, (sender, evt) => {});
  };

  copy = () => {
    const cells = (this.graph.getSelectionCells() || []).filter((cell) => {
      const validator = getValidator(this.config, this.graph, cell, 'copy');
      return !!validator ? validator() : true;
    });
    mxClipboard.copy(this.graph, cells);
  };

  cut = () => {
    const cells = (this.graph.getSelectionCells() || []).filter((cell) => {
      const validator = getValidator(this.config, this.graph, cell, 'cut');
      return !!validator ? validator() : true;
    });
    mxClipboard.cut(this.graph, cells);
  };

  paste = () => {
    const graph = this.graph;
    if (graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent())) {
      graph.getModel().beginUpdate();
      try {
        const cells = mxClipboard.paste(graph);

        if (cells != null) {
          let includeEdges = true;

          for (let i = 0; i < cells.length && includeEdges; i++) {
            includeEdges = includeEdges && graph.model.isEdge(cells[i]);
          }

          const t = graph.view.translate;
          const s = graph.view.scale;
          const dx = t.x;
          const dy = t.y;
          let bb: { x: number; y: number } | null = null;
          if (cells.length === 1 && includeEdges) {
            const geo = graph.getCellGeometry(cells[0]);
            if (geo != null) {
              bb = geo.getTerminalPoint(true);
            }
          }
          bb =
            bb != null
              ? bb
              : graph.getBoundingBoxFromGeometry(cells, includeEdges);
          if (bb != null) {
            const x = Math.round(
              graph.snap(graph.popupMenuHandler.triggerX / s - dx)
            );
            const y = Math.round(
              graph.snap(graph.popupMenuHandler.triggerY / s - dy)
            );
            graph.cellsMoved(cells, x - bb.x, y - bb.y);
          }
        }
      } finally {
        graph.getModel().endUpdate();
      }
    }
  };

  canZoom = (scaleTo: number) => {
    if (scaleTo <= this.maxZoom && scaleTo >= this.minZoom) {
      return true;
    }
    return false;
  };
  zoom = (type: 'zoomIn' | 'zoomOut') => {
    const scale = this.graph.view.scale * 100;
    const scaleTo = scale + (type === 'zoomIn' ? 10 : -10);
    if (this.canZoom(scaleTo)) {
      // parseFloat((value / 100).toFixed(1)
      this.graph.zoomTo(scaleTo / 100, true);
      this.graph.fireEvent(new mxEventObject(EEventName.zoom, 'zoom', scaleTo));
    }
  };

  // 回退判断与操作
  canUndo = () => this.editor.undoManager.indexOfNextAdd > 0;
  undo = () => {
    try {
      const graph = this.graph;

      if (graph.isEditing()) {
        // Stops editing and executes undo on graph if native undo
        // does not affect current editing value
        const value = graph.cellEditor.textarea.innerHTML;
        document.execCommand('undo', false);

        if (value === graph.cellEditor.textarea.innerHTML) {
          graph.stopEditing(true);
          this.editor.undoManager.undo();
        }
      } else {
        this.editor.undoManager.undo();
      }
    } catch (e) {
      // ignore all errors
    } finally {
      postEvent(EEventName.undo);
    }
  };
  clearUndo = () => {
    this.editor.undoManager.clear();
  };

  // 对齐判断与操作
  canAlignment = () => {
    return (
      this.graph.isEnabled() &&
      expandCells(this.graph.getSelectionCells()).filter((c) =>
        this.graph.model.isVertex(c)
      ).length > 1
    );
  };
  align = (type: string) => {
    const selectedVertexs = expandCells(
      this.graph.getSelectionCells()
    ).filter((c) => this.graph.model.isVertex(c));

    if (selectedVertexs.length < 2) {
      return;
    }

    const alignVertex = selectedVertexs[0];
    const alignGeo = alignVertex.getGeometry();
    const { x = 0, y = 0, width = 50, height = 50 } = alignGeo;

    updateCells(this.graph, selectedVertexs, function (g, c, i) {
      if (i === 0) {
        return;
      }
      const geo = mxUtils.clone(c.getGeometry());

      const {
        x: _x = 0,
        y: _y = 0,
        width: _width = 50,
        height: _height = 50,
      } = geo;

      switch (type) {
        case 'left':
          geo.x = x;
          break;
        case 'top':
          geo.y = y;
          break;
        case 'right':
          geo.x += x + width - (_x + _width);
          break;
        case 'bottom':
          geo.y += y + height - (_y + _height);
          break;
        case 'lrCenter':
          geo.x += x + width / 2 - (_x + _width / 2);
          break;
        case 'tbCenter':
          geo.y += y + height / 2 - (_y + _height / 2);
          break;
        default:
          break;
      }
      g.model.setGeometry(c, geo);
    });
  };

  // 重做判断与操作
  canRedo = () =>
    this.editor.undoManager.indexOfNextAdd <
    this.editor.undoManager.history.length;
  redo = () => {
    try {
      const graph = this.graph;

      if (graph.isEditing()) {
        document.execCommand('redo', false);
      } else {
        this.editor.undoManager.redo();
      }
    } catch (e) {
      // DO NOTHING
    } finally {
      postEvent(EEventName.redo);
    }
  };

  // 框选判断与操作
  canRubberBand = () => this.graph.rubberband.enabled;
  rubberband = (enabled?: boolean) => {
    try {
      this.graph.rubberband.setEnabled(
        enabled !== undefined ? enabled : !this.graph.rubberband.enabled
      );
    } finally {
      postEvent(EEventName.rubberband);
    }
  };

  // 删除判断与操作
  canDelete = () => {
    const cells = (this.graph.getSelectionCells() || []).filter((cell) => {
      const validator = getValidator(this.config, this.graph, cell, 'delete');
      return !!validator ? validator() : true;
    });
    return this.graph.isEnabled() && cells.length > 0;
  };
  delete = () => {
    try {
      const cells = (this.graph.getSelectionCells() || []).filter((cell) => {
        const validator = getValidator(this.config, this.graph, cell, 'delete');
        return !!validator ? validator() : true;
      });
      this.graph.removeCells(cells);
    } catch (e) {
      postEvent(EEventName.delete);
    }
  };

  highlightTimer: any;
  highlight = (cells: Array<any>, duration?: number) => {
    const graph = this.graph;

    const _cells = cells
      .map((c) => graph.model.getCell(c.id))
      .filter((c) => graph.model.isEdge(c));

    try {
      this.graph.orderCells(false, _cells);
      updateCells(graph, _cells, function (g, c) {
        g.model.setStyle(
          c,
          setStyle(c, {
            add: {
              [mxConstants.STYLE_STROKECOLOR]: mxConfig.themeColor,
            },
          })
        );
      });
    } finally {
      clearTimeout(this.highlightTimer);

      duration &&
        (this.highlightTimer = setTimeout(() => {
          updateCells(graph, _cells, function (g, c) {
            g.model.setStyle(
              c,
              setStyle(c, {
                add: {
                  [mxConstants.STYLE_STROKECOLOR]: '#666666',
                },
              })
            );
          });
        }, duration));
    }
  };

  toggleOverlay = (cell, active: boolean, customOverlay?) => {
    const graph = this.graph;
    const overlays = graph.getCellOverlays(cell);

    overlays != null && graph.removeCellOverlays(cell);

    if (!active) {
      return;
    }

    // Creates a new overlay with an image and a tooltip
    const overlay = customOverlay
      ? customOverlay
      : new mxCellOverlay(
          new mxImage(getImageBasePath('error.svg'), 16, 16),
          null,
          mxConstants.ALIGN_RIGHT,
          mxConstants.ALIGN_TOP,
          new mxPoint(8, -8)
        );

    // Installs a handler for clicks on the overlay
    overlay.addListener(mxEvent.CLICK, function (sender, evt) {
      console.log(sender, evt);
    });

    // Sets the overlay for the cell in the graph
    graph.addCellOverlay(cell, overlay);
  };

  cancelHighlight = (cells?: Array<any>) => {
    const graph = this.graph;

    const _cells = (cells !== undefined
      ? cells
      : expandCells(graph.model.cells)
    )
      .map((c) => graph.model.getCell(c.id))
      .filter((c) => graph.model.isEdge(c));

    updateCells(graph, _cells, function (g, c) {
      g.model.setStyle(
        c,
        setStyle(c, {
          add: {
            [mxConstants.STYLE_STROKECOLOR]: '#666666',
          },
        })
      );
    });
  };

  // 选中元素
  selectCells = (cells: Array<any>) => {
    const graph = this.graph;
    graph.setSelectionCells(cells);
    graph.scrollCellToVisible(cells[0]);
  };

  // 设置节点名称值
  setCellsValue = (cells: Array<any>, useUpdater?: boolean) => {
    const graph = this.graph;

    updateCells(graph, cells, function (g, c) {
      const cell = graph.model.getCell(c.id);
      g.model.setValue(cell, c.value);
    });

    this.config.afterUpdateCells && this.config.afterUpdateCells(graph);
  };

  // 重绘操作
  redraw = (delay?: number) => {
    setTimeout(() => {
      this.editor.initPageFormat();
      this.graph.view.validate();
      this.graph.sizeDidChange();
    }, delay);
  };

  // 销毁对象
  destroy = () => {
    try {
      mxEvent.removeListener(this.graph.container, 'wheel', this.wheelHandler);
      this.keydownHandler &&
        mxEvent.removeListener(document, 'keydown', this.keydownHandler);
      this.keyupHandler &&
        mxEvent.removeListener(document, 'keyup', this.keyupHandler);

      this.editor && this.editor.destroy();
    } catch (e) {
      // DO NOTHING
    }
  };
}