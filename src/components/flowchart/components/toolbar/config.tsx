import React from 'react';

import { mxConstants, mxPerimeter } from '@/components/mxgraph';

import { TitleIMG } from '../common/img';
import { ICell, ICellConstraints } from '../../types';
import { commonInit } from './utils';

const commonStyle = {
  [mxConstants.STYLE_SHAPE]: mxConstants.SHAPE_IMAGE,
  [mxConstants.STYLE_PERIMETER]: mxPerimeter.RectanglePerimeter
};

const commonLabelStyle = {
  [mxConstants.STYLE_VERTICAL_LABEL_POSITION]: 'bottom',
  [mxConstants.STYLE_VERTICAL_ALIGN]: 'top'
};

const commonConstraints: ICellConstraints = [
  [0.25, 0],
  [0.5, 0],
  [0.75, 0],
  [0, 0.25],
  [1, 0.25],
  [0, 0.5],
  [1, 0.5],
  [0, 0.75],
  [1, 0.75],
  [0.25, 1],
  [0.5, 1],
  [0.75, 1]
];

export const data: Array<ICell> = [
  {
    key: 'generalStart',
    name: '开始事件',
    style: {
      ...commonStyle,
      ...commonLabelStyle,
      [mxConstants.STYLE_IMAGE]: 'mxgraph/images/toolbar/general-start.svg'
    },
    geometry: {
      width: 36,
      height: 36,
      x: 0,
      y: 0
    },
    component: (
      <TitleIMG
        src="mxgraph/images/toolbar/general-start.svg"
        title="开始事件"
      />
    ),
    onInit: commonInit
  },
  {
    key: 'generalEnd',
    name: '结束事件',
    style: {
      ...commonStyle,
      ...commonLabelStyle,
      [mxConstants.STYLE_IMAGE]: 'mxgraph/images/toolbar/general-end.svg'
    },
    geometry: {
      width: 36,
      height: 36,
      x: 0,
      y: 0
    },
    component: (
      <TitleIMG src="mxgraph/images/toolbar/general-end.svg" title="结束事件" />
    ),
    onInit: commonInit
  },
  {
    key: 'draft',
    name: '起草节点',
    style: {
      ...commonStyle,
      [mxConstants.STYLE_IMAGE]: 'mxgraph/images/toolbar/draft.svg'
    },
    geometry: {
      width: 174,
      height: 54,
      x: 0,
      y: 0
    },
    constraints: commonConstraints,
    component: (
      <TitleIMG src="mxgraph/images/toolbar/draft-m.svg" title="起草节点" />
    ),
    onInit: commonInit
  },
  {
    key: 'review',
    name: '审批节点',
    style: {
      ...commonStyle,
      [mxConstants.STYLE_IMAGE]: 'mxgraph/images/toolbar/review.svg'
    },
    geometry: {
      width: 174,
      height: 54,
      x: 0,
      y: 0
    },
    constraints: commonConstraints,
    component: (
      <TitleIMG src="mxgraph/images/toolbar/review-m.svg" title="审批节点" />
    ),
    onInit: commonInit
  },
  {
    key: 'conditionBranch',
    name: '条件分支',
    style: {
      ...commonStyle,
      ...commonLabelStyle,
      [mxConstants.STYLE_IMAGE]: 'mxgraph/images/toolbar/condition-branch.svg'
    },
    geometry: {
      width: 36,
      height: 36,
      x: 0,
      y: 0
    },
    component: (
      <TitleIMG
        src="mxgraph/images/toolbar/condition-branch.svg"
        title="条件分支"
      />
    ),
    onInit: commonInit
  },
  {
    key: 'manualBranch',
    name: '人工分支',
    style: {
      ...commonStyle,
      ...commonLabelStyle,
      [mxConstants.STYLE_IMAGE]: 'mxgraph/images/toolbar/manual-branch.svg'
    },
    geometry: {
      width: 36,
      height: 36,
      x: 0,
      y: 0
    },
    component: (
      <TitleIMG
        src="mxgraph/images/toolbar/manual-branch.svg"
        title="人工分支"
      />
    ),
    onInit: commonInit
  },
  {
    key: 'split',
    name: '并行分支',
    style: {
      ...commonStyle,
      ...commonLabelStyle,
      [mxConstants.STYLE_IMAGE]: 'mxgraph/images/toolbar/split.svg'
    },
    geometry: {
      width: 36,
      height: 36,
      x: 0,
      y: 0
    },
    component: (
      <TitleIMG src="mxgraph/images/toolbar/split.svg" title="并行分支" />
    ),
    onInit: commonInit
  },
  {
    key: 'read',
    name: '传阅节点',
    style: {
      ...commonStyle,
      [mxConstants.STYLE_IMAGE]: 'mxgraph/images/toolbar/read.svg'
    },
    geometry: {
      width: 174,
      height: 54,
      x: 0,
      y: 0
    },
    constraints: commonConstraints,
    component: (
      <TitleIMG src="mxgraph/images/toolbar/read-m.svg" title="传阅节点" />
    ),
    onInit: commonInit
  },
  {
    key: 'subProcess',
    name: '子流程节点',
    style: {
      ...commonStyle,
      [mxConstants.STYLE_IMAGE]: 'mxgraph/images/toolbar/sub-process.svg'
    },
    geometry: {
      width: 174,
      height: 54,
      x: 0,
      y: 0
    },
    constraints: commonConstraints,
    component: (
      <TitleIMG
        src="mxgraph/images/toolbar/sub-process-m.svg"
        title="子流程节点"
      />
    ),
    onInit: commonInit
  }
];

export const dataMap = data.reduce(
  (p, c) => p.set(c.key, c),
  new Map<string, ICell>()
);
