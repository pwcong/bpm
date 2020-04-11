import React from 'react';

import { mxConstants, mxPerimeter } from '@/components/mxgraph';

import { getImageBasePath } from '@/components/mxgraph/utils';

import { ICell, ICellConstraints, ECellKey, ICellMap } from '../../types';
import EditorUI from '../editorui';
import { TitleIMG } from '../common/img';
import { commonInitial, commonStatus, getCommonComponent } from './utils';

const commonStyle = {
  [mxConstants.STYLE_SHAPE]: mxConstants.SHAPE_IMAGE,
  [mxConstants.STYLE_PERIMETER]: mxPerimeter.RectanglePerimeter,
  [mxConstants.STYLE_IMAGE_ASPECT]: 'none',
};

const commonRectStyle = {
  // [mxConstants.STYLE_OVERFLOW]: 'hidden',
  [mxConstants.STYLE_WHITE_SPACE]: 'wrap',
  // [mxConstants.STYLE_SPACING_LEFT]: 40
};

const commonLabelStyle = {
  [mxConstants.STYLE_VERTICAL_LABEL_POSITION]: 'bottom',
  [mxConstants.STYLE_VERTICAL_ALIGN]: 'top',
  [mxConstants.STYLE_SPACING_TOP]: 8,
};

const commonStyle1 = {
  ...commonStyle,
  ...commonLabelStyle,
};

const commonStyle2 = {
  ...commonStyle,
  ...commonRectStyle,
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
  [0.75, 1],
];

export const map: ICellMap = {
  [ECellKey.generalStart]: {
    key: ECellKey.generalStart,
    name: '开始事件',
    style: {
      ...commonStyle1,
      [mxConstants.STYLE_IMAGE]: getImageBasePath('toolbar/general-start.svg'),
    },
    status: commonStatus('general-start', commonStyle1),
    geometry: {
      width: 40,
      height: 40,
      x: 0,
      y: 0,
    },
    getComponent: (
      component: React.ReactElement,
      editorUI: EditorUI,
      cell: ICell
    ) =>
      getCommonComponent(
        component,
        <TitleIMG
          src={getImageBasePath('toolbar/general-start.svg')}
          title="开始事件"
        />,
        editorUI,
        cell
      ),
    onInitial: commonInitial,
    validations: {
      copy: () => false,
      cut: () => false,
      delete: () => false,
    },
  },
  [ECellKey.generalEnd]: {
    key: ECellKey.generalEnd,
    name: '结束事件',
    style: {
      ...commonStyle1,
      [mxConstants.STYLE_IMAGE]: getImageBasePath('toolbar/general-end.svg'),
    },
    status: commonStatus('general-end', commonStyle1),
    geometry: {
      width: 40,
      height: 40,
      x: 0,
      y: 0,
    },
    getComponent: (
      component: React.ReactElement,
      editorUI: EditorUI,
      cell: ICell
    ) =>
      getCommonComponent(
        component,
        <TitleIMG
          src={getImageBasePath('toolbar/general-end.svg')}
          title="结束事件"
        />,
        editorUI,
        cell
      ),
    onInitial: commonInitial,
    validations: {
      copy: () => false,
      cut: () => false,
      delete: () => false,
    },
    multiplicities: [
      {
        source: true,
        max: 0,
        countError: '结束事件禁止流出连线',
        typeError: '目标禁止连接',
      },
    ],
  },
  [ECellKey.draft]: {
    key: ECellKey.draft,
    name: '起草节点',
    style: {
      ...commonStyle2,
      [mxConstants.STYLE_IMAGE]: getImageBasePath('toolbar/draft.svg'),
    },
    status: commonStatus(ECellKey.draft, commonStyle2),
    geometry: {
      width: 160,
      height: 40,
      x: 0,
      y: 0,
    },
    constraints: commonConstraints,
    getComponent: (
      component: React.ReactElement,
      editorUI: EditorUI,
      cell: ICell
    ) =>
      getCommonComponent(
        component,
        <TitleIMG
          src={getImageBasePath('toolbar/draft-m.svg')}
          title="起草节点"
        />,
        editorUI,
        cell
      ),
    onInitial: commonInitial,
  },
  [ECellKey.review]: {
    key: ECellKey.review,
    name: '审批节点',
    style: {
      ...commonStyle2,
      [mxConstants.STYLE_IMAGE]: getImageBasePath('toolbar/review.svg'),
    },
    status: commonStatus(ECellKey.review, commonStyle2),
    geometry: {
      width: 160,
      height: 40,
      x: 0,
      y: 0,
    },
    constraints: commonConstraints,
    getComponent: (
      component: React.ReactElement,
      editorUI: EditorUI,
      cell: ICell
    ) =>
      getCommonComponent(
        component,
        <TitleIMG
          src={getImageBasePath('toolbar/review-m.svg')}
          title="审批节点"
        />,
        editorUI,
        cell
      ),
    onInitial: commonInitial,
  },
  [ECellKey.conditionBranch]: {
    key: ECellKey.conditionBranch,
    name: '条件分支',
    style: {
      ...commonStyle1,
      [mxConstants.STYLE_IMAGE]: getImageBasePath(
        'toolbar/condition-branch.svg'
      ),
    },
    status: commonStatus('condition-branch', commonStyle1),
    geometry: {
      width: 40,
      height: 40,
      x: 0,
      y: 0,
    },
    getComponent: (
      component: React.ReactElement,
      editorUI: EditorUI,
      cell: ICell
    ) =>
      getCommonComponent(
        component,
        <TitleIMG
          src={getImageBasePath('toolbar/condition-branch.svg')}
          title="条件分支"
        />,
        editorUI,
        cell
      ),
    onInitial: commonInitial,
  },
  [ECellKey.manualBranch]: {
    key: ECellKey.manualBranch,
    name: '人工分支',
    style: {
      ...commonStyle1,
      [mxConstants.STYLE_IMAGE]: getImageBasePath('toolbar/manual-branch.svg'),
    },
    status: commonStatus('manual-branch', commonStyle1),
    geometry: {
      width: 40,
      height: 40,
      x: 0,
      y: 0,
    },
    getComponent: (
      component: React.ReactElement,
      editorUI: EditorUI,
      cell: ICell
    ) =>
      getCommonComponent(
        component,
        <TitleIMG
          src={getImageBasePath('toolbar/manual-branch.svg')}
          title="人工分支"
        />,
        editorUI,
        cell
      ),
    onInitial: commonInitial,
  },
  [ECellKey.split]: {
    key: ECellKey.split,
    name: '并行分支',
    style: {
      ...commonStyle1,
      [mxConstants.STYLE_IMAGE]: getImageBasePath('toolbar/split.svg'),
    },
    status: commonStatus('split', commonStyle1),
    geometry: {
      width: 40,
      height: 40,
      x: 0,
      y: 0,
    },
    getComponent: (
      component: React.ReactElement,
      editorUI: EditorUI,
      cell: ICell
    ) =>
      getCommonComponent(
        component,
        <TitleIMG
          src={getImageBasePath('toolbar/split.svg')}
          title="并行分支"
        />,
        editorUI,
        cell
      ),
    onInitial: commonInitial,
  },
  [ECellKey.join]: {
    key: ECellKey.join,
    name: '并行分支',
    style: {
      ...commonStyle1,
      [mxConstants.STYLE_IMAGE]: getImageBasePath('toolbar/join.svg'),
    },
    status: commonStatus('join', commonStyle1),
    geometry: {
      width: 40,
      height: 40,
      x: 0,
      y: 0,
    },
    getComponent: (
      component: React.ReactElement,
      editorUI: EditorUI,
      cell: ICell
    ) =>
      getCommonComponent(
        component,
        <TitleIMG
          src={getImageBasePath('toolbar/join.svg')}
          title="并行分支"
        />,
        editorUI,
        cell
      ),
    onInitial: commonInitial,
  },
  [ECellKey.send]: {
    key: ECellKey.send,
    name: '传阅节点',
    style: {
      ...commonStyle2,
      [mxConstants.STYLE_IMAGE]: getImageBasePath('toolbar/send.svg'),
    },
    status: commonStatus('send', commonStyle2),
    geometry: {
      width: 160,
      height: 40,
      x: 0,
      y: 0,
    },
    constraints: commonConstraints,
    getComponent: (
      component: React.ReactElement,
      editorUI: EditorUI,
      cell: ICell
    ) =>
      getCommonComponent(
        component,
        <TitleIMG
          src={getImageBasePath('toolbar/send-m.svg')}
          title="传阅节点"
        />,
        editorUI,
        cell
      ),
    onInitial: commonInitial,
  },
  [ECellKey.startSubProcess]: {
    key: ECellKey.startSubProcess,
    name: '子流程节点',
    style: {
      ...commonStyle2,
      [mxConstants.STYLE_IMAGE]: getImageBasePath('toolbar/sub-process.svg'),
    },
    status: commonStatus('sub-process', commonStyle2),
    geometry: {
      width: 160,
      height: 40,
      x: 0,
      y: 0,
    },
    constraints: commonConstraints,
    getComponent: (
      component: React.ReactElement,
      editorUI: EditorUI,
      cell: ICell
    ) =>
      getCommonComponent(
        component,
        <TitleIMG
          src={getImageBasePath('toolbar/sub-process-m.svg')}
          title="子流程节点"
        />,
        editorUI,
        cell
      ),
    onInitial: commonInitial,
  },
};

const commonConnections: Array<ICell> = [
  map.review,
  map.conditionBranch,
  map.manualBranch,
  {
    ...map.split,
    relations: [map.join],
  },
  map.startSubProcess,
];

export const data: Array<ICell> = [
  {
    ...map.generalStart,
    // disabled: true,
    connections: commonConnections,
  },
  {
    ...map.generalEnd,
    // disabled: true,
  },
  {
    ...map.draft,
    connections: commonConnections,
  },
  {
    ...map.review,
    connections: commonConnections,
  },
  {
    ...map.conditionBranch,
    connections: commonConnections,
  },
  {
    ...map.manualBranch,
    connections: commonConnections,
  },
  {
    ...map.split,
    relations: [map.join],
    connections: commonConnections,
  },
  {
    ...map.startSubProcess,
    connections: commonConnections,
  },
];
