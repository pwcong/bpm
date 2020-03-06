import React from 'react';

import svgDelete from '@/mxgraph/images/delete.svg';
import svgUndo from '@/mxgraph/images/undo.svg';
import svgRedo from '@/mxgraph/images/redo.svg';
import svgGeneralStart from '@/mxgraph/images/generalStart.svg';

import { ICell } from './types';

export const menubarData: Array<ICell> = [
  {
    key: 'undo',
    title: '撤销',
    component: <img src={svgUndo} />
  },
  {
    key: 'redo',
    title: '恢复',
    component: <img src={svgRedo} />
  },
  {
    key: 'delete',
    title: '删除',
    component: <img src={svgDelete} />
  }
];

export const toolbarData: Array<ICell> = [
  {
    key: 'generalStart',
    title: '开始事件',
    value: {
      name: '开始事件'
    },
    style: 'shape=rounded',
    geometry: {
      width: 40,
      height: 40,
      x: 0,
      y: 0
    },
    component: <img src={svgGeneralStart} />
  }
];
