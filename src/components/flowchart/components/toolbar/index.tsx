import React from 'react';

import classnames from 'classnames';

import { mxCell, mxGeometry, mxUtils } from '@/components/mxgraph';

import { IBaseProps, ICell, ECellType } from '../../types';
import EditorUI from '../editorui';
import { data } from './config';

import './style.scss';

export interface IProps extends IBaseProps {
  editorUI: EditorUI;
}

export interface IToolbarItemProps extends IBaseProps {
  editorUI: EditorUI;
  data: ICell;
}

const cls = `flowchart-toolbar`;

export const ToolbarItem: React.FunctionComponent<IToolbarItemProps> = props => {
  const { className, style, editorUI, children, data } = props;

  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (ref.current) {
      const graph = editorUI.editor.graph;
      const container = ref.current;

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
      } = data;

      const prototype = new mxCell(
        value,
        new mxGeometry(geometry.x, geometry.y, geometry.width, geometry.height),
        style
      );
      prototype.setVertex(
        type !== undefined ? type === ECellType.VERTEX : true
      );

      const dragEl = document.createElement('div');
      dragEl.style.border = '1px dashed #4285f4';
      dragEl.style.width = `${geometry.width || 0}px`;
      dragEl.style.height = `${geometry.height || 0}px`;

      const ds = mxUtils.makeDraggable(
        container,
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
  }, [editorUI, data]);

  const itemCls = `${cls}-item`;

  return (
    <div className={classnames(itemCls, className)} style={style} ref={ref}>
      {children}
    </div>
  );
};

const Toolbar: React.FunctionComponent<IProps> = props => {
  const { editorUI, className, style } = props;

  React.useEffect(() => {
    // DO NOTHING
  }, [editorUI]);

  return (
    <div className={classnames(cls, className)} style={style}>
      {data.map(item => (
        <ToolbarItem key={item.key} data={item} editorUI={editorUI}>
          {item.component}
        </ToolbarItem>
      ))}
    </div>
  );
};

export default Toolbar;
