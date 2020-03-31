import React from 'react';
import {
  postEvent,
  getCells,
  parseJSON
} from '@/components/flowchart/utils';
import {
  mxCell,
  mxGeometry,
  mxUtils,
  mxConstants,
  config as mxConfig
} from '@/components/mxgraph';
import { getImageBasePath } from '@/components/mxgraph/utils';

import { ICell, ECellType, EEventName, ICellGeometry } from '../../types';
import EditorUI from '../editorui';

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

  const {
    key,
    name,
    value = {},
    geometry = {
      x: 0,
      y: 0,
      width: 50,
      height: 50
    },
    type
  } = cell;

  const prototype = new mxCell(
    JSON.stringify(
      Object.assign(
        {
          key,
          name
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
      children
    })
  );
}

export function relateCells(graph, cells: Array<any>) {
  const ids = cells.map(c => c.getId());

  for (let i = 0, l = cells.length; i <= l; i++) {
    const cell = cells[i];
    if (graph.model.isVertex(cell)) {
      const value = parseJSON(graph.model.getValue(cell), {});
      const id = cell.getId();
      graph.model.setValue(
        cell,
        JSON.stringify({
          ...value,
          relatedIds: ids.filter(_id => _id !== id).join(';')
        })
      );
    }
  }
}

enum EDirection {
  'north' = 'north',
  'east' = 'east',
  'west' = 'west',
  'south' = 'south'
}

export function makeClickable(
  editorUI: EditorUI,
  cell: ICell,
  target?: any,
  direction?: EDirection
) {
  const graph = editorUI.graph;

  graph.model.beginUpdate();

  let targetCells;

  try {
    const allVertexs = getCells(graph.model.cells).filter(c =>
      graph.model.isVertex(c)
    );
    const selectedVertexs = getCells(graph.getSelectionCells()).filter(c =>
      graph.model.isVertex(c)
    );

    let drop;

    if (target) {
      drop = target;
    } else {
      if (selectedVertexs.length > 0) {
        drop = selectedVertexs[0];
      } else if (allVertexs.length > 0) {
        drop = allVertexs[allVertexs.length - 1];
      }
    }

    let x = 20;
    let y = 20;

    const hasDrop = !!drop;

    if (hasDrop) {
      const geo = drop.getGeometry() || ({} as ICellGeometry);

      const { x: _x, y: _y, width: _width, height: _height } = geo;

      if (direction) {
        switch (direction) {
          case EDirection.east:
            x = _x + _width + 50;
            y = _y;
            break;
          case EDirection.south:
            x = _x;
            y = _y + _height + 50;
            break;
          case EDirection.west:
            x =
              _x - ((cell.geometry || ({} as ICellGeometry)).width || 50 + 50);
            y = _y;
            break;
          case EDirection.north:
            x = _x;
            y =
              _y - ((cell.geometry || ({} as ICellGeometry)).height || 50 + 50);
            break;
          default:
            break;
        }
      } else {
        x = _x;
        y = _y + _height + 50;
      }
    }

    const cells = commonGetCells(editorUI, cell, x, y);

    targetCells = graph.importCells(cells, 0, 0);

    if (targetCells.length > 0) {
      // 若新增目标节点有多个，则给目标节点添加标记
      if (targetCells.length > 1) {
        relateCells(graph, targetCells);
      }

      // 若存在选中节点，则自动连线
      if (hasDrop) {
        const source = targetCells[0];
        graph.insertEdge(null, null, '', drop, source);
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
  const {
    geometry = {
      x: 0,
      y: 0,
      width: 50,
      height: 50
    }
  } = cell;

  const dragEl = document.createElement('div');
  dragEl.style.position = 'relative';
  dragEl.style.transform = 'translate(-50%, -50%)';
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
        let { x, y } = pt;

        x = x - geometry.width / 2;
        y = y - geometry.height / 2;

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

  ds.isGuidesEnabled = function() {
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
      [mxConstants.STYLE_IMAGE]: getImageBasePath(`toolbar/${name}-todo.svg`)
    },
    doing: {
      ...others,
      [mxConstants.STYLE_FONTCOLOR]: mxConfig.themeColor,
      [mxConstants.STYLE_IMAGE]: getImageBasePath(`toolbar/${name}-doing.svg`)
    },
    done: {
      ...others,
      [mxConstants.STYLE_IMAGE]: getImageBasePath(`toolbar/${name}.svg`)
    },
    ignore: {
      ...others,
      [mxConstants.STYLE_FONTCOLOR]: '#999999',
      [mxConstants.STYLE_IMAGE]: getImageBasePath(`toolbar/${name}-ignore.svg`)
    },
    error: {
      ...others,
      [mxConstants.STYLE_FONTCOLOR]: '#ff0000',
      [mxConstants.STYLE_IMAGE]: getImageBasePath(`toolbar/${name}-error.svg`)
    }
  };
}
