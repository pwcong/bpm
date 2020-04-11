import React from 'react';

import { ICell, ICellMap, EEventName } from '../../types';
import EditorUI from '../../components/editorui';
import { TitleSVG } from '../common/svg';
import { getCommonComponent, reRender } from './utils';

export const map: ICellMap = {
  undo: {
    key: 'undo',
    name: '撤销',
    getComponent: (
      component: React.ReactElement,
      editorUI: EditorUI,
      cell: ICell
    ) =>
      getCommonComponent(
        component,
        <TitleSVG
          title={cell.name}
          name="undo"
          style={{
            color: editorUI.canUndo() ? '#666666' : '#cccccc',
          }}
        />,
        editorUI,
        cell
      ),
    listeners: [
      {
        name: EEventName.undo,
        callback: reRender,
      },
      {
        name: EEventName.redo,
        callback: reRender,
      },
      {
        name: EEventName.add,
        callback: reRender,
      },
    ],
  },
  redo: {
    key: 'redo',
    name: '恢复',
    getComponent: (
      component: React.ReactElement,
      editorUI: EditorUI,
      cell: ICell
    ) =>
      getCommonComponent(
        component,
        <TitleSVG
          title={cell.name}
          name="redo"
          style={{
            color: editorUI.canRedo() ? '#666666' : '#cccccc',
          }}
        />,
        editorUI,
        cell
      ),
    listeners: [
      {
        name: EEventName.undo,
        callback: reRender,
      },
      {
        name: EEventName.redo,
        callback: reRender,
      },
      {
        name: EEventName.add,
        callback: reRender,
      },
    ],
  },
  delete: {
    key: 'delete',
    name: '删除',
    getComponent: (
      component: React.ReactElement,
      editorUI: EditorUI,
      cell: ICell
    ) =>
      getCommonComponent(
        component,
        <TitleSVG
          title={cell.name}
          name="delete"
          style={{
            color: editorUI.canDelete() ? '#666666' : '#cccccc',
          }}
        />,
        editorUI,
        cell
      ),
    listeners: [
      {
        name: EEventName.select,
        callback: reRender,
      },
    ],
  },
  rubberband: {
    key: 'rubberband',
    name: '框选',
    getComponent: (
      component: React.ReactElement,
      editorUI: EditorUI,
      cell: ICell
    ) =>
      getCommonComponent(
        component,
        <TitleSVG
          title={cell.name}
          name="rubberband"
          style={{
            color: editorUI.canRubberBand() ? '#4285f4' : '#666666',
          }}
        />,
        editorUI,
        cell
      ),
    listeners: [
      {
        name: EEventName.rubberband,
        callback: reRender,
      },
    ],
  },
  alignment: {
    key: 'alignment',
    name: '对齐',
    getComponent: (
      component: React.ReactElement,
      editorUI: EditorUI,
      cell: ICell
    ) =>
      getCommonComponent(
        component,
        <TitleSVG
          title={cell.name}
          name="alignment"
          style={{
            color: editorUI.canAlignment() ? '#666666' : '#cccccc',
          }}
        />,
        editorUI,
        cell
      ),
    listeners: [
      {
        name: EEventName.select,
        callback: reRender,
      },
    ],
  },
  alignTop: {
    key: 'alignTop',
    name: '顶部对齐',
    getComponent: (
      component: React.ReactElement,
      editorUI: EditorUI,
      cell: ICell
    ) =>
      getCommonComponent(
        component,
        <TitleSVG
          title={cell.name}
          name="alignTop"
          style={{
            color: editorUI.canAlignment() ? '#666666' : '#cccccc',
          }}
        />,
        editorUI,
        cell
      ),
    listeners: [
      {
        name: EEventName.select,
        callback: reRender,
      },
    ],
  },
  alignTBCenter: {
    key: 'alignTBCenter',
    name: '上下居中对齐',
    getComponent: (
      component: React.ReactElement,
      editorUI: EditorUI,
      cell: ICell
    ) =>
      getCommonComponent(
        component,
        <TitleSVG
          title={cell.name}
          name="alignTBCenter"
          style={{
            color: editorUI.canAlignment() ? '#666666' : '#cccccc',
          }}
        />,
        editorUI,
        cell
      ),
    listeners: [
      {
        name: EEventName.select,
        callback: reRender,
      },
    ],
  },
  alignBottom: {
    key: 'alignBottom',
    name: '底对齐',
    getComponent: (
      component: React.ReactElement,
      editorUI: EditorUI,
      cell: ICell
    ) =>
      getCommonComponent(
        component,
        <TitleSVG
          title={cell.name}
          name="alignBottom"
          style={{
            color: editorUI.canAlignment() ? '#666666' : '#cccccc',
          }}
        />,
        editorUI,
        cell
      ),
    listeners: [
      {
        name: EEventName.select,
        callback: reRender,
      },
    ],
  },
  alignLeft: {
    key: 'alignLeft',
    name: '左对齐',
    getComponent: (
      component: React.ReactElement,
      editorUI: EditorUI,
      cell: ICell
    ) =>
      getCommonComponent(
        component,
        <TitleSVG
          title={cell.name}
          name="alignLeft"
          style={{
            color: editorUI.canAlignment() ? '#666666' : '#cccccc',
          }}
        />,
        editorUI,
        cell
      ),
    listeners: [
      {
        name: EEventName.select,
        callback: reRender,
      },
    ],
  },
  alignLRCenter: {
    key: 'alignLRCenter',
    name: '左右居中对齐',
    getComponent: (
      component: React.ReactElement,
      editorUI: EditorUI,
      cell: ICell
    ) =>
      getCommonComponent(
        component,
        <TitleSVG
          title={cell.name}
          name="alignLRCenter"
          style={{
            color: editorUI.canAlignment() ? '#666666' : '#cccccc',
          }}
        />,
        editorUI,
        cell
      ),
    listeners: [
      {
        name: EEventName.select,
        callback: reRender,
      },
    ],
  },
  alignRight: {
    key: 'alignRight',
    name: '右对齐',
    getComponent: (
      component: React.ReactElement,
      editorUI: EditorUI,
      cell: ICell
    ) =>
      getCommonComponent(
        component,
        <TitleSVG
          title={cell.name}
          name="alignRight"
          style={{
            color: editorUI.canAlignment() ? '#666666' : '#cccccc',
          }}
        />,
        editorUI,
        cell
      ),
    listeners: [
      {
        name: EEventName.select,
        callback: reRender,
      },
    ],
  },
};

export const data: Array<ICell> = [
  map.undo,
  map.redo,
  map.delete,
  {
    ...map.alignment,
    relations: [
      map.alignTop,
      map.alignTBCenter,
      map.alignBottom,
      map.alignLeft,
      map.alignLRCenter,
      map.alignRight,
    ],
  },
  // map.rubberband,
];
