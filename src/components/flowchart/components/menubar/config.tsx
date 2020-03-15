import React from 'react';

import { ICell } from '../../types';
import EditorUI from '../../components/editorui';
import { TitleSVG } from '../common/svg';
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
          children: (
            <TitleSVG
              title={cell.title}
              name="undo"
              style={{
                color: editorUI.canUndo() ? '#666666' : '#cccccc'
              }}
            />
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
      },
      {
        name: 'add',
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
          children: (
            <TitleSVG
              title={cell.title}
              name="redo"
              style={{
                color: editorUI.canRedo() ? '#666666' : '#cccccc'
              }}
            />
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
      },
      {
        name: 'add',
        callback: reRender
      }
    ]
  },
  {
    key: 'delete',
    title: '删除',
    getComponent: (
      component: React.ReactElement,
      editorUI: EditorUI,
      cell: ICell
    ) => {
      component = getCommonComponent(component, editorUI, cell);
      return React.cloneElement(
        component,
        Object.assign({}, component.props, {
          children: (
            <TitleSVG
              title={cell.title}
              name="delete"
              style={{
                color:
                  editorUI.editor.graph.getSelectionCells().length > 0
                    ? '#666666'
                    : '#cccccc'
              }}
            />
          )
        })
      );
    },
    listeners: [
      {
        name: 'select',
        callback: reRender
      }
    ]
  }
];
