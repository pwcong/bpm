import React from 'react';

import { postEvent, parseJSON } from '@bpm/utils';

import {
  expandCells,
  getChildVertexs,
  updateCells,
  getCenterGeometry,
  getDefaultGeometry,
} from '@/utils';

import { MX, mxConfig } from '@/components/mx';

import { getImageBasePath } from '@/components/mx';

import { ICell, ECellType, EEventName } from '@/types';
import EditorUI from '../editorui';

const { mxCell, mxGeometry, mxUtils, mxConstants } = MX;

export function commonGetCells(
  editorUI: EditorUI,
  cell: ICell,
  x: number,
  y: number
) {
  const source = commonGetCell(editorUI, cell, x, y);

  const targets: Array<any> = [];
  const { relations = [] } = cell;
  for (let i = 0, l = relations.length; i < l; i++) {
    const relation = relations[i];
    const target = commonGetCell(editorUI, relation, x + 100 * (i + 1), y);

    const edge = new mxCell({}, new mxGeometry(), null);
    edge.setEdge(true);
    edge.geometry.relative = true;
    edge.source = source;
    edge.target = target;

    targets.push(edge, target);
  }

  return [source, ...targets];
}

export function commonGetCell(
  editorUI: EditorUI,
  cell: ICell,
  x: number,
  y: number
) {
  const graph = editorUI.editor.graph;

  const { key, name, value = {}, type } = cell;

  const geometry = getDefaultGeometry(cell);

  const prototype = new mxCell(
    JSON.stringify(
      Object.assign(
        {
          key,
          name,
        },
        value
      )
    ),
    new mxGeometry(geometry.x, geometry.y, geometry.width, geometry.height),
    key
  );
  prototype.setVertex(type !== undefined ? type === ECellType.VERTEX : true);

  const t = graph.getModel().cloneCell(prototype);
  t.geometry.x = x;
  t.geometry.y = y;

  return cell.afterInitial ? cell.afterInitial(t) : t;
}

export function getCommonComponent(
  component: React.ReactElement,
  children: React.ReactNode,
  editorUI: EditorUI,
  cell: ICell
) {
  return React.cloneElement(
    component,
    Object.assign({}, component.props, {
      onClick: () => {
        makeClickable(editorUI, cell);
      },
      children,
    })
  );
}

export function relateCells(graph, cells: Array<any>) {
  cells = cells.filter((c) => graph.model.isVertex(c));

  const ids = cells.map((c) => c.getId());

  for (let i = 0, l = cells.length; i < l; i++) {
    const cell = cells[i];
    const value = parseJSON(graph.model.getValue(cell), {});
    const id = cell.getId();
    graph.model.setValue(
      cell,
      JSON.stringify({
        ...value,
        relatedIds: ids.filter((_id) => _id !== id).join(';'),
      })
    );
  }
}

enum EDirection {
  'north' = 'north',
  'northEast' = 'northEast',
  'northWest' = 'northWest',
  'south' = 'south',
  'southEast' = 'southEast',
  'southWest' = 'southWest',
  'east' = 'east',
  'west' = 'west',
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function calcNextPosition(
  cell: ICell,
  target,
  direction?: EDirection,
  next?: any
) {
  const cellGeo = getDefaultGeometry(cell);
  const targetGeo = getCenterGeometry(target);

  let x = 50;
  let y = 50;

  const { x: _x, y: _y, width: _width, height: _height } = targetGeo;

  // 根据方向计算
  if (direction) {
    switch (direction) {
      case EDirection.east:
        x = _x + _width / 2 + 50;
        y = _y - cellGeo.height / 2;
        break;
      case EDirection.west:
        x = _x - _width / 2 - 50 - cellGeo.width;
        y = _y - cellGeo.height / 2;
        break;
      case EDirection.north:
        x = _x - cellGeo.width / 2;
        y = _y - _height / 2 - 50 - cellGeo.height;
        break;
      case EDirection.south:
        x = _x - cellGeo.width / 2;
        y = _y + _height / 2 + 50;
        break;
      default:
        break;
    }
  } else {
    // if (next) {
    //   debugger
    //   // 根据下一节点计算
    //   const nextGeo = getCenterGeometry(next)

    //   const h = nextGeo.x - _x
    //   switch (true) {
    //     case h >= 20:
    //       x = _x + _width / 2 + 50
    //       break
    //     case h <= -20:
    //       x = _x - _width / 2 - 50 - cellGeo.width
    //       break
    //     default:
    //       x = _x - cellGeo.width / 2
    //   }

    //   const v = nextGeo.y - _y
    //   switch (true) {
    //     case v >= 20:
    //       y = _y - _height / 2 - 50 - cellGeo.height
    //       break
    //     case v <= -20:
    //       y = _y + _height / 2 + 50
    //       break
    //     default:
    //       x = _y + _height / 2 + 50
    //   }

    // } else {
    //   // 默认位置
    //   x = _x - cellGeo.width / 2
    //   y = _y + _height / 2 + 50
    // }

    // 默认位置
    x = _x - cellGeo.width / 2;
    y = _y + _height / 2 + 50;
  }

  return {
    x,
    y,
  };
}

export function makeClickable(
  editorUI: EditorUI,
  cell: ICell,
  target?: any,
  direction?: EDirection
) {
  const graph = editorUI.graph;

  graph.model.beginUpdate();

  try {
    let drop;

    const allVertexs = expandCells(graph.model.cells).filter((c) =>
      graph.model.isVertex(c)
    );
    const selectedVertexs = expandCells(graph.getSelectionCells()).filter((c) =>
      graph.model.isVertex(c)
    );

    if (target) {
      drop = target;
    } else {
      if (selectedVertexs.length > 0) {
        drop = selectedVertexs[selectedVertexs.length - 1];
      } else if (allVertexs.length > 0) {
        drop = allVertexs[allVertexs.length - 1];
      }
    }

    let x = 50;
    let y = 50;

    const hasDrop = !!drop;

    let targetCells;
    let splitFlag = false;

    const outgoingEdges = hasDrop ? graph.model.getOutgoingEdges(drop) : [];
    let outgoingEdge;
    if (hasDrop && !direction && outgoingEdges.length === 1) {
      splitFlag = true;
      outgoingEdge = outgoingEdges[0];
    }

    // 计算下一节点坐标值
    if (hasDrop) {
      const nextPosition = calcNextPosition(
        cell,
        drop,
        direction,
        splitFlag && outgoingEdge && outgoingEdge.target
          ? outgoingEdge.target
          : undefined
      );
      x = nextPosition.x;
      y = nextPosition.y;
    }

    const cells = commonGetCells(editorUI, cell, x, y);

    if (splitFlag) {
      // 有一条流出，切割线条
      updateCells(graph, getChildVertexs(graph, drop.id), (g, c) => {
        const geo = mxUtils.clone(c.getGeometry());
        geo.y += 100;
        g.model.setGeometry(c, geo);
      });

      graph.splitEdge(outgoingEdge, cells, null, 0, 0);
      targetCells = cells;
      splitFlag = true;
    } else {
      // 无流出或者有多条流出，默认新增逻辑
      targetCells = graph.importCells(cells, 0, 0);
    }

    if (!targetCells) {
      return;
    }

    if (targetCells && targetCells.length > 0) {
      // 若新增目标节点有多个，则给目标节点添加标记
      if (targetCells.length > 1) {
        relateCells(graph, targetCells);
      }

      // 若存在目标节点，则自动连线
      if (hasDrop && !splitFlag) {
        const first = targetCells[0];
        graph.insertEdge(null, null, '', drop, first);
      }
    }

    // 选中新增节点
    graph.setSelectionCells(targetCells);

    // 滚到节点区域
    graph.scrollCellToVisible(targetCells[0]);
  } finally {
    graph.model.endUpdate();

    postEvent(EEventName.add);
  }
}

export function makeDraggable(
  element: HTMLElement,
  editorUI: EditorUI,
  cell: ICell
) {
  const graph = editorUI.editor.graph;
  const geometry = getDefaultGeometry(cell);

  const dragEl = document.createElement('div');
  dragEl.style.position = 'relative';
  // dragEl.style.transform = 'translate(-50%, -50%)'
  dragEl.style.border = `1px dashed ${mxConfig.themeColor}`;
  dragEl.style.width = `${geometry.width || 0}px`;
  dragEl.style.height = `${geometry.height || 0}px`;

  const ds = mxUtils.makeDraggable(
    element,
    graph,
    (graph, evt, drop) => {
      // 避免重复插入问题
      const now = Date.now();
      if (graph.lastDropTime !== undefined && now - graph.lastDropTime < 200) {
        return;
      }
      graph.lastDropTime = now;

      graph.model.beginUpdate();

      let targetCells;

      try {
        const pt = graph.getPointForEvent(evt);
        const { x, y } = pt;

        // x = x - geometry.width / 2
        // y = y - geometry.height / 2

        const cells = commonGetCells(editorUI, cell, x, y);

        // 拖入对象是线条的情况下切割线条
        if (graph.isSplitTarget(drop, cells, evt)) {
          graph.splitEdge(drop, cells, null, 0, 0);
          targetCells = cells;
        } else {
          // 插入节点
          targetCells = graph.importCells(cells, 0, 0, drop);
        }

        // 若新增目标节点有多个，则给目标节点添加标记
        if (targetCells.length > 1) {
          relateCells(graph, targetCells);
        }

        // 选中新增节点
        graph.setSelectionCells(targetCells);

        // 滚到节点区域
        graph.scrollCellToVisible(targetCells[0]);
      } finally {
        graph.model.endUpdate();

        postEvent(EEventName.add);
      }
    },
    dragEl,
    null,
    null,
    graph.autoscroll,
    true
  );

  ds.isGuidesEnabled = function () {
    return graph.graphHandler.guidesEnabled;
  };
}

export function commonInitial(
  element: HTMLElement,
  editorUI: EditorUI,
  cell: ICell
) {
  makeDraggable(element, editorUI, cell);
}

export function commonStatus(name: string, others: { [key: string]: string }) {
  return {
    todo: {
      ...others,
      [mxConstants.STYLE_FONTCOLOR]: '#666666',
      [mxConstants.STYLE_IMAGE]: getImageBasePath(`toolbar/${name}-todo.svg`),
    },
    doing: {
      ...others,
      [mxConstants.STYLE_FONTCOLOR]: mxConfig.themeColor,
      [mxConstants.STYLE_IMAGE]: getImageBasePath(`toolbar/${name}-doing.svg`),
    },
    done: {
      ...others,
      [mxConstants.STYLE_IMAGE]: getImageBasePath(`toolbar/${name}.svg`),
    },
    ignore: {
      ...others,
      [mxConstants.STYLE_FONTCOLOR]: '#999999',
      [mxConstants.STYLE_IMAGE]: getImageBasePath(`toolbar/${name}-ignore.svg`),
    },
    error: {
      ...others,
      [mxConstants.STYLE_FONTCOLOR]: '#ff0000',
      [mxConstants.STYLE_IMAGE]: getImageBasePath(`toolbar/${name}-error.svg`),
    },
  };
}
