import React from 'react';

import { ICell } from '../../types';
import EditorUI from '../../components/editorui';
import { TitleSVG } from '../common/svg';
import { getCommonComponent, reRender } from './utils';

export const data: Array<ICell> = [
  {
    key: 'undo',
    name: '撤销',
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
              title={cell.name}
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
    name: '恢复',
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
              title={cell.name}
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
    name: '删除',
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
              title={cell.name}
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
  },
  {
    key: 'rubberband',
    name: '框选',
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
              title={cell.name}
              name="rubberband"
              style={{
                color: editorUI.canRubberBand() ? '#666666' : '#cccccc'
              }}
            />
          )
        })
      );
    },
    listeners: [
      {
        name: 'rubberband',
        callback: reRender
      }
    ]
  }
];
