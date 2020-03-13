import React from 'react';

import svgGeneralStart from '@/mxgraph/images/generalStart.svg';

import { ICell } from '../../types';
import { commonInit } from './utils';

export const data: Array<ICell> = [
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
    component: <img src={svgGeneralStart} />,
    onInit: commonInit
  }
];
