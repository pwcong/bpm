import React from 'react';
import EditorUI from './components/editorui';

export interface IBaseProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export interface ICommonProps extends IBaseProps {
  editorUI: EditorUI;
}

export interface IConfig {
  /** 是否允许编辑 */
  editable?: boolean;
  /** 菜单栏配置 */
  menubar?: ICellsConfig;
  /** 工具栏配置 */
  toolbar?: ICellsConfig;
  /** 变更操作 */
  afterUpdateCells?: (graph) => void;
}

export type IWrappedComponentRef = {
  editorUI: EditorUI | null;
  events: {
    mousemove?: MouseEvent;
    mousedown?: MouseEvent;
  } | null;
};

export type IWrappedComponentRefObject = React.RefObject<IWrappedComponentRef>;

export enum EEventName {
  /** 还原 */
  'undo' = 'flowchart_undo',
  /** 重做 */
  'redo' = 'flowchart_redo',
  /** 添加 */
  'add' = 'flowchart_add',
  /** 删除 */
  'delete' = 'flowchart_delete',
  /** 选择 */
  'select' = 'flowchart_select',
  /** 框选 */
  'rubberband' = 'flowchart_rubberband',
  /** 放大缩小 */
  'zoom' = 'flowchart_zoom'
}

export enum ECellType {
  /** 节点 */
  'VERTEX' = 'VERTEX',
  /** 线条 */
  'EDGE' = 'EDGE'
}

export enum ECellKey {
  /** 线条 */
  'sequenceFlow' = 'sequenceFlow',
  /** 开始事件 */
  'generalStart' = 'generalStart',
  /** 结束事件 */
  'generalEnd' = 'generalEnd',
  /** 起草节点 */
  'draft' = 'draft',
  /** 审批节点 */
  'review' = 'review',
  /** 条件分支 */
  'conditionBranch' = 'conditionBranch',
  /** 人工决策 */
  'manualBranch' = 'manualBranch',
  /** 并行分支启动 */
  'split' = 'split',
  /** 并行分支结束 */
  'join' = 'join',
  /** 抄送节点 */
  'send' = 'send',
  /** 子流程节点 */
  'startSubProcess' = 'startSubProcess'
}

export type ICellListenerCallbackRef = {
  event: any;
  element: HTMLElement | null;
  render: () => void;
};

export type ICellListenerCallback = (
  ref: ICellListenerCallbackRef,
  editorUI: EditorUI,
  cell: ICell
) => void;

export interface ICellListener {
  name: string;
  callback: ICellListenerCallback;
}

export type ICellsConfig = {
  data: Array<ICell>;
  map: { [key: string]: ICell };
};

export interface ICell {
  key: string;
  name: string;
  type?: ECellType;
  value?: ICellValue;
  geometry?: ICellGeometry;
  constraints?: ICellConstraints;
  style?: object;
  status?: { [key: string]: object };
  component?: React.ReactNode;
  getComponent?: (
    component: React.ReactElement,
    editorUI: EditorUI,
    cell: ICell
  ) => React.ReactElement;
  listeners?: Array<ICellListener>;
  relations?: Array<ICell>;
  connections?: Array<ICell>;
  disabled?: boolean;
  onInitial?: (element: HTMLElement, editorUI: EditorUI, cell: ICell) => void;
  onDestroy?: (editorUI: EditorUI, cell: ICell) => void;
}

export type ICellConstraints = Array<[number, number]>;

export type ICellMap = { [key: string]: ICell };

export type ICellValue = any & {
  key: string;
  name: string;
};

export interface ICellGeometry {
  x: number;
  y: number;
  width: number;
  height: number;
}
