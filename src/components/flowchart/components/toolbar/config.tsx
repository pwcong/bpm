import React from 'react';

import { mxConstants, mxPerimeter } from '@/components/mxgraph';
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
    style: {
      [mxConstants.STYLE_SHAPE]: mxConstants.SHAPE_IMAGE,
      [mxConstants.STYLE_PERIMETER]: mxPerimeter.RectanglePerimeter,
      [mxConstants.STYLE_IMAGE]: 'images/generalStart.svg'
    },
    geometry: {
      width: 80,
      height: 80,
      x: 0,
      y: 0
    },
    component: <img src={svgGeneralStart} />,
    onInit: commonInit
  }
];
