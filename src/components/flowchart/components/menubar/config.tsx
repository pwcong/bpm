import React from 'react';

import { ICell } from '../../types';
import EditorUI from '../../components/editorui';
import SVG from '../common/svg';
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
            <SVG
              name="undo"
              style={{
                color: editorUI.canUndo() ? '#333333' : '#999999'
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
            <SVG
              name="redo"
              style={{
                color: editorUI.canRedo() ? '#333333' : '#999999'
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
            <SVG
              name="delete"
              style={{
                color:
                  editorUI.editor.graph.getSelectionCells().length > 0
                    ? '#333333'
                    : '#999999'
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
