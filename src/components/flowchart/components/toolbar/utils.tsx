import { mxCell, mxGeometry, mxUtils } from '@/components/mxgraph';

import { ICell, ECellType } from '../../types';
import EditorUI from '../editorui';

export function commonInit(
  element: HTMLElement,
  editorUI: EditorUI,
  cell: ICell
) {
  const graph = editorUI.editor.graph;

  const {
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
    value,
    new mxGeometry(geometry.x, geometry.y, geometry.width, geometry.height),
    style
  );
  prototype.setVertex(type !== undefined ? type === ECellType.VERTEX : true);

  const dragEl = document.createElement('div');
  dragEl.style.border = '1px dashed #4285f4';
  dragEl.style.width = `${geometry.width || 0}px`;
  dragEl.style.height = `${geometry.height || 0}px`;

  const ds = mxUtils.makeDraggable(
    element,
    graph,
    (graph, evt, target) => {
      graph.model.beginUpdate();
      try {
        const pt = graph.getPointForEvent(evt);
        const vertex = graph.getModel().cloneCell(prototype);
        vertex.geometry.x = pt.x;
        vertex.geometry.y = pt.y;

        const cells = [vertex];

        // 插入节点
        graph.importCells(cells, 0, 0, target);

        if (cells != null && cells.length > 0) {
          // 选中新增节点
          graph.setSelectionCells(cells);
          // 滚到节点区域
          graph.scrollCellToVisible(cells[0]);
        }
      } finally {
        graph.model.endUpdate();
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
