import { postEvent } from '@/utils/event';
import { mxCell, mxGeometry, mxUtils } from '@/components/mxgraph';

import { ICell, ECellType } from '../../types';
import { EEventName } from '../../config';
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
    style = '',
    type
  } = cell;

  const prototype = new mxCell(
    Object.assign(
      {
        key,
        name
      },
      value
    ),
    new mxGeometry(geometry.x, geometry.y, geometry.width, geometry.height),
    typeof style === 'string' ? style : key
  );
  prototype.setVertex(type !== undefined ? type === ECellType.VERTEX : true);

  const t = graph.getModel().cloneCell(prototype);
  t.geometry.x = x;
  t.geometry.y = y;

  return t;
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
  dragEl.style.border = '1px dashed #4285f4';
  dragEl.style.width = `${geometry.width || 0}px`;
  dragEl.style.height = `${geometry.height || 0}px`;

  const ds = mxUtils.makeDraggable(
    element,
    graph,
    (graph, evt, target) => {
      graph.model.beginUpdate();

      let targetCells;

      try {
        const pt = graph.getPointForEvent(evt);
        const { x, y } = pt;

        const cells = commonGetCells(editorUI, cell, x, y);

        // 拖入对象是线条的情况下切割线条
        if (graph.isSplitTarget(target, cells, evt)) {
          graph.splitEdge(
            target,
            cells,
            null,
            -(geometry.width / 2),
            -(geometry.height / 2)
          );
          targetCells = cells;
        } else {
          // 插入节点
          targetCells = graph.importCells(cells, 0, 0, target);
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
