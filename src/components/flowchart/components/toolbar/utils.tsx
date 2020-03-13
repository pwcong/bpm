import { mxCell, mxGeometry, mxUtils } from '@/components/mxgraph';

import { ICell, ECellType } from '../../types';
import EditorUI from '../editorui';
import { postEvent } from '@/utils/event';
import { EEventName } from '../../config';

export function commonInit(
  element: HTMLElement,
  editorUI: EditorUI,
  cell: ICell
) {
  const graph = editorUI.editor.graph;

  const {
    key,
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

  if (typeof style === 'object') {
    const styleObj = new Object();
    Object.keys(style).forEach(k => (styleObj[k] = style[k]));
    graph.getStylesheet().putCellStyle(key, styleObj);
  }

  const prototype = new mxCell(
    value,
    new mxGeometry(geometry.x, geometry.y, geometry.width, geometry.height),
    typeof style === 'string' ? style : key
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

      let targetCells;

      try {
        const pt = graph.getPointForEvent(evt);
        const vertex = graph.getModel().cloneCell(prototype);
        vertex.geometry.x = pt.x;
        vertex.geometry.y = pt.y;

        const cells = [vertex];

        // 插入节点
        targetCells = graph.importCells(cells, 0, 0, target);

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
