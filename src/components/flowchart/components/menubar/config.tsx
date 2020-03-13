import React from 'react';

import svgDelete from '@/mxgraph/images/delete.svg';
import svgUndo from '@/mxgraph/images/undo.svg';
import svgRedo from '@/mxgraph/images/redo.svg';

import { ICell } from '../../types';
import EditorUI from '../../components/editorui';
import { getCommonComponent, reRender } from './utils';

export const data: Array<ICell> = [
  {
    key: 'undo',
    title: '撤销',
    getComponent: (
      component: React.ReactElement,
      editorUI: EditorUI,
      cell: ICell
    ) => {
      component = getCommonComponent(component, editorUI, cell);
      return React.cloneElement(
        component,
        Object.assign({}, component.props, {
          children: editorUI.canUndo() ? (
            <img src={svgUndo} />
          ) : (
            <img src={svgRedo} style={{ transform: 'rotateY(180deg' }} />
          )
        })
      );
    },
    listeners: [
      {
        name: 'undo',
        callback: reRender
      },
      {
        name: 'redo',
        callback: reRender
      }
    ]
  },
  {
    key: 'redo',
    title: '恢复',
    getComponent: (
      component: React.ReactElement,
      editorUI: EditorUI,
      cell: ICell
    ) => {
      component = getCommonComponent(component, editorUI, cell);
      return React.cloneElement(
        component,
        Object.assign({}, component.props, {
          children: editorUI.canRedo() ? (
            <img src={svgUndo} style={{ transform: 'rotateY(180deg' }} />
          ) : (
            <img src={svgRedo} />
          )
        })
      );
    },
    listeners: [
      {
        name: 'undo',
        callback: reRender
      },
      {
        name: 'redo',
        callback: reRender
      }
    ]
  },
  {
    key: 'delete',
    title: '删除',
    component: <img src={svgDelete} />,
    getComponent: getCommonComponent
  }
];
