import React from 'react';

import classnames from 'classnames';

import { mxCell, mxGeometry, mxUtils } from '@/components/mxgraph';

import { toolbarData } from '../../config';

import { IBaseProps, ICell } from '../../types';
import EditorUi from '../editorui';

import './style.scss';

export interface IProps extends IBaseProps {
  editorUi: EditorUi;
}

export interface IToolbarItemProps extends IBaseProps {
  editorUi: EditorUi;
  data: ICell;
}

const cls = `flowchart-toolbar`;

export const ToolbarItem: React.FunctionComponent<IToolbarItemProps> = props => {
  const { className, style, editorUi, children, data } = props;

  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (ref.current) {
      const container = ref.current

      const {
        value = {},
        geometry = {
          x: 0,
          y: 0,
          width: 50,
          height: 50
        },
        style = '',
        isVertex
      } = data;

      const cell = new mxCell(
        value,
        new mxGeometry(geometry.x, geometry.y, geometry.width, geometry.height),
        style
      );
      cell.setVertex(isVertex !== undefined ? isVertex : true);
      console.log(cell)

      mxUtils.makeDraggable(
        container,
        editorUi.editor.graph,
        (graph, evt) => {
          graph.model.beginUpdate();
          try {
            const pt = graph.getPointForEvent(evt);
            const vertex = graph.getModel().cloneCell(cell);
            vertex.geometry.x = pt.x;
            vertex.geometry.y = pt.y;

            graph.setSelectionCells(graph.importCells([vertex], 0, 0, graph.model.root));
          } finally {
            graph.model.endUpdate();
          }
        }
      );
    }
  }, [editorUi, data]);

  const itemCls = `${cls}-item`;

  return (
    <div className={classnames(itemCls, className)} style={style} ref={ref}>
      {children}
    </div>
  );
};

const Toolbar: React.FunctionComponent<IProps> = props => {
  const { editorUi, className, style } = props;

  React.useEffect(() => {
    // DO NOTHING
  }, [editorUi]);

  return (
    <div className={classnames(cls, className)} style={style}>
      {toolbarData.map(item => (
        <ToolbarItem key={item.key} data={item} editorUi={editorUi}>
          {item.component}
        </ToolbarItem>
      ))}
    </div>
  );
};

export default Toolbar;
