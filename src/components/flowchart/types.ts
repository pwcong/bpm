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
  enable?: boolean;
}

export const defaultConfig: IConfig = {
  enable: true
};

export enum ECellType {
  /** 节点 */
  'VERTEX' = 'VERTEX',
  /** 线条 */
  'EDGE' = 'EDGE'
}

export enum ECellKey {
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

export interface ICell {
  key: string;
  name: string;
  type?: ECellType;
  value?: ICellValue;
  geometry?: ICellGeometry;
  constraints?: ICellConstraints;
  style?: object | string;
  component?: React.ReactNode;
  getComponent?: (
    component: React.ReactElement,
    editorUI: EditorUI,
    cell: ICell
  ) => React.ReactElement;
  listeners?: Array<ICellListener>;
  relations?: Array<ICell>;
  onInitial?: (element: HTMLElement, editorUI: EditorUI, cell: ICell) => void;
  onDestroy?: (editorUI: EditorUI, cell: ICell) => void;
}

export type ICellConstraints = Array<[number, number]>;

export interface ICellValue {
  key: string;
  name: string;
}

export interface ICellGeometry {
  x: number;
  y: number;
  width: number;
  height: number;
}
